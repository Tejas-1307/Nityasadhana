"use server";

// ============================================================
// NITYASĀDHANĀ — GURU WEEKLY DIGEST SERVER ACTIONS
// ============================================================

import { requireGuru } from "@/lib/auth/guards";
import { DigestService } from "@/lib/digest/service";
import { GuruWeeklyDigest } from "@/lib/digest/types";

export async function getGuruWeeklyDigestAction(
  referenceDateStr?: string
): Promise<{
  success: boolean;
  data?: GuruWeeklyDigest;
  error?: string;
}> {
  try {
    const guru = await requireGuru();
    const digest = await DigestService.getGuruWeeklyDigest(guru.id, referenceDateStr);

    return {
      success: true,
      data: digest,
    };
  } catch (err: unknown) {
    console.error("[DigestAction] Failed to fetch weekly digest:", err);
    const message = err instanceof Error ? err.message : "Failed to load weekly digest.";
    return {
      success: false,
      error: message,
    };
  }
}
