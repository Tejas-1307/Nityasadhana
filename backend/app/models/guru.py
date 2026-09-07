from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
class FollowUp(Base):
    __tablename__ = "guru_follow_ups"
    id: Mapped[int] = mapped_column(primary_key=True); guru_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True); student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True); note: Mapped[str] = mapped_column(Text); follow_up_date: Mapped[str] = mapped_column(String(10)); next_follow_up_date: Mapped[str | None] = mapped_column(String(10)); status: Mapped[str] = mapped_column(String(16), default="upcoming"); created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow); updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
class PrivateNote(Base):
    __tablename__ = "guru_private_notes"
    id: Mapped[int] = mapped_column(primary_key=True); guru_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True); student_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True); content: Mapped[str] = mapped_column(Text); created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow); updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
