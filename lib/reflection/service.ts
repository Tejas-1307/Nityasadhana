// ============================================================
// NITYASĀDHANĀ — WEEKLY REFLECTION DOMAIN SERVICE
// ============================================================
// Provides lightweight, non-evaluative weekly pause and reflection
// handling for Shishyas and read-only mentorship view for Gurus.
// ============================================================

import { dbStore } from "@/lib/db/store";
import { DbWeeklyReflection, ReflectionState } from "@/lib/db/schema";
import { getSankalpaWeekBoundaries } from "@/lib/sankalpa/date-utils";

export interface ReflectionStateOption {
  key: ReflectionState;
  label: string;
  emoji: string;
  description: string;
}

export const REFLECTION_STATES: ReflectionStateOption[] = [
  {
    key: "steady",
    label: "Steady",
    emoji: "😊",
    description: "Maintained a consistent rhythm and practice",
  },
  {
    key: "good",
    label: "Good",
    emoji: "🙂",
    description: "Felt positive momentum throughout the week",
  },
  {
    key: "mixed",
    label: "Mixed",
    emoji: "😐",
    description: "Some days aligned, some days required adjustment",
  },
  {
    key: "difficult",
    label: "Difficult",
    emoji: "😔",
    description: "Encountered unexpected disruptions or fatigue",
  },
  {
    key: "reflective",
    label: "Reflective",
    emoji: "🙏",
    description: "Deep contemplation and prayerful intention",
  },
];

export function getReflectionStateDefinition(state: ReflectionState): ReflectionStateOption {
  const found = REFLECTION_STATES.find((s) => s.key === state);
  return (
    found || {
      key: "steady",
      label: "Steady",
      emoji: "😊",
      description: "Maintained a consistent rhythm and practice",
    }
  );
}

export interface SaveReflectionInput {
  studentId: string;
  sankalpaId?: string;
  weekStartDate?: string;
  weekEndDate?: string;
  state: ReflectionState;
  wentWell?: string;
  difficult?: string;
  improve?: string;
  guruMessage?: string;
}

export interface SaveReflectionResult {
  success: boolean;
  reflection?: DbWeeklyReflection;
  error?: string;
}

export class ReflectionService {
  /**
   * Saves or updates a weekly reflection.
   * Enforces 300 character limits, safe trimming, and single reflection per week.
   */
  static async saveReflection(
    input: SaveReflectionInput,
    currentDateStr?: string
  ): Promise<SaveReflectionResult> {
    const today = currentDateStr || new Date().toISOString().slice(0, 10);
    const boundaries = getSankalpaWeekBoundaries(today);

    const weekStartDate = input.weekStartDate || boundaries.startDate;
    const weekEndDate = input.weekEndDate || boundaries.endDate;

    // Validate state
    const validStates: ReflectionState[] = ["steady", "good", "mixed", "difficult", "reflective"];
    if (!validStates.includes(input.state)) {
      return { success: false, error: "Please select a valid reflection state." };
    }

    // Validate 300 character maximums
    const sanitizeField = (field?: string): string | undefined => {
      if (!field) return undefined;
      const trimmed = field.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const wentWell = sanitizeField(input.wentWell);
    const difficult = sanitizeField(input.difficult);
    const improve = sanitizeField(input.improve);
    const guruMessage = sanitizeField(input.guruMessage);

    if (wentWell && wentWell.length > 300) {
      return { success: false, error: "Reflection for 'What went well' cannot exceed 300 characters." };
    }
    if (difficult && difficult.length > 300) {
      return { success: false, error: "Reflection for 'What was difficult' cannot exceed 300 characters." };
    }
    if (improve && improve.length > 300) {
      return { success: false, error: "Reflection for 'What would you improve' cannot exceed 300 characters." };
    }
    if (guruMessage && guruMessage.length > 300) {
      return { success: false, error: "Message for Guru cannot exceed 300 characters." };
    }

    const now = new Date().toISOString();
    const id = `refl_${input.studentId}_${weekStartDate}_${Date.now()}`;

    const reflectionRecord: DbWeeklyReflection = {
      id,
      studentId: input.studentId,
      sankalpaId: input.sankalpaId,
      weekStartDate,
      weekEndDate,
      state: input.state,
      wentWell,
      difficult,
      improve,
      guruMessage,
      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    };

    const saved = await dbStore.saveWeeklyReflection(reflectionRecord);
    return { success: true, reflection: saved };
  }

  /**
   * Retrieves reflection for a given student and week start date.
   */
  static async getReflectionForWeek(
    studentId: string,
    weekStartDate: string
  ): Promise<DbWeeklyReflection | null> {
    return dbStore.getReflectionForWeek(studentId, weekStartDate);
  }

  /**
   * Retrieves reflection associated with a specific Sankalpa ID.
   */
  static async getReflectionBySankalpa(
    studentId: string,
    sankalpaId: string
  ): Promise<DbWeeklyReflection | null> {
    return dbStore.getReflectionBySankalpaId(studentId, sankalpaId);
  }

  /**
   * Retrieves paginated reflection history for a student.
   */
  static async getReflectionHistory(
    studentId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<{ reflections: DbWeeklyReflection[]; total: number }> {
    return dbStore.getReflectionHistory(studentId, limit, offset);
  }

  /**
   * Retrieves a reflection by ID with student ownership check.
   */
  static async getReflectionDetail(
    studentId: string,
    reflectionId: string
  ): Promise<DbWeeklyReflection | null> {
    const item = await dbStore.getReflectionById(reflectionId);
    if (!item || item.studentId !== studentId) {
      return null;
    }
    return item;
  }
}
