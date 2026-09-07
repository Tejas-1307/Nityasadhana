from datetime import datetime

from pydantic import BaseModel, Field


class InvitationCreate(BaseModel):
    expires_at: datetime | None = None


class InvitationResponse(BaseModel):
    id: int
    token: str
    code: str
    raw_code_masked: str
    expires_at: datetime


class InvitationDetails(BaseModel):
    id: int | None = None
    guru_name: str = ""
    expires_at: datetime | None = None
    is_valid: bool
    error_reason: str | None = None


class InvitationAccept(BaseModel):
    secret: str = Field(min_length=1)
