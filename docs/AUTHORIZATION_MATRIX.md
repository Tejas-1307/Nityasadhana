# Nityasādhanā Authorization Matrix

**Platform**: Nityasādhanā  
**Phase**: 6  
**Security Boundary**: Role-Based & Relationship-Based Access Control (RBAC + ReBAC)  

---

## 1. Actor Definitions

- **Guru A**: Authenticated user with trusted role `guru` (Active status).
- **Guru B**: Independent authenticated user with trusted role `guru` (Active status).
- **Shishya A**: Authenticated user with trusted role `shishya` (Active status, actively connected to Guru A).
- **Shishya B**: Authenticated user with trusted role `shishya` (Active status, actively connected to Guru B).
- **Unauthenticated / Public**: Any visitor without a valid Clerk session.

---

## 2. Comprehensive Action Matrix

| Operation / Resource | Guru A | Guru B | Shishya A | Shishya B | Unauthenticated |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Guru Dashboard (`/guru`)** | **ALLOW** | **ALLOW** | DENY (Redirect `/student`) | DENY (Redirect `/student`) | DENY (Redirect `/login`) |
| **View Shishya Portal (`/student`)** | DENY (Redirect `/guru`) | DENY (Redirect `/guru`) | **ALLOW** | **ALLOW** | DENY (Redirect `/login`) |
| **Create Shishya Invitation** | **ALLOW** (Own) | **ALLOW** (Own) | DENY | DENY | DENY |
| **View Own Active Invitations** | **ALLOW** | **ALLOW** | DENY | DENY | DENY |
| **Revoke Own Invitation** | **ALLOW** | **ALLOW** | DENY | DENY | DENY |
| **Revoke Other Guru's Invitation** | **DENY** | **DENY** | DENY | DENY | DENY |
| **Validate Invitation Link/Code** | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** (Public details only) |
| **Accept Invitation** | DENY | DENY | **ALLOW** (If no active Guru) | **ALLOW** (If no active Guru) | DENY (Must sign in first) |
| **View Own Connected Shishyas** | **ALLOW** (Shishya A) | **ALLOW** (Shishya B) | DENY | DENY | DENY |
| **View Other Guru's Shishyas** | **DENY** | **DENY** | DENY | DENY | DENY |
| **View Shishya A's Sādhanā Data** | **ALLOW** (Active rel) | **DENY** | **ALLOW** (Self) | **DENY** | DENY |
| **View Shishya B's Sādhanā Data** | **DENY** | **ALLOW** (Active rel) | **DENY** | **ALLOW** (Self) | DENY |
| **End Mentorship with Shishya A** | **ALLOW** (Own) | **DENY** | DENY | DENY | DENY |
| **End Mentorship with Shishya B** | **DENY** | **ALLOW** (Own) | DENY | DENY | DENY |
| **Manually Create Relationship** | **DENY** | **DENY** | **DENY** | **DENY** | **DENY** |
| **Manually Change / Reassign Guru** | **DENY** | **DENY** | **DENY** | **DENY** | **DENY** |
| **View Connected Guru Details** | DENY | DENY | **ALLOW** (Guru A) | **ALLOW** (Guru B) | DENY |

---

## 3. Post-Deactivation Matrix (When Guru A ends mentorship with Shishya A)

| Operation / Resource | Guru A | Guru B | Shishya A (Deactivated) |
| :--- | :---: | :---: | :---: |
| **View Shishya A in Active List** | **DENY** (Excluded) | **DENY** | N/A |
| **Access Shishya A's Private Data** | **DENY** (Fails closed) | **DENY** | **ALLOW** (Self account intact) |
| **Shishya A Logs into Portal** | N/A | N/A | **ALLOW** (Account not deleted) |
| **Shishya A Accepts New Invite** | N/A | N/A | **DENY** (Requires reactivation process) |
| **Historical Relationship Audit** | **PRESERVED** | N/A | **PRESERVED** |

---

## 4. Suspended / Inactive User Handling

| Account State | Access to Guru Routes | Access to Shishya Routes | API / Server Actions |
| :--- | :---: | :---: | :---: |
| **Active User** | Allowed (if role matches) | Allowed (if role matches) | Allowed (if authorized) |
| **Suspended User** | **DENIED** (Redirect `/login?error=account_suspended`) | **DENIED** (Redirect `/login?error=account_suspended`) | **DENIED** (`UNAUTHORIZED`) |
| **Deactivated User** | **DENIED** (Redirect `/login?error=account_suspended`) | **DENIED** (Redirect `/login?error=account_suspended`) | **DENIED** (`UNAUTHORIZED`) |
