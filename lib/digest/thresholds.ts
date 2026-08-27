// ============================================================
// NITYASĀDHANĀ — GURU WEEKLY DIGEST THRESHOLDS & CONFIGURATION
// ============================================================
// Centralized configuration defining factual thresholds for:
// - Major changes (Student vs Self comparison between consecutive weeks)
// - Positive trends aggregation
// - Attention signals and missing report alerts
// ============================================================

export const WEEKLY_DIGEST_THRESHOLDS = {
  // Missing reports in a 7-day period to flag in missing reports card
  MISSING_REPORTS_FLAG: 1,

  // Student vs Self: Major change thresholds
  // 1. Wake-up consistency changed by >= 2 days
  WAKE_UP_CONSISTENCY_CHANGE_DAYS: 2,

  // 2. Average Japa rounds changed by >= 3 rounds
  JAPA_ROUNDS_CHANGE: 3,

  // 3. Average reading duration changed by >= 15 minutes
  READING_MINUTES_CHANGE: 15,

  // 4. Average hearing duration changed by >= 15 minutes
  HEARING_MINUTES_CHANGE: 15,

  // 5. Average time wasted changed by >= 20 minutes
  TIME_WASTED_CHANGE_MINUTES: 20,

  // Positive trend thresholds
  // Early rising baseline target: 04:00 AM or earlier
  EARLY_RISING_TARGET_MINUTES: 240, // 04:00 AM (240 mins from midnight)

  // Steady Japa target: 16+ rounds
  STEADY_JAPA_ROUNDS_TARGET: 16,

  // Steady Reading target: 30+ minutes
  STEADY_READING_MINUTES_TARGET: 30,
} as const;
