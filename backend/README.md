# Nityasadhana FastAPI backend

This service is the first migration slice for the existing Next.js application. It owns a separate SQLite database at the repository root: `test.db`. The existing Next.js Server Actions and Clerk authentication remain unchanged until each domain contract has a compatible FastAPI replacement.

## Run locally

From the repository root:

```powershell
python -m pip install -r backend/requirements.txt
npm run backend:dev
```

The API is available at `http://localhost:8000`; health is `GET /health`, and the initial auth endpoints are under `/api/auth`.

Set `JWT_SECRET` to a long random value outside local development. Set `CORS_ORIGINS` to the exact frontend origins that need access; do not use a wildcard for authenticated requests.

## Migration boundary

The current production application uses Clerk plus Next.js Server Actions over `.nityasadhana-db.json`. This backend does not import, overwrite, or delete that state. A data import must be designed and validated separately before any production cutover.