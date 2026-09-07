from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_guru
from app.models import (
    FollowUp,
    PrivateNote,
    Report,
    User,
    Mentorship,
    RelationshipStatus,
    Sankalpa,
    WeeklyReflection,
)
from app.services.attention import assess

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


@router.get("/shishyas/{student_id}")
def student_detail(student_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    student = db.get(User, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    owns(guru, student_id, db)

    relation = db.scalar(
        select(Mentorship).where(
            Mentorship.guru_id == guru.id,
            Mentorship.shishya_id == student_id,
            Mentorship.status == RelationshipStatus.ACTIVE,
        )
    )

    today = date.today().isoformat()
    all_reports = db.scalars(
        select(Report)
        .where(Report.student_id == student_id)
        .order_by(Report.practice_date.desc())
        .limit(30)
    ).all()
    total_count = db.scalar(select(func.count()).select_from(Report).where(Report.student_id == student_id)) or 0

    today_report = next((r for r in all_reports if r.practice_date == today), None)
    assessment = assess(student_id, today_report, all_reports, today)

    day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    def build_trend_series(num_days: int):
        series = []
        base_d = date.fromisoformat(today)
        reports_map = {r.practice_date: r for r in all_reports}
        for i in range(num_days - 1, -1, -1):
            target_date = base_d - timedelta(days=i)
            date_str = target_date.isoformat()
            day_idx = (target_date.weekday() + 1) % 7
            day_label = day_names[day_idx]
            match = reports_map.get(date_str)
            if match and match.status == "submitted":
                series.append({
                    "date": date_str,
                    "dayLabel": day_label,
                    "isSubmitted": True,
                    "wakeUpTime": match.wake_up_time or "",
                    "totalRounds": match.total_rounds or match.japa_rounds or 0,
                    "readingMinutes": match.reading_duration_minutes or 0,
                    "hearingMinutes": match.hearing_duration_minutes or 0,
                    "studyMinutes": (match.college_study_duration_minutes or 0) + (match.self_study_duration_minutes or 0),
                    "unusedMinutes": match.time_wasted_duration_minutes or 0,
                })
            else:
                series.append({
                    "date": date_str,
                    "dayLabel": day_label,
                    "isSubmitted": False,
                })
        return series

    seven_day_trend = build_trend_series(7)
    thirty_day_trend = build_trend_series(30)

    submitted_in_30 = [r for r in all_reports if r.status == "submitted"]
    consistency_pct = round((len(submitted_in_30) / 30) * 100) if all_reports else 0

    count = len(submitted_in_30) or 1
    total_rounds_sum = sum(r.total_rounds or r.japa_rounds or 0 for r in submitted_in_30)
    total_reading_sum = sum(r.reading_duration_minutes or 0 for r in submitted_in_30)
    total_hearing_sum = sum(r.hearing_duration_minutes or 0 for r in submitted_in_30)
    total_study_sum = sum((r.college_study_duration_minutes or 0) + (r.self_study_duration_minutes or 0) for r in submitted_in_30)
    total_rest_sum = sum(r.day_rest_duration_minutes or 0 for r in submitted_in_30)
    total_unused_sum = sum(r.time_wasted_duration_minutes or 0 for r in submitted_in_30)

    valid_wake = []
    for r in submitted_in_30:
        if r.wake_up_time and ":" in r.wake_up_time:
            parts = r.wake_up_time.split(":")
            valid_wake.append(int(parts[0]) * 60 + int(parts[1]))

    avg_wake_mins = round(sum(valid_wake) / len(valid_wake)) if valid_wake else 240
    avg_wake_str = f"{avg_wake_mins // 60:02d}:{avg_wake_mins % 60:02d}"

    thirty_day_stats = {
        "totalSubmitted": len(submitted_in_30),
        "consistencyPercentage": consistency_pct,
        "avgRounds": round((total_rounds_sum / count) * 10) / 10,
        "avgWakeUpTime": avg_wake_str,
        "avgReadingMinutes": round(total_reading_sum / count),
        "avgHearingMinutes": round(total_hearing_sum / count),
        "avgStudyMinutes": round(total_study_sum / count),
        "avgDayRestMinutes": round(total_rest_sum / count),
        "avgUnusedMinutes": round(total_unused_sum / count),
    }

    trend_summaries = {
        "japa": f"Japa has averaged {thirty_day_stats['avgRounds']} rounds daily over {len(submitted_in_30)} recorded days." if len(submitted_in_30) >= 5 else "Initial Japa reporting in progress.",
        "wakeUp": f"Typical wake-up time is around {avg_wake_str} over recent reports." if len(valid_wake) >= 5 else "Baseline wake-up pattern establishing.",
        "reading": f"Reading duration averages {thirty_day_stats['avgReadingMinutes']}m daily." if len(submitted_in_30) >= 5 else "Reading history establishing.",
        "hearing": f"Hearing duration averages {thirty_day_stats['avgHearingMinutes']}m daily." if len(submitted_in_30) >= 5 else "Hearing history establishing.",
        "study": f"Combined study averages {thirty_day_stats['avgStudyMinutes'] // 60}h {thirty_day_stats['avgStudyMinutes'] % 60}m daily." if len(submitted_in_30) >= 5 else "Study schedule recording.",
        "unused": f"Recorded unused time averages {thirty_day_stats['avgUnusedMinutes']}m daily." if thirty_day_stats["avgUnusedMinutes"] > 0 else "No significant unused time recorded.",
        "overall": "Sādhanā reporting has remained consistent over the last 30 days." if consistency_pct >= 80 else "Reporting frequency has varied over recent weeks.",
    }

    follow_ups = db.scalars(
        select(FollowUp)
        .where(FollowUp.guru_id == guru.id, FollowUp.student_id == student_id)
        .order_by(FollowUp.created_at.desc())
    ).all()
    private_notes = db.scalars(
        select(PrivateNote)
        .where(PrivateNote.guru_id == guru.id, PrivateNote.student_id == student_id)
        .order_by(PrivateNote.created_at.desc())
    ).all()

    active_sankalpa = db.scalar(
        select(Sankalpa).where(Sankalpa.student_id == student_id, Sankalpa.status == "active")
    )
    sankalpas = db.scalars(
        select(Sankalpa).where(Sankalpa.student_id == student_id).order_by(Sankalpa.created_at.desc()).limit(5)
    ).all()
    latest_reflection = db.scalar(
        select(WeeklyReflection).where(WeeklyReflection.student_id == student_id).order_by(WeeklyReflection.week_start_date.desc())
    )

    return {
        "shishya": {
            "id": str(student.id),
            "name": student.name,
            "email": student.email,
            "spiritualName": student.spiritual_name,
            "role": student.role.value if hasattr(student.role, "value") else str(student.role),
            "status": student.status.value if hasattr(student.status, "value") else str(student.status),
        },
        "relationship": {
            "id": str(relation.id),
            "guruId": str(relation.guru_id),
            "guru_id": str(relation.guru_id),
            "shishyaId": str(relation.shishya_id),
            "shishya_id": str(relation.shishya_id),
            "status": relation.status.value if hasattr(relation.status, "value") else str(relation.status),
            "createdAt": relation.created_at.isoformat() if relation.created_at else "",
            "created_at": relation.created_at.isoformat() if relation.created_at else "",
        },
        "todayReport": (
            None
            if today_report is None
            else {
                "id": str(today_report.id),
                "status": today_report.status,
                "practiceDate": today_report.practice_date,
                "totalRounds": today_report.total_rounds,
                "japaRounds": today_report.japa_rounds,
                "wakeUpTime": today_report.wake_up_time,
                "submittedAt": today_report.submitted_at.isoformat() if today_report.submitted_at else None,
            }
        ),
        "attentionLevel": assessment["level"],
        "assessment": assessment,
        "signals": assessment["signals"],
        "baseline": assessment["baseline"],
        "sevenDayTrend": seven_day_trend,
        "thirtyDayTrend": thirty_day_trend,
        "thirtyDayStats": thirty_day_stats,
        "trendSummaries": trend_summaries,
        "recentHistory": [
            {
                "id": str(r.id),
                "practiceDate": r.practice_date,
                "status": r.status,
                "totalRounds": r.total_rounds,
                "wakeUpTime": r.wake_up_time,
            }
            for r in all_reports[:10]
        ],
        "totalReportCount": total_count,
        "attentionHistory": [],
        "followUps": [
            {
                "id": str(f.id),
                "guruId": str(f.guru_id),
                "studentId": str(f.student_id),
                "note": f.note,
                "followUpDate": f.follow_up_date,
                "nextFollowUpDate": f.next_follow_up_date,
                "status": f.status,
                "createdAt": f.created_at.isoformat() if f.created_at else "",
                "updatedAt": f.updated_at.isoformat() if f.updated_at else "",
            }
            for f in follow_ups
        ],
        "privateNotes": [
            {
                "id": str(n.id),
                "guruId": str(n.guru_id),
                "studentId": str(n.student_id),
                "content": n.content,
                "createdAt": n.created_at.isoformat() if n.created_at else "",
                "updatedAt": n.updated_at.isoformat() if n.updated_at else "",
            }
            for n in private_notes
        ],
        "activeSankalpa": (
            {
                "id": str(active_sankalpa.id),
                "studentId": str(active_sankalpa.student_id),
                "category": active_sankalpa.category,
                "title": active_sankalpa.title,
                "status": active_sankalpa.status,
            }
            if active_sankalpa
            else None
        ),
        "sankalpaHistory": [
            {
                "id": str(s.id),
                "title": s.title,
                "status": s.status,
            }
            for s in sankalpas
        ],
        "latestReflection": (
            {
                "id": str(latest_reflection.id),
                "state": latest_reflection.state,
                "weekStartDate": latest_reflection.week_start_date,
            }
            if latest_reflection
            else None
        ),
    }


@router.get("/shishyas/{student_id}/reports")
def student_reports(student_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)):
    student = db.get(User, student_id)
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
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
