// ============================================================
// NITYASĀDHANĀ — WEEKLY SANKALPA PROGRESS EVALUATOR
// ============================================================
// Deterministically calculates 7-day Sankalpa alignment from
// existing Daily Sādhanā reports without inventing data or scores.
// ============================================================

import {
  DbWeeklySankalpa,
  DbDailySadhanaReport,
  SankalpaProgress,
  SankalpaDailyProgress,
  SankalpaDayStatus,
  SankalpaTargetConfig,
} from "@/lib/db/schema";
import { getSankalpaDaysList } from "./date-utils";
import { timeToMinutes, formatTime12Hour, formatDuration, getLocalDateString } from "@/lib/reports/calculations";

export function evaluateSankalpaProgress(params: {
  sankalpa: DbWeeklySankalpa;
  reports: DbDailySadhanaReport[];
  currentDateStr?: string;
}): SankalpaProgress {
  const { sankalpa, reports } = params;
  const today = params.currentDateStr || getLocalDateString();

  const daysList = getSankalpaDaysList(sankalpa.startDate, sankalpa.endDate, today);
  const dailyProgress: SankalpaDailyProgress[] = [];

  let alignedCount = 0;
  let eligibleCount = 0;

  for (const day of daysList) {
    if (day.isFuture) {
      // Future days are never treated as missed or failed
      dailyProgress.push({
        date: day.date,
        dayLabel: day.dayLabel,
        status: "future",
      });
      continue;
    }

    eligibleCount++;

    const matchingReport = reports.find(
      (r) => r.practiceDate === day.date && r.status === "submitted"
    );

    if (!matchingReport) {
      // Today awaiting submission is pending; past missing days are not_completed
      const status: SankalpaDayStatus = day.isToday ? "pending" : "not_completed";
      dailyProgress.push({
        date: day.date,
        dayLabel: day.dayLabel,
        status,
        value: undefined,
      });
      continue;
    }

    // Evaluate target criteria against submitted report
    const { isAligned, formattedValue, targetDescription } = checkDayAlignment(
      sankalpa.category,
      sankalpa.targetType,
      sankalpa.targetConfig,
      matchingReport
    );

    if (isAligned) {
      alignedCount++;
      dailyProgress.push({
        date: day.date,
        dayLabel: day.dayLabel,
        status: "completed",
        value: formattedValue,
        targetDescription,
      });
    } else {
      dailyProgress.push({
        date: day.date,
        dayLabel: day.dayLabel,
        status: "not_completed",
        value: formattedValue,
        targetDescription,
      });
    }
  }

  return {
    alignedDays: alignedCount,
    totalDays: 7,
    eligibleDays: eligibleCount,
    dailyProgress,
    isTargetMet: alignedCount >= 5, // 5 out of 7 days is considered a healthy alignment
  };
}

/**
 * Checks if a specific daily report meets the Sankalpa target condition.
 */
function checkDayAlignment(
  category: DbWeeklySankalpa["category"],
  targetType: DbWeeklySankalpa["targetType"],
  targetConfig: SankalpaTargetConfig | undefined,
  report: DbDailySadhanaReport
): {
  isAligned: boolean;
  formattedValue?: string | number;
  targetDescription?: string;
} {
  // Custom Sankalpas: Submitting the daily report fulfills active intent
  if (targetType === "custom" || !targetConfig || !targetConfig.metric) {
    return {
      isAligned: true,
      formattedValue: "Reported",
      targetDescription: "Daily practice recorded",
    };
  }

  const { metric, targetValue, comparison } = targetConfig;

  switch (metric) {
    case "wake_up_time": {
      if (!report.wakeUpTime) {
        return { isAligned: false, formattedValue: "Not recorded" };
      }
      const actualMinutes = timeToMinutes(report.wakeUpTime);
      const targetMinutes =
        typeof targetValue === "string" ? timeToMinutes(targetValue) : (targetValue as number) || 210;

      const isAligned =
        comparison === "at_least"
          ? actualMinutes >= targetMinutes
          : actualMinutes <= targetMinutes; // Default: wake up at or before target

      return {
        isAligned,
        formattedValue: formatTime12Hour(report.wakeUpTime),
        targetDescription: `Target: ${formatTime12Hour(minutesToTimeStr(targetMinutes))}`,
      };
    }

    case "japa_rounds": {
      const actualRounds = report.totalRounds || report.japaRounds || 0;
      const targetRounds = Number(targetValue) || 16;
      const isAligned = actualRounds >= targetRounds;

      return {
        isAligned,
        formattedValue: `${actualRounds} rds`,
        targetDescription: `Target: ${targetRounds} rds`,
      };
    }

    case "reading_duration": {
      const actualMins = report.readingDurationMinutes || 0;
      const targetMins = Number(targetValue) || 30;
      const isAligned = actualMins >= targetMins;

      return {
        isAligned,
        formattedValue: formatDuration(actualMins),
        targetDescription: `Target: ${formatDuration(targetMins)}`,
      };
    }

    case "hearing_duration": {
      const actualMins = report.hearingDurationMinutes || 0;
      const targetMins = Number(targetValue) || 30;
      const isAligned = actualMins >= targetMins;

      return {
        isAligned,
        formattedValue: formatDuration(actualMins),
        targetDescription: `Target: ${formatDuration(targetMins)}`,
      };
    }

    case "study_duration": {
      const actualMins =
        (report.collegeStudyDurationMinutes || 0) + (report.selfStudyDurationMinutes || 0);
      const targetMins = Number(targetValue) || 120;
      const isAligned = actualMins >= targetMins;

      return {
        isAligned,
        formattedValue: formatDuration(actualMins),
        targetDescription: `Target: ${formatDuration(targetMins)}`,
      };
    }

    case "time_wasted": {
      const actualMins = report.timeWastedDurationMinutes || 0;
      const maxMins = Number(targetValue) || 30;
      const isAligned = actualMins <= maxMins;

      return {
        isAligned,
        formattedValue: formatDuration(actualMins),
        targetDescription: `Max: ${formatDuration(maxMins)}`,
      };
    }

    default:
      return {
        isAligned: true,
        formattedValue: "Reported",
      };
  }
}

function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
