import { STUDENT_NAV_ITEMS } from "../lib/constants/nav";
import { getTimeBasedGreeting, formatDevoteeDate, formatPracticeDate } from "../lib/utils/greeting";
import { dbStore } from "../lib/db/store";
import { DbUser } from "../lib/db/schema";
import { getActiveRelationshipForShishya } from "../lib/auth/authorization";

async function runPhase7Tests() {
  console.log("================================================================");
  console.log("=== RUNNING PHASE 7 STUDENT APP SHELL & UX TESTS ===");
  console.log("================================================================\n");

  // -------------------------------------------------------------------------
  // TEST 1: Exactly 4 Primary Navigation Destinations
  // -------------------------------------------------------------------------
  console.log("[TEST 1] Verifying 4 Primary Student Navigation Destinations...");
  if (STUDENT_NAV_ITEMS.length !== 4) {
    throw new Error(`TEST 1 FAILED: Expected exactly 4 items, found ${STUDENT_NAV_ITEMS.length}`);
  }

  const expectedRoutes = ["/student", "/student/journey", "/student/report", "/student/profile"];
  const actualRoutes = STUDENT_NAV_ITEMS.map((item) => item.href);

  for (const route of expectedRoutes) {
    if (!actualRoutes.includes(route)) {
      throw new Error(`TEST 1 FAILED: Missing expected route: ${route}`);
    }
  }

  console.log("-> Registered Student Nav Items:", STUDENT_NAV_ITEMS.map((i) => `${i.title} (${i.href})`));
  console.log("✓ TEST 1 PASSED: Exactly 4 primary destinations (Home, Journey, Report, Profile) configured.\n");

  // -------------------------------------------------------------------------
  // TEST 2: Contextual Greeting Utility (Morning, Afternoon, Evening)
  // -------------------------------------------------------------------------
  console.log("[TEST 2] Testing Time-of-Day Greeting Logic...");

  // Morning: 06:00
  const morningDate = new Date();
  morningDate.setHours(6, 0, 0, 0);
  const morningGreeting = getTimeBasedGreeting(morningDate);
  if (morningGreeting.timeGreeting !== "Good morning") {
    throw new Error(`TEST 2 FAILED: Expected 'Good morning', got '${morningGreeting.timeGreeting}'`);
  }
  console.log("-> 06:00 AM Greeting:", morningGreeting.fullGreeting("Arjuna Das"), `(${morningGreeting.timeGreeting})`);

  // Afternoon: 14:00
  const afternoonDate = new Date();
  afternoonDate.setHours(14, 0, 0, 0);
  const afternoonGreeting = getTimeBasedGreeting(afternoonDate);
  if (afternoonGreeting.timeGreeting !== "Good afternoon") {
    throw new Error(`TEST 2 FAILED: Expected 'Good afternoon', got '${afternoonGreeting.timeGreeting}'`);
  }
  console.log("-> 02:00 PM Greeting:", afternoonGreeting.fullGreeting("Arjuna Das"), `(${afternoonGreeting.timeGreeting})`);

  // Evening: 19:00
  const eveningDate = new Date();
  eveningDate.setHours(19, 0, 0, 0);
  const eveningGreeting = getTimeBasedGreeting(eveningDate);
  if (eveningGreeting.timeGreeting !== "Good evening") {
    throw new Error(`TEST 2 FAILED: Expected 'Good evening', got '${eveningGreeting.timeGreeting}'`);
  }
  console.log("-> 07:00 PM Greeting:", eveningGreeting.fullGreeting("Arjuna Das"), `(${eveningGreeting.timeGreeting})`);
  console.log("✓ TEST 2 PASSED: Contextual greeting helper accurately adapts to time of day.\n");

  // -------------------------------------------------------------------------
  // TEST 3: User-Friendly Date Formatter
  // -------------------------------------------------------------------------
  console.log("[TEST 3] Testing Date Formatting...");
  const testDate = new Date("2026-08-26T04:00:00Z");
  const formattedLong = formatDevoteeDate(testDate);
  const formattedPractice = formatPracticeDate(testDate);

  console.log("-> Formatted Long Date:", formattedLong);
  console.log("-> Formatted Practice Date:", formattedPractice);
  if (!formattedLong.includes("2026") || !formattedLong.includes("August")) {
    throw new Error("TEST 3 FAILED: Date formatting output unexpected: " + formattedLong);
  }
  console.log("✓ TEST 3 PASSED: Date formatting meets human-readable requirements.\n");

  // -------------------------------------------------------------------------
  // TEST 4: Shishya Connected Guru Resolution
  // -------------------------------------------------------------------------
  console.log("[TEST 4] Testing Connected Guru Data Resolution for Shishya...");
  const guruUser: DbUser = {
    id: "guru_radheshyam_shell_test",
    authProviderId: "auth_guru_shell",
    role: "guru",
    name: "His Grace Radheshyam Das",
    spiritualName: "Radheshyam Das",
    email: "radheshyam@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(guruUser);

  const shishyaUser: DbUser = {
    id: "shishya_arjuna_shell_test",
    authProviderId: "auth_shishya_shell",
    role: "shishya",
    name: "Arjun Das",
    spiritualName: "Arjuna Das",
    email: "arjun@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(shishyaUser);

  // Connect Shishya to Guru
  await dbStore.createRelationshipDirect({
    id: "rel_shell_test_001",
    guruId: guruUser.id,
    shishyaId: shishyaUser.id,
    relationshipType: "primary_guru",
    status: "active",
    isPrimary: true,
  });

  const connection = await getActiveRelationshipForShishya(shishyaUser.id);
  if (!connection || connection.guru.id !== guruUser.id) {
    throw new Error("TEST 4 FAILED: Shishya active Guru connection resolution failed");
  }
  console.log("-> Resolved Guiding Guru for Shishya:", connection.guru.spiritualName || connection.guru.name);
  console.log("✓ TEST 4 PASSED: Connected Guru resolved securely via server data access layer.\n");

  // -------------------------------------------------------------------------
  // TEST 5: Graceful Handling when Shishya has No Guru Connected
  // -------------------------------------------------------------------------
  console.log("[TEST 5] Testing Graceful Handling for Devotee with No Connected Guru...");
  const unconnectedShishya: DbUser = {
    id: "shishya_new_unconnected",
    authProviderId: "auth_new_unconnected",
    role: "shishya",
    name: "New Devotee",
    email: "new@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(unconnectedShishya);

  const noConnection = await getActiveRelationshipForShishya(unconnectedShishya.id);
  if (noConnection !== null) {
    throw new Error("TEST 5 FAILED: Expected null for unconnected Shishya, got: " + JSON.stringify(noConnection));
  }
  console.log("-> Unconnected Shishya returned:", noConnection, "(Graceful fallback state rendered in UI)");
  console.log("✓ TEST 5 PASSED: Zero crashes for unconnected devotee accounts.\n");

  console.log("================================================================");
  console.log("ALL PHASE 7 STUDENT APP SHELL & UX TESTS PASSED PERFECTLY!");
  console.log("================================================================");
}

runPhase7Tests().catch((err) => {
  console.error("\nTEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
