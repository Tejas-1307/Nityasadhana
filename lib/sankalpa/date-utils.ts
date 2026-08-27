// ============================================================
// NITYASĀDHANĀ — SANKALPA DATE & WEEK UTILITIES
// ============================================================
// Shared date utilities ensuring consistent Monday -> Sunday
// weekly boundaries and timezone-safe date calculations.
// ============================================================

export interface SankalpaWeekBoundaries {
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Sunday)
  formattedRange: string; // e.g. "18 Aug — 24 Aug"
}

export interface SankalpaDayInfo {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  dayNumber: number; // 1 (Mon) to 7 (Sun)
  formattedDayDate: string; // "Thu · 27 Aug"
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Calculates Monday -> Sunday week boundaries for a reference date.
 * If no reference date is given, defaults to current date.
 */
export function getSankalpaWeekBoundaries(referenceDateStr?: string): SankalpaWeekBoundaries {
  const ref = referenceDateStr
    ? new Date(referenceDateStr + "T00:00:00Z")
    : new Date();

  // Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dayOfWeek = ref.getUTCDay();
  // Distance to Monday (if Sun (0) -> -6, if Mon (1) -> 0, if Tue (2) -> -1, etc.)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(ref);
  monday.setUTCDate(ref.getUTCDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const startDate = monday.toISOString().slice(0, 10);
  const endDate = sunday.toISOString().slice(0, 10);

  const startDay = monday.getUTCDate();
  const startMonth = MONTH_NAMES_SHORT[monday.getUTCMonth()];
  const endDay = sunday.getUTCDate();
  const endMonth = MONTH_NAMES_SHORT[sunday.getUTCMonth()];

  const formattedRange =
    startMonth === endMonth
      ? `${startDay} ${startMonth} — ${endDay} ${endMonth}`
      : `${startDay} ${startMonth} — ${endDay} ${endMonth}`;

  return {
    startDate,
    endDate,
    formattedRange,
  };
}

/**
 * Formats a date string "YYYY-MM-DD" into "18 Aug — 24 Aug" range.
 */
export function formatSankalpaRange(startDateStr: string, endDateStr: string): string {
  const start = new Date(startDateStr + "T00:00:00Z");
  const end = new Date(endDateStr + "T00:00:00Z");

  const startDay = start.getUTCDate();
  const startMonth = MONTH_NAMES_SHORT[start.getUTCMonth()];
  const endDay = end.getUTCDate();
  const endMonth = MONTH_NAMES_SHORT[end.getUTCMonth()];

  return `${startDay} ${startMonth} — ${endDay} ${endMonth}`;
}

/**
 * Returns an ordered array of the 7 days in the Sankalpa period.
 */
export function getSankalpaDaysList(
  startDateStr: string,
  endDateStr: string,
  todayDateStr?: string
): SankalpaDayInfo[] {
  const today = todayDateStr || new Date().toISOString().slice(0, 10);
  const start = new Date(startDateStr + "T00:00:00Z");
  const end = new Date(endDateStr + "T00:00:00Z");

  const days: SankalpaDayInfo[] = [];
  const current = new Date(start);

  while (current <= end && days.length < 7) {
    const dStr = current.toISOString().slice(0, 10);
    const dayOfWeek = current.getUTCDay();
    const dayLabel = DAY_NAMES_SHORT[dayOfWeek];
    const dayNum = dayOfWeek === 0 ? 7 : dayOfWeek;

    const isToday = dStr === today;
    const isPast = dStr < today;
    const isFuture = dStr > today;

    const formattedDayDate = `${dayLabel} · ${current.getUTCDate()} ${MONTH_NAMES_SHORT[current.getUTCMonth()]}`;

    days.push({
      date: dStr,
      dayLabel,
      dayNumber: dayNum,
      formattedDayDate,
      isToday,
      isPast,
      isFuture,
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return days;
}

/**
 * Shifts a reference week by N weeks (-1 for previous, +1 for next).
 */
export function shiftSankalpaWeek(referenceMondayStr: string, offsetWeeks: number): SankalpaWeekBoundaries {
  const d = new Date(referenceMondayStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + offsetWeeks * 7);
  return getSankalpaWeekBoundaries(d.toISOString().slice(0, 10));
}

