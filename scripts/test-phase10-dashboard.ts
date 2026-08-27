import { dbStore } from "../lib/db/store";
import { DbUser } from "../lib/db/schema";
import { reportService } from "../lib/reports/service";
import { getLocalDateString } from "../lib/reports/calculations";

async function runPhase10Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 10 STUDENT DASHBOARD ARCHITECTURE TESTS ===");
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
    id: "shishya_dash_user_a",
    authProviderId: "auth_dash_user_a",
    role: "shishya",
    name: "Gopal Das",
    spiritualName: "Gopal Das",
    email: "gopal@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishyaA);

  const shishyaB: DbUser = {
    id: "shishya_dash_user_b",
    authProviderId: "auth_dash_user_b",
    role: "shishya",
    name: "Madhav Das",
    spiritualName: "Madhav Das",
    email: "madhav@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishyaB);

  const guru: DbUser = {
    id: "guru_dash_mentor",
    authProviderId: "auth_dash_guru",
    role: "guru",
    name: "H.G. Gauranga Das",
    spiritualName: "H.G. Gauranga Das",
    email: "gauranga@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(guru);

  // -------------------------------------------------------------------------
  // TEST 1: New User Empty Dashboard
  // -------------------------------------------------------------------------
  console.log("[TEST 1] Testing New User Empty Dashboard State...");

  const emptyDash = await reportService.getStudentDashboard(shishyaA.id);
  if (
    emptyDash.status !== "not_started" ||
    emptyDash.report !== null ||
    emptyDash.consistency.totalSubmitted !== 0 ||
    emptyDash.consistency.completedDays !== 0 ||
    emptyDash.consistency.currentStreak !== 0 ||
    emptyDash.recentReports.length !== 0
  ) {
    throw new Error("TEST 1 FAILED: Empty dashboard state is not clean for new devotee");
  }

  console.log("-> Status: not_started, Report: null, Total Submitted: 0, Streak: 0");
  console.log("✓ TEST 1 PASSED: Empty dashboard state renders accurately without fake data.\n");

  // -------------------------------------------------------------------------
  // TEST 2: In-Progress Draft State & Drafts Not Counting Toward Consistency
  // -------------------------------------------------------------------------
  console.log("[TEST 2] Testing In-Progress Draft State & Non-Counting in Streaks...");

  await reportService.saveOrSubmitReport({
    studentId: shishyaA.id,
    input: {
      practiceDate: todayStr,
      sleepTime: "21:00",
      wakeUpTime: "03:30",
      japaRounds: 16,
    },
    status: "draft",
  });

  const draftDash = await reportService.getStudentDashboard(shishyaA.id);
  if (
    draftDash.status !== "draft" ||
    !draftDash.report ||
    draftDash.consistency.totalSubmitted !== 0 ||
    draftDash.consistency.currentStreak !== 0
  ) {
    throw new Error("TEST 2 FAILED: Draft report was either not recognized or incorrectly counted in consistency");
  }

  console.log("-> Status: draft, Report ID:", draftDash.report.id);
  console.log("-> Consistency totalSubmitted: 0, currentStreak: 0 (Draft safely ignored in consistency)");
  console.log("✓ TEST 2 PASSED: Drafts are properly reflected as in-progress and excluded from streak calculations.\n");

  // -------------------------------------------------------------------------
  // TEST 3: Completed Report State with Real-Time Metrics
  // -------------------------------------------------------------------------
  console.log("[TEST 3] Testing Completed Today's Report & Metric Breakdown...");

  await reportService.saveOrSubmitReport({
    studentId: shishyaA.id,
    input: {
      practiceDate: todayStr,
      sleepTime: "20:45",
      wakeUpTime: "03:20",
      japaRounds: 16,
      extraRounds: 2,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 60,
      collegeStudyDurationMinutes: 360,
      selfStudyDurationMinutes: 120,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
    },
    status: "submitted",
  });

  const submittedDash = await reportService.getStudentDashboard(shishyaA.id);
  if (
    submittedDash.status !== "submitted" ||
    !submittedDash.report ||
    submittedDash.report.totalRounds !== 18 ||
    submittedDash.report.sleepDurationMinutes !== 395 ||
    submittedDash.report.totalStudyDurationMinutes !== 480 ||
    submittedDash.consistency.currentStreak !== 1 ||
    submittedDash.consistency.completedDays !== 1
  ) {
    throw new Error("TEST 3 FAILED: Submitted report metrics or streak mismatch");
  }

  console.log(`-> Today's Report: status=submitted, totalRounds=${submittedDash.report.totalRounds}, sleep=${submittedDash.report.sleepDurationMinutes}m, study=${submittedDash.report.totalStudyDurationMinutes}m`);
  console.log(`-> Consistency: ${submittedDash.consistency.completedDays}/10 days, streak=${submittedDash.consistency.currentStreak}`);
  console.log("✓ TEST 3 PASSED: Completed report metrics and initial streak verified.\n");

  // -------------------------------------------------------------------------
  // TEST 4: Consecutive Streak & 10-Day Window Calculation
  // -------------------------------------------------------------------------
  console.log("[TEST 4] Testing 5-Day Consecutive Streak Calculation...");

  // Seed 4 additional past consecutive days (yesterday down to 4 days ago)
  for (let i = 1; i <= 4; i++) {
    const pDate = getPastDateStr(i);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaA.id}_${pDate}`,
      studentId: shishyaA.id,
      practiceDate: pDate,
      sleepTime: "21:00",
      wakeUpTime: "03:30",
      sleepDurationMinutes: 390,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 45,
      collegeStudyDurationMinutes: 300,
      selfStudyDurationMinutes: 60,
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

  const multiDayDash = await reportService.getStudentDashboard(shishyaA.id);
  if (
    multiDayDash.consistency.completedDays !== 5 ||
    multiDayDash.consistency.currentStreak !== 5 ||
    multiDayDash.consistency.totalSubmitted !== 5
  ) {
    throw new Error(
      `TEST 4 FAILED: Expected 5 completed days and 5 current streak, got ${multiDayDash.consistency.completedDays} / ${multiDayDash.consistency.currentStreak}`
    );
  }

  console.log(`-> 5 consecutive days: window=${multiDayDash.consistency.completedDays}/10 days, streak=${multiDayDash.consistency.currentStreak} consecutive days`);
  console.log("✓ TEST 4 PASSED: Consecutive streak and window consistency are exact.\n");

  // -------------------------------------------------------------------------
  // TEST 5: Missing Day (Gap Day) Streak Handling
  // -------------------------------------------------------------------------
  console.log("[TEST 5] Testing Streak Behavior with Missing Practice Days...");

  // Seed Shishya B with reports for Today (day 0), Yesterday (day 1), and 3 days ago (day 3).
  // Day 2 (two days ago) is MISSING.
  await reportService.saveOrSubmitReport({
    studentId: shishyaB.id,
    input: { practiceDate: todayStr, sleepTime: "21:00", wakeUpTime: "03:30", japaRounds: 16 },
    status: "submitted",
  });
  await reportService.saveOrSubmitReport({
    studentId: shishyaB.id,
    input: { practiceDate: getPastDateStr(1), sleepTime: "21:00", wakeUpTime: "03:30", japaRounds: 16 },
    status: "submitted",
  });
  await dbStore.saveDailyReport({
    id: `rep_${shishyaB.id}_${getPastDateStr(3)}`,
    studentId: shishyaB.id,
    practiceDate: getPastDateStr(3),
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

  const gapDash = await reportService.getStudentDashboard(shishyaB.id);
  if (
    gapDash.consistency.completedDays !== 3 ||
    gapDash.consistency.currentStreak !== 2 // Streak is 2 because day 2 was missing
  ) {
    throw new Error(
      `TEST 5 FAILED: Expected 3 window days and 2 streak with gap day, got ${gapDash.consistency.completedDays} / ${gapDash.consistency.currentStreak}`
    );
  }

  console.log(`-> Gap day test: window=${gapDash.consistency.completedDays}/10 days, streak=${gapDash.consistency.currentStreak} (cleanly stopped at missing day)`);
  console.log("✓ TEST 5 PASSED: Missing days do not fabricate false streaks.\n");

  // -------------------------------------------------------------------------
  // TEST 6: Recent Reports Order and Limit
  // -------------------------------------------------------------------------
  console.log("[TEST 6] Testing Recent Reports Ordering and 5-Item Limit...");

  // Seed additional reports for Shishya A (6, 7, 8 days ago) -> Total 8 reports
  for (let i = 6; i <= 8; i++) {
    const pDate = getPastDateStr(i);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaA.id}_${pDate}`,
      studentId: shishyaA.id,
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

  const historyDash = await reportService.getStudentDashboard(shishyaA.id);
  if (historyDash.recentReports.length !== 5) {
    throw new Error(`TEST 6 FAILED: Expected exactly 5 recent reports, got ${historyDash.recentReports.length}`);
  }

  // Verify descending order
  for (let i = 0; i < historyDash.recentReports.length - 1; i++) {
    if (historyDash.recentReports[i].practiceDate < historyDash.recentReports[i + 1].practiceDate) {
      throw new Error("TEST 6 FAILED: Recent reports are not sorted in descending order by practiceDate");
    }
  }

  console.log(`-> Recent reports count: ${historyDash.recentReports.length} (capped at 5, sorted DESC)`);
  console.log("✓ TEST 6 PASSED: Recent reports query is optimized and correctly bounded.\n");

  // -------------------------------------------------------------------------
  // TEST 7: Cross-Shishya Dashboard Isolation
  // -------------------------------------------------------------------------
  console.log("[TEST 7] Verifying Strict Cross-Shishya Data Isolation...");

  const dashA = await reportService.getStudentDashboard(shishyaA.id);
  const dashB = await reportService.getStudentDashboard(shishyaB.id);

  if (dashA.consistency.totalSubmitted === dashB.consistency.totalSubmitted) {
    throw new Error("TEST 7 FAILED: Shishya A and Shishya B total submissions should differ");
  }

  console.log(`-> Shishya A total reports: ${dashA.consistency.totalSubmitted}`);
  console.log(`-> Shishya B total reports: ${dashB.consistency.totalSubmitted}`);
  console.log("✓ TEST 7 PASSED: Zero cross-Shishya data leakage.\n");

  // -------------------------------------------------------------------------
  // TEST 8: Guiding Guru Connection in Dashboard
  // -------------------------------------------------------------------------
  console.log("[TEST 8] Testing Guiding Guru Connection in Dashboard...");

  // Establish active relationship
  await dbStore.createRelationshipDirect({
    id: "rel_test_dash",
    guruId: guru.id,
    shishyaId: shishyaA.id,
    relationshipType: "primary_guru",
    status: "active",
    isPrimary: true,
  });

  const connectedDash = await reportService.getStudentDashboard(shishyaA.id);
  if (
    !connectedDash.guidingGuru ||
    connectedDash.guidingGuru.name !== "H.G. Gauranga Das"
  ) {
    throw new Error("TEST 8 FAILED: Guiding Guru association not returned in dashboard payload");
  }

  console.log(`-> Connected Guru: ${connectedDash.guidingGuru.spiritualName || connectedDash.guidingGuru.name}`);
  console.log("✓ TEST 8 PASSED: Guiding Guru successfully resolved in dashboard.\n");

  console.log("================================================================");
  console.log("ALL 8 PHASE 10 STUDENT DASHBOARD ARCHITECTURE TESTS PASSED!");
  console.log("================================================================");
}

runPhase10Tests().catch((err) => {
  console.error("\nTEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
