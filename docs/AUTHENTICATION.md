# Nityasādhanā Authentication & Security Architecture

> **"The browser is untrusted. Role assignment and route authorization are strictly server-authoritative."**

---

## 1. Overview & Provider

Nityasādhanā uses **Clerk** as the external authentication and identity provider, layered with internal **Nityasādhanā server-side authorization guards** and fail-closed role enforcement.

```
                    ┌─────────────────────────┐
                    │          CLERK          │
                    │ Authentication Identity │
                    └────────────┬────────────┘
                                 │
                                 ↓
                     Authenticated Session
                                 │
                                 ↓
                     Server-side Role Check
                   (publicMetadata.role only)
                                 │
                 ┌───────────────┴───────────────┐
                 ↓                               ↓
               GURU                           SHISHYA
          (role === 'guru')             (role === 'shishya')
                 │                               │
                 ↓                               ↓
          /guru/* (Protected)             /student/* (Protected)
```

---

## 2. Strict Role Model & Security Boundaries

### Type Definition

```typescript
export type UserRole = "guru" | "shishya";
```

### Critical Security Guarantees:

1. **No Client-Side Role Escalation**:
   - A user **CANNOT** turn themselves into a Guru via:
     - URL parameters (`?role=guru`)
     - Form inputs or hidden fields
     - `localStorage` or `sessionStorage`
     - Browser cookies modified by the client
     - React client-side state
     - `unsafeMetadata` in Clerk
2. **Server-Authoritative Storage**:
   - The user's role is stored exclusively in `publicMetadata.role` via server-side Clerk Admin SDK.
   - Client components may _read_ the role for display purposes, but **NEVER** write or authorize based on client state.
3. **Fail-Closed Principle**:
   - If an authenticated user has a `null`, missing, invalid, or unrecognized role, access to `/guru/*` and `/student/*` is **DENIED**.

---

## 3. Server Authorization Guards

Located in `lib/auth/guards.ts`:

| Guard Function     | Condition Required                   | Failure Action                                                                                      |
| :----------------- | :----------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `requireAuth()`    | Valid Clerk session                  | Redirects unauthenticated visitor to `/login`                                                       |
| `requireGuru()`    | Valid session + `role === 'guru'`    | If Shishya $\rightarrow$ `/student`. If missing role $\rightarrow$ `/login?error=unauthorized_role` |
| `requireShishya()` | Valid session + `role === 'shishya'` | If Guru $\rightarrow$ `/guru`. If missing role $\rightarrow$ `/login?error=unauthorized_role`       |

---

## 4. Route Protection Middleware

Located in `middleware.ts`:

- **Public Routes**: `/`, `/about`, `/design-system`, `/login(.*)`, `/signup(.*)`, `/forgot-password(.*)`, `/invite(.*)`, `/manifest.webmanifest`, `/favicon.ico`, static assets.
- **Protected Routes**: `/guru(.*)`, `/student(.*)`, `/api/protected(.*)`.
- Intercepts requests on edge; redirects unauthenticated visitors to `/login?redirect_url=...`.

---

## 5. Authentication Flows & UX

### A. Login Flow (`/login`)

- Accepts registered Email + Password.
- Preserves intentional role entry hint from landing page (`?role=guru` or `?role=student`) for UI context, while server-side metadata strictly dictates post-login routing.
- Handles invalid credentials and locked accounts with calm feedback.

### B. Signup Flow (`/signup`)

- Collects First Name, Last Name, Email, and Password.
- Creates the account immediately after FastAPI validates the registration payload; registration does not use OTP or email verification.
- Assigns the role securely on the FastAPI server.

### C. Password Recovery Flow (`/forgot-password`)

- Secure, single-use password-reset token sent to the configured email service.
- Account enumeration protected (generic success message prevents user probing).

### D. Sign Out Flow

- Triggered via `UserMenu` (`components/auth/user-menu.tsx`) through the FastAPI session endpoint.
- Invalidates session and redirects to `/login`.

---

## 6. Environment Variable Boundaries

```env
# Client-Safe Public Keys (Exposed to browser)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/student
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/student

# Private Backend Secrets (NEVER exposed to browser / client code)
CLERK_SECRET_KEY=sk_test_...
```

---

## 7. Security Acceptance Testing Matrix

| Test Scenario | Attack Vector                                       | Expected Result                | Verified Status |
| :------------ | :-------------------------------------------------- | :----------------------------- | :-------------- |
| **Test 1**    | Shishya modifies role in React DevTools             | Server guard rejects access    | **PASS**        |
| **Test 2**    | Shishya manually navigates to `/guru`               | Redirected to `/student`       | **PASS**        |
| **Test 3**    | Shishya modifies `localStorage.role = 'guru'`       | Server ignores local storage   | **PASS**        |
| **Test 4**    | Shishya modifies `sessionStorage`                   | Server ignores session storage | **PASS**        |
| **Test 5**    | Shishya appends `?role=guru` to URL                 | URL ignored; server role used  | **PASS**        |
| **Test 6**    | Shishya crafts POST request with `{ role: "guru" }` | Rejected; role unmodifiable    | **PASS**        |
| **Test 7**    | Unauthenticated visitor visits `/guru`              | Redirected to `/login`         | **PASS**        |
| **Test 8**    | Verified Guru visits `/guru`                        | Allowed access                 | **PASS**        |
| **Test 9**    | User has missing or corrupt role                    | Fails closed; access denied    | **PASS**        |
| **Test 10**   | Repository scan for `CLERK_SECRET_KEY` leaks        | Zero leaks in client bundles   | **PASS**        |

---

## 8. Future Roadmap (Phase 5+)

- **Guru Invitation & Credential Generator**: Gurus will generate cryptographically secure 6-character activation codes for their Shishyas.
- **Relational Ownership**: Linking `Shishya.guruId` $\rightarrow$ `Guru.id` with private data access rules.
