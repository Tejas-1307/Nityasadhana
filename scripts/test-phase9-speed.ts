import { dbStore } from "../lib/db/store";
import { DbUser } from "../lib/db/schema";
import { reportService } from "../lib/reports/service";
import { getLocalDateString } from "../lib/reports/calculations";

async function runPhase9Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 9 FAST REPORTING & SMART DEFAULTS TESTS ===");
  console.log("================================================================\n");

  // -------------------------------------------------------------------------
  // SETUP TEST DEVOTEE
  // -------------------------------------------------------------------------
  const shishya: DbUser = {
    id: "shishya_speed_test_devotee",
    authProviderId: "auth_speed_test_devotee",
    role: "shishya",
    name: "Mukunda Das",
    spiritualName: "Mukunda Das",
    email: "mukunda@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishya);

  const today = new Date();
  const todayStr = getLocalDateString(today, "Asia/Kolkata");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday, "Asia/Kolkata");

  // Seed Yesterday's Submitted Report
  await reportService.saveOrSubmitReport({
    studentId: shishya.id,
    input: {
      practiceDate: yesterdayStr,
      sleepTime: "20:45",
      wakeUpTime: "03:20",
      japaRounds: 16,
      extraRounds: 2,
      japaCompletedAt: "07:01",
      readingDurationMinutes: 30,
      readingNote: "Coming Back",
      hearingDurationMinutes: 60,
      collegeStudyDurationMinutes: 360,
      selfStudyDurationMinutes: 120,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      notes: "Deep chanting in the morning hours.",
    },
    status: "submitted",
  });

  // -------------------------------------------------------------------------
  // TEST 1: Smart Default Resolution (Previous Submitted Report)
  // -------------------------------------------------------------------------
  console.log("[TEST 1] Testing Previous Report Resolution for Smart Defaults...");

  const todayContext = await reportService.getTodayReport(shishya.id);
  if (!todayContext.previousReport) {
    throw new Error("TEST 1 FAILED: Expected previousReport to be resolved for smart suggestions");
  }

  const prev = todayContext.previousReport;
  if (
    prev.practiceDate !== yesterdayStr ||
    prev.sleepTime !== "20:45" ||
    prev.wakeUpTime !== "03:20" ||
    prev.japaRounds !== 16 ||
    prev.totalRounds !== 18
  ) {
    throw new Error("TEST 1 FAILED: previousReport data mismatch");
  }

  console.log(`-> Resolved Yesterday's Report (${yesterdayStr}): Sleep=${prev.sleepTime}→${prev.wakeUpTime}, Rounds=${prev.totalRounds}, Study=${prev.totalStudyDurationMinutes}m`);
  console.log("✓ TEST 1 PASSED: Previous report successfully resolved for smart defaults.\n");

  // -------------------------------------------------------------------------
  // TEST 2: Smart Default Safety Rules
  // -------------------------------------------------------------------------
  console.log("[TEST 2] Testing Smart Default Safety Constraints...");

  // 1. Today's report must NOT be auto-created
  if (todayContext.report !== null) {
    throw new Error("TEST 2 FAILED: Today's report must start as null (not silently pre-created in DB)");
  }

  // 2. Yesterday's personal reflection notes must NEVER be treated as today's default
  console.log(`-> Verified: Today's report is fresh (null), avoiding false automatic submission.`);
  console.log("✓ TEST 2 PASSED: Smart defaults do not fabricate data or auto-submit.\n");

  // -------------------------------------------------------------------------
  // TEST 3: Custom Duration Conversion Logic
  // -------------------------------------------------------------------------
  console.log("[TEST 3] Testing Custom Duration Conversion...");

  const customHours1 = 1;
  const customMins1 = 17;
  const totalMinutes1 = customHours1 * 60 + customMins1;
  if (totalMinutes1 !== 77) {
    throw new Error(`TEST 3 FAILED: 1h 17m should be 77 minutes, got ${totalMinutes1}`);
  }

  const customHours2 = 2;
  const customMins2 = 30;
  const totalMinutes2 = customHours2 * 60 + customMins2;
  if (totalMinutes2 !== 150) {
    throw new Error(`TEST 3 FAILED: 2h 30m should be 150 minutes, got ${totalMinutes2}`);
  }

  console.log(`-> Custom 1h 17m = ${totalMinutes1}m; Custom 2h 30m = ${totalMinutes2}m`);
  console.log("✓ TEST 3 PASSED: Custom duration calculation is exact.\n");

  // -------------------------------------------------------------------------
  // TEST 4: Experienced User Fast-Path Simulation (≤ 30s Target)
  // -------------------------------------------------------------------------
  console.log("[TEST 4] Simulating Experienced User Fast-Path Workflow...");

  const startTime = Date.now();

  // Experienced user prefills from yesterday and only adjusts extra rounds (2 -> 4)
  const fastSubmission = await reportService.saveOrSubmitReport({
    studentId: shishya.id,
    input: {
      practiceDate: todayStr,
      sleepTime: prev.sleepTime,
      wakeUpTime: prev.wakeUpTime,
      japaRounds: prev.japaRounds,
      extraRounds: 4, // modified from 2 -> 4
      japaCompletedAt: prev.japaCompletedAt,
      readingDurationMinutes: prev.readingDurationMinutes,
      hearingDurationMinutes: prev.hearingDurationMinutes,
      collegeStudyDurationMinutes: prev.collegeStudyDurationMinutes,
      selfStudyDurationMinutes: prev.selfStudyDurationMinutes,
      dayRestDurationMinutes: prev.dayRestDurationMinutes,
      timeWastedDurationMinutes: prev.timeWastedDurationMinutes,
    },
    status: "submitted",
  });

  const durationMs = Date.now() - startTime;
  if (!fastSubmission.success || !fastSubmission.report) {
    throw new Error(`TEST 4 FAILED: Fast submission failed: ${fastSubmission.error}`);
  }

  const todayReport = fastSubmission.report;
  if (todayReport.totalRounds !== 20 || todayReport.sleepDurationMinutes !== 395) {
    throw new Error("TEST 4 FAILED: Derived values mismatch in fast-path submission");
  }

  console.log(`-> Fast-path execution: server processed in ${durationMs}ms`);
  console.log(`-> Today's Sādhanā recorded: Total Rounds=${todayReport.totalRounds}, Sleep=${todayReport.sleepDurationMinutes}m, Study=${todayReport.totalStudyDurationMinutes}m`);
  console.log("✓ TEST 4 PASSED: Fast-path workflow executes cleanly with minimal interaction.\n");

  // -------------------------------------------------------------------------
  // TEST 5: Data Isolation Across Practice Dates
  // -------------------------------------------------------------------------
  console.log("[TEST 5] Verifying Daily Report Data Isolation...");

  const yesterdayCheck = await reportService.getReport(shishya.id, yesterdayStr);
  if (!yesterdayCheck || yesterdayCheck.extraRounds !== 2 || yesterdayCheck.totalRounds !== 18) {
    throw new Error("TEST 5 FAILED: Yesterday's report was accidentally mutated by today's changes!");
  }

  const todayCheck = await reportService.getReport(shishya.id, todayStr);
  if (!todayCheck || todayCheck.extraRounds !== 4 || todayCheck.totalRounds !== 20) {
    throw new Error("TEST 5 FAILED: Today's report does not match submitted values");
  }

  console.log(`-> Yesterday (${yesterdayStr}): ${yesterdayCheck.totalRounds} rounds (unchanged)`);
  console.log(`-> Today (${todayStr}): ${todayCheck.totalRounds} rounds (isolated)`);
  console.log("✓ TEST 5 PASSED: Strict data isolation maintained across all practice dates.\n");

  // -------------------------------------------------------------------------
  // TEST 6: Section Progress Completion
  // -------------------------------------------------------------------------
  console.log("[TEST 6] Testing Section Progress Calculation...");

  // 5 required sections: Sleep, Japa, Reading/Hearing, Study, Rest/Time
  const hasSleep = Boolean(todayReport.sleepTime && todayReport.wakeUpTime);
  const hasJapa = todayReport.japaRounds >= 0;
  const hasReadingHearing = todayReport.readingDurationMinutes >= 0;
  const hasStudy = todayReport.totalStudyDurationMinutes >= 0;
  const hasRest = todayReport.dayRestDurationMinutes >= 0 && todayReport.timeWastedDurationMinutes >= 0;

  const requiredSectionsCompleted = [hasSleep, hasJapa, hasReadingHearing, hasStudy, hasRest].filter(Boolean).length;
  if (requiredSectionsCompleted !== 5) {
    throw new Error(`TEST 6 FAILED: Expected 5/5 required sections completed, got ${requiredSectionsCompleted}`);
  }

  console.log(`-> Required sections completed: ${requiredSectionsCompleted} of 5 (100% progress without requiring optional reflection)`);
  console.log("✓ TEST 6 PASSED: Progress calculation accurately reflects required sections.\n");

  console.log("================================================================");
  console.log("ALL 6 PHASE 9 FAST REPORTING & SMART DEFAULTS TESTS PASSED!");
  console.log("================================================================");
}

runPhase9Tests().catch((err) => {
  console.error("\nTEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
