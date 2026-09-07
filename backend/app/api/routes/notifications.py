from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import User
from app.models.domain import Notification, NotificationPreference

router = APIRouter(prefix="/notifications", tags=["notifications"])

class PreferenceInput(BaseModel):
    dailyReportReminder: bool | None = None
    weeklyReflectionReminder: bool | None = None
    sankalpaReminder: bool | None = None
    guruDailySummary: bool | None = None
    guruFollowUpReminder: bool | None = None
    quietHoursStart: str | None = None
    quietHoursEnd: str | None = None
    timezone: str | None = None
    pushSubscription: str | None = None

def pref(db: Session, user_id: int) -> NotificationPreference:
    item = db.scalar(select(NotificationPreference).where(NotificationPreference.user_id == user_id))
    if item is None:
        item = NotificationPreference(user_id=user_id); db.add(item); db.commit(); db.refresh(item)
    return item

def serial(item: Notification) -> dict:
    return {"id": str(item.id), "userId": str(item.user_id), "type": item.type, "title": item.title, "message": item.message, "priority": item.priority, "status": item.status, "scheduledForDate": item.scheduled_for_date, "eventKey": item.event_key, "actionUrl": item.action_url, "readAt": item.read_at.isoformat() if item.read_at else None, "sentAt": item.sent_at.isoformat() if item.sent_at else None, "createdAt": item.created_at.isoformat(), "updatedAt": item.updated_at.isoformat()}

@router.get("")
def notifications(limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = db.scalars(select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc()).offset(offset).limit(limit)).all()
    total = db.scalar(select(func.count()).select_from(Notification).where(Notification.user_id == user.id)) or 0
    unread = db.scalar(select(func.count()).select_from(Notification).where(Notification.user_id == user.id, Notification.status.not_in(("read", "suppressed", "cancelled")))) or 0
    p = pref(db, user.id)
    preferences = {"id": p.id, "userId": p.user_id, "dailyReportReminder": p.daily_report_reminder, "weeklyReflectionReminder": p.weekly_reflection_reminder, "sankalpaReminder": p.sankalpa_reminder, "guruDailySummary": p.guru_daily_summary, "guruFollowUpReminder": p.guru_follow_up_reminder, "quietHoursStart": p.quiet_hours_start, "quietHoursEnd": p.quiet_hours_end, "timezone": p.timezone, "pushSubscription": p.push_subscription, "createdAt": p.created_at.isoformat(), "updatedAt": p.updated_at.isoformat()}
    return {"notifications": [serial(row) for row in rows], "total": total, "unreadCount": unread, "preferences": preferences}

@router.patch("/{notification_id}/read")
def mark_read(notification_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    item = db.scalar(select(Notification).where(Notification.id == notification_id, Notification.user_id == user.id))
    if item is None: raise HTTPException(404, "Notification not found")
    item.status = "read"; item.read_at = datetime.utcnow(); db.commit(); return {"success": True}

@router.post("/read-all")
def mark_all_read(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    rows = db.scalars(select(Notification).where(Notification.user_id == user.id, Notification.status != "read")).all()
    for item in rows: item.status = "read"; item.read_at = datetime.utcnow()
    db.commit(); return {"success": True, "count": len(rows)}

@router.patch("/preferences")
def update_preferences(payload: PreferenceInput, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    item = pref(db, user.id); values = payload.model_dump(exclude_none=True)
    mapping = {"dailyReportReminder":"daily_report_reminder", "weeklyReflectionReminder":"weekly_reflection_reminder", "sankalpaReminder":"sankalpa_reminder", "guruDailySummary":"guru_daily_summary", "guruFollowUpReminder":"guru_follow_up_reminder", "quietHoursStart":"quiet_hours_start", "quietHoursEnd":"quiet_hours_end", "timezone":"timezone", "pushSubscription":"push_subscription"}
    for key, value in values.items(): setattr(item, mapping[key], value)
    db.commit(); return {"success": True}
