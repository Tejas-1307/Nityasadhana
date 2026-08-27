import { dbStore } from "../lib/db/store";
import { DbUser } from "../lib/db/schema";
import { reportService } from "../lib/reports/service";
import { getLocalDateString } from "../lib/reports/calculations";

async function runPhase11Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 11 STUDENT JOURNEY ARCHITECTURE TESTS ===");
  console.log("================================================================\n");

  const today = new Date();
  const todayStr = getLocalDateString(today, "Asia/Kolkata");

  function getPastDateStr(daysAgo: number): string {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return getLocalDateString(d, "Asia/Kolkata");
  }

  // -------------------------------------------------------------------------
  // SETUP TEST DEVOTEES
  // -------------------------------------------------------------------------
  const shishyaA: DbUser = {
    id: "shishya_journey_user_a",
    authProviderId: "auth_journey_user_a",
    role: "shishya",
    name: "Sanatana Das",
    spiritualName: "Sanatana Das",
    email: "sanatana@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishyaA);

  const shishyaB: DbUser = {
    id: "shishya_journey_user_b",
    authProviderId: "auth_journey_user_b",
    role: "shishya",
    name: "Rupa Das",
    spiritualName: "Rupa Das",
    email: "rupa@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishyaB);

  // -------------------------------------------------------------------------
  // TEST 1: 7-Day Journey Calculation & Consistency
  // -------------------------------------------------------------------------
  console.log("[TEST 1] Testing 7-Day Journey Calculation & Consistency...");

  // Seed 7 days of reports for Shishya A (days 0 to 6)
  // Current Period (days 0 to 6): Japa = 18 rounds, Study = 360m (6h), Wake = 03:30 (210m)
  for (let i = 0; i < 7; i++) {
    const pDate = getPastDateStr(i);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaA.id}_${pDate}`,
      studentId: shishyaA.id,
      practiceDate: pDate,
      sleepTime: "21:00",
      wakeUpTime: "03:30",
      sleepDurationMinutes: 390,
      japaRounds: 16,
      extraRounds: 2,
      totalRounds: 18,
      readingDurationMinutes: 45,
      hearingDurationMinutes: 60,
      collegeStudyDurationMinutes: 240,
      selfStudyDurationMinutes: 120,
      totalStudyDurationMinutes: 360,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      timezone: "Asia/Kolkata",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    });
  }

  const journey7 = await reportService.getStudentJourney({
    studentId: shishyaA.id,
    rangeDays: 7,
  });

  if (
    journey7.rangeDays !== 7 ||
    journey7.dailySeries.length !== 7 ||
    journey7.overview.submittedCount !== 7 ||
    journey7.overview.consistencyPercentage !== 100 ||
    !journey7.hasEnoughData
  ) {
    throw new Error(
      `TEST 1 FAILED: Expected 7 daily series and 100% consistency, got ${journey7.dailySeries.length} items, ${journey7.overview.consistencyPercentage}%`
    );
  }

  console.log(`-> 7-Day Series Count: ${journey7.dailySeries.length}, Submitted: ${journey7.overview.submittedCount}/7 (100% consistency)`);
  console.log("✓ TEST 1 PASSED: 7-Day Journey calculation and daily series verified.\n");

  // -------------------------------------------------------------------------
  // TEST 2: 30-Day Journey Calculation
  // -------------------------------------------------------------------------
  console.log("[TEST 2] Testing 30-Day Journey Calculation...");

  const journey30 = await reportService.getStudentJourney({
    studentId: shishyaA.id,
    rangeDays: 30,
  });

  if (journey30.rangeDays !== 30 || journey30.dailySeries.length !== 30) {
    throw new Error(`TEST 2 FAILED: Expected 30 daily series, got ${journey30.dailySeries.length}`);
  }

  console.log(`-> 30-Day Series Count: ${journey30.dailySeries.length}, Submitted: ${journey30.overview.submittedCount}/30`);
  console.log("✓ TEST 2 PASSED: 30-Day Journey series generation verified.\n");

  // -------------------------------------------------------------------------
  // TEST 3: Missing Day vs Zero Value Distinction
  // -------------------------------------------------------------------------
  console.log("[TEST 3] Testing Missing Day vs Zero Value Distinction...");

  // In journey30, day index 10 (10 days ago) has no submitted report -> should be isSubmitted = false, totalRounds = undefined
  const missingDay = journey30.dailySeries.find((d) => d.date === getPastDateStr(10));
  if (!missingDay || missingDay.isSubmitted !== false || missingDay.totalRounds !== undefined) {
    throw new Error("TEST 3 FAILED: Missing day was not represented as isSubmitted=false and undefined value");
  }

  // Today has a submitted report with timeWasted = 0 -> should be isSubmitted = true, timeWastedMinutes = 0
  const submittedZeroDay = journey30.dailySeries.find((d) => d.date === todayStr);
  if (
    !submittedZeroDay ||
    submittedZeroDay.isSubmitted !== true ||
    submittedZeroDay.timeWastedMinutes !== 0
  ) {
    throw new Error("TEST 3 FAILED: Submitted report with 0m was not preserved as 0m");
  }

  console.log(`-> Missing Day (${missingDay.date}): isSubmitted=false, rounds=${missingDay.totalRounds ?? "Missing"}`);
  console.log(`-> Submitted Zero Day (${submittedZeroDay.date}): isSubmitted=true, timeWasted=${submittedZeroDay.timeWastedMinutes}m`);
  console.log("✓ TEST 3 PASSED: Missing data and Zero values are strictly distinguished.\n");

  // -------------------------------------------------------------------------
  // TEST 4: Personal Improvement Comparison (Current 7d vs Previous 7d)
  // -------------------------------------------------------------------------
  console.log("[TEST 4] Testing Personal Comparison (YOU Current vs YOU Previous)...");

  // Seed Previous Period (days 7 to 13):
  // Japa = 16 rounds, Study = 300m (5h), Wake = 04:00 (240m), Reading = 30m, Time Wasted = 30m
  for (let i = 7; i <= 13; i++) {
    const pDate = getPastDateStr(i);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaA.id}_${pDate}`,
      studentId: shishyaA.id,
      practiceDate: pDate,
      sleepTime: "21:00",
      wakeUpTime: "04:00",
      sleepDurationMinutes: 360,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 45,
      collegeStudyDurationMinutes: 200,
      selfStudyDurationMinutes: 100,
      totalStudyDurationMinutes: 300,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 30,
      status: "submitted",
      timezone: "Asia/Kolkata",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    });
  }

  const comparisonJourney = await reportService.getStudentJourney({
    studentId: shishyaA.id,
    rangeDays: 7,
  });

  const comp = comparisonJourney.comparison;

  // Japa: Cur (18) vs Prev (16) -> +2.0 rounds, direction: increased
  if (comp.japa.direction !== "increased" || Math.round(comp.japa.diff) !== 2) {
    throw new Error(`TEST 4 FAILED: Expected +2.0 rounds Japa improvement, got ${comp.japa.label}`);
  }

  // Wake-up: Cur (3:30 AM = 210m) vs Prev (4:00 AM = 240m) -> 30m earlier, direction: increased
  if (comp.wakeUp.direction !== "increased" || comp.wakeUp.diff !== 30) {
    throw new Error(`TEST 4 FAILED: Expected 30m earlier wake-up, got ${comp.wakeUp.label}`);
  }

  // Study: Cur (360m) vs Prev (300m) -> +1h, direction: increased
  if (comp.study.direction !== "increased" || Math.round(comp.study.diff) !== 60) {
    throw new Error(`TEST 4 FAILED: Expected +1h study improvement, got ${comp.study.label}`);
  }

  // Time wasted: Cur (0m) vs Prev (30m) -> -30m, direction: decreased
  if (comp.timeWasted.direction !== "decreased" || Math.round(comp.timeWasted.diff) !== -30) {
    throw new Error(`TEST 4 FAILED: Expected -30m time wasted reduction, got ${comp.timeWasted.label}`);
  }

  console.log(`-> Japa Comparison: ${comp.japa.label} (direction: ${comp.japa.direction})`);
  console.log(`-> Wake-up Comparison: ${comp.wakeUp.label} (direction: ${comp.wakeUp.direction})`);
  console.log(`-> Study Comparison: ${comp.study.label} (direction: ${comp.study.direction})`);
  console.log(`-> Time Wasted Comparison: ${comp.timeWasted.label} (direction: ${comp.timeWasted.direction})`);
  console.log("✓ TEST 4 PASSED: Personal period-over-period comparison is exact and objective.\n");

  // -------------------------------------------------------------------------
  // TEST 5: Insufficient Data Handling (< 3 Reports)
  // -------------------------------------------------------------------------
  console.log("[TEST 5] Testing Insufficient Data Handling (< 3 Reports)...");

  // Shishya B only has 2 submitted reports
  for (let i = 0; i < 2; i++) {
    const pDate = getPastDateStr(i);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaB.id}_${pDate}`,
      studentId: shishyaB.id,
      practiceDate: pDate,
      sleepTime: "21:00",
      wakeUpTime: "03:30",
      sleepDurationMinutes: 390,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 0,
      collegeStudyDurationMinutes: 0,
      selfStudyDurationMinutes: 0,
      totalStudyDurationMinutes: 0,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      timezone: "Asia/Kolkata",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    });
  }

  const sparseJourney = await reportService.getStudentJourney({
    studentId: shishyaB.id,
    rangeDays: 7,
  });

  if (sparseJourney.hasEnoughData !== false || sparseJourney.comparison.japa.direction !== "insufficient_data") {
    throw new Error("TEST 5 FAILED: Sparse dataset (< 3 reports) must assert hasEnoughData=false and insufficient_data");
  }

  console.log(`-> Sparse Dataset: hasEnoughData=false, label: "${sparseJourney.comparison.japa.label}"`);
  console.log("✓ TEST 5 PASSED: Sparse datasets are safely handled without asserting false trends.\n");

  // -------------------------------------------------------------------------
  // TEST 6: Strict Cross-Shishya Journey Isolation
  // -------------------------------------------------------------------------
  console.log("[TEST 6] Testing Cross-Shishya Journey Data Isolation...");

  const journeyA = await reportService.getStudentJourney({ studentId: shishyaA.id, rangeDays: 7 });
  const journeyB = await reportService.getStudentJourney({ studentId: shishyaB.id, rangeDays: 7 });

  if (journeyA.overview.submittedCount === journeyB.overview.submittedCount) {
    throw new Error("TEST 6 FAILED: Shishya A and Shishya B journey submitted counts should differ");
  }

  console.log(`-> Shishya A (7-Day Submitted): ${journeyA.overview.submittedCount}/7`);
  console.log(`-> Shishya B (7-Day Submitted): ${journeyB.overview.submittedCount}/7`);
  console.log("✓ TEST 6 PASSED: Zero cross-Shishya Journey data leakage.\n");

  console.log("================================================================");
  console.log("ALL 6 PHASE 11 STUDENT JOURNEY ARCHITECTURE TESTS PASSED!");
  console.log("================================================================");
}

runPhase11Tests().catch((err) => {
  console.error("\nTEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
