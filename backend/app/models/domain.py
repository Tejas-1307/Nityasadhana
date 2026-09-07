from datetime import datetime
from enum import StrEnum

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Report(Base):
    __tablename__ = "daily_reports"
    __table_args__ = (UniqueConstraint("student_id", "practice_date", name="uq_daily_report"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    practice_date: Mapped[str] = mapped_column(String(10), index=True)
    status: Mapped[str] = mapped_column(String(16), default="draft")
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    sleep_time: Mapped[str] = mapped_column(String(16), default="")
    wake_up_time: Mapped[str] = mapped_column(String(16), default="")
    sleep_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    japa_rounds: Mapped[int] = mapped_column(Integer, default=0)
    extra_rounds: Mapped[int] = mapped_column(Integer, default=0)
    total_rounds: Mapped[int] = mapped_column(Integer, default=0)
    japa_completed_at: Mapped[str | None] = mapped_column(String(16))
    reading_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    reading_note: Mapped[str | None] = mapped_column(String(100))
    hearing_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    hearing_note: Mapped[str | None] = mapped_column(String(100))
    college_study_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    self_study_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    total_study_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    day_rest_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    time_wasted_duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Sankalpa(Base):
    __tablename__ = "weekly_sankalpas"
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(32), default="other")
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str | None] = mapped_column(Text)
    target_type: Mapped[str] = mapped_column(String(20), default="metric_based")
    target_config: Mapped[dict | None] = mapped_column(JSON)
    start_date: Mapped[str] = mapped_column(String(10), index=True)
    end_date: Mapped[str] = mapped_column(String(10))
    status: Mapped[str] = mapped_column(String(16), default="active", index=True)
    reflection: Mapped[dict | None] = mapped_column(JSON)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WeeklyReflection(Base):
    __tablename__ = "weekly_reflections"
    __table_args__ = (UniqueConstraint("student_id", "week_start_date", name="uq_weekly_reflection"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    sankalpa_id: Mapped[int | None] = mapped_column(ForeignKey("weekly_sankalpas.id", ondelete="SET NULL"))
    week_start_date: Mapped[str] = mapped_column(String(10), index=True)
    week_end_date: Mapped[str] = mapped_column(String(10))
    state: Mapped[str] = mapped_column(String(16))
    went_well: Mapped[str | None] = mapped_column(String(300))
    difficult: Mapped[str | None] = mapped_column(String(300))
    improve: Mapped[str | None] = mapped_column(String(300))
    guru_message: Mapped[str | None] = mapped_column(String(300))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (UniqueConstraint("event_key", name="uq_notification_event"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    type: Mapped[str] = mapped_column(String(40))
    title: Mapped[str] = mapped_column(String(160))
    message: Mapped[str] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(String(16), default="low")
    status: Mapped[str] = mapped_column(String(16), default="sent", index=True)
    scheduled_for_date: Mapped[str] = mapped_column(String(10))
    event_key: Mapped[str] = mapped_column(String(200))
    action_url: Mapped[str | None] = mapped_column(String(255))
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime)
    suppressed_reason: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    daily_report_reminder: Mapped[bool] = mapped_column(Boolean, default=True)
    weekly_reflection_reminder: Mapped[bool] = mapped_column(Boolean, default=True)
    sankalpa_reminder: Mapped[bool] = mapped_column(Boolean, default=True)
    guru_daily_summary: Mapped[bool] = mapped_column(Boolean, default=True)
    guru_follow_up_reminder: Mapped[bool] = mapped_column(Boolean, default=True)
    quiet_hours_start: Mapped[str] = mapped_column(String(5), default="21:00")
    quiet_hours_end: Mapped[str] = mapped_column(String(5), default="05:00")
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata")
    push_subscription: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
