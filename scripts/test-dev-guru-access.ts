// ============================================================
// NITYASĀDHANĀ — DEVELOPMENT GURU ACCESS SPECIFICATION TESTS
// ============================================================
// Validates:
// 1. Development Guru provisioning & role recognition
// 2. Clearly labeled test Shishyas created in development
// 3. Sādhanā reports and attention signals populated for Guru testing
// 4. Guru Dashboard overview, Shishya list, and Student profile integration
// 5. Production safety verification (Zero test data or bypass in production)
// ============================================================

import { ensureDevGuruProvisioned } from "../lib/db/dev-seeder";
import { GuruService } from "../lib/guru/service";
import { InvitationService } from "../lib/invitations/service";

async function runDevGuruAccessTests() {
  console.log("================================================================");
  console.log("=== RUNNING DEV GURU TEST ACCESS SPECIFICATION TESTS ===========");
  console.log("================================================================\n");

  const devGuruId = "user_dev_guru_clerk_123";
  const devGuruEmail = "radheshyam.das@iskconpune.org";

  // ------------------------------------------------------------
  // TEST 1: Provision Development Guru
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Development Guru Provisioning...");
  const guruUser = await ensureDevGuruProvisioned({
    id: devGuruId,
    email: devGuruEmail,
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
  });

  if (!guruUser || guruUser.role !== "guru") {
    throw new Error("Failed to provision dev guru user");
  }

  console.log(`-> Provisioned Guru: ID=${guruUser.id}, Role=${guruUser.role}, Email=${guruUser.email}`);
  console.log("✓ TEST 1 PASSED: Development Guru provisioned with role GURU.");

  // ------------------------------------------------------------
  // TEST 2: Verify Guru Dashboard Overview & Connected Shishyas
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Testing Development Test Shishyas & Attention States...");
  const overview = await GuruService.getDashboardOverview(devGuruId);

  console.log(`-> Total Active Shishyas: ${overview.totalActiveShishyas}`);
  console.log(`-> Today Submitted: ${overview.todayStats.submittedCount}`);
  console.log(`-> Today Not Submitted: ${overview.todayStats.notSubmittedCount}`);
  console.log(`-> Attention Shishyas: ${overview.attentionShishyas.length}`);
  console.log(`-> Stable Shishyas: ${overview.stableShishyas.length}`);

  if (overview.totalActiveShishyas !== 4) {
    throw new Error(`Expected 4 dev test shishyas, got ${overview.totalActiveShishyas}`);
  }

  overview.allShishyas.forEach((s) => {
    console.log(`   - ${s.shishya.spiritualName || s.shishya.name} (Level: ${s.attentionLevel})`);
  });

  const hasStable = overview.allShishyas.some((s) => s.attentionLevel === "STABLE");
  const hasObserve = overview.allShishyas.some((s) => s.attentionLevel === "OBSERVE");
  const hasFollowUp = overview.allShishyas.some((s) => s.attentionLevel === "FOLLOW_UP_SUGGESTED");

  if (!hasStable || !hasObserve || !hasFollowUp) {
    throw new Error("Expected sample Shishyas across all attention levels (Stable, Observe, Follow-up)");
  }
  console.log("✓ TEST 2 PASSED: Test Shishyas populated across all attention levels.");

  // ------------------------------------------------------------
  // TEST 3: Verify Individual Shishya Profile & Sankalpa / Reflection
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Testing Individual Shishya Profile for Dev Guru...");
  const arjunaItem = overview.allShishyas.find((s) => s.shishya.name === "Arjun Sharma") || overview.allShishyas[0];
  const targetShishyaId = arjunaItem.shishya.id;
  const detail = await GuruService.getShishyaDetail(devGuruId, targetShishyaId);

  if (!detail) {
    throw new Error("Failed to load shishya detail");
  }

  console.log(`-> Shishya: ${detail.shishya.spiritualName}`);
  console.log(`-> 7-Day Trend Points: ${detail.sevenDayTrend.length}`);
  console.log(`-> 30-Day Trend Points: ${detail.thirtyDayTrend.length}`);
  console.log(`-> Active Sankalpa: ${detail.activeSankalpa?.title || "None"}`);
  console.log(`-> Latest Reflection: State=${detail.latestReflection?.state || "None"}`);
  console.log(`-> Follow-ups Count: ${detail.followUps.length}`);
  console.log(`-> Private Notes Count: ${detail.privateNotes.length}`);

  if (detail.sevenDayTrend.length !== 7 || detail.thirtyDayTrend.length !== 30) {
    throw new Error("Trend length mismatch");
  }
  if (!detail.activeSankalpa) {
    throw new Error("Expected active Sankalpa for student 1");
  }
  if (!detail.latestReflection) {
    throw new Error("Expected latest Reflection for student 1");
  }
  console.log("✓ TEST 3 PASSED: Student Profile completely functional with rich test data.");

  // ------------------------------------------------------------
  // TEST 4: Production Safety Verification
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Verifying Production Safety Guardrails...");
  const originalEnv = process.env.NODE_ENV;
  const originalAppEnv = process.env.NEXT_PUBLIC_APP_ENV;

  try {
    // @ts-expect-error mutating for testing
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_APP_ENV = "production";

    const prodResult = await ensureDevGuruProvisioned({
      id: "malicious_prod_user",
      email: "intruder@external.com",
      name: "Intruder",
    });

    if (prodResult !== null) {
      throw new Error("CRITICAL SECURITY VULNERABILITY: Dev seeder ran in simulated production!");
    }
    console.log("-> Production safety check: Dev seeder rejected in production mode.");
  } finally {
    // @ts-expect-error restoring
    process.env.NODE_ENV = originalEnv;
    process.env.NEXT_PUBLIC_APP_ENV = originalAppEnv;
  }
  // ------------------------------------------------------------
  // TEST 5: Verify Common Development Invite Codes
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Testing Common Development Invite Codes...");
  const val1 = await InvitationService.validateInvitationSecret("NITYA-7K4P-X9QM");
  const val2 = await InvitationService.validateInvitationSecret("NITYA-GURU-2026");

  if (!val1.isValid || !val2.isValid) {
    throw new Error(`Common dev invite code validation failed: val1=${val1.isValid}, val2=${val2.isValid}`);
  }

  console.log(`-> Verified Code 'NITYA-7K4P-X9QM' -> Guru: ${val1.guruName}, Valid: ${val1.isValid}`);
  console.log(`-> Verified Code 'NITYA-GURU-2026' -> Guru: ${val2.guruName}, Valid: ${val2.isValid}`);
  console.log("✓ TEST 5 PASSED: Common development invite codes are active and valid.");

  console.log("\n================================================================");
  console.log("ALL 5 DEV GURU ACCESS TESTS PASSED WITH 100% SUCCESS!");
  console.log("================================================================\n");
}

runDevGuruAccessTests().catch((err) => {
  console.error("Dev Guru Access Tests Failed:", err);
  process.exit(1);
});
