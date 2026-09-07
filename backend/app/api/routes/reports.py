from datetime import datetime, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_shishya, require_guru
from app.models import Mentorship, RelationshipStatus, User
from app.models.domain import Report

router = APIRouter(prefix="/reports", tags=["reports"])
DEFAULT_TZ = "Asia/Kolkata"

class ReportInput(BaseModel):
    practiceDate: str | None = None
    sleepTime: str = ""
    wakeUpTime: str = ""
    japaRounds: float = 0
    extraRounds: float = 0
    japaCompletedAt: str | None = None
    readingDurationMinutes: float = 0
    readingNote: str | None = None
    hearingDurationMinutes: float = 0
    hearingNote: str | None = None
    collegeStudyDurationMinutes: float = 0
    selfStudyDurationMinutes: float = 0
    dayRestDurationMinutes: float = 0
    timeWastedDurationMinutes: float = 0
    notes: str | None = None
    timezone: str = DEFAULT_TZ


def today(tz: str) -> str:
    try:
        return datetime.now(ZoneInfo(tz)).date().isoformat()
    except ZoneInfoNotFoundError:
        return datetime.utcnow().date().isoformat()


def editable(date: str, tz: str) -> bool:
    try:
        return datetime.fromisoformat(today(tz)).date() - datetime.fromisoformat(date).date() in (timedelta(0), timedelta(days=1))
    except ValueError:
        return False


def minutes(value: str) -> int:
    clean = (value or "").strip().upper().replace("AM", " AM").replace("PM", " PM")
    is_pm = "PM" in clean
    is_am = "AM" in clean
    clean = clean.replace("AM", "").replace("PM", "").strip()
    parts = clean.split(":")
    hours = int(parts[0] or 0)
    mins = int(parts[1] or 0) if len(parts) > 1 else 0
    if is_pm and hours < 12: hours += 12
    if is_am and hours == 12: hours = 0
    return (hours * 60 + mins) % 1440


def sleep_duration(sleep: str, wake: str) -> int:
    if not sleep or not wake: return 0
    result = minutes(wake) - minutes(sleep)
    return result + 1440 if result < 0 else result


def serialize(item: Report) -> dict:
    return {"id": str(item.id), "studentId": str(item.student_id), "practiceDate": item.practice_date, "status": item.status, "timezone": item.timezone, "sleepTime": item.sleep_time, "wakeUpTime": item.wake_up_time, "sleepDurationMinutes": item.sleep_duration_minutes, "japaRounds": item.japa_rounds, "extraRounds": item.extra_rounds, "totalRounds": item.total_rounds, "japaCompletedAt": item.japa_completed_at, "readingDurationMinutes": item.reading_duration_minutes, "readingNote": item.reading_note, "hearingDurationMinutes": item.hearing_duration_minutes, "hearingNote": item.hearing_note, "collegeStudyDurationMinutes": item.college_study_duration_minutes, "selfStudyDurationMinutes": item.self_study_duration_minutes, "totalStudyDurationMinutes": item.total_study_duration_minutes, "dayRestDurationMinutes": item.day_rest_duration_minutes, "timeWastedDurationMinutes": item.time_wasted_duration_minutes, "notes": item.notes, "submittedAt": item.submitted_at.isoformat() if item.submitted_at else None, "createdAt": item.created_at.isoformat(), "updatedAt": item.updated_at.isoformat()}


def build_report(payload: ReportInput, student: User, status_value: str, db: Session) -> Report:
    date = payload.practiceDate or today(payload.timezone)
    if not editable(date, payload.timezone): raise HTTPException(422, "This report is outside the allowed 1-day edit window.")
    if status_value == "submitted" and (not payload.sleepTime or not payload.wakeUpTime): raise HTTPException(422, "Please enter your sleep time and wake-up time.")
    if status_value == "submitted" and payload.japaRounds is None: raise HTTPException(422, "Please enter your completed Japa rounds.")
    values = {"japaRounds": payload.japaRounds, "extraRounds": payload.extraRounds, "readingDurationMinutes": payload.readingDurationMinutes, "hearingDurationMinutes": payload.hearingDurationMinutes, "collegeStudyDurationMinutes": payload.collegeStudyDurationMinutes, "selfStudyDurationMinutes": payload.selfStudyDurationMinutes, "dayRestDurationMinutes": payload.dayRestDurationMinutes, "timeWastedDurationMinutes": payload.timeWastedDurationMinutes}
    if any(float(v or 0) < 0 or float(v or 0) > (108 if k in ("japaRounds", "extraRounds") else 1440) for k, v in values.items()): raise HTTPException(422, "Report values are outside the allowed range.")
    item = db.scalar(select(Report).where(Report.student_id == student.id, Report.practice_date == date))
    if item is None: item = Report(student_id=student.id, practice_date=date, created_at=datetime.utcnow())
    item.status = status_value; item.timezone = payload.timezone; item.sleep_time = payload.sleepTime.strip(); item.wake_up_time = payload.wakeUpTime.strip(); item.sleep_duration_minutes = sleep_duration(item.sleep_time, item.wake_up_time); item.japa_rounds = int(payload.japaRounds or 0); item.extra_rounds = int(payload.extraRounds or 0); item.total_rounds = item.japa_rounds + item.extra_rounds; item.japa_completed_at = payload.japaCompletedAt; item.reading_duration_minutes = int(payload.readingDurationMinutes or 0); item.reading_note = (payload.readingNote or "").strip()[:100] or None; item.hearing_duration_minutes = int(payload.hearingDurationMinutes or 0); item.hearing_note = (payload.hearingNote or "").strip()[:100] or None; item.college_study_duration_minutes = int(payload.collegeStudyDurationMinutes or 0); item.self_study_duration_minutes = int(payload.selfStudyDurationMinutes or 0); item.total_study_duration_minutes = item.college_study_duration_minutes + item.self_study_duration_minutes; item.day_rest_duration_minutes = int(payload.dayRestDurationMinutes or 0); item.time_wasted_duration_minutes = int(payload.timeWastedDurationMinutes or 0); item.notes = (payload.notes or "").strip()[:1000] or None
    if status_value == "submitted" and item.submitted_at is None: item.submitted_at = datetime.utcnow()
    db.add(item); db.commit(); db.refresh(item); return item

@router.post("", status_code=status.HTTP_201_CREATED)
def save_report(payload: ReportInput, submit: bool = Query(False), student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    return {"report": serialize(build_report(payload, student, "submitted" if submit else "draft", db))}

@router.get("/today")
def today_report(student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    date = today(DEFAULT_TZ); current = db.scalar(select(Report).where(Report.student_id == student.id, Report.practice_date == date)); previous = db.scalars(select(Report).where(Report.student_id == student.id, Report.practice_date < date, Report.status == "submitted").order_by(Report.practice_date.desc()).limit(1)).first()
    return {"todayDate": date, "report": serialize(current) if current else None, "previousReport": serialize(previous) if previous else None, "isEditable": editable(date, DEFAULT_TZ)}

@router.get("/history")
def report_history(limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    query = select(Report).where(Report.student_id == student.id).order_by(Report.practice_date.desc()); rows = db.scalars(query.offset(offset).limit(limit)).all(); total = db.scalar(select(func.count()).select_from(Report).where(Report.student_id == student.id)) or 0
    return {"reports": [serialize(row) for row in rows], "total": total}

@router.get("/dashboard")
def dashboard(student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    date = today(DEFAULT_TZ); rows = db.scalars(select(Report).where(Report.student_id == student.id).order_by(Report.practice_date.desc()).limit(30)).all(); current = next((row for row in rows if row.practice_date == date), None); submitted = {row.practice_date for row in rows if row.status == "submitted"}; completed = sum(1 for i in range(10) if (datetime.fromisoformat(date).date() - timedelta(days=i)).isoformat() in submitted); streak = 0; start = 0 if date in submitted else 1 if (datetime.fromisoformat(date).date() - timedelta(days=1)).isoformat() in submitted else -1
    if start >= 0:
        while (datetime.fromisoformat(date).date() - timedelta(days=start)).isoformat() in submitted: streak += 1; start += 1
    guru = db.scalar(select(User).join(Mentorship, Mentorship.guru_id == User.id).where(Mentorship.shishya_id == student.id, Mentorship.status == RelationshipStatus.ACTIVE))
    return {"todayDate": date, "status": current.status if current else "not_started", "report": serialize(current) if current else None, "isEditable": editable(date, DEFAULT_TZ), "consistency": {"completedDays": completed, "windowDays": 10, "currentStreak": streak, "totalSubmitted": len(submitted)}, "recentReports": [serialize(row) for row in rows[:5]], "guidingGuru": {"name": guru.name, "spiritualName": guru.spiritual_name} if guru else None}

@router.get("/journey")
def journey(rangeDays: int = Query(7, ge=7, le=30), student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    range_days = 30 if rangeDays == 30 else 7
    end = datetime.fromisoformat(today(DEFAULT_TZ)).date()
    start = end - timedelta(days=range_days - 1)
    previous_start = end - timedelta(days=2 * range_days - 1)
    rows = db.scalars(select(Report).where(Report.student_id == student.id, Report.practice_date >= previous_start.isoformat(), Report.status.in_(("submitted", "draft"))).order_by(Report.practice_date.asc())).all()
    by_date = {row.practice_date: row for row in rows}
    def time_value(value: str) -> int | None:
        if not value: return None
        parts = value.split(":"); return int(parts[0]) * 60 + int(parts[1])
    daily = []
    for offset in range(range_days - 1, -1, -1):
        day = end - timedelta(days=offset); key = day.isoformat(); row = by_date.get(key)
        label = day.strftime("%a") if range_days == 7 else f"{day.strftime('%b')} {day.day}"
        item = {"date": key, "dayLabel": label, "isSubmitted": bool(row and row.status == "submitted"), "isDraft": bool(row and row.status == "draft")}
        if row and row.status == "submitted":
            item.update({"totalRounds": row.total_rounds, "wakeUpTime": row.wake_up_time, "wakeUpMinutes": time_value(row.wake_up_time), "sleepDurationMinutes": row.sleep_duration_minutes, "readingDurationMinutes": row.reading_duration_minutes, "hearingDurationMinutes": row.hearing_duration_minutes, "collegeStudyMinutes": row.college_study_duration_minutes, "selfStudyMinutes": row.self_study_duration_minutes, "totalStudyMinutes": row.total_study_duration_minutes, "dayRestMinutes": row.day_rest_duration_minutes, "timeWastedMinutes": row.time_wasted_duration_minutes})
        daily.append(item)
    current = [by_date[(start + timedelta(days=i)).isoformat()] for i in range(range_days) if (start + timedelta(days=i)).isoformat() in by_date and by_date[(start + timedelta(days=i)).isoformat()].status == "submitted"]
    previous = [by_date[(previous_start + timedelta(days=i)).isoformat()] for i in range(range_days) if (previous_start + timedelta(days=i)).isoformat() in by_date and by_date[(previous_start + timedelta(days=i)).isoformat()].status == "submitted"]
    submitted_dates = {row.practice_date for row in rows if row.status == "submitted"}
    streak = 0; cursor = 0 if end.isoformat() in submitted_dates else 1 if (end - timedelta(days=1)).isoformat() in submitted_dates else -1
    while cursor >= 0 and (end - timedelta(days=cursor)).isoformat() in submitted_dates: streak += 1; cursor += 1
    def avg(items, getter): return sum(getter(row) for row in items) / len(items) if items else 0
    def comparison(cur, prev, threshold, unit="", minutes_value=False, wake=False):
        formatted = f"{round(cur, 1)} {unit}" if not minutes_value and not wake else (f"{round(cur)}m" if minutes_value else f"{int(cur//60):02d}:{int(cur%60):02d}")
        if len(current) < 3 or not previous: return {"currentAvg":cur,"previousAvg":prev,"diff":0,"direction":"insufficient_data","label":"Keep recording","formattedCurrent":formatted}
        diff = (prev-cur) if wake else cur-prev
        if abs(diff) <= threshold: direction, label = "stable", "Stable"
        else: direction = "increased" if diff > 0 else "decreased"; label = (f"{('+' if diff > 0 else '-')}{round(abs(diff))}m" if minutes_value or wake else f"{('+' if diff > 0 else '-')}{abs(diff):.1f} {unit}")
        return {"currentAvg":cur,"previousAvg":prev,"diff":diff,"direction":direction,"label":label,"formattedCurrent":formatted}
    getters = {"japa": lambda r:r.total_rounds, "wakeUp": lambda r:time_value(r.wake_up_time) or 0, "sleep":lambda r:r.sleep_duration_minutes, "reading":lambda r:r.reading_duration_minutes, "hearing":lambda r:r.hearing_duration_minutes, "study":lambda r:r.total_study_duration_minutes, "timeWasted":lambda r:r.time_wasted_duration_minutes}
    comparisons = {"japa": comparison(avg(current,getters["japa"]),avg(previous,getters["japa"]),.4,"rounds"), "wakeUp":comparison(avg(current,getters["wakeUp"]),avg(previous,getters["wakeUp"]),5,wake=True), "sleep":comparison(avg(current,getters["sleep"]),avg(previous,getters["sleep"]),10,minutes_value=True), "reading":comparison(avg(current,getters["reading"]),avg(previous,getters["reading"]),5,minutes_value=True), "hearing":comparison(avg(current,getters["hearing"]),avg(previous,getters["hearing"]),5,minutes_value=True), "study":comparison(avg(current,getters["study"]),avg(previous,getters["study"]),15,minutes_value=True), "timeWasted":comparison(avg(current,getters["timeWasted"]),avg(previous,getters["timeWasted"]),5,minutes_value=True)}
    return {"rangeDays": range_days, "startDate": start.isoformat(), "endDate": end.isoformat(), "previousStartDate": previous_start.isoformat(), "previousEndDate": (start - timedelta(days=1)).isoformat(), "hasEnoughData": len(current) >= 3, "overview": {"submittedCount": len(current), "totalDays": range_days, "consistencyPercentage": round(len(current) / range_days * 100), "currentStreak": streak}, "dailySeries": daily, "comparison": comparisons}

@router.get("/{report_id}")
def report_detail(report_id: int, student: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Report).where(Report.id == report_id, Report.student_id == student.id))
    if item is None: raise HTTPException(404, "Report not found or unauthorized.")
    return {"report": serialize(item), "isEditable": editable(item.practice_date, item.timezone)}
