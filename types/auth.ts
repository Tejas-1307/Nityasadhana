/**
 * Nityasādhanā Authentication & Role Architecture Types
 *
 * CRITICAL SECURITY PRINCIPLES:
 * 1. `UserRole` is a strict TypeScript union: 'guru' | 'shishya'.
 * 2. Roles are server-authoritative and must NEVER be accepted from the client.
 * 3. Fail-closed: missing / invalid roles NEVER grant privileged access.
 */

export type UserRole = "guru" | "shishya";

export type AccountStatus = "active" | "pending" | "suspended";

export interface AuthenticatedUser {
  readonly id: string;
  readonly authProviderId: string;
  readonly email: string;
  readonly role: UserRole;
  name: string;
  spiritualName?: string;
  ashramId?: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  readonly userId: string;
  readonly role: UserRole;
  readonly email: string;
  readonly isAuthenticated: boolean;
}

export interface RoleAssignmentRequest {
  readonly userId: string;
  readonly targetRole: UserRole;
  readonly verifiedByServer: boolean;
}
