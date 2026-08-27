// ============================================================
// NITYASĀDHANĀ — 6-STAGE ATTENTION ENGINE PIPELINE
// ============================================================
// Complete 6-Stage Pipeline:
// 1. Raw Report Data: Extract facts from today's daily report
// 2. Personal Baseline: Compute outlier-resistant medians from past reports
// 3. Signal Detector: Pure detectors evaluating shifts vs personal baseline
// 4. Signal Aggregator: Combine signals & detect compound multi-dimension shifts
// 5. Attention Level: Determine deterministic level (🟢 STABLE / 🟡 OBSERVE / 🔵 FOLLOW_UP_SUGGESTED)
// 6. Human Explanation: Transparent, non-judgmental, empathetic explanation
// ============================================================

import { DbDailySadhanaReport, DbUser } from "@/lib/db/schema";
import {
  AttentionAssessment,
  AttentionPipelineResult,
  AttentionSignal,
} from "./types";
import { ATTENTION_CONFIG, AttentionEngineConfig } from "./config";
import { extractRawReportData, calculatePersonalBaseline } from "./baseline";
import { detectAllSignals } from "./detectors";
import { aggregateSignals, determineAttentionLevel } from "./aggregator";
import { generateHumanExplanation } from "./explanation";

export * from "./types";
export * from "./config";
export * from "./baseline";
export * from "./detectors";
export * from "./aggregator";
export * from "./explanation";

/**
 * Executes the complete 6-stage analytical pipeline:
 * Raw Report → Personal Baseline → Signal Detector → Signal Aggregator → Attention Level → Human Explanation
 */
export function runAttentionPipeline(params: {
  student: DbUser;
  todayReport: DbDailySadhanaReport | null;
  historicalReports: DbDailySadhanaReport[];
  currentDateStr: string;
  config?: AttentionEngineConfig;
}): AttentionPipelineResult {
  const { student, todayReport, historicalReports, currentDateStr } = params;
  const config = params.config || ATTENTION_CONFIG;

  // ------------------------------------------------------------
  // STAGE 1: Raw Report Data Ingestion
  // ------------------------------------------------------------
  const stage1RawData = extractRawReportData(todayReport, currentDateStr);

  // ------------------------------------------------------------
  // STAGE 2: Personal Baseline Calculation (strictly vs self)
  // ------------------------------------------------------------
  const pastReports = historicalReports.filter((r) => r.practiceDate < currentDateStr);
  const stage2Baseline = calculatePersonalBaseline(pastReports, config.minimumHistoryDays);

  // ------------------------------------------------------------
  // STAGE 3: Signal Detectors (pure dimension evaluators)
  // ------------------------------------------------------------
  const { rawSignals, consecutiveDays } = detectAllSignals({
    student,
    todayReport,
    pastReports,
    baseline: stage2Baseline,
    currentDateStr,
    config,
  });

  // ------------------------------------------------------------
  // STAGE 4: Signal Aggregator (multi-dimension compound shifts)
  // ------------------------------------------------------------
  const stage4AggregatedSignals = aggregateSignals({
    signals: rawSignals,
    studentId: student.id,
    config,
  });

  // ------------------------------------------------------------
  // STAGE 5: Attention Level Determination (stateless & deterministic)
  // ------------------------------------------------------------
  const stage5AttentionLevel = determineAttentionLevel(stage4AggregatedSignals);

  // ------------------------------------------------------------
  // STAGE 6: Human Explanation Generation (gentle & transparent)
  // ------------------------------------------------------------
  const stage6Explanation = generateHumanExplanation({
    level: stage5AttentionLevel,
    primarySignal: stage4AggregatedSignals.primarySignal,
    aggregatedSignals: stage4AggregatedSignals,
    baseline: stage2Baseline,
  });

  // Calculate 7-day reporting consistency ratio
  const sevenDaysAgo = new Date(new Date(currentDateStr).getTime() - 7 * 86400000)
    .toISOString()
    .slice(0, 10);
  const submittedLast7Count = pastReports.filter(
    (r) => r.practiceDate >= sevenDaysAgo && r.status === "submitted"
  ).length;

  const assessment: AttentionAssessment = {
    level: stage5AttentionLevel,
    primarySignal: stage4AggregatedSignals.primarySignal,
    signals: stage4AggregatedSignals.signals,
    additionalCount: stage4AggregatedSignals.additionalCount,
    summaryHeadline: stage6Explanation.headline,
    summaryDetail: stage6Explanation.detail,
    baseline: stage2Baseline,
    consecutiveMissingDays: consecutiveDays,
    reportingConsistencyRatio: `${submittedLast7Count}/7`,
  };

  return {
    stage1RawData,
    stage2Baseline,
    stage3DetectedSignals: stage4AggregatedSignals.signals,
    stage4AggregatedSignals,
    stage5AttentionLevel,
    stage6Explanation,
    assessment,
  };
}

/**
 * Main pure evaluation function returning the AttentionAssessment.
 */
export function evaluateAttention(params: {
  student: DbUser;
  todayReport: DbDailySadhanaReport | null;
  historicalReports: DbDailySadhanaReport[];
  currentDateStr: string;
  config?: AttentionEngineConfig;
}): AttentionAssessment {
  return runAttentionPipeline(params).assessment;
}

/**
 * Backward-compatible adapter for legacy calls.
 */
export function evaluateStudentAttentionSignals(params: {
  student: DbUser;
  todayReport: DbDailySadhanaReport | null;
  last7DaysReports: DbDailySadhanaReport[];
  baselineReports: DbDailySadhanaReport[];
  currentDateStr: string;
}): AttentionSignal[] {
  const assessment = evaluateAttention({
    student: params.student,
    todayReport: params.todayReport,
    historicalReports: params.baselineReports,
    currentDateStr: params.currentDateStr,
  });
  return assessment.signals;
}
