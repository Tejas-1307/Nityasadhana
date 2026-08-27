// ============================================================
// NITYASĀDHANĀ — WEEKLY SANKALPA DOMAIN SERVICE
// ============================================================
// Orchestrates business logic, single-active-sankalpa enforcement,
// dynamic progress evaluation, and end-of-week reflections.
// ============================================================

import { dbStore } from "@/lib/db/store";
import {
  DbWeeklySankalpa,
  SankalpaCategory,
  SankalpaTargetType,
  SankalpaTargetConfig,
  SankalpaReflection,
  SankalpaStatus,
} from "@/lib/db/schema";
import { getSankalpaWeekBoundaries } from "./date-utils";
import { evaluateSankalpaProgress } from "./progress";
import { getLocalDateString } from "@/lib/reports/calculations";

export interface CreateSankalpaInput {
  studentId: string;
  category: SankalpaCategory;
  title: string;
  description?: string;
  targetType?: SankalpaTargetType;
  targetConfig?: SankalpaTargetConfig;
  startDate?: string;
  endDate?: string;
}

export class SankalpaService {
  /**
   * Retrieves the currently active Weekly Sankalpa for a student
   * with dynamically calculated, real-time 7-day progress.
   */
  static async getActiveSankalpa(
    studentId: string,
    currentDateStr?: string
  ): Promise<DbWeeklySankalpa | null> {
    const today = currentDateStr || getLocalDateString();
    const active = await dbStore.getActiveSankalpa(studentId);
    if (!active) return null;

    // Fetch reports for the Sankalpa week
    const { reports } = await dbStore.getReportsByStudent(studentId, 30, 0);

    // Calculate real-time dynamic progress
    const progress = evaluateSankalpaProgress({
      sankalpa: active,
      reports,
      currentDateStr: today,
    });

    return {
      ...active,
      progress,
    };
  }

  /**
   * Creates a new Weekly Sankalpa for a student.
   * Strictly enforces ONE active Sankalpa per student.
   */
  static async createSankalpa(
    input: CreateSankalpaInput,
    currentDateStr?: string
  ): Promise<{ sankalpa?: DbWeeklySankalpa; error?: string }> {
    const today = currentDateStr || getLocalDateString();

    // 1. Enforce single active Sankalpa rule
    const existingActive = await dbStore.getActiveSankalpa(input.studentId);
    if (existingActive) {
      return {
        error: "You already have an active Sankalpa for this period. Please complete or reflect on your current focus before starting a new one.",
      };
    }

    // 2. Validate title
    const cleanTitle = (input.title || "").trim();
    if (!cleanTitle) {
      return { error: "Sankalpa title cannot be empty." };
    }
    if (cleanTitle.length > 160) {
      return { error: "Sankalpa title cannot exceed 160 characters." };
    }

    // 3. Resolve default weekly dates (Monday -> Sunday)
    const weekBoundaries = getSankalpaWeekBoundaries(today);
    const startDate = input.startDate || weekBoundaries.startDate;
    const endDate = input.endDate || weekBoundaries.endDate;

    if (endDate <= startDate) {
      return { error: "Sankalpa end date must be after start date." };
    }

    const id = `sankalpa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newRecord: DbWeeklySankalpa = {
      id,
      studentId: input.studentId,
      category: input.category || "other",
      title: cleanTitle,
      description: input.description ? input.description.trim() : undefined,
      targetType: input.targetType || "metric_based",
      targetConfig: input.targetConfig,
      startDate,
      endDate,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await dbStore.createSankalpa(newRecord);

    // Calculate initial progress
    const { reports } = await dbStore.getReportsByStudent(input.studentId, 10, 0);
    const progress = evaluateSankalpaProgress({
      sankalpa: saved,
      reports,
      currentDateStr: today,
    });

    return {
      sankalpa: {
        ...saved,
        progress,
      },
    };
  }

  /**
   * Retrieves paginated Sankalpa history for a student.
   */
  static async getSankalpaHistory(
    studentId: string,
    limit: number = 20,
    offset: number = 0,
    currentDateStr?: string
  ): Promise<{ sankalpas: DbWeeklySankalpa[]; total: number }> {
    const today = currentDateStr || getLocalDateString();
    const { sankalpas, total } = await dbStore.getSankalpasByStudent(studentId, limit, offset);

    // Fetch reports to populate evaluated progress
    const { reports } = await dbStore.getReportsByStudent(studentId, 60, 0);

    const evaluated = sankalpas.map((s) => ({
      ...s,
      progress: evaluateSankalpaProgress({
        sankalpa: s,
        reports,
        currentDateStr: today,
      }),
    }));

    return { sankalpas: evaluated, total };
  }

  /**
   * Retrieves a specific Sankalpa by ID.
   */
  static async getSankalpaById(
    studentId: string,
    sankalpaId: string,
    currentDateStr?: string
  ): Promise<DbWeeklySankalpa | null> {
    const today = currentDateStr || getLocalDateString();
    const record = await dbStore.getSankalpaById(sankalpaId);
    if (!record || record.studentId !== studentId) {
      return null;
    }

    const { reports } = await dbStore.getReportsByStudent(studentId, 30, 0);
    const progress = evaluateSankalpaProgress({
      sankalpa: record,
      reports,
      currentDateStr: today,
    });

    return {
      ...record,
      progress,
    };
  }

  /**
   * Saves student end-of-week reflection and marks Sankalpa completed / week completed.
   */
  static async saveReflection(params: {
    studentId: string;
    sankalpaId: string;
    reflection: {
      content: string;
      whatHelped?: string;
      whatDifficult?: string;
      whatContinue?: string;
    };
    currentDateStr?: string;
  }): Promise<{ sankalpa?: DbWeeklySankalpa; error?: string }> {
    const today = params.currentDateStr || getLocalDateString();
    const existing = await dbStore.getSankalpaById(params.sankalpaId);

    if (!existing || existing.studentId !== params.studentId) {
      return { error: "Sankalpa not found or unauthorized." };
    }

    const cleanContent = (params.reflection.content || "").trim();
    if (!cleanContent) {
      return { error: "Reflection content cannot be empty." };
    }

    // Evaluate progress to determine status
    const { reports } = await dbStore.getReportsByStudent(params.studentId, 30, 0);
    const progress = evaluateSankalpaProgress({
      sankalpa: existing,
      reports,
      currentDateStr: today,
    });

    const finalStatus: SankalpaStatus = progress.alignedDays >= 4 ? "completed" : "incomplete";

    const reflectionRecord: SankalpaReflection = {
      content: cleanContent,
      whatHelped: params.reflection.whatHelped?.trim() || undefined,
      whatDifficult: params.reflection.whatDifficult?.trim() || undefined,
      whatContinue: params.reflection.whatContinue?.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    const updated = await dbStore.updateSankalpa(params.sankalpaId, {
      reflection: reflectionRecord,
      status: finalStatus,
      completedAt: new Date().toISOString(),
      progress,
    });

    if (!updated) {
      return { error: "Failed to update Sankalpa reflection." };
    }

    return {
      sankalpa: {
        ...updated,
        progress,
      },
    };
  }

  /**
   * Cancels an active Sankalpa without deleting historical records.
   */
  static async cancelSankalpa(
    studentId: string,
    sankalpaId: string
  ): Promise<{ success: boolean; error?: string }> {
    const existing = await dbStore.getSankalpaById(sankalpaId);
    if (!existing || existing.studentId !== studentId) {
      return { success: false, error: "Sankalpa not found or unauthorized." };
    }

    const updated = await dbStore.updateSankalpa(sankalpaId, {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    });

    return { success: !!updated };
  }
}
