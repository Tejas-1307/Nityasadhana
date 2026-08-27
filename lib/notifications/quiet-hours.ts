// ============================================================
// NITYASĀDHANĀ — QUIET HOURS EVALUATION UTILITY
// ============================================================
// Evaluates whether a given time falls within the user's configured
// quiet hours window, safely handling cross-midnight periods.
// ============================================================

/**
 * Determines if a time string "HH:MM" falls within the quiet hours window.
 *
 * @param timeStr - Current time in 24-hour "HH:MM" format
 * @param startStr - Quiet hours start in "HH:MM" format (default "21:00")
 * @param endStr - Quiet hours end in "HH:MM" format (default "05:00")
 */
export function isWithinQuietHours(
  timeStr: string,
  startStr: string = "21:00",
  endStr: string = "05:00"
): boolean {
  if (!timeStr || !startStr || !endStr) return false;

  const [currH, currM] = timeStr.split(":").map(Number);
  const [startH, startM] = startStr.split(":").map(Number);
  const [endH, endM] = endStr.split(":").map(Number);

  const currMinutes = currH * 60 + currM;
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  // Cross-midnight window (e.g. 21:00 -> 05:00)
  if (startMinutes > endMinutes) {
    return currMinutes >= startMinutes || currMinutes < endMinutes;
  }

  // Same-day window (e.g. 13:00 -> 16:00)
  return currMinutes >= startMinutes && currMinutes < endMinutes;
}

/**
 * Returns current time formatted as "HH:MM" for a given IANA timezone.
 */
export function getCurrentTimeInTimezone(timezone: string = "Asia/Kolkata"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(new Date());
  } catch {
    // Fallback to UTC if timezone is invalid
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, "0");
    const m = String(now.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
}
