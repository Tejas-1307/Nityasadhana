import { redirect } from "next/navigation";
import { getCurrentAuthUser, getCurrentRole } from "./auth";
import { AuthenticatedUser } from "@/types/auth";
import { dbStore } from "@/lib/db/store";
import { DbGuruShishyaRelationship, DbUser } from "@/lib/db/schema";

/**
 * Server-side guard requiring an active authenticated user.
 * Fails closed if the user session is missing or account is suspended/inactive.
 */
export async function requireAuthenticatedUser(
  redirectTo: string = "/login"
): Promise<AuthenticatedUser> {
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect(redirectTo);
  }

  if (user.status !== "active") {
    redirect("/login?error=account_suspended");
  }

  return user;
}

/**
 * Server-side guard requiring the authenticated user to possess the trusted 'guru' role
 * and an active account status.
 *
 * CRITICAL SECURITY PRINCIPLE:
 * Fails closed if role is missing, corrupt, or equals 'shishya'.
 */
export async function requireGuruUser(): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser("/login?role=guru");
  const role = await getCurrentRole();

  if (role !== "guru") {
    if (role === "shishya") {
      redirect("/student");
    }
    redirect("/login?error=unauthorized_role");
  }

  return user;
}

/**
 * Server-side guard requiring the authenticated user to possess the trusted 'shishya' role
 * and an active account status.
 *
 * CRITICAL SECURITY PRINCIPLE:
 * Fails closed if role is missing, corrupt, or equals 'guru'.
 */
export async function requireShishyaUser(): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser("/login?role=student");
  const role = await getCurrentRole();

  if (role !== "shishya") {
    if (role === "guru") {
      redirect("/guru");
    }
    redirect("/login?error=unauthorized_role");
  }

  return user;
}

/**
 * Server-side authorization check: Verifies that the authenticated Guru has an
 * ACTIVE mentorship relationship with the requested Shishya.
 *
 * CRITICAL AUTHORIZATION RULE:
 * 1. Current user must be authenticated.
 * 2. Role must be 'guru' and account active.
 * 3. Relationship must exist, match calling guruId and target shishyaId.
 * 4. Relationship status must be 'active'.
 *
 * Fails closed (throws error) if any check fails, preventing cross-Guru access.
 */
export async function requireGuruOwnsShishya(shishyaId: string): Promise<{
  guru: AuthenticatedUser;
  shishya: DbUser;
  relationship: DbGuruShishyaRelationship;
}> {
  const guru = await requireGuruUser();

  if (!shishyaId || typeof shishyaId !== "string") {
    throw new Error("UNAUTHORIZED: Invalid or missing Shishya identifier.");
  }

  const relationship = await dbStore.getRelationship(guru.id, shishyaId);
  if (!relationship || relationship.status !== "active") {
    throw new Error(
      "UNAUTHORIZED: You do not have an active mentorship relationship with this Shishya."
    );
  }

  const shishya = await dbStore.getUserById(shishyaId);
  if (!shishya) {
    throw new Error("UNAUTHORIZED: Shishya account record not found.");
  }

  return {
    guru,
    shishya,
    relationship,
  };
}

/**
 * Server-side authorization check: Verifies that the authenticated user is the
 * authorized Shishya themselves.
 *
 * Prevents Shishya-to-Shishya cross-access.
 */
export async function requireCurrentShishya(requestedShishyaId?: string): Promise<{
  shishya: AuthenticatedUser;
}> {
  const shishya = await requireShishyaUser();

  if (requestedShishyaId && requestedShishyaId !== shishya.id) {
    throw new Error("UNAUTHORIZED: Cross-Shishya access is strictly prohibited.");
  }

  return { shishya };
}

// ============================================================
// DATA ACCESS LAYER (AUTHORIZATION-ENFORCING)
// ============================================================

/**
 * Scoped query: Retrieves Shishya data only if the calling Guru is actively connected.
 * Returns null if unauthorized or inactive.
 */
export async function getAuthorizedShishyaForGuru(
  guruId: string,
  shishyaId: string
): Promise<{ relationship: DbGuruShishyaRelationship; shishya: DbUser } | null> {
  const relationship = await dbStore.getRelationship(guruId, shishyaId);
  if (!relationship || relationship.status !== "active") {
    return null;
  }

  const shishya = await dbStore.getUserById(shishyaId);
  if (!shishya) return null;

  return { relationship, shishya };
}

/**
 * Scoped query: Retrieves all active Shishyas connected to the authenticated Guru.
 */
export async function getAuthorizedShishyasForGuru(
  guruId: string
): Promise<Array<{ relationship: DbGuruShishyaRelationship; shishya: DbUser }>> {
  return dbStore.getShishyasByGuru(guruId, "active");
}

/**
 * Scoped query: Retrieves active Guru relationship and profile for current Shishya.
 */
export async function getActiveRelationshipForShishya(
  shishyaId: string
): Promise<{ relationship: DbGuruShishyaRelationship; guru: DbUser } | null> {
  return dbStore.getGuruByShishya(shishyaId, "active");
}
