# Nityasādhanā — Deployment Environment Configuration Guide

This document describes the environment variable separation for deploying the **Nityasādhanā** platform:

- **Frontend**: Next.js App Router deployed on **Vercel**
- **Backend**: Python FastAPI deployed on **Render**
- **Repository**: `rohitpote-UX/nityasadhna_iskon`

---

## 1. Architectural Separation Overview

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│        Next.js Frontend         │                 │         FastAPI Backend         │
│         (Host: Vercel)          │                 │         (Host: Render)          │
├─────────────────────────────────┤                 ├─────────────────────────────────┤
│ Config template:                │  HTTPS / CORS   │ Config template:                │
│ `.env.example`                  │ ──────────────> │ `backend/.env.example`          │
│                                 │  Credentials    │                                 │
│ Public browser variables only   │    (Cookies)    │ Private server variables only   │
│ (prefixed with NEXT_PUBLIC_)    │                 │ (DB, JWT, CORS, SMTP)           │
└─────────────────────────────────┘                 └─────────────────────────────────┘
```

### Security Boundary Principles

1. **Zero Secret Leakage**: The Next.js frontend runs client-side bundles in users' web browsers. Variables prefixed with `NEXT_PUBLIC_` are baked into JavaScript bundles at build time. Never place `JWT_SECRET`, database passwords, or SMTP credentials in Vercel or any file prefixed with `NEXT_PUBLIC_`.
2. **Strict Origin Isolation**: Backend CORS must only allow the verified Vercel frontend origin. Wildcard (`*`) is forbidden because browser requests pass authentication cookies (`credentials: "include"`).

---

## 2. Frontend Configuration — Vercel

Configure these variables in **Vercel Dashboard** → **Project Settings** → **Environment Variables** (for _Production_ and _Preview_ environments).

| Variable Name          | Required | Default / Example (Local) | Example (Production Vercel)             | Description                                                                            |
| :--------------------- | :------: | :------------------------ | :-------------------------------------- | :------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`  | **Yes**  | `http://localhost:3000`   | `https://nityasadhana.vercel.app`       | Canonical public URL of the web application.                                           |
| `NEXT_PUBLIC_APP_NAME` |    No    | `Nityasādhanā`            | `Nityasādhanā`                          | Brand name displayed across metadata and UI headers.                                   |
| `NEXT_PUBLIC_APP_ENV`  | **Yes**  | `development`             | `production`                            | Environment tier. Setting to `production` prevents mock test data seeding.             |
| `NEXT_PUBLIC_API_URL`  | **Yes**  | `http://localhost:8000`   | `https://nityasadhana-api.onrender.com` | Base URL of the deployed FastAPI service on Render. **Do not include trailing slash.** |

### Local Development (Frontend)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

---

## 3. Backend Configuration — Render

Configure these variables in **Render Dashboard** → **Your Web Service** → **Environment**.

### Service Settings on Render

- **Environment**: `Python 3`
- **Root Directory**: `.` (or empty)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
  _(Note: If you set Root Directory to `backend`, the start command is `uvicorn app.main:app --host 0.0.0.0 --port $PORT`)_

> [!NOTE]
> Render automatically injects the `PORT` environment variable at container startup. Uvicorn binds to `$PORT` dynamic variable. Do not hardcode a port number in production commands.

### Environment Variables on Render

| Variable Name          |     Required      | Default / Example (Local) | Example (Production Render)                       | Description                                                                                                                                                         |
| :--------------------- | :---------------: | :------------------------ | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`         |      **Yes**      | `sqlite:///./test.db`     | `postgresql://user:password@host:5432/dbname`     | Database connection string. See [Section 4](#4-production-database-safety--persistence) for critical persistence instructions.                                      |
| `JWT_SECRET`           |      **Yes**      | `change-me-in-production` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b...` | 64-character high-entropy secret for signing session JWT tokens. Generate with `openssl rand -hex 32`.                                                              |
| `JWT_ALGORITHM`        |        No         | `HS256`                   | `HS256`                                           | Cryptographic algorithm for JWT signatures.                                                                                                                         |
| `ACCESS_TOKEN_MINUTES` |        No         | `60`                      | `60`                                              | JWT session lifetime before expiration (in minutes).                                                                                                                |
| `CORS_ORIGINS`         |      **Yes**      | `http://localhost:3000`   | `https://nityasadhana.vercel.app`                 | Comma-separated list of allowed origins. Must match your production Vercel domain. Multiple origins supported: `https://app.domain.com,https://preview.vercel.app`. |
| `FRONTEND_URL`         |      **Yes**      | `http://localhost:3000`   | `https://nityasadhana.vercel.app`                 | Frontend base URL used for email links (such as password reset).                                                                                                    |
| `APP_NAME`             |        No         | `Nityasadhana API`        | `Nityasadhana API`                                | OpenAPI title for FastAPI documentation.                                                                                                                            |
| `ENVIRONMENT`          |        No         | `development`             | `production`                                      | Operational environment tag.                                                                                                                                        |
| `SMTP_HOST`            | Feature-dependent | _(Empty)_                 | `smtp.sendgrid.net`                               | Outgoing SMTP host for password reset emails.                                                                                                                       |
| `SMTP_PORT`            | Feature-dependent | `587`                     | `587`                                             | SMTP port (typically `587` for STARTTLS).                                                                                                                           |
| `SMTP_USERNAME`        | Feature-dependent | _(Empty)_                 | `apikey`                                          | SMTP username.                                                                                                                                                      |
| `SMTP_PASSWORD`        | Feature-dependent | _(Empty)_                 | `SG.xxxxxxxx`                                     | SMTP password / API token.                                                                                                                                          |
| `SMTP_SENDER`          | Feature-dependent | _(Empty)_                 | `noreply@nityasadhana.org`                        | "From" address for notification emails.                                                                                                                             |

### Local Development (Backend)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Run the backend with:

```bash
npm run backend:dev
```

---

## 4. Production Database Safety & Persistence

### The Render SQLite Ephemeral Disk Concern

In the default configuration:

```env
DATABASE_URL=sqlite:///./test.db
```

- **Local Development**: SQLite persists to `test.db` in your workspace without issue.
- **Render Free Tier / Stateless Web Services**: The file system on Render web services is **ephemeral**. Every time the application sleeps, restarts, or deploys a new commit, any local SQLite database stored in the container container will be wiped clean.

### Production Solution:

1. **Managed PostgreSQL (Recommended for Production)**:
   - Create a Render PostgreSQL database (or Supabase / Neon / AWS RDS).
   - Set `DATABASE_URL` in Render environment variables to the database connection string:
     ```
     DATABASE_URL=postgresql://user:password@hostname:5432/nityasadhana
     ```
   - The existing backend (`backend/app/core/database.py`) uses SQLAlchemy with `pool_pre_ping=True` and automatically handles non-SQLite connections without any changes to ORM models.
2. **Render Persistent Disk (If remaining on SQLite)**:
   - Attach a Render Persistent Disk mounted at `/data`.
   - Set:
     ```
     DATABASE_URL=sqlite:////data/nityasadhana.db
     ```

> [!IMPORTANT]
> Do NOT execute destructive commands, migrations, or database resets during environment configuration. SQLite works for staging and proof of concept, but production data requires a persistent database provider.

---

## 5. Deployment Step-by-Step Checklist

1. **Deploy Backend on Render**:
   - Create a Web Service connected to repository `rohitpote-UX/nityasadhna_iskon`.
   - Set Build Command: `pip install -r backend/requirements.txt`
   - Set Start Command: `uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
   - Fill in backend environment variables (`JWT_SECRET`, `DATABASE_URL`, `CORS_ORIGINS`, etc.).
   - Deploy and verify health endpoint: `GET https://<your-render-service>.onrender.com/health` returns `{"status":"ok"}`.
2. **Deploy Frontend on Vercel**:
   - Import the repository in Vercel.
   - Configure environment variables:
     - `NEXT_PUBLIC_APP_URL` = `https://<your-vercel-domain>.vercel.app`
     - `NEXT_PUBLIC_API_URL` = `https://<your-render-service>.onrender.com`
     - `NEXT_PUBLIC_APP_ENV` = `production`
     - `NEXT_PUBLIC_APP_NAME` = `Nityasādhanā`
   - Deploy project.
3. **Verify Cross-Origin Communication**:
   - Update `CORS_ORIGINS` and `FRONTEND_URL` on Render with the final deployed Vercel domain if changed.
   - Test login / registration flow across the deployed URLs.
