from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_guru, require_shishya
from app.models import Invitation, InvitationStatus, Mentorship, RelationshipStatus, User, UserRole
from app.schemas.invitations import InvitationAccept, InvitationCreate, InvitationDetails, InvitationResponse

router = APIRouter(prefix="/invitations", tags=["invitations"])


def digest(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def find_invitation(db: Session, secret: str) -> Invitation | None:
    value = digest(secret.strip())
    return db.scalar(select(Invitation).where((Invitation.token_hash == value) | (Invitation.code_hash == value)))


@router.post("", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
def create_invitation(payload: InvitationCreate, guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> InvitationResponse:
    token = secrets.token_urlsafe(32)
    code = f"NITYA-{secrets.token_hex(2).upper()}-{secrets.token_hex(2).upper()}"
    expires = payload.expires_at or datetime.now(timezone.utc) + timedelta(days=30)
    invitation = Invitation(token_hash=digest(token), code_hash=digest(code), raw_code_masked=f"{code[:6]}••••{code[-4:]}", created_by_user_id=guru.id, expires_at=expires.replace(tzinfo=None))
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return InvitationResponse(id=invitation.id, token=token, code=code, raw_code_masked=invitation.raw_code_masked, expires_at=invitation.expires_at)


@router.get("/validate/{secret}", response_model=InvitationDetails)
def validate_invitation(secret: str, db: Session = Depends(get_db)) -> InvitationDetails:
    invitation = find_invitation(db, secret)
    if invitation is None:
        return InvitationDetails(is_valid=False, error_reason="Invitation not found.")
    guru = db.get(User, invitation.created_by_user_id)
    if invitation.status != InvitationStatus.PENDING:
        return InvitationDetails(id=invitation.id, guru_name=guru.name if guru else "", expires_at=invitation.expires_at, is_valid=False, error_reason="This invitation is no longer valid.")
    if invitation.expires_at <= datetime.utcnow():
        invitation.status = InvitationStatus.EXPIRED
        db.commit()
        return InvitationDetails(id=invitation.id, guru_name=guru.name if guru else "", expires_at=invitation.expires_at, is_valid=False, error_reason="This invitation has expired.")
    return InvitationDetails(id=invitation.id, guru_name=guru.name if guru else "", expires_at=invitation.expires_at, is_valid=True)


@router.post("/accept")
def accept_invitation(payload: InvitationAccept, shishya: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict[str, str]:
    invitation = find_invitation(db, payload.secret)
    if invitation is None or invitation.status != InvitationStatus.PENDING or invitation.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This invitation is invalid, expired, or already used.")
    if db.scalar(select(Mentorship).where(Mentorship.shishya_id == shishya.id, Mentorship.status == RelationshipStatus.ACTIVE)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This Shishya is already connected to a Guru.")
    if db.scalar(select(Mentorship).where(Mentorship.shishya_id == shishya.id)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This Shishya has a previous connection and requires reactivation.")
    guru = db.get(User, invitation.created_by_user_id)
    invitation.status = InvitationStatus.USED
    invitation.used_at = datetime.utcnow()
    invitation.used_by_user_id = shishya.id
    shishya.linked_guru_id = invitation.created_by_user_id
    db.add(Mentorship(guru_id=invitation.created_by_user_id, shishya_id=shishya.id, status=RelationshipStatus.ACTIVE))
    db.commit()
    return {"guru_name": guru.name if guru else "Guru"}


@router.get("/mine")
def my_invitations(guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> list[InvitationResponse]:
    invitations = db.scalars(select(Invitation).where(Invitation.created_by_user_id == guru.id).order_by(Invitation.created_at.desc())).all()
    return [{"id": item.id, "token": "", "code": "", "raw_code_masked": item.raw_code_masked, "expires_at": item.expires_at} for item in invitations]


@router.post("/{invitation_id}/revoke", status_code=status.HTTP_204_NO_CONTENT)
def revoke_invitation(invitation_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> None:
    invitation = db.get(Invitation, invitation_id)
    if invitation is None or invitation.created_by_user_id != guru.id or invitation.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    invitation.status = InvitationStatus.REVOKED
    db.commit()
