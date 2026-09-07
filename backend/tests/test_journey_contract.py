from datetime import date, timedelta
from uuid import uuid4

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.domain import Report

client = TestClient(app)

def test_journey_returns_full_comparison_contract() -> None:
    email = f"journey-{uuid4().hex}@example.com"
    registered = client.post("/api/auth/register", json={"name":"Journey","email":email,"password":"12345678","role":"shishya"})
    assert registered.status_code == 201
    user_id = registered.json()["user"]["id"]
    today = date.today()
    db = SessionLocal()
    for offset in range(3):
        day = today - timedelta(days=offset)
        db.add(Report(student_id=user_id, practice_date=day.isoformat(), status="submitted", sleep_time="21:00", wake_up_time="04:00", sleep_duration_minutes=420, japa_rounds=16, total_rounds=16, total_study_duration_minutes=120))
    db.commit(); db.close()
    response = client.get("/api/reports/journey?rangeDays=7", cookies=registered.cookies)
    assert response.status_code == 200
    body = response.json()
    assert body["hasEnoughData"] is True
    assert set(body["comparison"]) == {"japa", "wakeUp", "sleep", "reading", "hearing", "study", "timeWasted"}
    assert len(body["dailySeries"]) == 7
    assert body["overview"]["submittedCount"] == 3
