from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.dependencies.auth import get_current_user
from app.models import User
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.models.reset import PasswordResetToken
from app.core.config import get_settings
import hashlib
import secrets
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr, Field
from app.core.email import email_service


router = APIRouter(prefix="/auth", tags=["auth"])

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str = Field(min_length=20)
    password: str = Field(min_length=8)

def token_digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()



@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    email = str(payload.email).lower()
    if db.scalar(select(User).where(User.email == email)) is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    user = User(name=payload.name.strip(), email=email, role=payload.role, password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists") from exc

    result = TokenResponse(access_token=create_access_token(str(user.id), user.role.value), user=user)
    response.set_cookie("nityasadhana_session", result.access_token, httponly=True, samesite="lax", secure=False, max_age=3600, path="/")
    return result


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if user is None or user.password_hash is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if user.status.value != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is not active")
    return TokenResponse(access_token=create_access_token(str(user.id), user.role.value), user=user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, _: User = Depends(get_current_user)) -> None:
    response.delete_cookie("nityasadhana_session", httponly=True, samesite="lax")


@router.post("/session", response_model=TokenResponse)
def create_session(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> TokenResponse:
    result = login(payload, db)
    response.set_cookie("nityasadhana_session", result.access_token, httponly=True, samesite="lax", secure=False, max_age=3600, path="/")
    return result

@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(payload: PasswordResetRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user = db.scalar(select(User).where(User.email == str(payload.email).lower()))
    if user is not None:
        raw = secrets.token_urlsafe(48)
        db.add(PasswordResetToken(user_id=user.id, token_hash=token_digest(raw), expires_at=datetime.utcnow() + timedelta(minutes=30)))
        db.commit()
        email_service.send_password_reset(user.email, f"{get_settings().frontend_url}/forgot-password?token={raw}")
    return {"message": "If an account exists with this email, a reset link has been sent."}

@router.post("/password-reset/confirm")
def confirm_password_reset(payload: PasswordResetConfirm, db: Session = Depends(get_db)) -> dict[str, str]:
    reset = db.scalar(select(PasswordResetToken).where(PasswordResetToken.token_hash == token_digest(payload.token), PasswordResetToken.used_at.is_(None)))
    if reset is None or reset.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    user = db.get(User, reset.user_id)
    if user is None: raise HTTPException(status_code=400, detail="Invalid reset token")
    user.password_hash = hash_password(payload.password); reset.used_at = datetime.utcnow(); db.commit()
    return {"message": "Password updated successfully"}


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)) -> User:
    return user
