"use server";

import { requireShishya } from "@/lib/auth";
import { requireGuruOwnsShishya } from "@/lib/auth/authorization";
import { SankalpaService, CreateSankalpaInput } from "@/lib/sankalpa";
import { DbWeeklySankalpa, SankalpaCategory, SankalpaTargetConfig } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export interface SankalpaActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Fetches active Weekly Sankalpa for the authenticated Shishya.
 */
export async function getActiveSankalpaAction(): Promise<
  SankalpaActionResponse<{ sankalpa: DbWeeklySankalpa | null }>
> {
  try {
    const shishya = await requireShishya();
    const sankalpa = await SankalpaService.getActiveSankalpa(shishya.id);
    return { success: true, data: { sankalpa } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load active Sankalpa.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Creates a new Weekly Sankalpa for the authenticated Shishya.
 * Enforces single active Sankalpa rule on the server.
 */
export async function createSankalpaAction(params: {
  category: SankalpaCategory;
  title: string;
  description?: string;
  targetType?: "metric_based" | "custom";
  targetConfig?: SankalpaTargetConfig;
  startDate?: string;
  endDate?: string;
}): Promise<SankalpaActionResponse<{ sankalpa: DbWeeklySankalpa }>> {
  try {
    const shishya = await requireShishya();

    const input: CreateSankalpaInput = {
      studentId: shishya.id,
      category: params.category,
      title: params.title,
      description: params.description,
      targetType: params.targetType,
      targetConfig: params.targetConfig,
      startDate: params.startDate,
      endDate: params.endDate,
    };

    const result = await SankalpaService.createSankalpa(input);

    if (result.error || !result.sankalpa) {
      return { success: false, error: result.error || "Failed to create Sankalpa." };
    }

    revalidatePath("/student");
    revalidatePath("/student/journey");
    return { success: true, data: { sankalpa: result.sankalpa } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create Sankalpa.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Fetches past Sankalpa history for the authenticated Shishya.
 */
export async function getSankalpaHistoryAction(
  limit: number = 20,
  offset: number = 0
): Promise<SankalpaActionResponse<{ sankalpas: DbWeeklySankalpa[]; total: number }>> {
  try {
    const shishya = await requireShishya();
    const history = await SankalpaService.getSankalpaHistory(shishya.id, limit, offset);
    return { success: true, data: history };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load Sankalpa history.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Saves student reflection and transitions Sankalpa to completed/incomplete.
 */
export async function saveSankalpaReflectionAction(params: {
  sankalpaId: string;
  content: string;
  whatHelped?: string;
  whatDifficult?: string;
  whatContinue?: string;
}): Promise<SankalpaActionResponse<{ sankalpa: DbWeeklySankalpa }>> {
  try {
    const shishya = await requireShishya();

    const result = await SankalpaService.saveReflection({
      studentId: shishya.id,
      sankalpaId: params.sankalpaId,
      reflection: {
        content: params.content,
        whatHelped: params.whatHelped,
        whatDifficult: params.whatDifficult,
        whatContinue: params.whatContinue,
      },
    });

    if (result.error || !result.sankalpa) {
      return { success: false, error: result.error || "Failed to save reflection." };
    }

    revalidatePath("/student");
    revalidatePath("/student/journey");
    return { success: true, data: { sankalpa: result.sankalpa } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save reflection.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Cancels an active Sankalpa.
 */
export async function cancelSankalpaAction(params: {
  sankalpaId: string;
}): Promise<SankalpaActionResponse<{ cancelled: boolean }>> {
  try {
    const shishya = await requireShishya();
    const result = await SankalpaService.cancelSankalpa(shishya.id, params.sankalpaId);

    if (!result.success) {
      return { success: false, error: result.error || "Failed to cancel Sankalpa." };
    }

    revalidatePath("/student");
    revalidatePath("/student/journey");
    return { success: true, data: { cancelled: true } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to cancel Sankalpa.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Allows authorized Guru to inspect active Sankalpa for an assigned Shishya.
 */
export async function getShishyaActiveSankalpaForGuruAction(
  shishyaId: string
): Promise<SankalpaActionResponse<{ sankalpa: DbWeeklySankalpa | null }>> {
  try {
    await requireGuruOwnsShishya(shishyaId);
    const sankalpa = await SankalpaService.getActiveSankalpa(shishyaId);
    return { success: true, data: { sankalpa } };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load Shishya Sankalpa.";
    return { success: false, error: msg };
  }
}

/**
 * Server Action: Allows authorized Guru to inspect Sankalpa history for an assigned Shishya.
 */
export async function getShishyaSankalpaHistoryForGuruAction(
  shishyaId: string,
  limit: number = 10,
  offset: number = 0
): Promise<SankalpaActionResponse<{ sankalpas: DbWeeklySankalpa[]; total: number }>> {
  try {
    await requireGuruOwnsShishya(shishyaId);
    const history = await SankalpaService.getSankalpaHistory(shishyaId, limit, offset);
    return { success: true, data: history };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load Shishya Sankalpa history.";
    return { success: false, error: msg };
  }
}
