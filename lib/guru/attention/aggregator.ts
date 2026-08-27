// ============================================================
// NITYASĀDHANĀ — PIPELINE STAGES 4 & 5: AGGREGATOR & ATTENTION LEVEL
// ============================================================
// Stage 4: Aggregates individual signals, detecting multi-dimension compound shifts.
// Stage 5: Determines deterministic Attention Level (🟢 STABLE / 🟡 OBSERVE / 🔵 FOLLOW_UP_SUGGESTED).
//
// Core Rules:
// 1. Multi-dimension shifts (e.g. Japa + Wake-up + Reading) elevate attention appropriately.
// 2. Highest severity determines overall attention level:
//    FOLLOW_UP_SUGGESTED (🔵) > OBSERVE (🟡) > STABLE (🟢).
// 3. ZERO numerical "devotion scores". Purely explainable.
// 4. Dynamic return: Resolves to STABLE as soon as reporting normalizes.
// ============================================================

import {
  AttentionAssessment,
  AttentionLevel,
  AttentionSignal,
  PersonalBaseline,
  SignalAggregatorResult,
} from "./types";
import { AttentionEngineConfig, ATTENTION_CONFIG } from "./config";
import { generateHumanExplanation } from "./explanation";

const LEVEL_PRIORITY: Record<AttentionLevel, number> = {
  FOLLOW_UP_SUGGESTED: 0,
  OBSERVE: 1,
  STABLE: 2,
};

/**
 * STAGE 4: Aggregates individual detected signals and evaluates compound patterns.
 */
export function aggregateSignals(params: {
  signals: AttentionSignal[];
  studentId?: string;
  config?: AttentionEngineConfig;
}): SignalAggregatorResult {
  const { signals, studentId } = params;
  const config = params.config || ATTENTION_CONFIG;

  // Identify unique distinct affected dimensions (excluding 'reporting')
  const distinctDimensions = new Set<string>();
  for (const s of signals) {
    if (s.dimension && s.dimension !== "reporting") {
      distinctDimensions.add(s.dimension);
    } else if (
      s.type === "JAPA_CHANGE" ||
      s.type === "WAKE_TIME_CHANGE" ||
      s.type === "READING_REDUCTION" ||
      s.type === "ACTIVITY_REDUCTION" ||
      s.type === "SLEEP_PATTERN_CHANGE" ||
      s.type === "TIME_WASTE_INCREASE"
    ) {
      distinctDimensions.add(s.type);
    }
  }

  const dimensionCount = distinctDimensions.size;
  const hasMultipleDimensionsChanged = dimensionCount >= config.routineChange.observeDimensionCount;

  // Check if compound routine change signal is already present or should be created
  let compoundRoutineSignal = signals.find((s) => s.type === "ROUTINE_CHANGE") || null;

  if (!compoundRoutineSignal && hasMultipleDimensionsChanged && studentId) {
    const isFollowUp = dimensionCount >= config.routineChange.followUpDimensionCount;
    compoundRoutineSignal = {
      type: "ROUTINE_CHANGE",
      level: isFollowUp ? "FOLLOW_UP_SUGGESTED" : "OBSERVE",
      title: "Routine pattern changed",
      reason:
        dimensionCount >= 3
          ? "Several activity patterns have changed simultaneously compared with personal baseline."
          : "Multiple activity patterns have changed compared with personal baseline.",
      metric: `${dimensionCount} dimensions`,
      dimension: "reporting",
      studentId,
      detectedAt: new Date().toISOString(),
      metadata: {
        affectedDimensions: Array.from(distinctDimensions),
      },
    };
  }

  const allSignals = [...signals];
  if (compoundRoutineSignal && !signals.some((s) => s.type === "ROUTINE_CHANGE")) {
    allSignals.push(compoundRoutineSignal);
  }

  // Sort signals by severity priority
  const sortedSignals = allSignals.sort(
    (a, b) => LEVEL_PRIORITY[a.level] - LEVEL_PRIORITY[b.level]
  );

  const primarySignal = sortedSignals[0] || null;
  const additionalCount = Math.max(0, sortedSignals.length - 1);

  return {
    signals: sortedSignals,
    primarySignal,
    compoundRoutineSignal,
    dimensionCount,
    hasMultipleDimensionsChanged,
    additionalCount,
  };
}

/**
 * STAGE 5: Determines the deterministic Attention Level from aggregated signals.
 */
export function determineAttentionLevel(aggregated: SignalAggregatorResult): AttentionLevel {
  if (aggregated.signals.some((s) => s.level === "FOLLOW_UP_SUGGESTED")) {
    return "FOLLOW_UP_SUGGESTED";
  }
  if (aggregated.signals.some((s) => s.level === "OBSERVE")) {
    return "OBSERVE";
  }
  return "STABLE";
}

/**
 * Backward-compatible aggregator helper producing full AttentionAssessment.
 */
export function aggregateAttentionSignals(params: {
  signals: AttentionSignal[];
  baseline: PersonalBaseline;
  consecutiveMissingDays: number;
  submittedLast7Count: number;
  studentId?: string;
  config?: AttentionEngineConfig;
}): AttentionAssessment {
  const { signals, baseline, consecutiveMissingDays, submittedLast7Count, studentId, config } =
    params;

  // Stage 4: Aggregate Signals
  const aggregated = aggregateSignals({ signals, studentId, config });

  // Stage 5: Determine Attention Level
  const level = determineAttentionLevel(aggregated);

  // Stage 6: Generate Human Explanation
  const explanation = generateHumanExplanation({
    level,
    primarySignal: aggregated.primarySignal,
    aggregatedSignals: aggregated,
    baseline,
  });

  const reportingConsistencyRatio = `${submittedLast7Count}/7`;

  return {
    level,
    primarySignal: aggregated.primarySignal,
    signals: aggregated.signals,
    additionalCount: aggregated.additionalCount,
    summaryHeadline: explanation.headline,
    summaryDetail: explanation.detail,
    baseline,
    consecutiveMissingDays,
    reportingConsistencyRatio,
  };
}
