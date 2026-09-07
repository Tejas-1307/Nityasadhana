from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_guru, require_shishya
from app.models import Invitation, Mentorship, RelationshipStatus, User

router = APIRouter(prefix="/relationships", tags=["relationships"])

@router.get("/guru")
def guru_relationships(guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    rows = db.scalars(select(Mentorship).where(Mentorship.guru_id == guru.id)).all()
    return {"shishyas": [{"relationship": row, "shishya": db.get(User, row.shishya_id)} for row in rows], "invitations": db.scalars(select(Invitation).where(Invitation.created_by_user_id == guru.id)).all()}

@router.get("/shishya")
def shishya_relationship(shishya: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict | None:
    row = db.scalar(select(Mentorship).where(Mentorship.shishya_id == shishya.id, Mentorship.status == RelationshipStatus.ACTIVE))
    return {"relationship": row, "guru": db.get(User, row.guru_id)} if row else None

@router.post("/{shishya_id}/end")
def end_relationship(shishya_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    row = db.scalar(select(Mentorship).where(Mentorship.guru_id == guru.id, Mentorship.shishya_id == shishya_id, Mentorship.status == RelationshipStatus.ACTIVE))
    if row is None:
        raise HTTPException(status_code=404, detail="Active mentorship relationship not found")
    row.status = RelationshipStatus.INACTIVE
    db.commit()
    return {"success": True}
