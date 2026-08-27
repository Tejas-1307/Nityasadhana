# Nityasādhanā Invitation & Relationship Security Architecture

> **"The invitation establishes the relationship. The browser does NOT establish the relationship."**
>
> **"Never trust `guruId` or `shishyaId` from client requests. Relationships must be created exclusively through server-authoritative invitation validation."**

---

## 1. Threat Model & Security Axioms

| Vulnerability Vector                 | Attack Scenario                                                                   | Nityasādhanā Defense Mechanism                                                                                                                                                                                                                         |
| :----------------------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Direct ID Manipulation**           | Attacker sends `{ guruId: "victim_guru_id" }` in POST payload to attach to a Guru | **Server-Authoritative:** Server strictly derives Guru ID from the authenticated Guru session during invitation creation, and derives Shishya ID from the authenticated Shishya session during acceptance. Client-supplied IDs are completely ignored. |
| **Token Brute-Forcing**              | Attacker attempts to enumerate or guess invitation URLs                           | **256-bit Entropy:** URL tokens are 64-character hexadecimal cryptographically secure random strings generated via `crypto.randomBytes(32)` ($2^{256}$ keyspace). Unguessable.                                                                         |
| **Readable Code Collision**          | Attacker guesses `NITYA-XXXX-XXXX` human-readable codes                           | **Unambiguous Base32:** 8 characters from unambiguous charset (omitting 0/O/1/I/L) with rate limiting (maximum 50 pending per Guru) and SHA-256 validation.                                                                                            |
| **Database Compromise / Leak**       | Plaintext invitation codes stolen from database dump                              | **One-Way Hashing:** Only SHA-256 hashes (`tokenHash`, `codeHash`) are stored in the database. Raw tokens/codes are never persisted.                                                                                                                   |
| **Race Conditions (Double Claim)**   | Two Shishyas open and accept the same invitation at the exact same millisecond    | **Atomic Transaction & Mutex Locking:** Database operations use synchronous mutex-locked conditional compare-and-swap (`status === 'pending' && expiresAt > NOW()`). If claimed, only the first request succeeds; all concurrent attempts fail.        |
| **Expired / Revoked Reuse**          | Devotee attempts to accept an expired (7+ days) or revoked invitation             | **Strict Time & Status Check:** Server checks `expiresAt > NOW()` and `status === 'pending'`. Revocation immediately updates status to `'revoked'`.                                                                                                    |
| **Silent Guru Hijacking**            | Shishya already connected to Guru A attempts to accept an invitation from Guru B  | **Explicit Single Guru Constraint:** Server verifies Shishya has no active Guru. Rejects with `"You are already connected with a Guru"` rather than silently overwriting the relationship.                                                             |
| **Cross-Guru Access**                | Guru A attempts to query, list, or revoke Guru B's invitations                    | **Ownership Enforcement:** Queries filter strictly by `createdByUserId === currentGuru.id`. Revocation verifies `invitation.createdByUserId === currentGuru.id`.                                                                                       |
| **Role Escalation via Invite**       | Attacker modifies role parameter to `role=guru` during invite signup              | **Server-Enforced Role:** `intendedRole` is hardcoded to `'shishya'` in the invitation model. Acceptance assigns `role = 'shishya'` server-side only.                                                                                                  |
| **Token Leakage in Browser History** | Invitation bearer token remains visible in address bar                            | **Post-Acceptance Redirect:** After acceptance, user is immediately redirected to clean route `/student`.                                                                                                                                              |

---

## 2. Cryptographic Token Lifecycle

```
[Guru in My Shishyas]
        │
        ▼ (Taps "Generate Invitation")
[crypto.randomBytes(32)] ──► rawToken (64 hex chars, 256-bit entropy)
[crypto.randomBytes(8)]  ──► rawCode (NITYA-7K4P-X9QM)
        │
        ▼
[SHA-256 Hashing] ──► tokenHash, codeHash
        │
        ▼
[Database Persistence] ──► Stores { tokenHash, codeHash, rawCodeMasked, createdByUserId: guru.id, status: 'pending', expiresAt: +7d }
        │
        ▼
[Guru Interface] ──► Displays rawCode ("NITYA-7K4P-X9QM") & Web Share URL (/invite/<rawToken>)
```

---

## 3. Atomic Acceptance Transaction Workflow

```
[Shishya taps "Accept & Connect"]
        │
        ▼
[Server Action: acceptInvitationAction(secret)]
        │
        ▼
[Authenticate Shishya Session] ──► Extract authenticated shishya.id
        │
        ▼
[Acquire Database Mutex Lock]
        │
        ├──► 1. Verify invitation exists by tokenHash or codeHash
        ├──► 2. Verify status === 'pending' (reject if used/expired/revoked)
        ├──► 3. Verify expiresAt > NOW() (reject if expired)
        ├──► 4. Verify Shishya has no existing active Guru relationship
        ├──► 5. Atomically update invitation: status = 'used', usedAt = NOW(), usedByUserId = shishya.id
        ├──► 6. Atomically insert GuruShishyaRelationship { guruId, shishyaId, status: 'active' }
        └──► 7. Atomically update Shishya user role = 'shishya'
        │
        ▼
[Release Mutex Lock]
        │
        ▼
[Revalidate Paths & Redirect to /student]
```

---

## 4. Database Schema Specification

### User Entity

```typescript
interface DbUser {
  id: string; // Immutable internal identifier
  authProviderId: string; // Clerk external ID
  role: "guru" | "shishya";
  name: string;
  spiritualName?: string;
  email: string;
  status: "active" | "pending" | "suspended";
  createdAt: string;
  updatedAt: string;
}
```

### Invitation Entity

```typescript
interface DbInvitation {
  id: string;
  tokenHash: string; // SHA-256 hash of 256-bit URL token
  codeHash: string; // SHA-256 hash of human-readable code
  rawCodeMasked: string; // e.g. "NITYA-••••-X9QM"
  createdByUserId: string; // References Guru.id
  intendedRole: "shishya"; // Strict union
  status: "pending" | "used" | "expired" | "revoked";
  expiresAt: string; // ISO UTC (+7 days)
  usedAt?: string;
  usedByUserId?: string; // References Shishya.id
  revokedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Relationship Entity

```typescript
interface DbGuruShishyaRelationship {
  id: string;
  guruId: string; // References Guru.id
  shishyaId: string; // References Shishya.id
  status: "active" | "paused" | "ended";
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Security Acceptance Test Confirmation

- **Can a Guru manually attach an arbitrary Shishya?** $\rightarrow$ **NO.**
- **Can a Shishya manually choose or change their Guru?** $\rightarrow$ **NO.**
- **Can the same invitation be used twice?** $\rightarrow$ **NO.**
- **Can a browser request create an arbitrary Guru–Shishya relationship?** $\rightarrow$ **NO.**
