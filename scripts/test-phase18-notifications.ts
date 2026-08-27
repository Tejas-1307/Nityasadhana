// ============================================================
// NITYASĀDHANĀ — PHASE 18: NOTIFICATION SYSTEM SPECIFICATION TESTS
// ============================================================
// Validates:
// 1. Student Daily Report Reminder (Gentle, short, single daily cap)
// 2. Smart Suppression (Report submission cancels pending reminders)
// 3. Weekly Reflection & Sankalpa Reminders
// 4. Guru Daily Summary (Aggregated 1 notification, zero student spam)
// 5. Guru Follow-Up Reminder (Only for intentionally scheduled dates)
// 6. Quiet Hours Evaluation (Cross-midnight & same-day time checks)
// 7. Notification Preferences (Toggle controls & persistence)
// 8. Idempotency & Duplicate Prevention
// 9. Multi-Tenant Security & Owner Isolation
// 10. Philosophy & Zero Commercial Engagement Patterns
// ============================================================

import { dbStore } from "../lib/db/store";
import { NotificationService } from "../lib/notifications/service";
import { isWithinQuietHours } from "../lib/notifications/quiet-hours";
import { DbDailySadhanaReport } from "../lib/db/schema";

async function runPhase18NotificationTests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 18 NOTIFICATIONS SPECIFICATION TESTS =========");
  console.log("================================================================\n");

  const studentId = "student_test_notif_01";
  const guruId = "guru_test_notif_01";
  const dateStr = "2026-08-27";
  const weekStart = "2026-08-24";

  // ------------------------------------------------------------
  // TEST 1: Student Daily Report Reminder & Idempotency
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Student Daily Report Reminder & Idempotency...");
  const notif1 = await NotificationService.scheduleDailyReportReminder(studentId, dateStr);

  if (!notif1) {
    throw new Error("Failed to create daily report reminder");
  }

  console.log(`-> Created Reminder: Title="${notif1.title}", Priority=${notif1.priority}, Status=${notif1.status}`);
  console.log(`-> Message: "${notif1.message}"`);

  // Idempotency: Attempt to schedule second time for same day & student
  const notif2 = await NotificationService.scheduleDailyReportReminder(studentId, dateStr);
  if (!notif2 || notif2.id !== notif1.id) {
    throw new Error("Idempotency failed: Duplicate notification created for same day!");
  }

  const { total } = await NotificationService.getNotificationsForUser(studentId);
  if (total !== 1) {
    throw new Error(`Expected exactly 1 notification, found ${total}`);
  }
  console.log("✓ TEST 1 PASSED: Daily report reminder created and duplicate prevention verified.");

  // ------------------------------------------------------------
  // TEST 2: Smart Suppression (Report Submission Cancels Reminder)
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Testing Smart Suppression on Daily Report Submission...");
  const suppressed = await NotificationService.suppressDailyReportReminder(studentId, dateStr);
  if (!suppressed) {
    throw new Error("Failed to suppress daily report reminder");
  }

  const updatedNotif = await dbStore.getNotificationByEventKey(`daily_report:${dateStr}:${studentId}`);
  if (!updatedNotif || updatedNotif.status !== "suppressed") {
    throw new Error(`Expected status to be suppressed, got ${updatedNotif?.status}`);
  }
  console.log(`-> Notification Status: ${updatedNotif.status} (Reason: ${updatedNotif.suppressedReason})`);

  // If report is already submitted in database, scheduler returns null
  const dummyReport: DbDailySadhanaReport = {
    id: `rep_${studentId}_${dateStr}`,
    studentId,
    practiceDate: dateStr,
    wakeUpTime: "03:30",
    sleepTime: "21:30",
    sleepDurationMinutes: 360,
    japaRounds: 16,
    extraRounds: 0,
    totalRounds: 16,
    readingDurationMinutes: 30,
    hearingDurationMinutes: 20,
    collegeStudyDurationMinutes: 60,
    selfStudyDurationMinutes: 60,
    totalStudyDurationMinutes: 120,
    dayRestDurationMinutes: 0,
    timeWastedDurationMinutes: 10,
    status: "submitted",
    timezone: "Asia/Kolkata",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.saveDailyReport(dummyReport);

  const shouldBeNull = await NotificationService.scheduleDailyReportReminder(studentId, dateStr);
  if (shouldBeNull && shouldBeNull.status !== "suppressed") {
    throw new Error("Smart suppression failed: Scheduled reminder after report was submitted!");
  }
  console.log("✓ TEST 2 PASSED: Smart suppression verified upon report submission.");

  // ------------------------------------------------------------
  // TEST 3: Weekly Reflection & Sankalpa Reminders
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Testing Weekly Reflection & Sankalpa Reminders...");
  const reflNotif = await NotificationService.scheduleWeeklyReflectionReminder(studentId, weekStart);
  if (!reflNotif) {
    throw new Error("Failed to schedule reflection reminder");
  }
  console.log(`-> Reflection Reminder: "${reflNotif.message}"`);

  // Suppress reflection reminder
  const reflSuppressed = await NotificationService.suppressReflectionReminder(studentId, weekStart);
  if (!reflSuppressed) {
    throw new Error("Failed to suppress reflection reminder");
  }

  const sankalpaNotif = await NotificationService.scheduleSankalpaReminder(
    studentId,
    "sank_01",
    "Maintain consistent morning japa",
    dateStr
  );
  if (!sankalpaNotif) {
    throw new Error("Failed to schedule sankalpa reminder");
  }
  console.log(`-> Sankalpa Reminder: "${sankalpaNotif.message}"`);
  console.log("✓ TEST 3 PASSED: Reflection and Sankalpa reminders verified.");

  // ------------------------------------------------------------
  // TEST 4: Guru Daily Summary Aggregation (Zero Student Spam)
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Testing Guru Daily Summary Aggregation...");
  const guruSummary = await NotificationService.scheduleGuruDailySummary(guruId, dateStr, {
    submitted: 22,
    total: 25,
    followUps: 2,
  });

  if (!guruSummary) {
    throw new Error("Failed to schedule Guru daily summary");
  }
  console.log(`-> Guru Summary Message: "${guruSummary.message}"`);

  const guruNotifs = await NotificationService.getNotificationsForUser(guruId);
  if (guruNotifs.total !== 1) {
    throw new Error(`Expected exactly 1 aggregated summary for Guru, got ${guruNotifs.total}`);
  }
  console.log("✓ TEST 4 PASSED: Guru receives ONE concise aggregated summary.");

  // ------------------------------------------------------------
  // TEST 5: Guru Follow-Up Reminder
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Testing Guru Scheduled Follow-Up Reminder...");
  const followUpNotif = await NotificationService.scheduleGuruFollowUpReminder(
    guruId,
    "fu_001",
    "Arjuna Das",
    dateStr
  );
  if (!followUpNotif) {
    throw new Error("Failed to schedule follow-up reminder");
  }
  console.log(`-> Follow-Up Reminder: "${followUpNotif.message}"`);
  console.log("✓ TEST 5 PASSED: Scheduled follow-up reminder verified.");

  // ------------------------------------------------------------
  // TEST 6: Quiet Hours Cross-Midnight Evaluation
  // ------------------------------------------------------------
  console.log("\n[TEST 6] Testing Quiet Hours Evaluator...");
  // Standard 21:00 (9:00 PM) -> 05:00 (5:00 AM)
  const is2200Quiet = isWithinQuietHours("22:00", "21:00", "05:00");
  const is0330Quiet = isWithinQuietHours("03:30", "21:00", "05:00");
  const is1400Quiet = isWithinQuietHours("14:00", "21:00", "05:00");

  console.log(`-> 22:00 in 21:00-05:00: ${is2200Quiet} (Expected: true)`);
  console.log(`-> 03:30 in 21:00-05:00: ${is0330Quiet} (Expected: true)`);
  console.log(`-> 14:00 in 21:00-05:00: ${is1400Quiet} (Expected: false)`);

  if (!is2200Quiet || !is0330Quiet || is1400Quiet) {
    throw new Error("Quiet hours cross-midnight evaluation failed");
  }

  // Daytime 13:00 -> 16:00
  const is1400DayQuiet = isWithinQuietHours("14:00", "13:00", "16:00");
  const is1700DayQuiet = isWithinQuietHours("17:00", "13:00", "16:00");

  if (!is1400DayQuiet || is1700DayQuiet) {
    throw new Error("Quiet hours daytime evaluation failed");
  }
  console.log("✓ TEST 6 PASSED: Quiet hours evaluation verified across midnight and daytime.");

  // ------------------------------------------------------------
  // TEST 7: Notification Preferences & Disabling
  // ------------------------------------------------------------
  console.log("\n[TEST 7] Testing Notification Preferences & Toggling...");
  await NotificationService.updatePreferences(studentId, {
    dailyReportReminder: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
  });

  const updatedPrefs = await NotificationService.getPreferences(studentId);
  if (updatedPrefs.dailyReportReminder !== false || updatedPrefs.quietHoursStart !== "22:00") {
    throw new Error("Preferences update failed");
  }

  // Attempt to schedule daily reminder when disabled
  const disabledAttempt = await NotificationService.scheduleDailyReportReminder(studentId, "2026-08-28");
  if (disabledAttempt !== null) {
    throw new Error("Notification was generated despite preference being disabled!");
  }
  console.log("✓ TEST 7 PASSED: Preferences respected; disabled categories return null.");

  // ------------------------------------------------------------
  // TEST 8: Multi-Tenant Security & Owner-Only Isolation
  // ------------------------------------------------------------
  console.log("\n[TEST 8] Testing Multi-Tenant Security Isolation...");
  const otherUserNotifs = await NotificationService.getNotificationsForUser("intruder_user_999");
  if (otherUserNotifs.total !== 0) {
    throw new Error("SECURITY LEAK: User accessed another user's notifications!");
  }

  const markOtherResult = await NotificationService.markAsRead(sankalpaNotif.id, "intruder_user_999");
  if (markOtherResult !== false) {
    throw new Error("SECURITY LEAK: User was able to mark another user's notification as read!");
  }
  console.log("✓ TEST 8 PASSED: Multi-tenant notification isolation confirmed.");

  // ------------------------------------------------------------
  // TEST 9: Philosophy Check (Zero Gamification / Urgency)
  // ------------------------------------------------------------
  console.log("\n[TEST 9] Verifying Philosophy & Forbidden Terms...");
  const testPayloads = [
    notif1.message,
    reflNotif.message,
    sankalpaNotif.message,
    guruSummary.message,
    followUpNotif.message,
  ].join(" ").toLowerCase();

  const forbidden = [
    "urgent",
    "streak",
    "🔥",
    "falling behind",
    "don't miss out",
    "don't break",
    "missed your sadhana",
    "failing",
    "late",
    "lazy",
    "undisciplined",
    "bad devotee",
    "weak devotee",
  ];

  for (const word of forbidden) {
    if (testPayloads.includes(word)) {
      throw new Error(`PHILOSOPHY VIOLATION: Forbidden term '${word}' found in notification copy!`);
    }
  }
  console.log("✓ TEST 9 PASSED: Absolute adherence to calm, non-judgmental spiritual tone.");

  console.log("\n================================================================");
  console.log("ALL 9 PHASE 18 NOTIFICATION TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runPhase18NotificationTests().catch((err) => {
  console.error("Phase 18 Notification Tests Failed:", err);
  process.exit(1);
});
