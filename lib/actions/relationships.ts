"use server";

import { revalidatePath } from "next/cache";
import {
  requireGuru,
  requireShishya,
  requireGuruOwnsShishya,
  getAuthorizedShishyasForGuru,
  getActiveRelationshipForShishya,
} from "@/lib/auth";
import { dbStore } from "@/lib/db/store";
import { DbGuruShishyaRelationship, DbUser, DbInvitation } from "@/lib/db/schema";

export interface ShishyaRelationshipItem {
  relationship: DbGuruShishyaRelationship;
  shishya: DbUser;
}

export interface GuruRelationshipItem {
  relationship: DbGuruShishyaRelationship;
  guru: DbUser;
}

/**
 * Server Action: Guru deactivates an active mentorship relationship ("End Mentorship").
 *
 * CRITICAL SECURITY PRINCIPLES:
 * 1. Must be authenticated with 'guru' role.
 * 2. Guru must own an active relationship with target Shishya (server-verified).
 * 3. Does NOT delete Shishya user account, historical reports, or invitations.
 * 4. Fails closed if the relationship is nonexistent, inactive, or belongs to another Guru.
 */
export async function endMentorshipAction(shishyaId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Enforce server-authoritative ownership and active relationship
    const { guru } = await requireGuruOwnsShishya(shishyaId);

    const result = await dbStore.deactivateRelationship({
      guruId: guru.id,
      shishyaId,
      deactivatedBy: guru.id,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to end mentorship relationship.",
      };
    }

    // Revalidate affected routes
    revalidatePath("/guru/shishyas");
    revalidatePath("/guru");
    revalidatePath("/student");

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to end mentorship relationship.";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Retrieves only the authenticated Guru's active Shishyas and invitations.
 * Scoped query strictly prevents cross-Guru data leakage.
 */
export async function getGuruShishyasDataAction(): Promise<{
  shishyas: ShishyaRelationshipItem[];
  invitations: DbInvitation[];
}> {
  const guru = await requireGuru();

  const [shishyas, invitations] = await Promise.all([
    getAuthorizedShishyasForGuru(guru.id),
    dbStore.getInvitationsByGuru(guru.id),
  ]);

  return {
    shishyas,
    invitations,
  };
}

/**
 * Server Action: Retrieves active Guru relationship for current authenticated Shishya.
 * Scoped strictly to authenticated session.
 */
export async function getShishyaGuruDataAction(): Promise<GuruRelationshipItem | null> {
  const shishya = await requireShishya();
  return getActiveRelationshipForShishya(shishya.id);
}
