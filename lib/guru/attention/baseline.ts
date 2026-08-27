// ============================================================
// NITYASĀDHANĀ — PIPELINE STAGES 1 & 2: RAW REPORT & PERSONAL BASELINE
// ============================================================
// Stage 1: Extracts structured factual data from raw reports.
// Stage 2: Calculates a student's personal historical baseline (strictly vs themselves).
// Uses outlier-resistant median calculations.
// Crucial Rule: Distinguishes NOT_REPORTED (null/undefined) from REPORTED_ZERO (0).
// ============================================================

import { DbDailySadhanaReport } from "@/lib/db/schema";
import { timeToMinutes } from "@/lib/reports/calculations";
import { PersonalBaseline, RawReportData } from "./types";
import { ATTENTION_CONFIG } from "./config";

/**
 * STAGE 1: Extract structured factual data from a raw report.
 */
export function extractRawReportData(
  report: DbDailySadhanaReport | null,
  practiceDate?: string
): RawReportData | null {
  if (!report) {
    if (!practiceDate) return null;
    return {
      practiceDate,
      status: "missing",
      wakeUpTime: null,
      wakeUpMinutes: null,
      totalRounds: null,
      readingMinutes: null,
      hearingMinutes: null,
      studyMinutes: null,
      sleepDurationMinutes: null,
      timeWastedMinutes: null,
    };
  }

  const wakeUpMinutes = report.wakeUpTime ? timeToMinutes(report.wakeUpTime) : null;
  const totalRounds = report.totalRounds ?? report.japaRounds ?? null;
  const readingMinutes =
    report.readingDurationMinutes !== undefined ? report.readingDurationMinutes : null;
  const hearingMinutes =
    report.hearingDurationMinutes !== undefined ? report.hearingDurationMinutes : null;

  const college = report.collegeStudyDurationMinutes ?? 0;
  const self = report.selfStudyDurationMinutes ?? 0;
  const studyMinutes =
    report.collegeStudyDurationMinutes !== undefined ||
    report.selfStudyDurationMinutes !== undefined
      ? college + self
      : null;

  return {
    practiceDate: report.practiceDate,
    status: report.status,
    wakeUpTime: report.wakeUpTime || null,
    wakeUpMinutes,
    totalRounds,
    readingMinutes,
    hearingMinutes,
    studyMinutes,
    sleepDurationMinutes: report.sleepDurationMinutes ?? null,
    timeWastedMinutes: report.timeWastedDurationMinutes ?? null,
  };
}

/**
 * Calculates statistical median of a numerical array.
 * Returns null if the array is empty.
 */
export function calculateMedian(numbers: number[]): number | null {
  if (!numbers || numbers.length === 0) return null;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

/**
 * STAGE 2: Calculates a student's personal historical baseline from submitted reports.
 * Excludes today's report to prevent self-distortion.
 */
export function calculatePersonalBaseline(
  historicalReports: DbDailySadhanaReport[],
  minimumHistoryDays: number = ATTENTION_CONFIG.minimumHistoryDays
): PersonalBaseline {
  const submitted = historicalReports.filter((r) => r.status === "submitted");

  if (submitted.length === 0) {
    return {
      medianWakeUpMinutes: null,
      medianTotalRounds: null,
      medianReadingMinutes: null,
      medianHearingMinutes: null,
      medianStudyMinutes: null,
      medianTimeWastedMinutes: null,
      medianSleepDurationMinutes: null,
      submittedReportCount: 0,
      sampleDays: historicalReports.length,
      hasSufficientHistory: false,
    };
  }

  const wakeUpList: number[] = [];
  const roundsList: number[] = [];
  const readingList: number[] = [];
  const hearingList: number[] = [];
  const studyList: number[] = [];
  const timeWastedList: number[] = [];
  const sleepDurationList: number[] = [];

  for (const rep of submitted) {
    // 1. Wake-up time
    if (rep.wakeUpTime) {
      wakeUpList.push(timeToMinutes(rep.wakeUpTime));
    }

    // 2. Japa Rounds
    const totalRounds = rep.totalRounds ?? rep.japaRounds;
    if (totalRounds !== undefined && totalRounds !== null) {
      roundsList.push(totalRounds);
    }

    // 3. Reading duration (distinguish NOT_REPORTED from 0)
    if (rep.readingDurationMinutes !== undefined && rep.readingDurationMinutes !== null) {
      readingList.push(rep.readingDurationMinutes);
    }

    // 4. Hearing duration
    if (rep.hearingDurationMinutes !== undefined && rep.hearingDurationMinutes !== null) {
      hearingList.push(rep.hearingDurationMinutes);
    }

    // 5. Study duration (College + Self)
    const college = rep.collegeStudyDurationMinutes ?? 0;
    const self = rep.selfStudyDurationMinutes ?? 0;
    if (
      rep.collegeStudyDurationMinutes !== undefined ||
      rep.selfStudyDurationMinutes !== undefined
    ) {
      studyList.push(college + self);
    }

    // 6. Time wasted duration
    if (rep.timeWastedDurationMinutes !== undefined && rep.timeWastedDurationMinutes !== null) {
      timeWastedList.push(rep.timeWastedDurationMinutes);
    }

    // 7. Sleep duration
    if (rep.sleepDurationMinutes !== undefined && rep.sleepDurationMinutes !== null) {
      sleepDurationList.push(rep.sleepDurationMinutes);
    }
  }

  const hasSufficientHistory = submitted.length >= minimumHistoryDays;

  const medWake = calculateMedian(wakeUpList);
  const medRounds = calculateMedian(roundsList);
  const medReading = calculateMedian(readingList);
  const medHearing = calculateMedian(hearingList);
  const medStudy = calculateMedian(studyList);

  return {
    medianWakeUpMinutes: medWake,
    medianTotalRounds: medRounds,
    medianReadingMinutes: medReading,
    medianHearingMinutes: medHearing,
    medianStudyMinutes: medStudy,
    medianTimeWastedMinutes: calculateMedian(timeWastedList),
    medianSleepDurationMinutes: calculateMedian(sleepDurationList),
    avgWakeUpMinutes: medWake,
    avgTotalRounds: medRounds,
    avgReadingMinutes: medReading,
    avgHearingMinutes: medHearing,
    avgStudyMinutes: medStudy,
    submittedReportCount: submitted.length,
    sampleDays: historicalReports.length,
    hasSufficientHistory,
  };
}
