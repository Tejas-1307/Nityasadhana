import { dbStore } from "../lib/db/store";
import { InvitationService } from "../lib/invitations/service";
import { hashInvitationSecret } from "../lib/invitations/crypto";
import { DbUser } from "../lib/db/schema";

async function runTests() {
  console.log("=== RUNNING PHASE 5 INVITATION SECURITY TESTS ===\n");

  // Mock Guru
  const testGuru: DbUser = {
    id: "guru_radheshyam_das",
    authProviderId: "auth_guru_001",
    role: "guru",
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
    email: "radheshyam.das@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(testGuru);

  // Mock Shishya A
  const shishyaA: DbUser = {
    id: "shishya_arjuna_01",
    authProviderId: "auth_shishya_001",
    role: "shishya",
    name: "Arjun Das",
    spiritualName: "Arjuna Das",
    email: "arjun@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock Shishya B
  const shishyaB: DbUser = {
    id: "shishya_bhima_02",
    authProviderId: "auth_shishya_002",
    role: "shishya",
    name: "Bhim Das",
    spiritualName: "Bhima Das",
    email: "bhim@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // TEST 1: Guru Creates Invitation
  console.log("[TEST 1] Guru Creates Invitation...");
  const invite = await InvitationService.createGuruInvitation(testGuru);
  console.log("-> Created Invite:", {
    id: invite.invitationId,
    code: invite.rawCode,
    masked: invite.rawCodeMasked,
    expiresAt: invite.expiresAt,
  });
  if (!invite.rawCode.startsWith("NITYA-")) throw new Error("TEST 1 FAILED: Code format invalid");
  console.log("✓ TEST 1 PASSED: Guru created invitation successfully.\n");

  // TEST 2: Verify Raw Secret is NOT in Database (One-Way Hashing)
  console.log("[TEST 2] Verify Database Hashes (Zero Raw Secret Leak)...");
  const storedInv = await dbStore.getInvitationById(invite.invitationId);
  if (!storedInv) throw new Error("TEST 2 FAILED: Invitation not in database");
  if (storedInv.tokenHash === invite.rawToken) throw new Error("TEST 2 FAILED: Raw token stored in plaintext!");
  if (storedInv.codeHash === invite.rawCode) throw new Error("TEST 2 FAILED: Raw code stored in plaintext!");
  console.log("-> Stored tokenHash (SHA-256):", storedInv.tokenHash);
  console.log("-> Stored codeHash (SHA-256):", storedInv.codeHash);
  console.log("✓ TEST 2 PASSED: Database only stores SHA-256 hashes.\n");

  // TEST 3: Validate Invitation Secret by URL Token & Readable Code
  console.log("[TEST 3] Validate Secret (Token & Readable Code)...");
  const valToken = await InvitationService.validateInvitationSecret(invite.rawToken);
  const valCode = await InvitationService.validateInvitationSecret(invite.rawCode);
  if (!valToken.isValid || valToken.guruName !== "Radheshyam Das") throw new Error("TEST 3 FAILED: Token validation failed");
  if (!valCode.isValid || valCode.guruName !== "Radheshyam Das") throw new Error("TEST 3 FAILED: Code validation failed");
  console.log("✓ TEST 3 PASSED: Both 256-bit token and readable code resolve valid Guru.\n");

  // TEST 4: Atomic Acceptance by Shishya A
  console.log("[TEST 4] Shishya A Accepts Invitation...");
  const acceptResultA = await InvitationService.acceptInvitation({
    secret: invite.rawToken,
    shishya: shishyaA,
  });
  if (!acceptResultA.success || acceptResultA.guruName !== "Radheshyam Das") {
    throw new Error("TEST 4 FAILED: Acceptance failed: " + acceptResultA.error);
  }
  const relCheck = await dbStore.getGuruByShishya(shishyaA.id);
  if (!relCheck || relCheck.guru.id !== testGuru.id) throw new Error("TEST 4 FAILED: Relationship not established");
  console.log("-> Shishya A Connected to Guru:", relCheck.guru.name);
  console.log("✓ TEST 4 PASSED: Shishya A accepted and relationship established.\n");

  // TEST 5: One-Time Usage (Shishya B attempts same invitation)
  console.log("[TEST 5] Single-Use Enforcement (Shishya B attempts used invitation)...");
  const acceptResultB = await InvitationService.acceptInvitation({
    secret: invite.rawToken,
    shishya: shishyaB,
  });
  if (acceptResultB.success) throw new Error("TEST 5 FAILED: Duplicate acceptance succeeded!");
  console.log("-> Rejected with reason:", acceptResultB.error);
  console.log("✓ TEST 5 PASSED: Reused invitation strictly rejected.\n");

  // TEST 6: Shishya Already Connected Attempting Another Guru
  console.log("[TEST 6] Shishya Already Connected (Attempting 2nd Guru)...");
  const secondGuru: DbUser = {
    id: "guru_gouranga_02",
    authProviderId: "auth_guru_002",
    role: "guru",
    name: "His Grace Gouranga Das",
    email: "gouranga.das@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(secondGuru);
  const secondInvite = await InvitationService.createGuruInvitation(secondGuru);
  const reassignResult = await InvitationService.acceptInvitation({
    secret: secondInvite.rawToken,
    shishya: shishyaA, // Shishya A already belongs to Guru 1
  });
  if (reassignResult.success) throw new Error("TEST 6 FAILED: Silent Guru reassignment occurred!");
  console.log("-> Rejected with reason:", reassignResult.error);
  console.log("✓ TEST 6 PASSED: Existing Guru connection cannot be overwritten.\n");

  // TEST 7: Revocation
  console.log("[TEST 7] Guru Revokes Invitation...");
  const thirdInvite = await InvitationService.createGuruInvitation(testGuru);
  const revoked = await InvitationService.revokeGuruInvitation(thirdInvite.invitationId, testGuru.id);
  if (!revoked) throw new Error("TEST 7 FAILED: Revocation failed");
  const acceptRevoked = await InvitationService.acceptInvitation({
    secret: thirdInvite.rawToken,
    shishya: shishyaB,
  });
  if (acceptRevoked.success) throw new Error("TEST 7 FAILED: Revoked invitation was accepted!");
  console.log("-> Rejected with reason:", acceptRevoked.error);
  console.log("✓ TEST 7 PASSED: Revoked invitation cannot be accepted.\n");

  // TEST 8: Cross-Guru Revocation Block
  console.log("[TEST 8] Cross-Guru Revocation Block...");
  const fourthInvite = await InvitationService.createGuruInvitation(secondGuru);
  const crossRevoke = await InvitationService.revokeGuruInvitation(fourthInvite.invitationId, testGuru.id);
  if (crossRevoke) throw new Error("TEST 8 FAILED: Guru A was able to revoke Guru B's invitation!");
  console.log("✓ TEST 8 PASSED: Cross-Guru modification blocked.\n");

  console.log("==================================================");
  console.log("ALL PHASE 5 SECURITY & INTEGRATION TESTS PASSED!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
