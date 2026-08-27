import { dbStore } from "../lib/db/store";
import { DbUser } from "../lib/db/schema";
import { InvitationService } from "../lib/invitations/service";
import { reportService } from "../lib/reports/service";
import { calculateSleepDuration, formatDuration } from "../lib/reports/calculations";
import { rateLimiter, RATE_LIMITS } from "../lib/security/rate-limit";
import { getLocalDraft, saveLocalDraft, getSyncStatusMeta } from "../lib/reports/offline";
import { AuditService } from "../lib/audit/service";

async function runHardeningTests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 11.5 PRODUCTION & SECURITY HARDENING TESTS ===");
  console.log("================================================================\n");

  const nowIso = new Date().toISOString();

  // Seed Entities: Guru A, Guru B, Shishya A, Shishya B
  const guruA: DbUser = {
    id: "guru_radheshyam_pune",
    authProviderId: "auth_guru_a",
    role: "guru",
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
    email: "radheshyam.das@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const guruB: DbUser = {
    id: "guru_gauranga_mumbai",
    authProviderId: "auth_guru_b",
    role: "guru",
    name: "His Grace Gouranga Das",
    spiritualName: "Gouranga Das",
    email: "gouranga.das@iskconmumbai.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaA: DbUser = {
    id: "shishya_arjuna_001",
    authProviderId: "auth_shishya_a",
    role: "shishya",
    name: "Arjun Sharma",
    spiritualName: "Arjuna Das",
    email: "arjuna@iskconpune.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const shishyaB: DbUser = {
    id: "shishya_bhima_002",
    authProviderId: "auth_shishya_b",
    role: "shishya",
    name: "Bhim Rao",
    spiritualName: "Bhima Das",
    email: "bhima@iskconmumbai.org",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await dbStore.upsertUser(guruA);
  await dbStore.upsertUser(guruB);
  await dbStore.upsertUser(shishyaA);
  await dbStore.upsertUser(shishyaB);

  // Establish relationships: Guru A -> Shishya A, Guru B -> Shishya B
  await dbStore.createRelationshipDirect({
    id: `rel_${guruA.id}_${shishyaA.id}`,
    guruId: guruA.id,
    shishyaId: shishyaA.id,
    relationshipType: "primary_guru",
    status: "active",
    isPrimary: true,
  });

  await dbStore.createRelationshipDirect({
    id: `rel_${guruB.id}_${shishyaB.id}`,
    guruId: guruB.id,
    shishyaId: shishyaB.id,
    relationshipType: "primary_guru",
    status: "active",
    isPrimary: true,
  });

  // ------------------------------------------------------------
  // TEST 1: Cross-Guru Multi-Tenant Isolation
  // ------------------------------------------------------------
  console.log("[TEST 1] Testing Guru A cannot access Shishya of Guru B...");
  const guruAShishyas = await dbStore.getShishyasByGuru(guruA.id);
  const guruAShishyaIds = guruAShishyas.map((s) => s.shishya.id);
  if (guruAShishyaIds.includes(shishyaB.id)) {
    throw new Error("SECURITY FAILURE: Guru A can see Shishya B!");
  }
  const isConnected = await dbStore.isShishyaConnectedToGuru(guruA.id, shishyaB.id);
  if (isConnected) {
    throw new Error("SECURITY FAILURE: isShishyaConnectedToGuru returned true for unassociated Shishya B!");
  }
  console.log("-> Guru A sees only Shishya A:", guruAShishyaIds);
  console.log("✓ TEST 1 PASSED: Zero cross-Guru data leakage.\n");

  // ------------------------------------------------------------
  // TEST 2: Cross-Shishya Report Isolation
  // ------------------------------------------------------------
  console.log("[TEST 2] Testing Shishya A cannot access Shishya B reports...");
  const reportB = await dbStore.saveDailyReport({
    id: `rep_${shishyaB.id}_2026-08-26`,
    studentId: shishyaB.id,
    practiceDate: "2026-08-26",
    sleepTime: "21:00",
    wakeUpTime: "04:00",
    sleepDurationMinutes: 420,
    japaRounds: 16,
    extraRounds: 0,
    totalRounds: 16,
    readingDurationMinutes: 30,
    hearingDurationMinutes: 45,
    collegeStudyDurationMinutes: 300,
    selfStudyDurationMinutes: 120,
    totalStudyDurationMinutes: 420,
    dayRestDurationMinutes: 0,
    timeWastedDurationMinutes: 0,
    status: "submitted",
    createdAt: nowIso,
    updatedAt: nowIso,
    timezone: "Asia/Kolkata",
  });

  const queryAsShishyaA = await reportService.getReportByIdForStudent(reportB.id, shishyaA.id);
  if (queryAsShishyaA !== null) {
    throw new Error("SECURITY FAILURE: Shishya A was able to read Shishya B's report!");
  }
  console.log("-> Shishya A querying Shishya B report: REJECTED (returned null)");
  console.log("✓ TEST 2 PASSED: Cross-Shishya report isolation verified.\n");

  // ------------------------------------------------------------
  // TEST 3: Expired Invitation Cannot Be Used
  // ------------------------------------------------------------
  console.log("[TEST 3] Testing Expired Invitation Rejection...");
  const expiredInv = await dbStore.createInvitation({
    id: "inv_expired_test_001",
    tokenHash: "token_hash_expired",
    codeHash: "code_hash_expired",
    rawCodeMasked: "NITYA-••••-EXPR",
    createdByUserId: guruA.id,
    intendedRole: "shishya",
    status: "pending",
    expiresAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  });

  const acceptExpired = await dbStore.atomicAcceptInvitation({
    invitationId: expiredInv.id,
    shishya: {
      id: "shishya_new_001",
      authProviderId: "auth_new_1",
      role: "shishya",
      name: "New Devotee",
      email: "new@example.com",
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  });

  if (acceptExpired.success) {
    throw new Error("SECURITY FAILURE: Expired invitation was successfully accepted!");
  }
  console.log("-> Expired invite result:", acceptExpired.error);
  console.log("✓ TEST 3 PASSED: Expired invitation rejected atomically.\n");

  // ------------------------------------------------------------
  // TEST 4: Used Invitation Replay Prevention
  // ------------------------------------------------------------
  console.log("[TEST 4] Testing Used Invitation Replay Prevention...");
  const freshInv = await dbStore.createInvitation({
    id: "inv_fresh_test_002",
    tokenHash: "token_hash_fresh_002",
    codeHash: "code_hash_fresh_002",
    rawCodeMasked: "NITYA-••••-FRE2",
    createdByUserId: guruA.id,
    intendedRole: "shishya",
    status: "pending",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  const devoteeC: DbUser = {
    id: "shishya_devotee_c",
    authProviderId: "auth_devotee_c",
    role: "shishya",
    name: "Devotee C",
    email: "devoteec@example.com",
    status: "active",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const acceptFirstTime = await dbStore.atomicAcceptInvitation({
    invitationId: freshInv.id,
    shishya: devoteeC,
  });

  if (!acceptFirstTime.success) {
    throw new Error(`First acceptance failed: ${acceptFirstTime.error}`);
  }

  // Attempt replay with a different devotee
  const acceptSecondTime = await dbStore.atomicAcceptInvitation({
    invitationId: freshInv.id,
    shishya: {
      id: "shishya_devotee_d",
      authProviderId: "auth_devotee_d",
      role: "shishya",
      name: "Devotee D",
      email: "devoteed@example.com",
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  });

  if (acceptSecondTime.success) {
    throw new Error("SECURITY FAILURE: Single-use invitation was reused!");
  }
  console.log("-> Replay attempt rejected with:", acceptSecondTime.error);
  console.log("✓ TEST 4 PASSED: Single-use invitation strictly enforced.\n");

  // ------------------------------------------------------------
  // TEST 5: Revoked Invitation Rejection
  // ------------------------------------------------------------
  console.log("[TEST 5] Testing Revoked Invitation Rejection...");
  const revokeInv = await dbStore.createInvitation({
    id: "inv_revoke_test_003",
    tokenHash: "token_hash_revoke_003",
    codeHash: "code_hash_revoke_003",
    rawCodeMasked: "NITYA-••••-RVK3",
    createdByUserId: guruA.id,
    intendedRole: "shishya",
    status: "pending",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  await dbStore.revokeInvitation(revokeInv.id, guruA.id);

  const acceptRevoked = await dbStore.atomicAcceptInvitation({
    invitationId: revokeInv.id,
    shishya: {
      id: "shishya_devotee_e",
      authProviderId: "auth_devotee_e",
      role: "shishya",
      name: "Devotee E",
      email: "devoteee@example.com",
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  });

  if (acceptRevoked.success) {
    throw new Error("SECURITY FAILURE: Revoked invitation was accepted!");
  }
  console.log("-> Revoked invite rejected with:", acceptRevoked.error);
  console.log("✓ TEST 5 PASSED: Revoked invitations are invalid.\n");

  // ------------------------------------------------------------
  // TEST 6: Real-world Cross-Midnight Sleep Calculation (Asia/Kolkata)
  // ------------------------------------------------------------
  console.log("[TEST 6] Testing Cross-Midnight Sleep Duration Calculation...");
  // Sleep: 20:45 (8:45 PM) -> Wake: 03:20 (3:20 AM next morning)
  const duration1 = calculateSleepDuration("20:45", "03:20");
  if (duration1 !== 395) {
    throw new Error(`Expected 395 minutes (6h 35m), got ${duration1} minutes`);
  }

  // Sleep: 22:30 -> Wake: 04:00
  const duration2 = calculateSleepDuration("22:30", "04:00");
  if (duration2 !== 330) {
    throw new Error(`Expected 330 minutes (5h 30m), got ${duration2} minutes`);
  }
  console.log("-> 20:45 to 03:20:", formatDuration(duration1), `(${duration1}m)`);
  console.log("-> 22:30 to 04:00:", formatDuration(duration2), `(${duration2}m)`);
  console.log("✓ TEST 6 PASSED: Cross-midnight time calculation is accurate.\n");

  // ------------------------------------------------------------
  // TEST 7: Audit Log Verification
  // ------------------------------------------------------------
  console.log("[TEST 7] Testing Audit Log Recording & Integrity...");
  const allLogs = await AuditService.getAllLogs();
  if (allLogs.length === 0) {
    throw new Error("Audit logs collection is empty!");
  }
  const inviteCreatedLogs = allLogs.filter((l) => l.action === "INVITATION_CREATED");
  const shishyaConnectedLogs = allLogs.filter((l) => l.action === "SHISHYA_CONNECTED");
  const reportLogs = allLogs.filter((l) => l.action.startsWith("REPORT_"));

  if (inviteCreatedLogs.length === 0 || shishyaConnectedLogs.length === 0) {
    throw new Error("Missing expected audit log categories!");
  }
  console.log(`-> Total Recorded Audit Logs: ${allLogs.length}`);
  console.log(`-> INVITATION_CREATED logs: ${inviteCreatedLogs.length}`);
  console.log(`-> SHISHYA_CONNECTED logs: ${shishyaConnectedLogs.length}`);
  console.log(`-> REPORT logs: ${reportLogs.length}`);
  console.log("✓ TEST 7 PASSED: Comprehensive audit trail recorded.\n");

  // ------------------------------------------------------------
  // TEST 8: Sliding Window Rate Limiter
  // ------------------------------------------------------------
  console.log("[TEST 8] Testing Sliding-Window Rate Limiter...");
  rateLimiter.clearAll();
  const testKey = "test_rate_limit_user";
  const limit = 5;
  const windowMs = 1000;

  // Make 5 allowed requests
  for (let i = 0; i < limit; i++) {
    const res = rateLimiter.check(testKey, limit, windowMs);
    if (!res.allowed) {
      throw new Error(`Request ${i + 1} was prematurely blocked!`);
    }
  }

  // 6th request must be blocked
  const blockedRes = rateLimiter.check(testKey, limit, windowMs);
  if (blockedRes.allowed) {
    throw new Error("Rate limiter failed to block request exceeding limit!");
  }
  console.log("-> 6th rapid request blocked correctly (remaining: 0, resetMs > 0)");
  console.log("✓ TEST 8 PASSED: Rate limiter throttles abuse reliably.\n");

  // ------------------------------------------------------------
  // TEST 9: Duplicate Report Constraint
  // ------------------------------------------------------------
  console.log("[TEST 9] Testing Database-Level Duplicate Report Prevention...");
  let duplicateRejected = false;
  try {
    await dbStore.saveDailyReport({
      id: "rep_duplicate_attempt",
      studentId: shishyaB.id,
      practiceDate: "2026-08-26", // already exists for shishyaB
      sleepTime: "22:00",
      wakeUpTime: "04:30",
      sleepDurationMinutes: 390,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 0,
      hearingDurationMinutes: 0,
      collegeStudyDurationMinutes: 0,
      selfStudyDurationMinutes: 0,
      totalStudyDurationMinutes: 0,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 0,
      status: "submitted",
      createdAt: nowIso,
      updatedAt: nowIso,
      timezone: "Asia/Kolkata",
    });
  } catch (err: unknown) {
    duplicateRejected = true;
    console.log("-> Duplicate report caught:", (err as Error).message);
  }

  if (!duplicateRejected) {
    throw new Error("SECURITY FAILURE: Database allowed duplicate report for same student and date!");
  }
  console.log("✓ TEST 9 PASSED: Duplicate report constraint strictly enforced.\n");

  // ------------------------------------------------------------
  // TEST 10: Sync State Metadata Configurations
  // ------------------------------------------------------------
  console.log("[TEST 10] Testing Offline Sync State Metadata...");
  const states = ["saved", "saving", "offline", "pending_sync", "synced", "failed_sync"] as const;
  for (const state of states) {
    const meta = getSyncStatusMeta(state);
    if (!meta.label || !meta.variant || !meta.colorClass) {
      throw new Error(`Sync metadata incomplete for state: ${state}`);
    }
  }
  console.log("-> Verified sync status meta for 6 distinct network states.");
  console.log("✓ TEST 10 PASSED: Sync states provide transparent user feedback.\n");

  console.log("================================================================");
  console.log("ALL 10 PHASE 11.5 PRODUCTION & SECURITY TESTS PASSED PERFECTLY!");
  console.log("================================================================");
}

runHardeningTests().catch((err) => {
  console.error("Hardening test failed:", err);
  process.exit(1);
});
