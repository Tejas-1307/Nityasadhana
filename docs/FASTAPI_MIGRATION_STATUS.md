# FastAPI Migration Status

## Audit findings

- Frontend: Next.js App Router, React 19, TypeScript.
- Existing backend boundary: nine Next.js Server Action modules under `lib/actions/`.
- Authentication: Clerk browser/server integration and middleware.
- Existing persistence: `lib/db/store.ts` persists domain records to `.nityasadhana-db.json`; `prisma/schema.prisma` is PostgreSQL-targeted but is not used by the runtime.
- Frontend-to-backend calls: client components invoke Server Actions directly; no existing REST route handlers or Axios/fetch API client was found.

## Implemented foundation

- `backend/app/` FastAPI service with dependency-injected SQLAlchemy sessions.
- SQLite configuration defaulting to repository-root `test.db`.
- Relational User, Mentorship, and Invitation models with role/status constraints and useful indexes.
- Argon2 password hashing, JWT access tokens, bearer authentication, and server-side Guru/Shishya role dependencies.
- `GET /health` and `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.
- CORS configured from `CORS_ORIGINS`, defaulting to `http://localhost:3000`.

## Not yet cut over

The Next.js/Clerk flow remains authoritative while migration continues. Reports, Guru dashboard operations, Sankalpa, reflections, notifications, invitations/connections, frontend API integration, Clerk token verification, and data import still require contract-by-contract migration and end-to-end verification.

No production database or `.nityasadhana-db.json` data was deleted or modified by this foundation.