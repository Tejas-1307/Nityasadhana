from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

PRODUCTION_VERCEL_ORIGIN = "https://nityasadhanaiskon.vercel.app"
UNAUTHORIZED_ORIGIN = "https://unauthorized-origin.evil.com"
LOCALHOST_ORIGIN = "http://localhost:3000"


def test_cors_options_preflight_vercel_origin() -> None:
    """Verify that OPTIONS preflight from the production Vercel frontend is accepted with correct CORS headers."""
    response = client.options(
        "/api/auth/register",
        headers={
            "Origin": PRODUCTION_VERCEL_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type, authorization",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == PRODUCTION_VERCEL_ORIGIN
    assert response.headers.get("access-control-allow-credentials") == "true"
    allowed_methods = response.headers.get("access-control-allow-methods", "")
    assert "POST" in allowed_methods
    assert "OPTIONS" in allowed_methods


def test_cors_registration_request_permitted_origin() -> None:
    """Verify that a registration POST request from the production Vercel origin succeeds with CORS headers attached."""
    email = f"cors-test-{uuid4().hex}@example.com"
    response = client.post(
        "/api/auth/register",
        headers={"Origin": PRODUCTION_VERCEL_ORIGIN},
        json={
            "name": "CORS Test User",
            "email": email,
            "password": "validPassword123",
            "role": "shishya",
        },
    )
    assert response.status_code == 201
    assert response.headers.get("access-control-allow-origin") == PRODUCTION_VERCEL_ORIGIN
    assert response.headers.get("access-control-allow-credentials") == "true"
    assert "access_token" in response.json()


def test_cors_expected_headers_on_responses() -> None:
    """Verify that CORS response headers are present on regular API responses when called from the Vercel origin."""
    response = client.get(
        "/health",
        headers={"Origin": PRODUCTION_VERCEL_ORIGIN},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == PRODUCTION_VERCEL_ORIGIN
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_unapproved_origin_rejected() -> None:
    """Verify that preflight and simple requests from unapproved origins do not receive Access-Control-Allow-Origin."""
    # Preflight rejected with 400 and no allow-origin header
    preflight = client.options(
        "/api/auth/register",
        headers={
            "Origin": UNAUTHORIZED_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert preflight.status_code == 400
    assert "access-control-allow-origin" not in preflight.headers

    # Simple GET from unapproved origin does not get allow-origin header
    response = client.get(
        "/health",
        headers={"Origin": UNAUTHORIZED_ORIGIN},
    )
    assert "access-control-allow-origin" not in response.headers


def test_cors_localhost_still_permitted() -> None:
    """Verify that existing local development origin (http://localhost:3000) is preserved and still accepted."""
    response = client.options(
        "/api/auth/register",
        headers={
            "Origin": LOCALHOST_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == LOCALHOST_ORIGIN
    assert response.headers.get("access-control-allow-credentials") == "true"
