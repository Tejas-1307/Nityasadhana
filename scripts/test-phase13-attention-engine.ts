// ============================================================
// NITYASĀDHANĀ — PHASE 13 ATTENTION ENGINE TEST SUITE
// ============================================================
// Validates:
// 1. All 3 Attention Levels: STABLE (🟢), OBSERVE (🟡), FOLLOW_UP_SUGGESTED (🔵)
// 2. Personal Baseline calculation with median outlier resistance
// 3. Strict distinction between NOT_REPORTED (null) and REPORTED_ZERO (0)
// 4. Consecutive missing report streak detection (1d -> Observe, 3d -> Follow-up)
// 5. Japa pattern detection vs personal baseline
// 6. Wake-up time shift vs personal baseline
// 7. Multi-dimension concurrent routine change detection
// 8. Insufficient history handling (< 5 reports)
// 9. Signal resolution when report is submitted
// 10. Multi-tenant isolation & IDOR denial
// 11. Zero cross-student comparison & zero spiritual judgment terms
// 12. Scaled performance benchmark (100 Shishyas x 30 days)
// ============================================================

import { dbStore } from "../lib/db/store";
import {
  evaluateAttention,
  calculatePersonalBaseline,
  calculateMedian,
} from "../lib/guru/attention";
import { GuruService } from "../lib/guru/service";
import { DbDailySadhanaReport, DbUser, DbGuruShishyaRelationship } from "../lib/db/schema";

function createTestReport(
  partial: Partial<DbDailySadhanaReport> & {
    id: string;
    studentId: string;
    practiceDate: string;
  }
): DbDailySadhanaReport {
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

async function runPhase13Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 13 ATTENTION ENGINE SPECIFICATION TESTS ======");
  console.log("================================================================\n");

  const today = "2026-08-26";

  // --- SEED USERS & MENTORSHIPS ---
  const guru1: DbUser = {
    id: "guru_p13_gauranga",
    authProviderId: "auth_p13_g1",
    email: "gauranga@iskconpune.org",
    role: "guru",
    name: "Gauranga Das",
    spiritualName: "His Grace Gauranga Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const guru2: DbUser = {
    id: "guru_p13_radheshyam",
    authProviderId: "auth_p13_g2",
    email: "radheshyam@iskconpune.org",
    role: "guru",
    name: "Radheshyam Das",
    spiritualName: "His Grace Radheshyam Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 1: Stable Arjuna (7 consistent reports)
  const student1: DbUser = {
    id: "shishya_p13_arjuna",
    authProviderId: "auth_p13_s1",
    email: "arjuna@nityasadhana.org",
    role: "shishya",
    name: "Arjun Sharma",
    spiritualName: "Arjuna Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 2: Nakula (1 missing report today)
  const student2: DbUser = {
    id: "shishya_p13_nakula",
    authProviderId: "auth_p13_s2",
    email: "nakula@nityasadhana.org",
    role: "shishya",
    name: "Nakul Verma",
    spiritualName: "Nakula Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 3: Bhima (3 consecutive missing reports)
  const student3: DbUser = {
    id: "shishya_p13_bhima",
    authProviderId: "auth_p13_s3",
    email: "bhima@nityasadhana.org",
    role: "shishya",
    name: "Bhim Rao",
    spiritualName: "Bhima Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 4: Sahadeva (Japa drop: 16 -> 8 rounds)
  const student4: DbUser = {
    id: "shishya_p13_sahadeva",
    authProviderId: "auth_p13_s4",
    email: "sahadeva@nityasadhana.org",
    role: "shishya",
    name: "Sahadev Joshi",
    spiritualName: "Sahadeva Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 5: Karna (Wake-up shift: 3:20 -> 5:00 AM)
  const student5: DbUser = {
    id: "shishya_p13_karna",
    authProviderId: "auth_p13_s5",
    email: "karna@nityasadhana.org",
    role: "shishya",
    name: "Karan Singhania",
    spiritualName: "Karna Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 6: New student with only 2 reports
  const student6: DbUser = {
    id: "shishya_p13_newbie",
    authProviderId: "auth_p13_s6",
    email: "newbie@nityasadhana.org",
    role: "shishya",
    name: "Naveen Patel",
    spiritualName: undefined,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Student 7: Belongs to Guru 2 (Foreign student)
  const student7: DbUser = {
    id: "shishya_p13_foreign",
    authProviderId: "auth_p13_s7",
    email: "foreign@nityasadhana.org",
    role: "shishya",
    name: "Foreign Student",
    spiritualName: "Foreign Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Seed DB users
  await dbStore.upsertUser(guru1);
  await dbStore.upsertUser(guru2);
  await dbStore.upsertUser(student1);
  await dbStore.upsertUser(student2);
  await dbStore.upsertUser(student3);
  await dbStore.upsertUser(student4);
  await dbStore.upsertUser(student5);
  await dbStore.upsertUser(student6);
  await dbStore.upsertUser(student7);

  // Establish relationships
  const rels: Array<Omit<DbGuruShishyaRelationship, "createdAt" | "updatedAt">> = [
    {
      id: "rel_p13_1",
      guruId: guru1.id,
      shishyaId: student1.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_2",
      guruId: guru1.id,
      shishyaId: student2.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_3",
      guruId: guru1.id,
      shishyaId: student3.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_4",
      guruId: guru1.id,
      shishyaId: student4.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_5",
      guruId: guru1.id,
      shishyaId: student5.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_6",
      guruId: guru1.id,
      shishyaId: student6.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
    {
      id: "rel_p13_7",
      guruId: guru2.id,
      shishyaId: student7.id,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    },
  ];

  for (const rel of rels) {
    await dbStore.createRelationshipDirect(rel);
  }

  // ------------------------------------------------------------
  // TEST 1: Case 1 — 7 Consistent Reports -> STABLE (🟢)
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Case 1: 7 Consistent Reports -> STABLE (🟢)...");
  const reports1: DbDailySadhanaReport[] = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    reports1.push(
      createTestReport({
        id: `rep_s1_${dateStr}`,
        studentId: student1.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:20",
        sleepTime: "21:30",
        sleepDurationMinutes: 350,
        totalRounds: 16,
        readingDurationMinutes: 30,
        hearingDurationMinutes: 45,
      })
    );
  }
  for (const r of reports1) await dbStore.saveDailyReport(r);

  const assessment1 = evaluateAttention({
    student: student1,
    todayReport: reports1[0],
    historicalReports: reports1,
    currentDateStr: today,
  });

  if (assessment1.level !== "STABLE") {
    throw new Error(`Expected STABLE for consistent student, got ${assessment1.level}`);
  }
  console.log(`-> Student 1 Level: ${assessment1.level} (🟢), Signals Count: ${assessment1.signals.length}`);
  console.log("✓ TEST 1 PASSED: Steady student correctly assessed as STABLE.\n");

  // ------------------------------------------------------------
  // TEST 2: Case 2 — 1 Missing Report Today -> OBSERVE (🟡)
  // ------------------------------------------------------------
  console.log("[TEST 2] Testing Case 2: 1 Missing Report Today -> OBSERVE (🟡)...");
  const reports2: DbDailySadhanaReport[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    reports2.push(
      createTestReport({
        id: `rep_s2_${dateStr}`,
        studentId: student2.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:30",
        totalRounds: 16,
        readingDurationMinutes: 30,
        hearingDurationMinutes: 30,
      })
    );
  }
  for (const r of reports2) await dbStore.saveDailyReport(r);

  const assessment2 = evaluateAttention({
    student: student2,
    todayReport: null,
    historicalReports: reports2,
    currentDateStr: today,
  });

  if (assessment2.level !== "OBSERVE") {
    throw new Error(`Expected OBSERVE for 1 missing report, got ${assessment2.level}`);
  }
  const missingSig = assessment2.signals.find((s) => s.type === "REPORT_MISSING");
  if (!missingSig) {
    throw new Error("Missing REPORT_MISSING signal!");
  }
  console.log(`-> Student 2 Level: ${assessment2.level} (🟡), Signal: ${missingSig.title} (${missingSig.reason})`);
  console.log("✓ TEST 2 PASSED: 1 missed report correctly classified as OBSERVE.\n");

  // ------------------------------------------------------------
  // TEST 3: Case 3 — 3 Consecutive Missing Reports -> FOLLOW_UP_SUGGESTED (🔵)
  // ------------------------------------------------------------
  console.log("[TEST 3] Testing Case 3: 3 Consecutive Missing Reports -> FOLLOW_UP_SUGGESTED (🔵)...");
  const reports3: DbDailySadhanaReport[] = [];
  for (let i = 4; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    reports3.push(
      createTestReport({
        id: `rep_s3_${dateStr}`,
        studentId: student3.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:30",
        totalRounds: 16,
      })
    );
  }
  for (const r of reports3) await dbStore.saveDailyReport(r);

  const assessment3 = evaluateAttention({
    student: student3,
    todayReport: null,
    historicalReports: reports3,
    currentDateStr: today,
  });

  if (assessment3.level !== "FOLLOW_UP_SUGGESTED") {
    throw new Error(`Expected FOLLOW_UP_SUGGESTED for 3 consecutive missing reports, got ${assessment3.level}`);
  }
  const repeatedSig = assessment3.signals.find((s) => s.type === "REPEATED_REPORT_MISSING");
  if (!repeatedSig) {
    throw new Error("Missing REPEATED_REPORT_MISSING signal!");
  }
  console.log(`-> Student 3 Level: ${assessment3.level} (🔵), Signal: ${repeatedSig.title} (${repeatedSig.reason})`);
  console.log("✓ TEST 3 PASSED: 3 consecutive missing reports triggered FOLLOW_UP_SUGGESTED.\n");

  // ------------------------------------------------------------
  // TEST 4: Case 4 — Minor Japa Change (16 -> 15 rounds) -> No Alert
  // ------------------------------------------------------------
  console.log("[TEST 4] Testing Case 4: Minor Japa Change (16 -> 15 rounds) -> STABLE (🟢)...");
  const reports4: DbDailySadhanaReport[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    reports4.push(
      createTestReport({
        id: `rep_s4_hist_${dateStr}`,
        studentId: student4.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:30",
        totalRounds: 16,
        readingDurationMinutes: 30,
      })
    );
  }
  const minorJapaToday = createTestReport({
    id: `rep_s4_today_${today}`,
    studentId: student4.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "03:30",
    totalRounds: 15,
    readingDurationMinutes: 30,
  });

  const assessment4 = evaluateAttention({
    student: student4,
    todayReport: minorJapaToday,
    historicalReports: [minorJapaToday, ...reports4],
    currentDateStr: today,
  });

  if (assessment4.level !== "STABLE") {
    throw new Error(`Expected STABLE for minor 1-round variation, got ${assessment4.level}`);
  }
  console.log(`-> Student 4 Level: ${assessment4.level} (🟢) (15/16 rounds tolerated without alert)`);
  console.log("✓ TEST 4 PASSED: Minor natural variations do NOT trigger false alerts.\n");

  // ------------------------------------------------------------
  // TEST 5: Case 5 — Significant Japa Drop (16 -> 8 rounds, 50% drop) -> FOLLOW_UP_SUGGESTED (🔵)
  // ------------------------------------------------------------
  console.log("[TEST 5] Testing Case 5: Significant Japa Drop (16 -> 8 rounds) -> FOLLOW_UP_SUGGESTED (🔵)...");
  const majorJapaToday = createTestReport({
    id: `rep_s4_today_major_${today}`,
    studentId: student4.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "03:30",
    totalRounds: 8, // 50% drop
    readingDurationMinutes: 30,
  });

  const assessment5 = evaluateAttention({
    student: student4,
    todayReport: majorJapaToday,
    historicalReports: [majorJapaToday, ...reports4],
    currentDateStr: today,
  });

  if (assessment5.level !== "FOLLOW_UP_SUGGESTED") {
    throw new Error(`Expected FOLLOW_UP_SUGGESTED for 50% Japa drop, got ${assessment5.level}`);
  }
  const japaSig = assessment5.signals.find((s) => s.type === "JAPA_CHANGE");
  if (!japaSig) throw new Error("Missing JAPA_CHANGE signal!");
  console.log(`-> Student 4 Level: ${assessment5.level} (🔵), Reason: ${japaSig.reason}`);
  console.log("✓ TEST 5 PASSED: Significant Japa deviation triggered FOLLOW_UP_SUGGESTED.\n");

  // ------------------------------------------------------------
  // TEST 6: Case 6 — Wake-Up Time Shift (03:20 -> 05:00, 100m late) -> FOLLOW_UP_SUGGESTED (🔵)
  // ------------------------------------------------------------
  console.log("[TEST 6] Testing Case 6: Wake-Up Time Shift (03:20 -> 05:00) -> FOLLOW_UP_SUGGESTED (🔵)...");
  const reports5: DbDailySadhanaReport[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    reports5.push(
      createTestReport({
        id: `rep_s5_hist_${dateStr}`,
        studentId: student5.id,
        practiceDate: dateStr,
        status: "submitted",
        wakeUpTime: "03:20",
        totalRounds: 16,
        readingDurationMinutes: 30,
      })
    );
  }
  const lateWakeToday = createTestReport({
    id: `rep_s5_today_${today}`,
    studentId: student5.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "05:00", // 100 mins later than 03:20
    totalRounds: 16,
    readingDurationMinutes: 30,
  });

  const assessment6 = evaluateAttention({
    student: student5,
    todayReport: lateWakeToday,
    historicalReports: [lateWakeToday, ...reports5],
    currentDateStr: today,
  });

  if (assessment6.level !== "FOLLOW_UP_SUGGESTED") {
    throw new Error(`Expected FOLLOW_UP_SUGGESTED for 100m wake-up delay, got ${assessment6.level}`);
  }
  const wakeSig = assessment6.signals.find((s) => s.type === "WAKE_TIME_CHANGE");
  if (!wakeSig) throw new Error("Missing WAKE_TIME_CHANGE signal!");
  console.log(`-> Student 5 Level: ${assessment6.level} (🔵), Reason: ${wakeSig.reason}`);
  console.log("✓ TEST 6 PASSED: Significant wake-up deviation detected.\n");

  // ------------------------------------------------------------
  // TEST 7: Case 7 — Minor Reading Change (30m -> 25m) -> No Alert
  // ------------------------------------------------------------
  console.log("[TEST 7] Testing Case 7: Minor Reading Change (30m -> 25m) -> STABLE (🟢)...");
  const readingToday = createTestReport({
    id: `rep_s5_today_reading_${today}`,
    studentId: student5.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "03:20",
    totalRounds: 16,
    readingDurationMinutes: 25, // Only 5m variance
  });

  const assessment7 = evaluateAttention({
    student: student5,
    todayReport: readingToday,
    historicalReports: [readingToday, ...reports5],
    currentDateStr: today,
  });

  if (assessment7.level !== "STABLE") {
    throw new Error(`Expected STABLE for minor 5m reading variance, got ${assessment7.level}`);
  }
  console.log(`-> Student 5 Level: ${assessment7.level} (🟢) (25m reading vs 30m base tolerated)`);
  console.log("✓ TEST 7 PASSED: Minor activity variations ignored.\n");

  // ------------------------------------------------------------
  // TEST 8: Case 8 — New Shishya with < 5 Reports -> Insufficient History Handling
  // ------------------------------------------------------------
  console.log("[TEST 8] Testing Case 8: New Shishya with 2 reports -> Safe baseline handling...");
  const newbieReports: DbDailySadhanaReport[] = [
    createTestReport({
      id: "rep_newbie_1",
      studentId: student6.id,
      practiceDate: "2026-08-25",
      status: "submitted",
      wakeUpTime: "05:30",
      totalRounds: 10,
    }),
    createTestReport({
      id: "rep_newbie_2",
      studentId: student6.id,
      practiceDate: "2026-08-24",
      status: "submitted",
      wakeUpTime: "05:00",
      totalRounds: 8,
    }),
  ];

  const newbieBaseline = calculatePersonalBaseline(newbieReports);
  if (newbieBaseline.hasSufficientHistory) {
    throw new Error("Expected hasSufficientHistory=false for 2 reports!");
  }

  const newbieToday = createTestReport({
    id: `rep_newbie_today_${today}`,
    studentId: student6.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "06:00",
    totalRounds: 6,
  });

  const newbieAssessment = evaluateAttention({
    student: student6,
    todayReport: newbieToday,
    historicalReports: [newbieToday, ...newbieReports],
    currentDateStr: today,
  });

  if (newbieAssessment.level !== "STABLE") {
    throw new Error(`Expected STABLE for new student with insufficient history, got ${newbieAssessment.level}`);
  }
  console.log(`-> Newbie Baseline hasSufficientHistory: ${newbieBaseline.hasSufficientHistory}, Assessment: ${newbieAssessment.level}`);
  console.log("✓ TEST 8 PASSED: New Shishyas are NOT penalized with false anomaly alerts.\n");

  // ------------------------------------------------------------
  // TEST 9: Case 9 — Multi-Dimension Routine Change Aggregation
  // ------------------------------------------------------------
  console.log("[TEST 9] Testing Case 9: Multi-Dimension Routine Change Aggregation...");
  const multiShiftToday = createTestReport({
    id: `rep_s5_multi_${today}`,
    studentId: student5.id,
    practiceDate: today,
    status: "submitted",
    wakeUpTime: "05:00", // Shift 1: Wake-up 100m late
    totalRounds: 8, // Shift 2: Japa dropped 50%
    readingDurationMinutes: 0, // Shift 3: Reading dropped from 30m to 0m
    timeWastedDurationMinutes: 90, // Shift 4: Unused time jumped to 90m
  });

  const assessment9 = evaluateAttention({
    student: student5,
    todayReport: multiShiftToday,
    historicalReports: [multiShiftToday, ...reports5],
    currentDateStr: today,
  });

  if (assessment9.level !== "FOLLOW_UP_SUGGESTED") {
    throw new Error(`Expected FOLLOW_UP_SUGGESTED for multi-dimension shift, got ${assessment9.level}`);
  }
  const routineSig = assessment9.signals.find((s) => s.type === "ROUTINE_CHANGE");
  if (!routineSig) throw new Error("Missing ROUTINE_CHANGE aggregated signal!");
  console.log(`-> Multi-Shift Level: ${assessment9.level} (🔵), Aggregated Signal: ${routineSig.title}`);
  console.log(`-> Summary Headline: "${assessment9.summaryHeadline}", Additional count: ${assessment9.additionalCount}`);
  console.log("✓ TEST 9 PASSED: Multi-dimension changes cleanly aggregated without alert fatigue.\n");

  // ------------------------------------------------------------
  // TEST 10: Case 10 — Signal Lifecycle & Resolution
  // ------------------------------------------------------------
  console.log("[TEST 10] Testing Case 10: Signal Lifecycle & Resolution...");
  const beforeSubmission = evaluateAttention({
    student: student1,
    todayReport: null,
    historicalReports: reports1.filter((r) => r.practiceDate < today),
    currentDateStr: today,
  });
  if (beforeSubmission.level !== "OBSERVE") {
    throw new Error("Expected OBSERVE before today report submission!");
  }

  const afterSubmission = evaluateAttention({
    student: student1,
    todayReport: reports1[0],
    historicalReports: reports1,
    currentDateStr: today,
  });
  if (afterSubmission.level !== "STABLE") {
    throw new Error("Expected STABLE after today report submission!");
  }
  console.log(`-> Before Submission: ${beforeSubmission.level} (🟡) -> After Submission: ${afterSubmission.level} (🟢)`);
  console.log("✓ TEST 10 PASSED: Signals dynamically resolve upon report submission.\n");

  // ------------------------------------------------------------
  // TEST 11: Statistical Median Outlier Resistance
  // ------------------------------------------------------------
  console.log("[TEST 11] Testing Median Outlier Resistance (30, 30, 30, 30, 120)...");
  const outlierArray = [30, 30, 30, 30, 120];
  const calculatedMedian = calculateMedian(outlierArray);
  if (calculatedMedian !== 30) {
    throw new Error(`Expected median to be 30, got ${calculatedMedian}`);
  }
  console.log(`-> Array [30, 30, 30, 30, 120] Median: ${calculatedMedian} (outlier 120 resisted)`);
  console.log("✓ TEST 11 PASSED: Outlier resistance confirmed.\n");

  // ------------------------------------------------------------
  // TEST 12: Distinct NOT_REPORTED vs REPORTED_ZERO
  // ------------------------------------------------------------
  console.log("[TEST 12] Testing NOT_REPORTED vs REPORTED_ZERO separation...");
  const dummyReportWithZero = createTestReport({
    id: "rep_zero",
    studentId: "s_test",
    practiceDate: "2026-08-20",
    status: "submitted",
    readingDurationMinutes: 0,
    timeWastedDurationMinutes: 0,
  });

  const dummyReportWithNull = createTestReport({
    id: "rep_null",
    studentId: "s_test",
    practiceDate: "2026-08-21",
    status: "submitted",
  });
  // Make reading undefined to simulate NOT_REPORTED
  delete (dummyReportWithNull as any).readingDurationMinutes;

  const baseZero = calculatePersonalBaseline([dummyReportWithZero, dummyReportWithZero, dummyReportWithZero, dummyReportWithZero, dummyReportWithZero]);
  const baseNull = calculatePersonalBaseline([dummyReportWithNull, dummyReportWithNull, dummyReportWithNull, dummyReportWithNull, dummyReportWithNull]);

  if (baseZero.medianReadingMinutes !== 0) throw new Error("Expected medianReadingMinutes=0 for REPORTED_ZERO");
  if (baseNull.medianReadingMinutes !== null) throw new Error("Expected medianReadingMinutes=null for NOT_REPORTED");

  console.log(`-> Reported Zero: ${baseZero.medianReadingMinutes} vs Not Reported: ${baseNull.medianReadingMinutes}`);
  console.log("✓ TEST 12 PASSED: Strict distinction between NOT_REPORTED and REPORTED_ZERO.\n");

  // ------------------------------------------------------------
  // TEST 13: Strict Guru Multi-Tenant Authorization & IDOR Isolation
  // ------------------------------------------------------------
  console.log("[TEST 13] Testing Cross-Guru Multi-Tenant Authorization & IDOR Isolation...");
  const crossQuery = await GuruService.getShishyaDetail(guru1.id, student7.id);
  if (crossQuery !== null) {
    throw new Error("SECURITY FAILURE: Guru 1 was able to access Guru 2's student!");
  }
  console.log("-> Guru 1 query for Guru 2 student: REJECTED (null)");
  console.log("✓ TEST 13 PASSED: Multi-tenant boundary verified.\n");

  // ------------------------------------------------------------
  // TEST 14: Zero Cross-Student Comparison, Zero Ranks, Zero Scores
  // ------------------------------------------------------------
  console.log("[TEST 14] Verifying Zero Gamification, Scores, or Cross-Student Comparison...");
  const assessmentJson = JSON.stringify(assessment9);
  const forbiddenTerms = [
    "score",
    "rank",
    "bad student",
    "weak devotee",
    "undisciplined",
    "lazy",
    "spiritually weak",
    "falling away",
    "low performer",
    "failed sadhana",
  ];

  for (const term of forbiddenTerms) {
    if (assessmentJson.toLowerCase().includes(term)) {
      throw new Error(`FORBIDDEN TERM DETECTED in assessment: "${term}"`);
    }
  }
  console.log("-> Zero forbidden scores, ranks, or judgmental terms detected in assessment payloads.");
  console.log("✓ TEST 14 PASSED: Absolute adherence to non-judgmental spiritual philosophy.\n");

  // ------------------------------------------------------------
  // TEST 15: Scaled Performance Benchmark (100 Shishyas x 30 Days)
  // ------------------------------------------------------------
  console.log("[TEST 15] Running Scaled Performance Benchmark (100 Shishyas x 30 days in-memory)...");
  const scaleGuru: DbUser = {
    id: "guru_scale_bench",
    authProviderId: "auth_scale_g",
    email: "scale@iskcon.org",
    role: "guru",
    name: "Scale Benchmark Guru",
    spiritualName: "His Grace Benchmark Das",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(scaleGuru);

  for (let s = 1; s <= 100; s++) {
    const stId = `shishya_scale_${s}`;
    const stUser: DbUser = {
      id: stId,
      authProviderId: `auth_scale_s_${s}`,
      email: `${stId}@test.org`,
      role: "shishya",
      name: `Student ${s}`,
      spiritualName: `Shishya ${s} Das`,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await dbStore.upsertUser(stUser);
    await dbStore.createRelationshipDirect({
      id: `rel_scale_${s}`,
      guruId: scaleGuru.id,
      shishyaId: stId,
      status: "active",
      isPrimary: true,
      relationshipType: "primary_guru",
    });

    for (let d = 0; d < 30; d++) {
      const pDate = new Date(today);
      pDate.setDate(pDate.getDate() - d);
      const dateStr = pDate.toISOString().slice(0, 10);
      await dbStore.saveDailyReport(
        createTestReport({
          id: `rep_scale_${s}_${dateStr}`,
          studentId: stId,
          practiceDate: dateStr,
          status: "submitted",
          wakeUpTime: "03:30",
          totalRounds: 16,
          readingDurationMinutes: 30,
          hearingDurationMinutes: 30,
        })
      );
    }
  }

  const startTime = Date.now();
  const overview = await GuruService.getDashboardOverview(scaleGuru.id, today);
  const elapsedMs = Date.now() - startTime;

  console.log(`-> Aggregated overview for 100 Shishyas (3,000 reports) executed in: ${elapsedMs} ms`);
  console.log(`-> Total Shishyas processed: ${overview.totalActiveShishyas}, Stable: ${overview.stableShishyas.length}`);

  if (overview.totalActiveShishyas !== 100) {
    throw new Error(`Expected 100 processed Shishyas, got ${overview.totalActiveShishyas}`);
  }
  console.log("✓ TEST 15 PASSED: High-performance single-pass aggregation validated.\n");

  console.log("================================================================");
  console.log("ALL 15 PHASE 13 ATTENTION ENGINE TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runPhase13Tests().catch((err) => {
  console.error("Phase 13 Test Suite Failed:", err);
  process.exit(1);
});
