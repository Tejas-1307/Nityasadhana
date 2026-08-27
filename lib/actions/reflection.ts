"use server";

// ============================================================
// NITYASĀDHANĀ — WEEKLY REFLECTION SERVER ACTIONS
// ============================================================
// Secure, server-authoritative actions for creating, editing,
// and viewing weekly reflections with strict IDOR protections.
// ============================================================

import { revalidatePath } from "next/cache";
import { requireShishya, requireGuruOwnsShishya } from "@/lib/auth";
import { ReflectionService } from "@/lib/reflection/service";
import { DbWeeklyReflection, ReflectionState } from "@/lib/db/schema";
import { NotificationService } from "@/lib/notifications/service";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SaveWeeklyReflectionActionInput {
  sankalpaId?: string;
  weekStartDate?: string;
  weekEndDate?: string;
  state: ReflectionState;
  wentWell?: string;
  difficult?: string;
  improve?: string;
  guruMessage?: string;
}

/**
 * Saves or updates a weekly reflection for the authenticated Shishya.
 */
export async function saveWeeklyReflectionAction(
  input: SaveWeeklyReflectionActionInput
): Promise<ActionResult<{ reflection: DbWeeklyReflection }>> {
  try {
    const student = await requireShishya();

    const result = await ReflectionService.saveReflection({
      studentId: student.id,
      sankalpaId: input.sankalpaId,
      weekStartDate: input.weekStartDate,
      weekEndDate: input.weekEndDate,
      state: input.state,
      wentWell: input.wentWell,
      difficult: input.difficult,
      improve: input.improve,
      guruMessage: input.guruMessage,
    });

    if (!result.success || !result.reflection) {
      return { success: false, error: result.error || "Failed to save weekly reflection." };
    }

    // Smart Suppression: cancel any pending reflection reminders for this week
    try {
      await NotificationService.suppressReflectionReminder(student.id, result.reflection.weekStartDate);
    } catch {
      // Failure isolation: notification failure never disrupts reflection save
    }

    revalidatePath("/student/journey");
    revalidatePath("/student");

    return {
      success: true,
      data: { reflection: result.reflection },
    };
  } catch (error) {
    console.error("saveWeeklyReflectionAction error:", error);
    return {
      success: false,
      error: "Your reflection could not be saved. Please try again.",
    };
  }
}

/**
 * Retrieves reflection history for the authenticated Shishya.
 */
export async function getWeeklyReflectionHistoryAction(
  limit: number = 10,
  offset: number = 0
): Promise<ActionResult<{ reflections: DbWeeklyReflection[]; total: number }>> {
  try {
    const student = await requireShishya();
    const history = await ReflectionService.getReflectionHistory(student.id, limit, offset);

    return {
      success: true,
      data: history,
    };
  } catch (error) {
    console.error("getWeeklyReflectionHistoryAction error:", error);
    return {
      success: false,
      error: "Failed to load reflection history.",
    };
  }
}

/**
 * Retrieves a specific Shishya's weekly reflection for an authorized Guru.
 * Strictly verifies mentorship authorization before returning data.
 */
export async function getShishyaReflectionForGuruAction(
  shishyaId: string,
  weekStartDate: string
): Promise<ActionResult<{ reflection: DbWeeklyReflection | null }>> {
  try {
    await requireGuruOwnsShishya(shishyaId);
    const reflection = await ReflectionService.getReflectionForWeek(shishyaId, weekStartDate);

    return {
      success: true,
      data: { reflection },
    };
  } catch (error) {
    console.error("getShishyaReflectionForGuruAction error:", error);
    return {
      success: false,
      error: "Unauthorized or failed to load Shishya reflection.",
    };
  }
}

/**
 * Retrieves a specific Shishya's reflection history for an authorized Guru.
 */
export async function getShishyaReflectionHistoryForGuruAction(
  shishyaId: string,
  limit: number = 10,
  offset: number = 0
): Promise<ActionResult<{ reflections: DbWeeklyReflection[]; total: number }>> {
  try {
    await requireGuruOwnsShishya(shishyaId);
    const history = await ReflectionService.getReflectionHistory(shishyaId, limit, offset);

    return {
      success: true,
      data: history,
    };
  } catch (error) {
    console.error("getShishyaReflectionHistoryForGuruAction error:", error);
    return {
      success: false,
      error: "Unauthorized or failed to load Shishya reflection history.",
    };
  }
}
