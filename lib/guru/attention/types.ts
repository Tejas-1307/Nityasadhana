// ============================================================
// NITYASĀDHANĀ — ATTENTION ENGINE TYPE DEFINITIONS
// ============================================================
// 6-Stage Pipeline Architecture:
// Stage 1: Raw Report Data
// Stage 2: Personal Baseline (outlier-resistant medians)
// Stage 3: Signal Detectors (pure dimension evaluators)
// Stage 4: Signal Aggregator (multi-dimension compound shifts)
// Stage 5: Attention Level (🟢 STABLE / 🟡 OBSERVE / 🔵 FOLLOW_UP_SUGGESTED)
// Stage 6: Human Explanation (gentle, objective, transparent)
//
// Core Philosophy:
// 1. System observes FACTS and PATTERNS, never judges spiritual state.
// 2. Three deterministic levels: STABLE (🟢), OBSERVE (🟡), FOLLOW_UP_SUGGESTED (🔵).
// 3. ZERO cross-student comparison. Zero ranking or "devotion scores".
// 4. Dynamic Return: Shishyas automatically return to STABLE when reporting normalizes.
// ============================================================

export type AttentionLevel = "STABLE" | "OBSERVE" | "FOLLOW_UP_SUGGESTED";

export type AttentionDimension =
  | "japa"
  | "wake_up"
  | "reading"
  | "hearing"
  | "study"
  | "sleep"
  | "time_waste"
  | "reporting";

export type AttentionSignalType =
  | "REPORT_MISSING"
  | "REPEATED_REPORT_MISSING"
  | "JAPA_CHANGE"
  | "WAKE_TIME_CHANGE"
  | "READING_REDUCTION"
  | "ACTIVITY_REDUCTION"
  | "SLEEP_PATTERN_CHANGE"
  | "ROUTINE_CHANGE"
  | "TIME_WASTE_INCREASE"
  | "INSUFFICIENT_HISTORY";

export interface AttentionSignalMetadata {
  currentValue?: number | string | null;
  baselineValue?: number | string | null;
  deviationPercent?: number | null;
  consecutiveDays?: number | null;
  affectedDimensions?: string[];
}

export interface AttentionSignal {
  type: AttentionSignalType;
  level: AttentionLevel;
  title: string;
  reason: string;
  metric?: string;
  dimension?: AttentionDimension;
  studentId: string;
  detectedAt: string;
  metadata?: AttentionSignalMetadata;
}

// ------------------------------------------------------------
// STAGE 1: Raw Report Data
// ------------------------------------------------------------
export interface RawReportData {
  practiceDate: string;
  status: "submitted" | "draft" | "missing";
  wakeUpTime?: string | null;
  wakeUpMinutes?: number | null;
  totalRounds?: number | null;
  readingMinutes?: number | null;
  hearingMinutes?: number | null;
  studyMinutes?: number | null;
  sleepDurationMinutes?: number | null;
  timeWastedMinutes?: number | null;
}

// ------------------------------------------------------------
// STAGE 2: Personal Baseline
// ------------------------------------------------------------
export interface PersonalBaseline {
  medianWakeUpMinutes: number | null;
  medianTotalRounds: number | null;
  medianReadingMinutes: number | null;
  medianHearingMinutes: number | null;
  medianStudyMinutes: number | null;
  medianTimeWastedMinutes: number | null;
  medianSleepDurationMinutes: number | null;
  avgWakeUpMinutes?: number | null;
  avgTotalRounds?: number | null;
  avgReadingMinutes?: number | null;
  avgHearingMinutes?: number | null;
  avgStudyMinutes?: number | null;
  submittedReportCount: number;
  sampleDays: number;
  hasSufficientHistory: boolean;
}

// ------------------------------------------------------------
// STAGE 4: Signal Aggregator Result
// ------------------------------------------------------------
export interface SignalAggregatorResult {
  signals: AttentionSignal[];
  primarySignal: AttentionSignal | null;
  compoundRoutineSignal: AttentionSignal | null;
  dimensionCount: number;
  hasMultipleDimensionsChanged: boolean;
  additionalCount: number;
}

// ------------------------------------------------------------
// STAGE 6: Human Explanation
// ------------------------------------------------------------
export interface HumanExplanation {
  headline: string;
  detail: string;
  isMultiDimensionChange: boolean;
  explanationNotes: string[];
}

// ------------------------------------------------------------
// Complete Final Assessment
// ------------------------------------------------------------
export interface AttentionAssessment {
  level: AttentionLevel;
  primarySignal: AttentionSignal | null;
  signals: AttentionSignal[];
  additionalCount: number;
  summaryHeadline: string;
  summaryDetail: string;
  baseline: PersonalBaseline;
  consecutiveMissingDays: number;
  reportingConsistencyRatio: string; // e.g. "6/7"
}

// ------------------------------------------------------------
// Full 6-Stage Pipeline Execution Result
// ------------------------------------------------------------
export interface AttentionPipelineResult {
  stage1RawData: RawReportData | null;
  stage2Baseline: PersonalBaseline;
  stage3DetectedSignals: AttentionSignal[];
  stage4AggregatedSignals: SignalAggregatorResult;
  stage5AttentionLevel: AttentionLevel;
  stage6Explanation: HumanExplanation;
  assessment: AttentionAssessment;
}
