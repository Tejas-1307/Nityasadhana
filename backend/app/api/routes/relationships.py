from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import require_guru, require_shishya
from app.models import Invitation, Mentorship, RelationshipStatus, Report, User
from app.services.attention import assess

router = APIRouter(prefix="/relationships", tags=["relationships"])


def serialize_invitation(inv: Invitation) -> dict:
    status_val = inv.status.value if hasattr(inv.status, "value") else str(inv.status)
    created_at_iso = inv.created_at.isoformat() if inv.created_at else ""
    expires_at_iso = inv.expires_at.isoformat() if inv.expires_at else ""
    used_at_iso = inv.used_at.isoformat() if inv.used_at else None

    return {
        "id": str(inv.id),
        "tokenHash": inv.token_hash,
        "codeHash": inv.code_hash,
        "rawCodeMasked": inv.raw_code_masked,
        "raw_code_masked": inv.raw_code_masked,
        "createdByUserId": str(inv.created_by_user_id),
        "created_by_user_id": str(inv.created_by_user_id),
        "status": status_val,
        "expiresAt": expires_at_iso,
        "expires_at": expires_at_iso,
        "usedAt": used_at_iso,
        "used_at": used_at_iso,
        "usedByUserId": str(inv.used_by_user_id) if inv.used_by_user_id else None,
        "used_by_user_id": str(inv.used_by_user_id) if inv.used_by_user_id else None,
        "createdAt": created_at_iso,
        "created_at": created_at_iso,
    }


def serialize_shishya_item(relation: Mentorship, student: User, db: Session, today: str) -> dict:
    reports = db.scalars(
        select(Report)
        .where(Report.student_id == relation.shishya_id)
        .order_by(Report.practice_date.desc())
        .limit(30)
    ).all()
    today_report = next((r for r in reports if r.practice_date == today), None)
    assessment = assess(student.id, today_report, reports, today)
    state = today_report.status if today_report else "not_submitted"

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
    }


@router.get("/guru")
def guru_relationships(guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    today = date.today().isoformat()
    relations = db.scalars(select(Mentorship).where(Mentorship.guru_id == guru.id)).all()

    shishyas = []
    for relation in relations:
        student = db.get(User, relation.shishya_id)
        if student is not None:
            shishyas.append(serialize_shishya_item(relation, student, db, today))

    shishyas.sort(
        key=lambda item: (
            not item["needsAttention"],
            item["reportingState"] == "submitted",
            item["shishya"]["name"],
        )
    )

    invitations = db.scalars(
        select(Invitation)
        .where(Invitation.created_by_user_id == guru.id)
        .order_by(Invitation.created_at.desc())
    ).all()

    return {
        "shishyas": shishyas,
        "invitations": [serialize_invitation(inv) for inv in invitations],
    }


@router.get("/shishya")
def shishya_relationship(shishya: User = Depends(require_shishya), db: Session = Depends(get_db)) -> dict | None:
    row = db.scalar(
        select(Mentorship).where(
            Mentorship.shishya_id == shishya.id,
            Mentorship.status == RelationshipStatus.ACTIVE,
        )
    )
    if not row:
        return None

    guru = db.get(User, row.guru_id)
    return {
        "relationship": {
            "id": str(row.id),
            "guruId": str(row.guru_id),
            "guru_id": str(row.guru_id),
            "shishyaId": str(row.shishya_id),
            "shishya_id": str(row.shishya_id),
            "status": row.status.value if hasattr(row.status, "value") else str(row.status),
            "createdAt": row.created_at.isoformat() if row.created_at else None,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "endedAt": row.ended_at.isoformat() if row.ended_at else None,
            "ended_at": row.ended_at.isoformat() if row.ended_at else None,
        },
        "guru": (
            {
                "id": str(guru.id),
                "name": guru.name,
                "email": guru.email,
                "spiritualName": guru.spiritual_name,
                "role": guru.role.value if hasattr(guru.role, "value") else str(guru.role),
            }
            if guru
            else None
        ),
    }


@router.post("/{shishya_id}/end")
def end_relationship(shishya_id: int, guru: User = Depends(require_guru), db: Session = Depends(get_db)) -> dict:
    row = db.scalar(
        select(Mentorship).where(
            Mentorship.guru_id == guru.id,
            Mentorship.shishya_id == shishya_id,
            Mentorship.status == RelationshipStatus.ACTIVE,
        )
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Active mentorship relationship not found")
    row.status = RelationshipStatus.INACTIVE
    row.ended_at = datetime.utcnow()
    db.commit()
    return {"success": True}
