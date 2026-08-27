import { DbDailySadhanaReport } from "@/lib/db/schema";
import { REPORT_CONFIG } from "./config";

/**
 * Parses a time string (e.g. "20:45", "8:45 PM", "03:20", "3:20 AM")
 * into minutes since midnight (0 - 1439).
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== "string") return 0;

  const clean = timeStr.trim().toUpperCase();

  // Handle 12-hour format with AM/PM
  if (clean.includes("AM") || clean.includes("PM")) {
    const isPM = clean.includes("PM");
    const withoutPeriod = clean.replace(/AM|PM/g, "").trim();
    const parts = withoutPeriod.split(":");
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return (hours * 60 + minutes) % 1440;
  }

  // Handle standard 24-hour "HH:MM" format
  const parts = clean.split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  return (hours * 60 + minutes) % 1440;
}

/**
 * Normalizes minutes since midnight to 24-hour "HH:MM" string.
 */
export function minutesTo24Hour(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Formats a "HH:MM" or time string into user-friendly 12-hour format with AM/PM.
 * Example: "20:45" -> "8:45 PM", "03:20" -> "3:20 AM"
 */
export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return "--:--";
  const totalMinutes = timeToMinutes(timeStr);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutesFormatted = minutes.toString().padStart(2, "0");

  return `${hours12}:${minutesFormatted} ${period}`;
}

/**
 * Calculates sleep duration in minutes, accurately supporting cross-midnight sleep.
 *
 * Example 1 (Overnight):
 * Sleep: "20:45" (8:45 PM = 1245 min), Wake: "03:20" (3:20 AM = 200 min)
 * -> (1440 - 1245) + 200 = 195 + 200 = 395 min (6h 35m)
 *
 * Example 2 (Same day nap/sleep):
 * Sleep: "01:00" (60 min), Wake: "06:00" (360 min)
 * -> 360 - 60 = 300 min (5h 00m)
 */
export function calculateSleepDuration(sleepTime: string, wakeUpTime: string): number {
  if (!sleepTime || !wakeUpTime) return 0;

  const sleepMin = timeToMinutes(sleepTime);
  const wakeMin = timeToMinutes(wakeUpTime);

  if (wakeMin < sleepMin) {
    // Crosses midnight
    return 1440 - sleepMin + wakeMin;
  }

  return wakeMin - sleepMin;
}

/**
 * Calculates total Japa rounds: standard rounds + extra rounds.
 */
export function calculateTotalRounds(japaRounds: number, extraRounds: number = 0): number {
  const standard = Math.max(0, Math.floor(Number(japaRounds) || 0));
  const extra = Math.max(0, Math.floor(Number(extraRounds) || 0));
  return standard + extra;
}

/**
 * Calculates total study duration in minutes: college study + self study.
 */
export function calculateTotalStudy(
  collegeMinutes: number = 0,
  selfStudyMinutes: number = 0
): number {
  const college = Math.max(0, Math.floor(Number(collegeMinutes) || 0));
  const self = Math.max(0, Math.floor(Number(selfStudyMinutes) || 0));
  return college + self;
}

/**
 * Formats a duration in minutes into a clean, human-readable string.
 * Examples:
 *   0   -> "0m"
 *   30  -> "30m"
 *   60  -> "1h"
 *   90  -> "1h 30m"
 *   395 -> "6h 35m"
 *   480 -> "8h"
 */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.floor(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const mins = total % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Formats duration in a verbose format (e.g. "6 hours 35 minutes", "8 hours").
 */
export function formatDurationVerbose(minutes: number): string {
  const total = Math.max(0, Math.floor(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const mins = total % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (mins > 0 || hours === 0) parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);

  return parts.join(" ");
}

/**
 * Derives the local calendar date string (YYYY-MM-DD) for a given date in the target timezone.
 * Prevents UTC day-shifting discrepancies.
 */
export function getLocalDateString(
  date: Date = new Date(),
  timezone: string = REPORT_CONFIG.DEFAULT_TIMEZONE
): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date); // Outputs "YYYY-MM-DD"
  } catch {
    // Fallback if timezone string is invalid
    return date.toISOString().split("T")[0];
  }
}

/**
 * Converts a structured DbDailySadhanaReport into the traditional Guru-friendly summary text.
 */
export function generateWhatsAppSummary(report: DbDailySadhanaReport): string {
  const sleepStr = `${formatTime12Hour(report.sleepTime)} → ${formatTime12Hour(report.wakeUpTime)} · ${formatDuration(report.sleepDurationMinutes)}`;
  const japaStr =
    report.extraRounds > 0
      ? `${report.japaRounds} + ${report.extraRounds} · ${report.totalRounds} rounds`
      : `${report.totalRounds} rounds`;

  const lines = [
    "Hare Krishna Prabhuji,",
    "Please accept my humble Obeisances 🙏🏻",
    "",
    `Date: ${report.practiceDate}`,
    `Sleep: ${sleepStr}`,
    `Rounds: ${japaStr}${report.japaCompletedAt ? ` (Completed ${formatTime12Hour(report.japaCompletedAt)})` : ""}`,
    `Reading: ${formatDuration(report.readingDurationMinutes)}${report.readingNote ? ` (${report.readingNote})` : ""}`,
    `Hearing: ${formatDuration(report.hearingDurationMinutes)}${report.hearingNote ? ` (${report.hearingNote})` : ""}`,
    `Study: ${formatDuration(report.collegeStudyDurationMinutes)} college + ${formatDuration(report.selfStudyDurationMinutes)} self · ${formatDuration(report.totalStudyDurationMinutes)} total`,
    `Day rest: ${formatDuration(report.dayRestDurationMinutes)}`,
    `Time wasted: ${formatDuration(report.timeWastedDurationMinutes)}`,
  ];

  if (report.notes) {
    lines.push("", `Reflection: ${report.notes}`);
  }

  return lines.join("\n");
}

export interface ConsistencyMetrics {
  completedDays: number;
  windowDays: number;
  currentStreak: number;
  totalSubmitted: number;
}

/**
 * Calculates consistency and streak metrics from submitted reports.
 * Strict Rule: Drafts are ignored; only status === 'submitted' counts.
 * Streak is calculated for consecutive calendar days ending either today or yesterday.
 */
export function calculateReportConsistency(
  reports: DbDailySadhanaReport[],
  todayDateStr: string,
  windowDays: number = 10
): ConsistencyMetrics {
  // Map submitted practice dates
  const submittedDatesSet = new Set<string>();
  let totalSubmitted = 0;

  for (const r of reports) {
    if (r.status === "submitted") {
      submittedDatesSet.add(r.practiceDate);
      totalSubmitted++;
    }
  }

  // 1. Calculate Window Consistency (last windowDays calendar days ending today)
  const [tY, tM, tD] = todayDateStr.split("-").map(Number);
  let completedDaysInWindow = 0;

  for (let i = 0; i < windowDays; i++) {
    const d = new Date(Date.UTC(tY, tM - 1, tD - i));
    const dStr = d.toISOString().split("T")[0];
    if (submittedDatesSet.has(dStr)) {
      completedDaysInWindow++;
    }
  }

  // 2. Calculate Current Consecutive Streak
  let currentStreak = 0;
  let checkOffset = 0;

  if (submittedDatesSet.has(todayDateStr)) {
    checkOffset = 0;
  } else {
    // Check if yesterday is submitted
    const yDate = new Date(Date.UTC(tY, tM - 1, tD - 1));
    const yStr = yDate.toISOString().split("T")[0];
    if (submittedDatesSet.has(yStr)) {
      checkOffset = 1;
    } else {
      checkOffset = -1; // no active streak
    }
  }

  if (checkOffset >= 0) {
    let i = checkOffset;
    while (true) {
      const d = new Date(Date.UTC(tY, tM - 1, tD - i));
      const dStr = d.toISOString().split("T")[0];
      if (submittedDatesSet.has(dStr)) {
        currentStreak++;
        i++;
      } else {
        break;
      }
    }
  }

  return {
    completedDays: completedDaysInWindow,
    windowDays,
    currentStreak,
    totalSubmitted,
  };
}

export interface JourneyDayData {
  date: string;
  dayLabel: string;
  isSubmitted: boolean;
  isDraft: boolean;
  totalRounds?: number;
  wakeUpTime?: string;
  wakeUpMinutes?: number;
  sleepDurationMinutes?: number;
  readingDurationMinutes?: number;
  hearingDurationMinutes?: number;
  collegeStudyMinutes?: number;
  selfStudyMinutes?: number;
  totalStudyMinutes?: number;
  dayRestMinutes?: number;
  timeWastedMinutes?: number;
}

export interface MetricComparison {
  currentAvg: number;
  previousAvg: number;
  diff: number;
  direction: "increased" | "decreased" | "stable" | "insufficient_data";
  label: string;
  formattedCurrent: string;
}

export interface JourneyAnalytics {
  rangeDays: 7 | 30;
  startDate: string;
  endDate: string;
  previousStartDate: string;
  previousEndDate: string;
  hasEnoughData: boolean;
  overview: {
    submittedCount: number;
    totalDays: number;
    consistencyPercentage: number;
    currentStreak: number;
  };
  dailySeries: JourneyDayData[];
  comparison: {
    japa: MetricComparison;
    wakeUp: MetricComparison;
    sleep: MetricComparison;
    reading: MetricComparison;
    hearing: MetricComparison;
    study: MetricComparison;
    timeWasted: MetricComparison;
  };
}

/**
 * Calculates complete personal Journey analytics for a given range (7 or 30 days).
 * Strictly compares YOU (Current Period) vs YOU (Previous Period).
 * Missing days are preserved as missing (never silently filled with 0 or averages).
 */
export function calculateJourneyAnalytics(params: {
  reports: DbDailySadhanaReport[];
  rangeDays: 7 | 30;
  todayDateStr: string;
}): JourneyAnalytics {
  const { reports, rangeDays, todayDateStr } = params;

  const [tY, tM, tD] = todayDateStr.split("-").map(Number);

  // Map reports by practiceDate
  const reportMap = new Map<string, DbDailySadhanaReport>();
  for (const r of reports) {
    reportMap.set(r.practiceDate, r);
  }

  // 1. Build Current Period Days [T-(rangeDays-1) ... T] (ascending chronological order)
  const currentPeriodDays: string[] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(tY, tM - 1, tD - i));
    currentPeriodDays.push(d.toISOString().split("T")[0]);
  }

  // 2. Build Previous Period Days [T-(2*rangeDays-1) ... T-rangeDays]
  const previousPeriodDays: string[] = [];
  for (let i = 2 * rangeDays - 1; i >= rangeDays; i--) {
    const d = new Date(Date.UTC(tY, tM - 1, tD - i));
    previousPeriodDays.push(d.toISOString().split("T")[0]);
  }

  // 3. Build Daily Time Series for Current Period
  const dailySeries: JourneyDayData[] = currentPeriodDays.map((dateStr) => {
    const rep = reportMap.get(dateStr);
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));

    const dayLabel =
      rangeDays === 7
        ? dateObj.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })
        : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

    if (!rep) {
      return {
        date: dateStr,
        dayLabel,
        isSubmitted: false,
        isDraft: false,
      };
    }

    const isSubmitted = rep.status === "submitted";
    const isDraft = rep.status === "draft";

    let wakeUpMinutes: number | undefined;
    if (rep.wakeUpTime) {
      const [wh, wm] = rep.wakeUpTime.split(":").map(Number);
      wakeUpMinutes = wh * 60 + wm;
    }

    return {
      date: dateStr,
      dayLabel,
      isSubmitted,
      isDraft,
      totalRounds: isSubmitted ? rep.totalRounds : undefined,
      wakeUpTime: isSubmitted ? rep.wakeUpTime : undefined,
      wakeUpMinutes: isSubmitted ? wakeUpMinutes : undefined,
      sleepDurationMinutes: isSubmitted ? rep.sleepDurationMinutes : undefined,
      readingDurationMinutes: isSubmitted ? rep.readingDurationMinutes : undefined,
      hearingDurationMinutes: isSubmitted ? rep.hearingDurationMinutes : undefined,
      collegeStudyMinutes: isSubmitted ? rep.collegeStudyDurationMinutes : undefined,
      selfStudyMinutes: isSubmitted ? rep.selfStudyDurationMinutes : undefined,
      totalStudyMinutes: isSubmitted ? rep.totalStudyDurationMinutes : undefined,
      dayRestMinutes: isSubmitted ? rep.dayRestDurationMinutes : undefined,
      timeWastedMinutes: isSubmitted ? rep.timeWastedDurationMinutes : undefined,
    };
  });

  // 4. Gather Submitted Reports in Current and Previous Periods
  const currentSubmitted = currentPeriodDays
    .map((d) => reportMap.get(d))
    .filter((r): r is DbDailySadhanaReport => Boolean(r && r.status === "submitted"));

  const previousSubmitted = previousPeriodDays
    .map((d) => reportMap.get(d))
    .filter((r): r is DbDailySadhanaReport => Boolean(r && r.status === "submitted"));

  const submittedCount = currentSubmitted.length;
  const consistencyPercentage = Math.round((submittedCount / rangeDays) * 100);
  const consistency = calculateReportConsistency(reports, todayDateStr, rangeDays);
  const currentStreak = consistency.currentStreak;

  const hasEnoughData = submittedCount >= 3;

  // 5. Helper to compute averages
  function getAvg(arr: DbDailySadhanaReport[], selector: (r: DbDailySadhanaReport) => number): number {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + (selector(curr) || 0), 0);
    return sum / arr.length;
  }

  function getWakeAvg(arr: DbDailySadhanaReport[]): number {
    const valid = arr.filter((r) => r.wakeUpTime);
    if (valid.length === 0) return 0;
    const sum = valid.reduce((acc, r) => {
      const [h, m] = r.wakeUpTime.split(":").map(Number);
      return acc + (h * 60 + m);
    }, 0);
    return sum / valid.length;
  }

  // Averages for Current Period
  const curJapaAvg = getAvg(currentSubmitted, (r) => r.totalRounds);
  const prevJapaAvg = getAvg(previousSubmitted, (r) => r.totalRounds);

  const curWakeAvg = getWakeAvg(currentSubmitted);
  const prevWakeAvg = getWakeAvg(previousSubmitted);

  const curSleepAvg = getAvg(currentSubmitted, (r) => r.sleepDurationMinutes);
  const prevSleepAvg = getAvg(previousSubmitted, (r) => r.sleepDurationMinutes);

  const curReadAvg = getAvg(currentSubmitted, (r) => r.readingDurationMinutes);
  const prevReadAvg = getAvg(previousSubmitted, (r) => r.readingDurationMinutes);

  const curHearAvg = getAvg(currentSubmitted, (r) => r.hearingDurationMinutes);
  const prevHearAvg = getAvg(previousSubmitted, (r) => r.hearingDurationMinutes);

  const curStudyAvg = getAvg(currentSubmitted, (r) => r.totalStudyDurationMinutes);
  const prevStudyAvg = getAvg(previousSubmitted, (r) => r.totalStudyDurationMinutes);

  const curWasteAvg = getAvg(currentSubmitted, (r) => r.timeWastedDurationMinutes);
  const prevWasteAvg = getAvg(previousSubmitted, (r) => r.timeWastedDurationMinutes);

  // 6. Build Metric Comparisons
  function makeComparison(
    cur: number,
    prev: number,
    threshold: number,
    unit: string,
    isTimeInMinutes: boolean = false,
    isWakeTime: boolean = false
  ): MetricComparison {
    if (!hasEnoughData || previousSubmitted.length === 0) {
      return {
        currentAvg: cur,
        previousAvg: prev,
        diff: 0,
        direction: "insufficient_data",
        label: "Keep recording",
        formattedCurrent: isWakeTime
          ? formatTime12Hour(
              `${Math.floor(cur / 60)
                .toString()
                .padStart(2, "0")}:${Math.round(cur % 60)
                .toString()
                .padStart(2, "0")}`
            )
          : isTimeInMinutes
            ? formatDuration(Math.round(cur))
            : `${cur.toFixed(1)} ${unit}`,
      };
    }

    if (isWakeTime) {
      // For wake-up time: diff = prev - cur (positive means earlier!)
      const diffMins = Math.round(prev - cur);
      const formattedCurrent = formatTime12Hour(
        `${Math.floor(cur / 60)
          .toString()
          .padStart(2, "0")}:${Math.round(cur % 60)
          .toString()
          .padStart(2, "0")}`
      );

      if (Math.abs(diffMins) <= threshold) {
        return {
          currentAvg: cur,
          previousAvg: prev,
          diff: diffMins,
          direction: "stable",
          label: "Stable",
          formattedCurrent,
        };
      }

      if (diffMins > 0) {
        return {
          currentAvg: cur,
          previousAvg: prev,
          diff: diffMins,
          direction: "increased",
          label: `${diffMins}m earlier`,
          formattedCurrent,
        };
      } else {
        return {
          currentAvg: cur,
          previousAvg: prev,
          diff: diffMins,
          direction: "decreased",
          label: `${Math.abs(diffMins)}m later`,
          formattedCurrent,
        };
      }
    }

    const diff = cur - prev;
    const formattedCurrent = isTimeInMinutes
      ? formatDuration(Math.round(cur))
      : `${cur.toFixed(1)} ${unit}`;

    if (Math.abs(diff) <= threshold) {
      return {
        currentAvg: cur,
        previousAvg: prev,
        diff,
        direction: "stable",
        label: "Stable",
        formattedCurrent,
      };
    }

    if (diff > 0) {
      const diffLabel = isTimeInMinutes
        ? `+${formatDuration(Math.round(diff))}`
        : `+${diff.toFixed(1)} ${unit}`;
      return {
        currentAvg: cur,
        previousAvg: prev,
        diff,
        direction: "increased",
        label: diffLabel,
        formattedCurrent,
      };
    } else {
      const diffLabel = isTimeInMinutes
        ? `-${formatDuration(Math.round(Math.abs(diff)))}`
        : `-${Math.abs(diff).toFixed(1)} ${unit}`;
      return {
        currentAvg: cur,
        previousAvg: prev,
        diff,
        direction: "decreased",
        label: diffLabel,
        formattedCurrent,
      };
    }
  }

  return {
    rangeDays,
    startDate: currentPeriodDays[0],
    endDate: currentPeriodDays[currentPeriodDays.length - 1],
    previousStartDate: previousPeriodDays[0],
    previousEndDate: previousPeriodDays[previousPeriodDays.length - 1],
    hasEnoughData,
    overview: {
      submittedCount,
      totalDays: rangeDays,
      consistencyPercentage,
      currentStreak,
    },
    dailySeries,
    comparison: {
      japa: makeComparison(curJapaAvg, prevJapaAvg, 0.4, "rounds"),
      wakeUp: makeComparison(curWakeAvg, prevWakeAvg, 5, "", false, true),
      sleep: makeComparison(curSleepAvg, prevSleepAvg, 10, "", true),
      reading: makeComparison(curReadAvg, prevReadAvg, 5, "", true),
      hearing: makeComparison(curHearAvg, prevHearAvg, 5, "", true),
      study: makeComparison(curStudyAvg, prevStudyAvg, 15, "", true),
      timeWasted: makeComparison(curWasteAvg, prevWasteAvg, 5, "", true),
    },
  };
}
