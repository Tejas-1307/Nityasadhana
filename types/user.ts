/**
 * User & Role domain type placeholders.
 * Pure type architecture for future profile and ashram modules.
 */

import { UserRole } from "./auth";

export interface UserProfile {
  readonly id: string;
  readonly phone?: string;
  readonly role: UserRole;
  name: string;
  spiritualName?: string;
  ashramId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  readonly userId: string;
  readonly role: UserRole;
  readonly expiresAt: string;
  isAuthenticated: boolean;
}

export interface AshramGroup {
  readonly id: string;
  name: string;
  sanskritName?: string;
  location?: string;
}
