/**
 * Configuration constants for the Daily Sādhanā Reporting Engine.
 */

export const REPORT_CONFIG = {
  // Default devotee timezone
  DEFAULT_TIMEZONE: "Asia/Kolkata",

  // Configurable edit window: current day + N previous days
  // V1 default: 1 (Today and Yesterday)
  REPORT_EDIT_WINDOW_DAYS: 1,

  // Limits
  MAX_JAPA_ROUNDS: 108,
  MAX_EXTRA_ROUNDS: 108,
  MAX_MINUTES_PER_ACTIVITY: 1440, // 24 hours
  MAX_NOTES_LENGTH: 1000,
  MAX_TITLE_LENGTH: 100,

  // Presets for quick mobile input
  REST_PRESETS_MINUTES: [0, 15, 30, 45, 60, 90],
  WASTED_PRESETS_MINUTES: [0, 15, 30, 45, 60, 90],
  READING_PRESETS_MINUTES: [0, 15, 30, 45, 60, 90],
  HEARING_PRESETS_MINUTES: [0, 30, 45, 60, 90, 120],
} as const;
