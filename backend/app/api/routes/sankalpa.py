from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_shishya
from app.models import User
from app.models.domain import Report, Sankalpa

router = APIRouter(prefix="/sankalpas", tags=["sankalpas"])
class SankalpaInput(BaseModel):
    category: str = "other"; title: str = Field(min_length=1, max_length=160); description: str | None = None; targetType: str = "metric_based"; targetConfig: dict | None = None; startDate: str | None = None; endDate: str | None = None
class ReflectionInput(BaseModel):
    content: str = Field(min_length=1); whatHelped: str | None = None; whatDifficult: str | None = None; whatContinue: str | None = None

def week(today: date) -> tuple[str, str]:
    start = today - timedelta(days=today.weekday()); return start.isoformat(), (start + timedelta(days=6)).isoformat()
def todict(item: Sankalpa, reports: list[Report]) -> dict:
    start = date.fromisoformat(item.start_date); end = date.fromisoformat(item.end_date); current = date.today(); aligned = 0; daily = []
    config = item.target_config or {}; metric = config.get("metric"); target = config.get("targetValue")
    for index in range((end-start).days+1):
        day = start + timedelta(days=index); row = next((r for r in reports if r.practice_date == day.isoformat() and r.status == "submitted"), None)
        if day > current: state = "future"; ok = False
        elif row is None: state = "pending" if day == current else "not_completed"; ok = False
        else:
            actual = row.total_rounds if metric == "japa_rounds" else row.reading_duration_minutes if metric == "reading_duration" else row.hearing_duration_minutes if metric == "hearing_duration" else row.total_study_duration_minutes if metric == "study_duration" else row.time_wasted_duration_minutes if metric == "time_wasted" else None
            if metric == "wake_up_time": actual = int(row.wake_up_time.split(":")[0])*60 + int(row.wake_up_time.split(":")[1])
            if metric == "wake_up_time": ok = actual <= (int(target.split(":")[0])*60+int(target.split(":")[1]) if isinstance(target,str) else 210)
            elif metric == "time_wasted": ok = actual <= float(target or 30)
            elif metric: ok = actual >= float(target or (16 if metric == "japa_rounds" else 30))
            else: ok = True
            state = "completed" if ok else "not_completed"
        if ok: aligned += 1
        daily.append({"date": day.isoformat(), "dayLabel": day.strftime("%a"), "status": state})
    return {"id": str(item.id), "studentId": str(item.student_id), "category": item.category, "title": item.title, "description": item.description, "targetType": item.target_type, "targetConfig": item.target_config, "startDate": item.start_date, "endDate": item.end_date, "status": item.status, "reflection": item.reflection, "progress": {"alignedDays": aligned, "totalDays": 7, "eligibleDays": sum(1 for x in daily if x["status"] != "future"), "dailyProgress": daily, "isTargetMet": aligned >= 5}}

@router.get("/active")
def active(user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Sankalpa).where(Sankalpa.student_id == user.id, Sankalpa.status == "active")); reports = db.scalars(select(Report).where(Report.student_id == user.id)).all(); return {"sankalpa": todict(item, reports) if item else None}

@router.get("/history")
def history(limit: int = 20, offset: int = 0, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    rows = db.scalars(select(Sankalpa).where(Sankalpa.student_id == user.id).order_by(Sankalpa.created_at.desc()).offset(offset).limit(limit)).all(); reports = db.scalars(select(Report).where(Report.student_id == user.id)).all(); total = db.scalar(select(func.count()).select_from(Sankalpa).where(Sankalpa.student_id == user.id)) or 0; return {"sankalpas": [todict(x,reports) for x in rows], "total": total}

@router.post("", status_code=status.HTTP_201_CREATED)
def create(payload: SankalpaInput, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    if db.scalar(select(Sankalpa).where(Sankalpa.student_id == user.id, Sankalpa.status == "active")): raise HTTPException(409, "You already have an active Sankalpa for this period.")
    start, end = payload.startDate, payload.endDate
    if not start or not end: start, end = week(date.today())
    if end <= start: raise HTTPException(422, "Sankalpa end date must be after start date.")
    item = Sankalpa(student_id=user.id, category=payload.category, title=payload.title.strip(), description=payload.description.strip() if payload.description else None, target_type=payload.targetType, target_config=payload.targetConfig, start_date=start, end_date=end)
    db.add(item); db.commit(); db.refresh(item); return {"sankalpa": todict(item, [])}

@router.post("/{sankalpa_id}/reflection")
def reflect(sankalpa_id: int, payload: ReflectionInput, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Sankalpa).where(Sankalpa.id == sankalpa_id, Sankalpa.student_id == user.id));
    if item is None: raise HTTPException(404, "Sankalpa not found or unauthorized.")
    reports = db.scalars(select(Report).where(Report.student_id == user.id)).all(); progress = todict(item,reports)["progress"]; item.reflection = {"content": payload.content.strip(), "whatHelped": payload.whatHelped, "whatDifficult": payload.whatDifficult, "whatContinue": payload.whatContinue, "submittedAt": datetime.utcnow().isoformat()}; item.status = "completed" if progress["alignedDays"] >= 4 else "incomplete"; item.completed_at = datetime.utcnow(); db.commit(); return {"sankalpa": todict(item,reports)}

@router.patch("/{sankalpa_id}/cancel")
def cancel(sankalpa_id: int, user: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Sankalpa).where(Sankalpa.id == sankalpa_id, Sankalpa.student_id == user.id));
    if item is None: raise HTTPException(404, "Sankalpa not found or unauthorized.")
    item.status = "cancelled"; item.cancelled_at = datetime.utcnow(); db.commit(); return {"success": True}
