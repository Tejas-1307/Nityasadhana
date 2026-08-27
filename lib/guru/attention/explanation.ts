// ============================================================
// NITYASĀDHANĀ — PIPELINE STAGE 6: HUMAN EXPLANATION GENERATOR
// ============================================================
// Produces gentle, transparent, non-judgmental human explanations.
// Core Philosophy:
// 1. Zero devotional judgment, zero arbitrary scores, zero ranking terms.
// 2. Clear, factual description of what changed vs personal baseline.
// 3. Empathetic and supportive tone suitable for ISKCON mentorship.
// ============================================================

import {
  AttentionLevel,
  AttentionSignal,
  HumanExplanation,
  PersonalBaseline,
  SignalAggregatorResult,
} from "./types";

export function generateHumanExplanation(params: {
  level: AttentionLevel;
  primarySignal: AttentionSignal | null;
  aggregatedSignals: SignalAggregatorResult;
  baseline: PersonalBaseline;
}): HumanExplanation {
  const { level, primarySignal, aggregatedSignals, baseline } = params;

  // 1. Consistent / Stable Case
  if (level === "STABLE") {
    if (!baseline.hasSufficientHistory) {
      return {
        headline: "Establishing Baseline",
        detail: "Initial reporting in progress. Baseline will establish after 5 submitted reports.",
        isMultiDimensionChange: false,
        explanationNotes: ["Less than 5 reports submitted; anomaly detection paused."],
      };
    }

    return {
      headline: "Consistent Routine",
      detail: "Reporting and Sādhanā patterns appear consistent with recent personal baseline.",
      isMultiDimensionChange: false,
      explanationNotes: ["All recorded dimensions are within normal personal variance."],
    };
  }

  // 2. Multi-Dimension Compound Shifts (e.g. Japa + Wake-up + Reading)
  if (aggregatedSignals.hasMultipleDimensionsChanged) {
    const affectedCount = aggregatedSignals.dimensionCount;
    const detail =
      affectedCount >= 3
        ? "Several activity patterns have changed compared with the recent personal pattern."
        : "Multiple activity patterns have changed compared with the recent personal pattern.";

    const notes = aggregatedSignals.signals
      .filter((s) => s.type !== "ROUTINE_CHANGE")
      .map((s) => `${s.title}: ${s.reason}`);

    return {
      headline: "Routine pattern changed",
      detail,
      isMultiDimensionChange: true,
      explanationNotes: notes,
    };
  }

  // 3. Single Dimension Observation or Follow-up
  if (primarySignal) {
    return {
      headline: primarySignal.title,
      detail: primarySignal.reason,
      isMultiDimensionChange: false,
      explanationNotes: [primarySignal.reason],
    };
  }

  // 4. Default Fallback
  return {
    headline: level === "FOLLOW_UP_SUGGESTED" ? "Follow-up Suggested" : "Routine Change Detected",
    detail: "Variations observed compared with recent personal baseline.",
    isMultiDimensionChange: false,
    explanationNotes: [],
  };
}
