(async () => {
  const { rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const dbFilePath = join(process.cwd(), ".nityasadhana-db.json");
  rmSync(dbFilePath, { force: true });

  const { NityasadhanaDbStore } = await import("../lib/db/store");
  const { hashInvitationSecret, generateSecureUrlToken, generateReadableCode, maskReadableCode, calculateExpirationDate } = await import("../lib/invitations/crypto");

  const first = new NityasadhanaDbStore();
  const guru = {
    id: "guru_persistence_test",
    authProviderId: "guru_persistence_test_auth",
    role: "guru" as const,
    name: "Persistence Guru",
    spiritualName: "Persistence Guru",
    email: "persistence.guru@example.com",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await first.upsertUser(guru);

  const rawToken = generateSecureUrlToken();
  const rawCode = generateReadableCode();
  const invitation = {
    id: "inv_persistence_test_001",
    tokenHash: hashInvitationSecret(rawToken),
    codeHash: hashInvitationSecret(rawCode),
    rawCodeMasked: maskReadableCode(rawCode),
    createdByUserId: guru.id,
    intendedRole: "shishya" as const,
    status: "pending" as const,
    expiresAt: calculateExpirationDate(),
  };

  await first.createInvitation(invitation);

  const second = new NityasadhanaDbStore();
  const found = await second.getInvitationByTokenHash(hashInvitationSecret(rawToken));

  if (!found) {
    throw new Error("PERSISTENCE_FAIL: invitation was not restored from disk");
  }

  console.log("PERSISTENCE_OK", found.id, found.createdByUserId);
})();
