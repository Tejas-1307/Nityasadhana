// ============================================================
// NITYASĀDHANĀ — 6-STAGE ATTENTION ENGINE PIPELINE TEST SUITE
// ============================================================
// Validates:
// 1. Full 6-Stage Pipeline Execution:
//    Raw Report → Personal Baseline → Signal Detector → Signal Aggregator → Attention Level → Human Explanation
// 2. User Specification Example:
//    - Raw: Japa 16->9, Wake-up 3:20->4:55, Reading 30->10
//    - Baseline: Japa ~16, Wake-up ~3:20, Reading ~30m
//    - Signals: JAPA_CHANGE, WAKE_TIME_CHANGE, READING_REDUCTION
//    - Aggregator: Multiple dimensions changed simultaneously
//    - Attention Level: FOLLOW_UP_SUGGESTED (🔵)
//    - Explanation: "Several activity patterns have changed compared with the recent personal pattern."
// 3. Dynamic Normalization Lifecycle:
//    - Transition: 🔵 Follow-up Suggested -> 🟢 Stable upon reporting normalization.
//    - Confirms zero permanent labels, badges, or "devotion scores".
// ============================================================

import {
  runAttentionPipeline,
  evaluateAttention,
  calculatePersonalBaseline,
  extractRawReportData,
} from "../lib/guru/attention";
import { DbDailySadhanaReport, DbUser } from "../lib/db/schema";

function createReport(partial: Partial<DbDailySadhanaReport> & {
  id: string;
  studentId: string;
  practiceDate: string;
}): DbDailySadhanaReport {
  const now = new Date().toISOString();
  return {
    id: partial.id,
    studentId: partial.studentId,
    practiceDate: partial.practiceDate,
    status: partial.status || "submitted",
    timezone: partial.timezone || "Asia/Kolkata",
    sleepTime: partial.sleepTime || "21:30",
    wakeUpTime: partial.wakeUpTime || "03:20",
    sleepDurationMinutes: partial.sleepDurationMinutes ?? 350,
    japaRounds: partial.japaRounds ?? 16,
    extraRounds: partial.extraRounds ?? 0,
    totalRounds: partial.totalRounds ?? 16,
    readingDurationMinutes: partial.readingDurationMinutes ?? 30,
    hearingDurationMinutes: partial.hearingDurationMinutes ?? 45,
    collegeStudyDurationMinutes: partial.collegeStudyDurationMinutes ?? 120,
    selfStudyDurationMinutes: partial.selfStudyDurationMinutes ?? 60,
    totalStudyDurationMinutes: partial.totalStudyDurationMinutes ?? 180,
    dayRestDurationMinutes: partial.dayRestDurationMinutes ?? 0,
    timeWastedDurationMinutes: partial.timeWastedDurationMinutes ?? 0,
    submittedAt: partial.submittedAt || now,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
  };
}

async function runPipelineTests() {
  console.log("================================================================");
  console.log("=== RUNNING 6-STAGE ATTENTION PIPELINE SPECIFICATION TESTS =====");
  console.log("================================================================\n");

  const student: DbUser = {
    id: "shishya_pipeline_test",
    authProviderId: "auth_pipeline_1",
    email: "devotee@nityasadhana.org",
    role: "shishya",
    name: "Mukunda Das",
    spiritualName: "Mukunda Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const today = "2026-08-27";

  // Build 7 baseline days with:
  // Japa: 16, Wake-up: 03:20, Reading: 30m
  const historyReports: DbDailySadhanaReport[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    historyReports.push(
      createReport({
        id: `rep_hist_${dateStr}`,
        studentId: student.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:20",
        totalRounds: 16,
        readingDurationMinutes: 30,
        hearingDurationMinutes: 30,
      })
    );
  }

  // ------------------------------------------------------------
  // TEST 1: User's Exact Multi-Dimension Compound Shift Scenario
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing User Example: Japa 16->9, Wake-up 3:20->4:55, Reading 30->10...");
  const multiShiftReport = createReport({
    id: `rep_multi_${today}`,
    studentId: student.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "04:55", // 95 mins later than 03:20
    totalRounds: 9,      // 7 rounds below baseline (43.75% drop)
    readingDurationMinutes: 10, // 20m below baseline (66.7% drop)
  });

  const pipelineResult = runAttentionPipeline({
    student,
    todayReport: multiShiftReport,
    historicalReports: [multiShiftReport, ...historyReports],
    currentDateStr: today,
  });

  // Stage 1: Check Raw Data
  console.log("-> Stage 1 (Raw Report):", {
    date: pipelineResult.stage1RawData?.practiceDate,
    japa: pipelineResult.stage1RawData?.totalRounds,
    wakeUp: pipelineResult.stage1RawData?.wakeUpTime,
    reading: pipelineResult.stage1RawData?.readingMinutes,
  });
  if (pipelineResult.stage1RawData?.totalRounds !== 9) throw new Error("Stage 1 raw data mismatch");

  // Stage 2: Check Personal Baseline
  console.log("-> Stage 2 (Personal Baseline):", {
    medianRounds: pipelineResult.stage2Baseline.medianTotalRounds,
    medianWakeUpMinutes: pipelineResult.stage2Baseline.medianWakeUpMinutes,
    medianReadingMinutes: pipelineResult.stage2Baseline.medianReadingMinutes,
  });
  if (pipelineResult.stage2Baseline.medianTotalRounds !== 16) throw new Error("Stage 2 baseline mismatch");
  if (pipelineResult.stage2Baseline.medianReadingMinutes !== 30) throw new Error("Stage 2 reading baseline mismatch");

  // Stage 3: Check Detected Signals
  const signalTypes = pipelineResult.stage3DetectedSignals.map((s) => s.type);
  console.log("-> Stage 3 (Detected Signals):", signalTypes);
  if (!signalTypes.includes("JAPA_CHANGE")) throw new Error("Missing JAPA_CHANGE in Stage 3");
  if (!signalTypes.includes("WAKE_TIME_CHANGE")) throw new Error("Missing WAKE_TIME_CHANGE in Stage 3");
  if (!signalTypes.includes("READING_REDUCTION")) throw new Error("Missing READING_REDUCTION in Stage 3");

  // Stage 4: Check Aggregator
  console.log("-> Stage 4 (Signal Aggregator):", {
    dimensionCount: pipelineResult.stage4AggregatedSignals.dimensionCount,
    hasMultipleDimensionsChanged: pipelineResult.stage4AggregatedSignals.hasMultipleDimensionsChanged,
    compoundRoutineSignal: pipelineResult.stage4AggregatedSignals.compoundRoutineSignal?.title,
  });
  if (!pipelineResult.stage4AggregatedSignals.hasMultipleDimensionsChanged) {
    throw new Error("Stage 4 failed to detect concurrent multi-dimension shifts");
  }

  // Stage 5: Check Attention Level
  console.log("-> Stage 5 (Attention Level):", pipelineResult.stage5AttentionLevel, "(🔵)");
  if (pipelineResult.stage5AttentionLevel !== "FOLLOW_UP_SUGGESTED") {
    throw new Error(`Expected FOLLOW_UP_SUGGESTED, got ${pipelineResult.stage5AttentionLevel}`);
  }

  // Stage 6: Check Human Explanation
  console.log("-> Stage 6 (Human Explanation):");
  console.log(`   Headline: "${pipelineResult.stage6Explanation.headline}"`);
  console.log(`   Detail: "${pipelineResult.stage6Explanation.detail}"`);
  console.log("   Notes:", pipelineResult.stage6Explanation.explanationNotes);

  const detailText = pipelineResult.stage6Explanation.detail;
  const isExpectedExplanation =
    detailText.includes("Several activity patterns have changed") ||
    detailText.includes("Multiple activity patterns have changed") ||
    pipelineResult.stage4AggregatedSignals.signals.some((s) => s.reason.includes("Several activity patterns"));

  if (!isExpectedExplanation) {
    throw new Error(`Explanation did not convey pattern changes: "${detailText}"`);
  }

  console.log("✓ TEST 1 PASSED: Complete 6-stage pipeline validated on user example.\n");

  // ------------------------------------------------------------
  // TEST 2: Dynamic Normalization (Return from 🔵 -> 🟢)
  // ------------------------------------------------------------
  console.log("[TEST 2] Testing Dynamic Normalization: 🔵 Follow-up Suggested -> 🟢 Stable...");

  // Next Day: Mukunda reports completely normal sadhana
  const nextDay = "2026-08-28";
  const normalizedReport = createReport({
    id: `rep_norm_${nextDay}`,
    studentId: student.id,
    practiceDate: nextDay,
    status: "submitted",
    wakeUpTime: "03:20",
    totalRounds: 16,
    readingDurationMinutes: 30,
  });

  const nextDayHistory = [normalizedReport, multiShiftReport, ...historyReports];

  const nextDayAssessment = evaluateAttention({
    student,
    todayReport: normalizedReport,
    historicalReports: nextDayHistory,
    currentDateStr: nextDay,
  });

  console.log(`-> Day T (Shift Day) Level: FOLLOW_UP_SUGGESTED (🔵)`);
  console.log(`-> Day T+1 (Normalized Day) Level: ${nextDayAssessment.level} (🟢)`);
  console.log(`-> Day T+1 Headline: "${nextDayAssessment.summaryHeadline}"`);
  console.log(`-> Day T+1 Detail: "${nextDayAssessment.summaryDetail}"`);

  if (nextDayAssessment.level !== "STABLE") {
    throw new Error(`Expected automatic return to STABLE, got ${nextDayAssessment.level}`);
  }
  if (nextDayAssessment.signals.length !== 0) {
    throw new Error("Expected zero active signals after normalization");
  }

  console.log("✓ TEST 2 PASSED: Shishya automatically and cleanly returned to 🟢 STABLE with zero permanent labels.\n");

  // ------------------------------------------------------------
  // TEST 3: Inspectability of All 6 Intermediate Stages
  // ------------------------------------------------------------
  console.log("[TEST 3] Verifying Inspectability of All 6 Intermediate Stages...");
  if (!pipelineResult.stage1RawData) throw new Error("Stage 1 missing");
  if (!pipelineResult.stage2Baseline) throw new Error("Stage 2 missing");
  if (!pipelineResult.stage3DetectedSignals) throw new Error("Stage 3 missing");
  if (!pipelineResult.stage4AggregatedSignals) throw new Error("Stage 4 missing");
  if (!pipelineResult.stage5AttentionLevel) throw new Error("Stage 5 missing");
  if (!pipelineResult.stage6Explanation) throw new Error("Stage 6 missing");
  if (!pipelineResult.assessment) throw new Error("Final assessment missing");

  console.log("✓ TEST 3 PASSED: All 6 stages produce typed, inspectable outputs.\n");

  console.log("================================================================");
  console.log("ALL 6-STAGE ATTENTION PIPELINE SPECIFICATION TESTS PASSED!");
  console.log("================================================================\n");
}

runPipelineTests().catch((err) => {
  console.error("Pipeline Test Suite Failed:", err);
  process.exit(1);
});
