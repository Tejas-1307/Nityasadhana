import { REPORT_CONFIG } from "./config";
import { getLocalDateString } from "./calculations";

export interface DailySadhanaReportInput {
  practiceDate: string; // YYYY-MM-DD
  sleepTime: string; // "HH:MM" e.g. "20:45"
  wakeUpTime: string; // "HH:MM" e.g. "03:20"
  japaRounds: number;
  extraRounds?: number;
  japaCompletedAt?: string;
  readingDurationMinutes?: number;
  readingNote?: string;
  hearingDurationMinutes?: number;
  hearingNote?: string;
  collegeStudyDurationMinutes?: number;
  selfStudyDurationMinutes?: number;
  dayRestDurationMinutes?: number;
  timeWastedDurationMinutes?: number;
  notes?: string;
  timezone?: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Checks whether a given practice date falls within the allowed editable window.
 * V1: Today and Yesterday (editWindowDays = 1).
 */
export function canEditReport(
  practiceDate: string,
  timezone: string = REPORT_CONFIG.DEFAULT_TIMEZONE,
  editWindowDays: number = REPORT_CONFIG.REPORT_EDIT_WINDOW_DAYS
): boolean {
  if (!practiceDate || typeof practiceDate !== "string") return false;

  const todayStr = getLocalDateString(new Date(), timezone);

  // Future dates are never editable/submittable
  if (practiceDate > todayStr) {
    return false;
  }

  // Calculate day difference between today and practice date
  const [tY, tM, tD] = todayStr.split("-").map(Number);
  const [pY, pM, pD] = practiceDate.split("-").map(Number);

  const todayUtc = Date.UTC(tY, tM - 1, tD);
  const practiceUtc = Date.UTC(pY, pM - 1, pD);

  const diffDays = Math.floor((todayUtc - practiceUtc) / (1000 * 60 * 60 * 24));

  return diffDays >= 0 && diffDays <= editWindowDays;
}

/**
 * Validates a Daily Sādhanā Report input payload.
 * If isDraft = true, required fields are relaxed to permit partial saves.
 * If isDraft = false, strictly validates required fields and value ranges.
 */
export function validateReportInput(
  input: Partial<DailySadhanaReportInput>,
  isDraft: boolean = false
): ValidationResult<DailySadhanaReportInput> {
  const timezone = input.timezone || REPORT_CONFIG.DEFAULT_TIMEZONE;
  const todayStr = getLocalDateString(new Date(), timezone);

  // 1. Practice Date Validation
  const practiceDate = input.practiceDate?.trim() || todayStr;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(practiceDate)) {
    return { success: false, error: "Invalid practice date format (YYYY-MM-DD required)." };
  }

  // Future date check
  if (practiceDate > todayStr) {
    return {
      success: false,
      error: "You cannot record or submit Sādhanā for a future date.",
    };
  }

  // Edit window check
  if (!canEditReport(practiceDate, timezone)) {
    return {
      success: false,
      error: `This report is outside the allowed ${REPORT_CONFIG.REPORT_EDIT_WINDOW_DAYS}-day edit window.`,
    };
  }

  // 2. Strict Submission Requirements (when not a draft)
  if (!isDraft) {
    if (!input.sleepTime || !input.sleepTime.trim()) {
      return { success: false, error: "Please enter your sleep time." };
    }
    if (!input.wakeUpTime || !input.wakeUpTime.trim()) {
      return { success: false, error: "Please enter your wake-up time." };
    }
    if (input.japaRounds === undefined || input.japaRounds === null || isNaN(Number(input.japaRounds))) {
      return { success: false, error: "Please enter your completed Japa rounds." };
    }
  }

  // 3. Numeric Range Validation
  const japaRounds = Math.max(0, Math.floor(Number(input.japaRounds) || 0));
  const extraRounds = Math.max(0, Math.floor(Number(input.extraRounds) || 0));

  if (japaRounds < 0 || japaRounds > REPORT_CONFIG.MAX_JAPA_ROUNDS) {
    return {
      success: false,
      error: `Japa rounds must be between 0 and ${REPORT_CONFIG.MAX_JAPA_ROUNDS}.`,
    };
  }

  if (extraRounds < 0 || extraRounds > REPORT_CONFIG.MAX_EXTRA_ROUNDS) {
    return {
      success: false,
      error: `Extra rounds must be between 0 and ${REPORT_CONFIG.MAX_EXTRA_ROUNDS}.`,
    };
  }

  const readingMinutes = Math.max(0, Math.floor(Number(input.readingDurationMinutes) || 0));
  const hearingMinutes = Math.max(0, Math.floor(Number(input.hearingDurationMinutes) || 0));
  const collegeStudyMinutes = Math.max(0, Math.floor(Number(input.collegeStudyDurationMinutes) || 0));
  const selfStudyMinutes = Math.max(0, Math.floor(Number(input.selfStudyDurationMinutes) || 0));
  const dayRestMinutes = Math.max(0, Math.floor(Number(input.dayRestDurationMinutes) || 0));
  const timeWastedMinutes = Math.max(0, Math.floor(Number(input.timeWastedDurationMinutes) || 0));

  const durationFields = [
    { name: "Reading duration", val: readingMinutes },
    { name: "Hearing duration", val: hearingMinutes },
    { name: "College study", val: collegeStudyMinutes },
    { name: "Self study", val: selfStudyMinutes },
    { name: "Day rest", val: dayRestMinutes },
    { name: "Time wasted", val: timeWastedMinutes },
  ];

  for (const { name, val } of durationFields) {
    if (val < 0 || val > REPORT_CONFIG.MAX_MINUTES_PER_ACTIVITY) {
      return {
        success: false,
        error: `${name} must be between 0 and ${REPORT_CONFIG.MAX_MINUTES_PER_ACTIVITY} minutes.`,
      };
    }
  }

  // 4. Text Length Limits
  const notes = input.notes?.trim();
  if (notes && notes.length > REPORT_CONFIG.MAX_NOTES_LENGTH) {
    return {
      success: false,
      error: `Reflection notes cannot exceed ${REPORT_CONFIG.MAX_NOTES_LENGTH} characters.`,
    };
  }

  const readingNote = input.readingNote?.trim();
  if (readingNote && readingNote.length > REPORT_CONFIG.MAX_TITLE_LENGTH) {
    return {
      success: false,
      error: `Reading topic title cannot exceed ${REPORT_CONFIG.MAX_TITLE_LENGTH} characters.`,
    };
  }

  const hearingNote = input.hearingNote?.trim();
  if (hearingNote && hearingNote.length > REPORT_CONFIG.MAX_TITLE_LENGTH) {
    return {
      success: false,
      error: `Hearing topic title cannot exceed ${REPORT_CONFIG.MAX_TITLE_LENGTH} characters.`,
    };
  }

  return {
    success: true,
    data: {
      practiceDate,
      sleepTime: input.sleepTime?.trim() || "",
      wakeUpTime: input.wakeUpTime?.trim() || "",
      japaRounds,
      extraRounds,
      japaCompletedAt: input.japaCompletedAt?.trim() || undefined,
      readingDurationMinutes: readingMinutes,
      readingNote: readingNote || undefined,
      hearingDurationMinutes: hearingMinutes,
      hearingNote: hearingNote || undefined,
      collegeStudyDurationMinutes: collegeStudyMinutes,
      selfStudyDurationMinutes: selfStudyMinutes,
      dayRestDurationMinutes: dayRestMinutes,
      timeWastedDurationMinutes: timeWastedMinutes,
      notes: notes || undefined,
      timezone,
    },
  };
}
