from datetime import date, timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_shishya, require_guru
from app.models import Mentorship, RelationshipStatus, User
from app.models.domain import WeeklyReflection

router = APIRouter(prefix="/reflections", tags=["reflections"])
class ReflectionInput(BaseModel):
    sankalpaId: int | None = None; weekStartDate: str | None = None; weekEndDate: str | None = None; state: str; wentWell: str | None = Field(default=None, max_length=300); difficult: str | None = Field(default=None, max_length=300); improve: str | None = Field(default=None, max_length=300); guruMessage: str | None = Field(default=None, max_length=300)
def bounds():
    start = date.today() - timedelta(days=date.today().weekday()); return start.isoformat(), (start+timedelta(days=6)).isoformat()
def serial(x: WeeklyReflection) -> dict:
    return {"id": str(x.id), "studentId": str(x.student_id), "sankalpaId": x.sankalpa_id, "weekStartDate": x.week_start_date, "weekEndDate": x.week_end_date, "state": x.state, "wentWell": x.went_well, "difficult": x.difficult, "improve": x.improve, "guruMessage": x.guru_message, "createdAt": x.created_at.isoformat(), "updatedAt": x.updated_at.isoformat(), "submittedAt": x.submitted_at.isoformat()}
@router.post("")
def save(payload: ReflectionInput, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    start, end = payload.weekStartDate or bounds()[0], payload.weekEndDate or bounds()[1]
    if payload.state not in {"steady","good","mixed","difficult","reflective"}: raise HTTPException(422, "Please select a valid reflection state.")
    item = db.scalar(select(WeeklyReflection).where(WeeklyReflection.student_id == user.id, WeeklyReflection.week_start_date == start))
    if item is None: item = WeeklyReflection(student_id=user.id, week_start_date=start, week_end_date=end, state=payload.state)
    item.sankalpa_id=payload.sankalpaId; item.week_end_date=end; item.state=payload.state; item.went_well=payload.wentWell.strip() if payload.wentWell else None; item.difficult=payload.difficult.strip() if payload.difficult else None; item.improve=payload.improve.strip() if payload.improve else None; item.guru_message=payload.guruMessage.strip() if payload.guruMessage else None; db.add(item); db.commit(); db.refresh(item); return {"reflection": serial(item)}
@router.get("")
def history(limit: int = Query(10,ge=1,le=100), offset: int = 0, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    rows=db.scalars(select(WeeklyReflection).where(WeeklyReflection.student_id==user.id).order_by(WeeklyReflection.week_start_date.desc()).offset(offset).limit(limit)).all(); total=db.scalar(select(func.count()).select_from(WeeklyReflection).where(WeeklyReflection.student_id==user.id)) or 0; return {"reflections":[serial(x) for x in rows],"total":total}
@router.get("/guru/{student_id}")
def guru_history(student_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    if db.scalar(select(Mentorship).where(Mentorship.guru_id==guru.id,Mentorship.shishya_id==student_id,Mentorship.status==RelationshipStatus.ACTIVE)) is None: raise HTTPException(403,"Active mentorship required")
    rows=db.scalars(select(WeeklyReflection).where(WeeklyReflection.student_id==student_id).order_by(WeeklyReflection.week_start_date.desc())).all(); return {"reflections":[serial(x) for x in rows],"total":len(rows)}
