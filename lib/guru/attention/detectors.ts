// ============================================================
// NITYASĀDHANĀ — PIPELINE STAGE 3: SIGNAL DETECTORS
// ============================================================
// Pure, deterministic pattern detectors evaluating facts vs personal baseline.
// Core Rules:
// 1. Never judge, never rank, always factual and transparent.
// 2. Strict baseline comparison: compare student only to their own history.
// 3. Emits discrete, typed AttentionSignals with dimension metadata.
// ============================================================

import { DbDailySadhanaReport, DbUser } from "@/lib/db/schema";
import { timeToMinutes } from "@/lib/reports/calculations";
import { AttentionSignal, PersonalBaseline } from "./types";
import { AttentionEngineConfig, ATTENTION_CONFIG } from "./config";

/**
 * Detector 1: Checks if today's report is missing or in draft.
 */
export function detectMissingReport(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  currentDateStr: string
): AttentionSignal | null {
  const nowIso = new Date().toISOString();

  if (!todayReport || todayReport.status !== "submitted") {
    if (todayReport?.status === "draft") {
      return {
        type: "REPORT_MISSING",
        level: "OBSERVE",
        title: "Report in draft",
        reason: "Sādhanā report started but not yet submitted for today.",
        metric: "Draft pending",
        dimension: "reporting",
        studentId: student.id,
        detectedAt: nowIso,
        metadata: { currentValue: "draft" },
      };
    }

    return {
      type: "REPORT_MISSING",
      level: "OBSERVE",
      title: "Report not received",
      reason: `No Sādhanā report has been submitted for today (${currentDateStr}).`,
      metric: "Missing today",
      dimension: "reporting",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: { currentValue: "missing" },
    };
  }

  return null;
}

/**
 * Detector 2: Counts consecutive missing reports counting backwards from yesterday.
 */
export function detectRepeatedMissedReports(
  student: DbUser,
  pastReports: DbDailySadhanaReport[],
  currentDateStr: string,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): { signal: AttentionSignal | null; consecutiveDays: number } {
  const nowIso = new Date().toISOString();
  let consecutiveDays = 0;

  const baseDate = new Date(currentDateStr);

  for (let i = 1; i <= 30; i++) {
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() - i);
    const targetDateStr = targetDate.toISOString().slice(0, 10);

    const match = pastReports.find((r) => r.practiceDate === targetDateStr);
    if (match && match.status === "submitted") {
      break;
    } else {
      consecutiveDays++;
    }
  }

  if (consecutiveDays >= config.missingReports.followUpConsecutive) {
    return {
      signal: {
        type: "REPEATED_REPORT_MISSING",
        level: "FOLLOW_UP_SUGGESTED",
        title: "Reporting pattern changed",
        reason: `No report has been received for ${consecutiveDays} consecutive days.`,
        metric: `${consecutiveDays} days missing`,
        dimension: "reporting",
        studentId: student.id,
        detectedAt: nowIso,
        metadata: { consecutiveDays },
      },
      consecutiveDays,
    };
  }

  if (consecutiveDays >= config.missingReports.observeConsecutive && consecutiveDays >= 2) {
    return {
      signal: {
        type: "REPEATED_REPORT_MISSING",
        level: "OBSERVE",
        title: "Reporting pattern changed",
        reason: `No report received for ${consecutiveDays} consecutive days.`,
        metric: `${consecutiveDays} days missing`,
        dimension: "reporting",
        studentId: student.id,
        detectedAt: nowIso,
        metadata: { consecutiveDays },
      },
      consecutiveDays,
    };
  }

  return { signal: null, consecutiveDays };
}

/**
 * Detector 3: Analyzes Japa rounds against personal baseline.
 */
export function detectJapaPattern(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  if (
    !todayReport ||
    todayReport.status !== "submitted" ||
    !baseline.hasSufficientHistory ||
    baseline.medianTotalRounds === null ||
    baseline.medianTotalRounds < config.japa.minimumBaseRounds
  ) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const todayRounds = todayReport.totalRounds ?? todayReport.japaRounds ?? 0;
  const baseRounds = baseline.medianTotalRounds;
  const drop = baseRounds - todayRounds;
  if (drop <= 0) return null;

  const dropPercent = (drop / baseRounds) * 100;

  if (dropPercent >= config.japa.followUpDeviationPercent) {
    return {
      type: "JAPA_CHANGE",
      level: "FOLLOW_UP_SUGGESTED",
      title: "Japa pattern changed",
      reason: `Chanted ${todayRounds} rounds today (${Math.round(drop)} rounds below personal baseline of ${Math.round(baseRounds)}).`,
      metric: `${todayRounds} rds (base: ${baseRounds})`,
      dimension: "japa",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayRounds,
        baselineValue: baseRounds,
        deviationPercent: Math.round(dropPercent),
      },
    };
  }

  if (dropPercent >= config.japa.observeDeviationPercent) {
    return {
      type: "JAPA_CHANGE",
      level: "OBSERVE",
      title: "Japa pattern changed",
      reason: `Chanted ${todayRounds} rounds today (${Math.round(drop)} rounds below personal baseline of ${Math.round(baseRounds)}).`,
      metric: `${todayRounds} rds (base: ${baseRounds})`,
      dimension: "japa",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayRounds,
        baselineValue: baseRounds,
        deviationPercent: Math.round(dropPercent),
      },
    };
  }

  return null;
}

/**
 * Detector 4: Analyzes Wake-up time against personal baseline median.
 */
export function detectWakeUpPattern(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  if (
    !todayReport ||
    todayReport.status !== "submitted" ||
    !todayReport.wakeUpTime ||
    !baseline.hasSufficientHistory ||
    baseline.medianWakeUpMinutes === null
  ) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const todayWakeMins = timeToMinutes(todayReport.wakeUpTime);
  const baseWakeMins = baseline.medianWakeUpMinutes;
  const diffMins = todayWakeMins - baseWakeMins;

  if (diffMins >= config.wakeUp.followUpDeviationMinutes) {
    return {
      type: "WAKE_TIME_CHANGE",
      level: "FOLLOW_UP_SUGGESTED",
      title: "Wake-up pattern shifted",
      reason: `Woke up approximately ${Math.round(diffMins)} minutes later than personal baseline average.`,
      metric: `${todayReport.wakeUpTime}`,
      dimension: "wake_up",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayReport.wakeUpTime,
        baselineValue: baseWakeMins,
        deviationPercent: Math.round(diffMins),
      },
    };
  }

  if (diffMins >= config.wakeUp.observeDeviationMinutes) {
    return {
      type: "WAKE_TIME_CHANGE",
      level: "OBSERVE",
      title: "Wake-up pattern shifted",
      reason: `Woke up approximately ${Math.round(diffMins)} minutes later than personal baseline average.`,
      metric: `${todayReport.wakeUpTime}`,
      dimension: "wake_up",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayReport.wakeUpTime,
        baselineValue: baseWakeMins,
        deviationPercent: Math.round(diffMins),
      },
    };
  }

  return null;
}

/**
 * Detector 5: Analyzes Sleep duration variance vs personal baseline.
 */
export function detectSleepPattern(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  if (
    !todayReport ||
    todayReport.status !== "submitted" ||
    todayReport.sleepDurationMinutes === undefined ||
    !baseline.hasSufficientHistory ||
    baseline.medianSleepDurationMinutes === null
  ) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const currentSleep = todayReport.sleepDurationMinutes;
  const baseSleep = baseline.medianSleepDurationMinutes;
  const varianceMinutes = Math.abs(currentSleep - baseSleep);
  const variancePercent = (varianceMinutes / baseSleep) * 100;

  if (variancePercent >= config.sleep.followUpDeviationPercent) {
    return {
      type: "SLEEP_PATTERN_CHANGE",
      level: "OBSERVE",
      title: "Sleep duration changed",
      reason: `Sleep duration (${Math.floor(currentSleep / 60)}h ${currentSleep % 60}m) differs significantly from personal baseline (${Math.floor(baseSleep / 60)}h ${baseSleep % 60}m).`,
      metric: `${Math.floor(currentSleep / 60)}h ${currentSleep % 60}m`,
      dimension: "sleep",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: currentSleep,
        baselineValue: baseSleep,
        deviationPercent: Math.round(variancePercent),
      },
    };
  }

  return null;
}

/**
 * Detector 6: Analyzes reported unused time increase.
 */
export function detectTimeWaste(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  if (
    !todayReport ||
    todayReport.status !== "submitted" ||
    todayReport.timeWastedDurationMinutes === undefined ||
    !baseline.hasSufficientHistory
  ) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const currentWaste = todayReport.timeWastedDurationMinutes;
  const baseWaste = baseline.medianTimeWastedMinutes ?? 0;
  const increase = currentWaste - baseWaste;

  if (increase >= config.timeWaste.followUpIncreaseMinutes) {
    return {
      type: "TIME_WASTE_INCREASE",
      level: "FOLLOW_UP_SUGGESTED",
      title: "Unused time increased",
      reason: `Reported unused time (${currentWaste}m) is ${increase}m higher than personal baseline.`,
      metric: `${currentWaste}m unused`,
      dimension: "time_waste",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: { currentValue: currentWaste, baselineValue: baseWaste },
    };
  }

  if (increase >= config.timeWaste.observeIncreaseMinutes) {
    return {
      type: "TIME_WASTE_INCREASE",
      level: "OBSERVE",
      title: "Unused time increased",
      reason: `Reported unused time (${currentWaste}m) is higher than personal baseline.`,
      metric: `${currentWaste}m unused`,
      dimension: "time_waste",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: { currentValue: currentWaste, baselineValue: baseWaste },
    };
  }

  return null;
}

/**
 * Detector 7: Analyzes Reading activity reduction.
 */
export function detectReadingReduction(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  if (
    !todayReport ||
    todayReport.status !== "submitted" ||
    !baseline.hasSufficientHistory ||
    baseline.medianReadingMinutes === null
  ) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const baseReading = baseline.medianReadingMinutes;
  const todayReading = todayReport.readingDurationMinutes ?? 0;

  if (baseReading < config.activityReduction.minimumBaseMinutes) {
    return null;
  }

  const drop = baseReading - todayReading;
  if (drop <= 0) return null;

  const dropPercent = (drop / baseReading) * 100;

  if (dropPercent >= config.activityReduction.followUpDeviationPercent || todayReading === 0) {
    return {
      type: "READING_REDUCTION",
      level: "OBSERVE",
      title: "Reading routine changed",
      reason:
        todayReading === 0
          ? `No reading recorded today (typical personal baseline: ${Math.round(baseReading)}m).`
          : `Reading duration (${todayReading}m) is significantly below personal baseline (${Math.round(baseReading)}m).`,
      metric: `${todayReading}m reading (base: ${Math.round(baseReading)}m)`,
      dimension: "reading",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayReading,
        baselineValue: baseReading,
        deviationPercent: Math.round(dropPercent),
      },
    };
  }

  if (dropPercent >= config.activityReduction.observeDeviationPercent) {
    return {
      type: "READING_REDUCTION",
      level: "OBSERVE",
      title: "Reading routine changed",
      reason: `Reading duration (${todayReading}m) is below personal baseline (${Math.round(baseReading)}m).`,
      metric: `${todayReading}m reading (base: ${Math.round(baseReading)}m)`,
      dimension: "reading",
      studentId: student.id,
      detectedAt: nowIso,
      metadata: {
        currentValue: todayReading,
        baselineValue: baseReading,
        deviationPercent: Math.round(dropPercent),
      },
    };
  }

  return null;
}

/**
 * Backward compatibility alias for general activity reduction.
 */
export function detectActivityReduction(
  student: DbUser,
  todayReport: DbDailySadhanaReport | null,
  baseline: PersonalBaseline,
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  return detectReadingReduction(student, todayReport, baseline, config);
}

/**
 * Executes all individual Stage 3 signal detectors.
 */
export function detectAllSignals(params: {
  student: DbUser;
  todayReport: DbDailySadhanaReport | null;
  pastReports: DbDailySadhanaReport[];
  baseline: PersonalBaseline;
  currentDateStr: string;
  config?: AttentionEngineConfig;
}): { rawSignals: AttentionSignal[]; consecutiveDays: number } {
  const { student, todayReport, pastReports, baseline, currentDateStr } = params;
  const config = params.config || ATTENTION_CONFIG;

  const rawSignals: AttentionSignal[] = [];

  // 1. Missing report today
  const missingSignal = detectMissingReport(student, todayReport, currentDateStr);
  if (missingSignal) rawSignals.push(missingSignal);

  // 2. Repeated missing report streak
  const { signal: repeatedMissSignal, consecutiveDays } = detectRepeatedMissedReports(
    student,
    pastReports,
    currentDateStr,
    config
  );
  if (repeatedMissSignal) rawSignals.push(repeatedMissSignal);

  // 3. Japa deviation vs baseline
  const japaSignal = detectJapaPattern(student, todayReport, baseline, config);
  if (japaSignal) rawSignals.push(japaSignal);

  // 4. Wake-up deviation vs baseline
  const wakeSignal = detectWakeUpPattern(student, todayReport, baseline, config);
  if (wakeSignal) rawSignals.push(wakeSignal);

  // 5. Reading reduction vs baseline
  const readingSignal = detectReadingReduction(student, todayReport, baseline, config);
  if (readingSignal) rawSignals.push(readingSignal);

  // 6. Sleep pattern variance vs baseline
  const sleepSignal = detectSleepPattern(student, todayReport, baseline, config);
  if (sleepSignal) rawSignals.push(sleepSignal);

  // 7. Time waste increase vs baseline
  const timeWasteSignal = detectTimeWaste(student, todayReport, baseline, config);
  if (timeWasteSignal) rawSignals.push(timeWasteSignal);

  return { rawSignals, consecutiveDays };
}

/**
 * Detector 8: Checks for multi-dimension concurrent shifts (Routine Change).
 */
export function detectRoutineChange(
  student: DbUser,
  signals: AttentionSignal[],
  config: AttentionEngineConfig = ATTENTION_CONFIG
): AttentionSignal | null {
  const dimensionSignals = signals.filter(
    (s) =>
      s.type === "JAPA_CHANGE" ||
      s.type === "WAKE_TIME_CHANGE" ||
      s.type === "SLEEP_PATTERN_CHANGE" ||
      s.type === "ACTIVITY_REDUCTION" ||
      s.type === "READING_REDUCTION" ||
      s.type === "TIME_WASTE_INCREASE"
  );

  if (dimensionSignals.length >= config.routineChange.followUpDimensionCount) {
    return {
      type: "ROUTINE_CHANGE",
      level: "FOLLOW_UP_SUGGESTED",
      title: "Routine pattern changed",
      reason: "Several activity patterns have changed simultaneously compared with personal baseline.",
      metric: `${dimensionSignals.length} dimensions`,
      dimension: "reporting",
      studentId: student.id,
      detectedAt: new Date().toISOString(),
      metadata: {
        affectedDimensions: dimensionSignals.map((s) => s.type),
      },
    };
  }

  if (dimensionSignals.length >= config.routineChange.observeDimensionCount) {
    return {
      type: "ROUTINE_CHANGE",
      level: "OBSERVE",
      title: "Routine pattern changed",
      reason: "Multiple activity patterns have changed compared with personal baseline.",
      metric: `${dimensionSignals.length} dimensions`,
      dimension: "reporting",
      studentId: student.id,
      detectedAt: new Date().toISOString(),
      metadata: {
        affectedDimensions: dimensionSignals.map((s) => s.type),
      },
    };
  }

  return null;
}
