from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_guru
from app.models import FollowUp, PrivateNote, Report, User, Mentorship, RelationshipStatus

router = APIRouter(prefix="/guru", tags=["guru"])
class FollowUpInput(BaseModel):
    shishyaId: int
    note: str = Field(min_length=1, max_length=2000)
    followUpDate: str
    nextFollowUpDate: str | None = None
class NoteInput(BaseModel):
    shishyaId: int
    content: str = Field(min_length=1, max_length=5000)
def owns(guru: User, student_id: int, db: Session) -> None:
    if db.scalar(select(Mentorship).where(Mentorship.guru_id == guru.id, Mentorship.shishya_id == student_id, Mentorship.status == RelationshipStatus.ACTIVE)) is None:
        raise HTTPException(403, "Active mentorship required")
@router.get("/shishyas/{student_id}/reports")
def student_reports(student_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    owns(guru, student_id, db)
    rows = db.scalars(select(Report).where(Report.student_id == student_id).order_by(Report.practice_date.desc())).all()
    return {"reports": [{"id": str(x.id), "practiceDate": x.practice_date, "status": x.status, "totalRounds": x.total_rounds} for x in rows], "total": len(rows)}
@router.post("/follow-ups")
def add_followup(payload: FollowUpInput, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    owns(guru, payload.shishyaId, db)
    item = FollowUp(guru_id=guru.id, student_id=payload.shishyaId, note=payload.note.strip(), follow_up_date=payload.followUpDate, next_follow_up_date=payload.nextFollowUpDate)
    db.add(item); db.commit(); db.refresh(item)
    return {"followUp": {"id": str(item.id), "note": item.note, "status": item.status, "followUpDate": item.follow_up_date}}
@router.patch("/follow-ups/{followup_id}")
def update_followup(followup_id: int, completed: bool, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    item = db.scalar(select(FollowUp).where(FollowUp.id == followup_id, FollowUp.guru_id == guru.id))
    if item is None: raise HTTPException(404, "Follow-up not found")
    item.status = "completed" if completed else "upcoming"; db.commit()
    return {"followUp": {"id": str(item.id), "status": item.status}}
@router.post("/notes")
def add_note(payload: NoteInput, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    owns(guru, payload.shishyaId, db)
    item = PrivateNote(guru_id=guru.id, student_id=payload.shishyaId, content=payload.content.strip()); db.add(item); db.commit(); db.refresh(item)
    return {"note": {"id": str(item.id), "content": item.content}}
@router.delete("/notes/{note_id}")
def delete_note(note_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    item = db.scalar(select(PrivateNote).where(PrivateNote.id == note_id, PrivateNote.guru_id == guru.id))
    if item is None: raise HTTPException(404, "Note not found")
    db.delete(item); db.commit(); return {"deleted": True}
