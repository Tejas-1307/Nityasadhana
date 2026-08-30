import { rmSync } from "node:fs";
import { join } from "node:path";
import { NityasadhanaDbStore } from "../lib/db/store";
import { hashInvitationSecret } from "../lib/invitations/crypto";
import { DbUser } from "../lib/db/schema";

const dbFilePath = join(process.cwd(), ".nityasadhana-db.json");
rmSync(dbFilePath, { force: true });

const createUser = (id: string, role: "guru" | "shishya"): DbUser => ({
  id,
  authProviderId: `${id}_auth`,
  role,
  name: id,
  spiritualName: id,
  email: `${id}@example.com`,
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const createInvitation = (id: string, guruId: string, token: string) => ({
  id,
  tokenHash: hashInvitationSecret(token),
  codeHash: hashInvitationSecret(`${token}_code`),
  rawCodeMasked: "NITYA-••••-TEST",
  createdByUserId: guruId,
  intendedRole: "shishya" as const,
  status: "pending" as const,
  expiresAt: "2099-12-31T23:59:59.000Z",
});

(async () => {
  const store = new NityasadhanaDbStore();
  const guruA = createUser("guru_association_a", "guru");
  const guruB = createUser("guru_association_b", "guru");
  const shishyaOne = createUser("shishya_association_one", "shishya");
  const shishyaTwo = createUser("shishya_association_two", "shishya");

  await store.upsertUser(guruA);
  await store.upsertUser(guruB);

  await store.createInvitation(createInvitation("invite_association_a1", guruA.id, "token-association-a1"));
  await store.createInvitation(createInvitation("invite_association_a2", guruA.id, "token-association-a2"));
  await store.createInvitation(createInvitation("invite_association_b1", guruB.id, "token-association-b1"));

  const firstAcceptance = await store.atomicAcceptInvitation({
    invitationId: "invite_association_a1",
    shishya: shishyaOne,
  });
  const secondAcceptance = await store.atomicAcceptInvitation({
    invitationId: "invite_association_a2",
    shishya: shishyaTwo,
  });

  if (!firstAcceptance.success || !secondAcceptance.success) {
    throw new Error("ASSOCIATION_FAIL: one Guru could not connect multiple Shishyas");
  }

  const crossGuruAttempt = await store.atomicAcceptInvitation({
    invitationId: "invite_association_b1",
    shishya: shishyaOne,
  });
  if (crossGuruAttempt.success) {
    throw new Error("ASSOCIATION_FAIL: Shishya was connected to a second Guru");
  }

  const guruAShishyas = await store.getShishyasByGuru(guruA.id);
  if (
    guruAShishyas.length !== 2 ||
    !guruAShishyas.every((entry) => entry.shishya.id.startsWith("shishya_association_"))
  ) {
    throw new Error("ASSOCIATION_FAIL: Guru could not retrieve both associated Shishyas");
  }

  const restored = new NityasadhanaDbStore();
  const restoredRelationships = await restored.getShishyasByGuru(guruA.id);
  if (restoredRelationships.length !== 2) {
    throw new Error("ASSOCIATION_FAIL: relationships were not persisted");
  }

  console.log("ASSOCIATION_OK", restoredRelationships.map((entry) => entry.shishya.id).join(","));
})();
