"use server";

import { requireGuru } from "@/lib/auth/guards";
import { requireGuruOwnsShishya } from "@/lib/auth/authorization";
import {
  GuruService,
  GuruDashboardOverview,
  ShishyaDetailForGuru,
} from "@/lib/guru/service";
import { DbDailySadhanaReport, DbGuruFollowUp, DbGuruPrivateNote } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export interface GuruActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Fetches complete Guru Dashboard overview.
 * Accessible strictly by authenticated Gurus.
 */
export async function getGuruDashboardOverviewAction(): Promise<
  GuruActionResponse<GuruDashboardOverview>
> {
  try {
    const guru = await requireGuru();
    const overview = await GuruService.getDashboardOverview(guru.id);
    return { success: true, data: overview };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load Guru dashboard overview.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Fetches complete student profile data for Guru inspection.
 * Strictly verifies that the calling Guru has an active mentorship with this Shishya.
 */
export async function getGuruShishyaDetailAction(
  shishyaId: string
): Promise<GuruActionResponse<ShishyaDetailForGuru>> {
  try {
    const { guru } = await requireGuruOwnsShishya(shishyaId);
    const detail = await GuruService.getShishyaDetail(guru.id, shishyaId);

    if (!detail) {
      return { success: false, error: "Shishya profile not found or unauthorized." };
    }

    return { success: true, data: detail };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load Shishya profile.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Fetches paginated past report history for a Shishya.
 * Strictly verifies mentorship ownership.
 */
export async function getGuruShishyaReportHistoryAction(
  shishyaId: string,
  limit: number = 20,
  offset: number = 0
): Promise<
  GuruActionResponse<{
    reports: DbDailySadhanaReport[];
    total: number;
  }>
> {
  try {
    const { guru } = await requireGuruOwnsShishya(shishyaId);
    const history = await GuruService.getShishyaHistory(guru.id, shishyaId, limit, offset);

    if (!history) {
      return { success: false, error: "History not found or unauthorized." };
    }

    return { success: true, data: history };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load report history.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Retrieves single report detail for inspection by Guru.
 * Strictly READ-ONLY.
 */
export async function getGuruShishyaReportDetailAction(
  shishyaId: string,
  reportId: string
): Promise<GuruActionResponse<{ report: DbDailySadhanaReport }>> {
  try {
    const { guru } = await requireGuruOwnsShishya(shishyaId);
    const report = await GuruService.getReportDetailForGuru(guru.id, shishyaId, reportId);

    if (!report) {
      return { success: false, error: "Report not found or unauthorized." };
    }

    return { success: true, data: { report } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load report detail.";
    return { success: false, error: msg };
  }
}

// ============================================================
// PHASE 14: FOLLOW-UP & PRIVATE NOTE ACTIONS
// ============================================================

/**
 * Server Action: Creates a follow-up discussion record for a Shishya.
 * Strictly validates that calling Guru is authorized.
 */
export async function addGuruFollowUpAction(params: {
  shishyaId: string;
  note: string;
  followUpDate: string;
  nextFollowUpDate?: string;
}): Promise<GuruActionResponse<{ followUp: DbGuruFollowUp }>> {
  try {
    const { guru } = await requireGuruOwnsShishya(params.shishyaId);

    const cleanNote = (params.note || "").trim();
    if (!cleanNote) {
      return { success: false, error: "Follow-up discussion note cannot be empty." };
    }
    if (cleanNote.length > 2000) {
      return { success: false, error: "Note exceeds maximum permitted length of 2000 characters." };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(params.followUpDate)) {
      return { success: false, error: "Invalid discussion date format. Expected YYYY-MM-DD." };
    }

    if (params.nextFollowUpDate && !dateRegex.test(params.nextFollowUpDate)) {
      return { success: false, error: "Invalid next follow-up date format. Expected YYYY-MM-DD." };
    }

    const followUp = await GuruService.addFollowUp({
      guruId: guru.id,
      studentId: params.shishyaId,
      note: cleanNote,
      followUpDate: params.followUpDate,
      nextFollowUpDate: params.nextFollowUpDate,
    });

    if (!followUp) {
      return { success: false, error: "Failed to record follow-up." };
    }

    revalidatePath(`/guru/shishyas/${params.shishyaId}`);
    return { success: true, data: { followUp } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add follow-up.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Updates follow-up completion status.
 */
export async function toggleFollowUpCompletedAction(params: {
  shishyaId: string;
  followUpId: string;
  completed: boolean;
}): Promise<GuruActionResponse<{ followUp: DbGuruFollowUp }>> {
  try {
    const { guru } = await requireGuruOwnsShishya(params.shishyaId);

    const status = params.completed ? "completed" : "upcoming";
    const updated = await GuruService.updateFollowUpStatus(guru.id, params.followUpId, status);

    if (!updated) {
      return { success: false, error: "Follow-up record not found or unauthorized." };
    }

    revalidatePath(`/guru/shishyas/${params.shishyaId}`);
    return { success: true, data: { followUp: updated } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update follow-up.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Adds a private Guru note.
 * Strictly authoring Guru only.
 */
export async function addGuruPrivateNoteAction(params: {
  shishyaId: string;
  content: string;
}): Promise<GuruActionResponse<{ note: DbGuruPrivateNote }>> {
  try {
    const { guru } = await requireGuruOwnsShishya(params.shishyaId);

    const cleanContent = (params.content || "").trim();
    if (!cleanContent) {
      return { success: false, error: "Private note content cannot be empty." };
    }
    if (cleanContent.length > 5000) {
      return { success: false, error: "Note exceeds maximum permitted length of 5000 characters." };
    }

    const note = await GuruService.addPrivateNote({
      guruId: guru.id,
      studentId: params.shishyaId,
      content: cleanContent,
    });

    if (!note) {
      return { success: false, error: "Failed to create private note." };
    }

    revalidatePath(`/guru/shishyas/${params.shishyaId}`);
    return { success: true, data: { note } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add private note.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Deletes a private Guru note.
 */
export async function deleteGuruPrivateNoteAction(params: {
  shishyaId: string;
  noteId: string;
}): Promise<GuruActionResponse<{ deleted: boolean }>> {
  try {
    const { guru } = await requireGuruOwnsShishya(params.shishyaId);
    const deleted = await GuruService.deletePrivateNote(guru.id, params.noteId);

    if (!deleted) {
      return { success: false, error: "Note not found or unauthorized." };
    }

    revalidatePath(`/guru/shishyas/${params.shishyaId}`);
    return { success: true, data: { deleted: true } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete private note.";
    return { success: false, error: msg };
  }
}
