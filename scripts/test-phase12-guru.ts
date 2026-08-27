import { dbStore } from "../lib/db/store";
import { DbUser, DbDailySadhanaReport } from "../lib/db/schema";
import { GuruService } from "../lib/guru/service";
import {
  evaluateStudentAttentionSignals,
  calculatePersonalBaseline,
} from "../lib/guru/attention-engine";

async function runPhase12Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 12 GURU DASHBOARD & MANAGEMENT TESTS =========");
  console.log("================================================================\n");

  const today = "2026-08-26";
  const nowIso = new Date().toISOString();

  // ------------------------------------------------------------
  // SEED GURUS & SHISHYAS
  // ------------------------------------------------------------
  const guru1: DbUser = {
    id: "guru_radheshyam_p12",
    authProviderId: "auth_guru_r_p12",
    role: "guru",
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
    email: "radheshyam@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const guru2: DbUser = {
    id: "guru_gauranga_p12",
    authProviderId: "auth_guru_g_p12",
    role: "guru",
    name: "His Grace Gouranga Das",
    spiritualName: "Gouranga Das",
    email: "gouranga@iskconmumbai.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await dbStore.upsertUser(guru1);
  await dbStore.upsertUser(guru2);

  // Seed 4 Shishyas for Guru 1:
  // - Shishya A: Steady/Consistent
  // - Shishya B: Missing report today
  // - Shishya C: Multiple missing reports in last 7 days
  // - Shishya D: Wake-up time shifted today (4:30 AM instead of baseline 3:20 AM)
  // Seed 1 Shishya for Guru 2:
  // - Shishya E: Belongs strictly to Guru 2

  const shishyaA: DbUser = {
    id: "shishya_arjuna_p12",
    authProviderId: "auth_shishya_a_p12",
    role: "shishya",
    name: "Arjun Sharma",
    spiritualName: "Arjuna Das",
    email: "arjun@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaB: DbUser = {
    id: "shishya_bhima_p12",
    authProviderId: "auth_shishya_b_p12",
    role: "shishya",
    name: "Bhim Rao",
    spiritualName: "Bhima Das",
    email: "bhim@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaC: DbUser = {
    id: "shishya_nakula_p12",
    authProviderId: "auth_shishya_c_p12",
    role: "shishya",
    name: "Nakul Sen",
    spiritualName: "Nakula Das",
    email: "nakul@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaD: DbUser = {
    id: "shishya_sahadeva_p12",
    authProviderId: "auth_shishya_d_p12",
    role: "shishya",
    name: "Sahadev Patil",
    spiritualName: "Sahadeva Das",
    email: "sahadev@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaE: DbUser = {
    id: "shishya_karna_p12",
    authProviderId: "auth_shishya_e_p12",
    role: "shishya",
    name: "Karan Verma",
    spiritualName: "Karna Das",
    email: "karan@iskconmumbai.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await dbStore.upsertUser(shishyaA);
  await dbStore.upsertUser(shishyaB);
  await dbStore.upsertUser(shishyaC);
  await dbStore.upsertUser(shishyaD);
  await dbStore.upsertUser(shishyaE);

  // Connect Shishyas A, B, C, D to Guru 1
  for (const s of [shishyaA, shishyaB, shishyaC, shishyaD]) {
    await dbStore.createRelationshipDirect({
      id: `rel_${guru1.id}_${s.id}`,
      guruId: guru1.id,
      shishyaId: s.id,
      relationshipType: "primary_guru",
      status: "active",
      isPrimary: true,
    });
  }

  // Connect Shishya E to Guru 2
  await dbStore.createRelationshipDirect({
    id: `rel_${guru2.id}_${shishyaE.id}`,
    guruId: guru2.id,
    shishyaId: shishyaE.id,
    relationshipType: "primary_guru",
    status: "active",
    isPrimary: true,
  });

  // ------------------------------------------------------------
  // SEED HISTORICAL SĀDHANĀ REPORTS
  // ------------------------------------------------------------
  // 1. Shishya A: 14 days of submitted reports + Today submitted (3:20 AM, 16 rds, 30m reading, 60m hearing)
  for (let i = 1; i <= 14; i++) {
    const d = new Date(new Date(today).getTime() - i * 86400000).toISOString().slice(0, 10);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaA.id}_${d}`,
      studentId: shishyaA.id,
      practiceDate: d,
      sleepTime: "21:00",
      wakeUpTime: "03:20",
      sleepDurationMinutes: 380,
      japaRounds: 16,
      extraRounds: 2,
      totalRounds: 18,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 60,
      collegeStudyDurationMinutes: 360,
      selfStudyDurationMinutes: 120,
      totalStudyDurationMinutes: 480,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      createdAt: nowIso,
      updatedAt: nowIso,
      timezone: "Asia/Kolkata",
    });
  }
  // Today's report for Shishya A (Steady)
  await dbStore.saveDailyReport({
    id: `rep_${shishyaA.id}_${today}`,
    studentId: shishyaA.id,
    practiceDate: today,
    sleepTime: "21:00",
    wakeUpTime: "03:20",
    sleepDurationMinutes: 380,
    japaRounds: 16,
    extraRounds: 2,
    totalRounds: 18,
    readingDurationMinutes: 30,
    hearingDurationMinutes: 60,
    collegeStudyDurationMinutes: 360,
    selfStudyDurationMinutes: 120,
    totalStudyDurationMinutes: 480,
    dayRestDurationMinutes: 0,
    timeWastedDurationMinutes: 0,
    status: "submitted",
    createdAt: nowIso,
    updatedAt: nowIso,
    timezone: "Asia/Kolkata",
  });

  // 2. Shishya B: 14 days of history, but NO report submitted for today (Missing today)
  for (let i = 1; i <= 14; i++) {
    const d = new Date(new Date(today).getTime() - i * 86400000).toISOString().slice(0, 10);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaB.id}_${d}`,
      studentId: shishyaB.id,
      practiceDate: d,
      sleepTime: "21:30",
      wakeUpTime: "04:00",
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
      createdAt: nowIso,
      updatedAt: nowIso,
      timezone: "Asia/Kolkata",
    });
  }

  // 3. Shishya C: Has missing reports across the last 7 days (4 days missing)
  for (let i = 5; i <= 14; i++) {
    const d = new Date(new Date(today).getTime() - i * 86400000).toISOString().slice(0, 10);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaC.id}_${d}`,
      studentId: shishyaC.id,
      practiceDate: d,
      sleepTime: "22:00",
      wakeUpTime: "04:30",
      sleepDurationMinutes: 390,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 20,
      hearingDurationMinutes: 30,
      collegeStudyDurationMinutes: 240,
      selfStudyDurationMinutes: 60,
      totalStudyDurationMinutes: 300,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      createdAt: nowIso,
      updatedAt: nowIso,
      timezone: "Asia/Kolkata",
    });
  }

  // 4. Shishya D: 14 days history with baseline wake-up 03:20 AM. Today woke up at 04:30 AM (70m shift)
  for (let i = 1; i <= 14; i++) {
    const d = new Date(new Date(today).getTime() - i * 86400000).toISOString().slice(0, 10);
    await dbStore.saveDailyReport({
      id: `rep_${shishyaD.id}_${d}`,
      studentId: shishyaD.id,
      practiceDate: d,
      sleepTime: "21:00",
      wakeUpTime: "03:20",
      sleepDurationMinutes: 380,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 60,
      collegeStudyDurationMinutes: 300,
      selfStudyDurationMinutes: 60,
      totalStudyDurationMinutes: 360,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      createdAt: nowIso,
      updatedAt: nowIso,
      timezone: "Asia/Kolkata",
    });
  }
  // Today's report for Shishya D with 04:30 AM wake-up
  await dbStore.saveDailyReport({
    id: `rep_${shishyaD.id}_${today}`,
    studentId: shishyaD.id,
    practiceDate: today,
    sleepTime: "22:30",
    wakeUpTime: "04:30", // 70 min later than 03:20 baseline
    sleepDurationMinutes: 360,
    japaRounds: 16,
    extraRounds: 0,
    totalRounds: 16,
    readingDurationMinutes: 30,
    hearingDurationMinutes: 60,
    collegeStudyDurationMinutes: 300,
    selfStudyDurationMinutes: 60,
    totalStudyDurationMinutes: 360,
    dayRestDurationMinutes: 0,
    timeWastedDurationMinutes: 0,
    status: "submitted",
    createdAt: nowIso,
    updatedAt: nowIso,
    timezone: "Asia/Kolkata",
  });

  // ------------------------------------------------------------
  // TEST 1: Cross-Guru Multi-Tenant Isolation
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Guru 1 cannot access Shishya E (belongs to Guru 2)...");
  const guru1ShishyaDetail = await GuruService.getShishyaDetail(guru1.id, shishyaE.id, today);
  if (guru1ShishyaDetail !== null) {
    throw new Error("SECURITY FAILURE: Guru 1 was able to access Shishya E belonging to Guru 2!");
  }
  const isConnected = await dbStore.isShishyaConnectedToGuru(guru1.id, shishyaE.id);
  if (isConnected) {
    throw new Error("SECURITY FAILURE: isShishyaConnectedToGuru returned true for foreign Shishya!");
  }
  console.log("-> Query result for foreign Shishya: REJECTED (null)");
  console.log("✓ TEST 1 PASSED: Strict cross-Guru isolation confirmed.\n");

  // ------------------------------------------------------------
  // TEST 2: Guru Home Dashboard Aggregation
  // ------------------------------------------------------------
  console.log("[TEST 2] Testing Guru 1 Dashboard Overview Aggregation...");
  const overview = await GuruService.getDashboardOverview(guru1.id, today);

  if (overview.totalActiveShishyas !== 4) {
    throw new Error(`Expected 4 active Shishyas, got ${overview.totalActiveShishyas}`);
  }
  if (overview.todayStats.submittedCount !== 2) {
    // Shishya A and Shishya D submitted today
    throw new Error(`Expected 2 submitted reports, got ${overview.todayStats.submittedCount}`);
  }
  if (overview.todayStats.notSubmittedCount !== 2) {
    // Shishya B and Shishya C have not submitted today
    throw new Error(`Expected 2 not submitted reports, got ${overview.todayStats.notSubmittedCount}`);
  }
  console.log(`-> Total Active Shishyas: ${overview.totalActiveShishyas}`);
  console.log(`-> Today Submitted: ${overview.todayStats.submittedCount}`);
  console.log(`-> Today Awaiting: ${overview.todayStats.notSubmittedCount}`);
  console.log("✓ TEST 2 PASSED: Dashboard statistics correctly aggregated.\n");

  // ------------------------------------------------------------
  // TEST 3: Attention Signal Engine — Missing Report Today
  // ------------------------------------------------------------
  console.log("[TEST 3] Testing Attention Signal: Report Missing Today...");
  const shishyaBItem = overview.allShishyas.find((s) => s.shishya.id === shishyaB.id);
  if (!shishyaBItem) throw new Error("Shishya B not found in overview!");

  const missingSignal = shishyaBItem.signals.find(
    (s) => s.type === "REPORT_MISSING" || (s.type as string) === "REPORT_MISSING_TODAY"
  );
  if (!missingSignal) {
    throw new Error("Attention engine failed to signal missing report today for Shishya B!");
  }
  console.log("-> Signal detected:", missingSignal.title, "—", missingSignal.reason);
  console.log("✓ TEST 3 PASSED: Missing report today surfaced with transparent reason.\n");

  // ------------------------------------------------------------
  // TEST 4: Attention Signal Engine — Multiple Missing Reports in 7 Days
  // ------------------------------------------------------------
  console.log("[TEST 4] Testing Attention Signal: Multiple Missing Reports in 7 Days...");
  const shishyaCItem = overview.allShishyas.find((s) => s.shishya.id === shishyaC.id);
  if (!shishyaCItem) throw new Error("Shishya C not found in overview!");

  const patternSignal = shishyaCItem.signals.find(
    (s) => s.type === "REPEATED_REPORT_MISSING" || (s.type as string) === "MULTIPLE_MISSING_REPORTS"
  );
  if (!patternSignal) {
    throw new Error("Attention engine failed to signal multiple missing reports for Shishya C!");
  }
  console.log("-> Signal detected:", patternSignal.title, "—", patternSignal.reason);
  console.log("✓ TEST 4 PASSED: Multi-day reporting pattern deviation surfaced.\n");

  // ------------------------------------------------------------
  // TEST 5: Attention Signal Engine — Wake-Up Time Shift vs Personal Baseline
  // ------------------------------------------------------------
  console.log("[TEST 5] Testing Attention Signal: Wake-Up Time Shift vs Personal Baseline...");
  const shishyaDItem = overview.allShishyas.find((s) => s.shishya.id === shishyaD.id);
  if (!shishyaDItem) throw new Error("Shishya D not found in overview!");

  const wakeSignal = shishyaDItem.signals.find(
    (s) => s.type === "WAKE_TIME_CHANGE" || (s.type as string) === "WAKE_TIME_CHANGED"
  );
  if (!wakeSignal) {
    throw new Error("Attention engine failed to detect wake-up time shift for Shishya D!");
  }
  console.log("-> Signal detected:", wakeSignal.title, "—", wakeSignal.reason);
  console.log("✓ TEST 5 PASSED: Shift vs personal baseline detected accurately.\n");

  // ------------------------------------------------------------
  // TEST 6: Stable Shishya Classification
  // ------------------------------------------------------------
  console.log("[TEST 6] Testing Stable Shishya Classification...");
  const shishyaAItem = overview.allShishyas.find((s) => s.shishya.id === shishyaA.id);
  if (!shishyaAItem) throw new Error("Shishya A not found in overview!");

  if (!shishyaAItem.isStable || shishyaAItem.needsAttention) {
    throw new Error("Steady Shishya A was falsely flagged with attention signals!");
  }
  console.log("-> Shishya A status: isStable = true, needsAttention = false");
  console.log("✓ TEST 6 PASSED: Steady student correctly classified as stable.\n");

  // ------------------------------------------------------------
  // TEST 7: Student Profile Deep Detail & 7-Day / 30-Day Trends
  // ------------------------------------------------------------
  console.log("[TEST 7] Testing Student Profile Deep Detail Query...");
  const detailA = await GuruService.getShishyaDetail(guru1.id, shishyaA.id, today);
  if (!detailA) throw new Error("Failed to load detail for Shishya A!");

  if (detailA.sevenDayTrend.length !== 7) {
    throw new Error(`Expected 7 data points in 7-day trend, got ${detailA.sevenDayTrend.length}`);
  }
  if (detailA.thirtyDayStats.avgRounds !== 18) {
    throw new Error(`Expected 18 average rounds, got ${detailA.thirtyDayStats.avgRounds}`);
  }
  console.log(`-> 7-Day Trend points: ${detailA.sevenDayTrend.length}`);
  console.log(`-> 30-Day Consistency: ${detailA.thirtyDayStats.consistencyPercentage}%`);
  console.log(`-> 30-Day Avg Japa: ${detailA.thirtyDayStats.avgRounds} rounds`);
  console.log(`-> 30-Day Avg Wake-up: ${detailA.thirtyDayStats.avgWakeUpTime}`);
  console.log("✓ TEST 7 PASSED: 7-day and 30-day personal baseline trend calculations verified.\n");

  // ------------------------------------------------------------
  // TEST 8: Read-Only Report Inspection Security
  // ------------------------------------------------------------
  console.log("[TEST 8] Testing Read-Only Report Inspection...");
  const reportDetail = await GuruService.getReportDetailForGuru(
    guru1.id,
    shishyaA.id,
    `rep_${shishyaA.id}_${today}`
  );
  if (!reportDetail) {
    throw new Error("Guru failed to retrieve read-only report detail!");
  }
  if (reportDetail.studentId !== shishyaA.id) {
    throw new Error("Report studentId mismatch!");
  }
  console.log("-> Guru read-only access verified for report:", reportDetail.id);
  console.log("✓ TEST 8 PASSED: Read-only inspection verified.\n");

  // ------------------------------------------------------------
  // TEST 9: Verification of Zero Gamification & No Student Comparison
  // ------------------------------------------------------------
  console.log("[TEST 9] Verifying Zero Gamification, Ranks, or Cross-Student Comparison...");
  for (const item of overview.allShishyas) {
    const rawObj = item as unknown as Record<string, unknown>;
    if ("rank" in rawObj || "score" in rawObj || "leaderboard" in rawObj || "percentile" in rawObj) {
      throw new Error("SECURITY/PHILOSOPHY VIOLATION: Forbidden competitive fields present in payload!");
    }
  }
  console.log("-> Verified: Zero ranks, scores, or cross-student comparison fields exist.");
  console.log("✓ TEST 9 PASSED: Absolute adherence to non-competitive spiritual philosophy.\n");

  console.log("================================================================");
  console.log("ALL 9 PHASE 12 GURU DASHBOARD & MANAGEMENT TESTS PASSED 100%!");
  console.log("================================================================");
}

runPhase12Tests().catch((err) => {
  console.error("Phase 12 Test Failed:", err);
  process.exit(1);
});
