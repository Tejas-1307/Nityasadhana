from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_login_and_me() -> None:
    email = f"test-guru-{uuid4().hex}@example.com"
    response = client.post(
        "/api/auth/register",
        json={"name": "Test Guru", "email": email, "password": "correct horse battery", "role": "guru"},
    )
    assert response.status_code == 201
    token = response.json()["access_token"]
    assert response.json()["user"]["role"] == "guru"

    duplicate = client.post(
        "/api/auth/register",
        json={"name": "Duplicate", "email": email, "password": "correct horse battery", "role": "guru"},
    )
    assert duplicate.status_code == 409

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == email

    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "correct horse battery"},
    )
    assert login.status_code == 200

    invalid = client.post(
        "/api/auth/login",
        json={"email": email, "password": "wrong password"},
    )
    assert invalid.status_code == 401
