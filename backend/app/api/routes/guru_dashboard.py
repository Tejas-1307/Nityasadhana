from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import require_guru
from app.models import Mentorship, RelationshipStatus, User
from app.models.domain import Report
from app.services.attention import assess

router = APIRouter(prefix="/guru-dashboard", tags=["guru-dashboard"])


@router.get("")
def dashboard(guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    today = date.today().isoformat()
    relationships = db.scalars(select(Mentorship).where(Mentorship.guru_id == guru.id)).all()
    active = [row for row in relationships if row.status == RelationshipStatus.ACTIVE]
    inactive = [row for row in relationships if row.status != RelationshipStatus.ACTIVE]
    items = []

    for relation in active:
        student = db.get(User, relation.shishya_id)
        if student is None:
            continue

        reports = db.scalars(
            select(Report)
            .where(Report.student_id == relation.shishya_id)
            .order_by(Report.practice_date.desc())
            .limit(30)
        ).all()
        today_report = next((row for row in reports if row.practice_date == today), None)
        assessment = assess(student.id, today_report, reports, today)
        state = today_report.status if today_report else "not_submitted"

        items.append({
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
                "endedAt": relation.ended_at.isoformat() if relation.ended_at else None,
                "ended_at": relation.ended_at.isoformat() if relation.ended_at else None,
            },
            "reportingState": state,
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
            "primarySignal": assessment["primarySignal"],
            "additionalSignalsCount": assessment["additionalCount"],
            "isStable": assessment["level"] == "STABLE",
            "needsAttention": assessment["level"] in ("OBSERVE", "FOLLOW_UP_SUGGESTED"),
            "baseline": assessment["baseline"],
            "lastActiveFormatted": (
                "Today"
                if today_report
                else (reports[0].practice_date if reports else "No reports yet")
            ),
        })

    items.sort(
        key=lambda item: (
            not item["needsAttention"],
            item["reportingState"] == "submitted",
            item["shishya"]["name"] or "",
        )
    )

    return {
        "totalActiveShishyas": len(items),
        "totalInactiveShishyas": len(inactive),
        "todayStats": {
            "submittedCount": sum(i["reportingState"] == "submitted" for i in items),
            "pendingCount": sum(i["reportingState"] == "draft" for i in items),
            "notSubmittedCount": sum(i["reportingState"] == "not_submitted" for i in items),
        },
        "attentionShishyas": [i for i in items if i["needsAttention"]],
        "stableShishyas": [i for i in items if i["isStable"]],
        "allShishyas": items,
        "currentDateStr": today,
    }
