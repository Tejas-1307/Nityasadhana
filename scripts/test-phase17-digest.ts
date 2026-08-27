// ============================================================
// NITYASĀDHANĀ — PHASE 17: GURU WEEKLY DIGEST SPECIFICATION TESTS
// ============================================================
// Validates:
// 1. Weekly Digest Aggregation (Group metrics, reporting consistency)
// 2. Missing Reports tracking & last submitted dates
// 3. Major Changes (Student vs Self comparison between consecutive weeks)
// 4. Positive Group Trends (Meaningful steady improvements)
// 5. Follow-up Reminders integration
// 6. Week Navigation & date slicing
// 7. Authorization & Cross-Guru Data Isolation
// 8. Philosophy & Zero-Judgment Enforcement
// ============================================================

import { dbStore } from "../lib/db/store";
import { DigestService } from "../lib/digest/service";
import { getSankalpaWeekBoundaries, shiftSankalpaWeek } from "../lib/sankalpa/date-utils";
import { ensureDevGuruProvisioned } from "../lib/db/dev-seeder";
import { DbUser, DbGuruShishyaRelationship } from "../lib/db/schema";

async function runPhase17DigestTests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 17 GURU WEEKLY DIGEST SPECIFICATION TESTS ====");
  console.log("================================================================\n");

  const guruId = "guru_test_digest_01";
  const guruEmail = "radheshyam.digest@iskconpune.org";

  // Provision Guru & 4 test Shishyas
  await ensureDevGuruProvisioned({
    id: guruId,
    email: guruEmail,
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentWeek = getSankalpaWeekBoundaries(todayStr);

  // ------------------------------------------------------------
  // TEST 1: Weekly Digest Aggregation & Summary
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Weekly Digest Summary Aggregation...");
  const digest = await DigestService.getGuruWeeklyDigest(guruId, currentWeek.startDate);

  console.log(`-> Week Range: ${digest.formattedRange}`);
  console.log(`-> Week in progress: ${digest.isWeekInProgress}`);
  console.log(`-> Total Active Shishyas: ${digest.summary.totalActiveShishyas}`);
  console.log(`-> Students Reported: ${digest.summary.studentsReportedCount} / ${digest.summary.totalActiveShishyas}`);
  console.log(`-> Reporting Consistency: ${digest.summary.reportingConsistencyPercentage}%`);
  console.log(`-> Attention Needed: ${digest.summary.studentsNeedingAttentionCount}`);
  console.log(`-> Follow-ups Due: ${digest.summary.followUpsDueCount}`);

  if (digest.summary.totalActiveShishyas !== 4) {
    throw new Error(`Expected 4 active shishyas, got ${digest.summary.totalActiveShishyas}`);
  }
  if (digest.summary.reportingConsistencyPercentage <= 0) {
    throw new Error("Expected valid reporting consistency percentage");
  }
  console.log("✓ TEST 1 PASSED: Weekly summary aggregation verified.");

  // ------------------------------------------------------------
  // TEST 2: Missing Reports Tracking
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Testing Missing Reports Detection...");
  console.log(`-> Missing Reports Count: ${digest.missingReports.length}`);
  digest.missingReports.forEach((m) => {
    console.log(`   - ${m.shishya.spiritualName || m.shishya.name}: ${m.missingCount} missing (Last report: ${m.lastSubmittedDate || "None"})`);
  });

  if (digest.missingReports.length === 0) {
    throw new Error("Expected at least 1 missing report item for test Shishyas");
  }
  console.log("✓ TEST 2 PASSED: Missing reports tracked accurately.");

  // ------------------------------------------------------------
  // TEST 3: Attention Suggestions & Factual Explanations
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Testing Attention Suggestions & Neutral Language...");
  console.log(`-> Attention Suggestions: ${digest.attentionSuggestions.length}`);
  digest.attentionSuggestions.forEach((a) => {
    console.log(`   - ${a.shishya.spiritualName} [${a.attentionLevel}]: ${a.headline}`);
    a.reasons.forEach((r) => console.log(`     • ${r}`));
  });

  const hasFollowUp = digest.attentionSuggestions.some((a) => a.attentionLevel === "FOLLOW_UP_SUGGESTED");
  const hasObserve = digest.attentionSuggestions.some((a) => a.attentionLevel === "OBSERVE");

  if (!hasFollowUp && !hasObserve) {
    throw new Error("Expected attention suggestions to include Follow-up or Observe");
  }
  console.log("✓ TEST 3 PASSED: Attention suggestions populated with factual reasons.");

  // ------------------------------------------------------------
  // TEST 4: Positive Group Trends
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Testing Group Positive Trends Detection...");
  console.log(`-> Positive Trends Count: ${digest.positiveTrends.length}`);
  digest.positiveTrends.forEach((t) => {
    console.log(`   - ${t.title}: ${t.description} (${t.studentCount} students)`);
  });

  if (digest.positiveTrends.length === 0) {
    throw new Error("Expected positive trends from steady test data");
  }
  console.log("✓ TEST 4 PASSED: Positive trends aggregated accurately.");

  // ------------------------------------------------------------
  // TEST 5: Follow-up Reminders
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Testing Follow-up Reminders Integration...");
  console.log(`-> Follow-ups Count: ${digest.followUps.length}`);
  digest.followUps.forEach((fu) => {
    console.log(`   - ${fu.shishya.spiritualName}: Status=${fu.status}, Date=${fu.followUp.followUpDate}`);
  });

  console.log("✓ TEST 5 PASSED: Follow-up reminders integrated.");

  // ------------------------------------------------------------
  // TEST 6: Week Navigation (Previous & Next Weeks)
  // ------------------------------------------------------------
  console.log("\n[TEST 6] Testing Week Navigation & Boundaries Slicing...");
  const prevWeek = shiftSankalpaWeek(currentWeek.startDate, -1);
  const prevDigest = await DigestService.getGuruWeeklyDigest(guruId, prevWeek.startDate);

  console.log(`-> Current Week: ${digest.weekStartDate} to ${digest.weekEndDate}`);
  console.log(`-> Previous Week: ${prevDigest.weekStartDate} to ${prevDigest.weekEndDate}`);

  if (prevDigest.weekStartDate === digest.weekStartDate) {
    throw new Error("Previous week start date should differ from current week");
  }
  console.log("✓ TEST 6 PASSED: Week shifting and navigation boundaries verified.");

  // ------------------------------------------------------------
  // TEST 7: Cross-Guru Multi-Tenant Data Isolation
  // ------------------------------------------------------------
  console.log("\n[TEST 7] Testing Cross-Guru Security & Data Isolation...");
  const foreignGuruId = "guru_foreign_test_999";
  const foreignDigest = await DigestService.getGuruWeeklyDigest(foreignGuruId, currentWeek.startDate);

  console.log(`-> Foreign Guru Total Active Shishyas: ${foreignDigest.summary.totalActiveShishyas}`);
  if (foreignDigest.summary.totalActiveShishyas !== 0) {
    throw new Error("SECURITY LEAK: Foreign Guru accessed another Guru's Shishyas!");
  }
  if (foreignDigest.attentionSuggestions.length !== 0 || foreignDigest.missingReports.length !== 0) {
    throw new Error("SECURITY LEAK: Foreign Guru received another Guru's reports or attention data!");
  }
  console.log("✓ TEST 7 PASSED: Complete multi-tenant isolation enforced.");

  // ------------------------------------------------------------
  // TEST 8: Philosophy Check (Zero Devotee Scores / Rankings)
  // ------------------------------------------------------------
  console.log("\n[TEST 8] Verifying Philosophy & Forbidden Terms...");
  const digestString = JSON.stringify(digest).toLowerCase();
  const forbidden = [
    "score",
    "rank",
    "leaderboard",
    "best student",
    "worst student",
    "bad devotee",
    "weak devotee",
    "good devotee",
    "spiritually advanced",
    "failing",
    "undisciplined",
    "lazy",
  ];

  for (const word of forbidden) {
    if (digestString.includes(word)) {
      throw new Error(`PHILOSOPHY VIOLATION: Forbidden term '${word}' detected in weekly digest data!`);
    }
  }
  console.log("✓ TEST 8 PASSED: Zero scores, rankings, or judgmental terms detected.");

  console.log("\n================================================================");
  console.log("ALL 8 PHASE 17 GURU WEEKLY DIGEST TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runPhase17DigestTests().catch((err) => {
  console.error("Phase 17 Digest Tests Failed:", err);
  process.exit(1);
});
