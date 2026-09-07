from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def register(role: str = "shishya") -> dict:
    email = f"domain-{uuid4().hex}@example.com"
    response = client.post("/api/auth/register", json={"name": "Domain User", "email": email, "password": "12345678", "role": role})
    assert response.status_code == 201
    return response.cookies


def test_report_calculation_and_edit_window() -> None:
    cookies = register()
    response = client.post("/api/reports?submit=true", cookies=cookies, json={"practiceDate": "2099-01-01", "sleepTime": "20:00", "wakeUpTime": "04:00", "japaRounds": 16})
    assert response.status_code == 422
    response = client.post("/api/reports?submit=true", cookies=cookies, json={"sleepTime": "20:45", "wakeUpTime": "03:20", "japaRounds": 16.9, "extraRounds": 2.8, "collegeStudyDurationMinutes": 30, "selfStudyDurationMinutes": 20})
    assert response.status_code == 201
    report = response.json()["report"]
    assert report["sleepDurationMinutes"] == 395
    assert report["totalRounds"] == 18
    assert report["totalStudyDurationMinutes"] == 50


def test_password_reset_token_is_single_use() -> None:
    email = f"reset-{uuid4().hex}@example.com"
    client.post("/api/auth/register", json={"name": "Reset User", "email": email, "password": "12345678", "role": "shishya"})
    response = client.post("/api/auth/password-reset/request", json={"email": email})
    assert response.status_code == 202
    assert "token" not in response.text.lower()
