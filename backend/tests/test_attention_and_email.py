from datetime import date, timedelta
from uuid import uuid4

from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.core.email import email_service
from app.main import app
from app.models import Mentorship, RelationshipStatus, User
from app.models.domain import Report

client = TestClient(app)


def account(role: str) -> tuple[dict, int]:
    email = f"attention-{role}-{uuid4().hex}@example.com"
    response = client.post("/api/auth/register", json={"name": role.title(), "email": email, "password": "12345678", "role": role})
    assert response.status_code == 201
    return response.cookies, response.json()["user"]["id"]


def test_guru_dashboard_uses_attention_pipeline() -> None:
    guru_cookies, guru_id = account("guru")
    _, student_id = account("shishya")
    db = SessionLocal()
    db.add(Mentorship(guru_id=guru_id, shishya_id=student_id, status=RelationshipStatus.ACTIVE))
    today = date.today()
    for offset in range(1, 7):
        day = today - timedelta(days=offset)
        db.add(Report(student_id=student_id, practice_date=day.isoformat(), status="submitted", sleep_time="21:00", wake_up_time="04:00", sleep_duration_minutes=420, japa_rounds=16, total_rounds=16, total_study_duration_minutes=120))
    db.add(Report(student_id=student_id, practice_date=today.isoformat(), status="submitted", sleep_time="21:00", wake_up_time="06:00", sleep_duration_minutes=420, japa_rounds=6, total_rounds=6, total_study_duration_minutes=120))
    db.commit(); db.close()
    response = client.get("/api/guru-dashboard", cookies=guru_cookies)
    assert response.status_code == 200
    item = response.json()["allShishyas"][0]
    assert item["attentionLevel"] in {"OBSERVE", "FOLLOW_UP_SUGGESTED"}
    assert item["assessment"]["baseline"]["hasSufficientHistory"] is True


def test_reset_email_is_mockable_and_token_is_single_use(monkeypatch) -> None:
    email = f"email-{uuid4().hex}@example.com"
    client.post("/api/auth/register", json={"name": "Email User", "email": email, "password": "12345678", "role": "shishya"})
    sent: list[tuple[str, str]] = []
    monkeypatch.setattr(email_service, "send_password_reset", lambda recipient, url: sent.append((recipient, url)))
    assert client.post("/api/auth/password-reset/request", json={"email": email}).status_code == 202
    assert sent and sent[0][0] == email and "token=" in sent[0][1]
    token = sent[0][1].split("token=", 1)[1]
    assert client.post("/api/auth/password-reset/confirm", json={"token": token, "password": "newpass8"}).status_code == 200
    assert client.post("/api/auth/password-reset/confirm", json={"token": token, "password": "newpass9"}).status_code == 400
