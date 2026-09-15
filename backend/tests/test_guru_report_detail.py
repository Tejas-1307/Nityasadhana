from datetime import date
from uuid import uuid4

from fastapi.testclient import TestClient

from app.core.database import SessionLocal
from app.main import app
from app.models import Mentorship, RelationshipStatus
from app.models.domain import Report

client = TestClient(app)


def register(role: str) -> tuple[dict, int]:
    email = f"detail-{role}-{uuid4().hex}@example.com"
    response = client.post("/api/auth/register", json={"name": role.title(), "email": email, "password": "12345678", "role": role})
    assert response.status_code == 201
    return response.cookies, response.json()["user"]["id"]


def test_guru_report_detail_is_relationship_scoped() -> None:
    guru_cookies, guru_id = register("guru")
    other_guru_cookies, other_guru_id = register("guru")
    _, student_id = register("shishya")
    db = SessionLocal()
    db.add(Mentorship(guru_id=guru_id, shishya_id=student_id, status=RelationshipStatus.ACTIVE))
    report = Report(student_id=student_id, practice_date=date.today().isoformat(), status="submitted", sleep_time="21:00", wake_up_time="04:00", sleep_duration_minutes=420, japa_rounds=16, total_rounds=16)
    db.add(report)
    db.commit(); db.refresh(report); db.close()

    authorized = client.get(f"/api/guru/shishyas/{student_id}/reports/{report.id}", cookies=guru_cookies)
    assert authorized.status_code == 200
    assert authorized.json()["report"]["id"] == str(report.id)

    denied = client.get(f"/api/guru/shishyas/{student_id}/reports/{report.id}", cookies=other_guru_cookies)
    assert denied.status_code == 403

    missing = client.get(f"/api/guru/shishyas/{student_id}/reports/999999999", cookies=guru_cookies)
    assert missing.status_code == 404
