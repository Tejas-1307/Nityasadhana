import { dbStore } from "../lib/db/store";
import { GuruService } from "../lib/guru/service";
import { reportService } from "../lib/reports/service";
import { SankalpaService } from "../lib/sankalpa/service";
import { ReflectionService } from "../lib/reflection/service";
import { InvitationService } from "../lib/invitations/service";
import { getPostAuthRedirectUrl } from "../lib/auth/redirects";
import { DbUser } from "../lib/db/schema";

async function runProductionAuthFlowTests() {
  console.log("================================================================");
  console.log("=== RUNNING PRODUCTION READINESS AUTHENTICATION FLOW TESTS =====");
  console.log("================================================================\n");

  // ============================================================
  // TEST 1: FRESH GURU SIGNUP & ISOLATION
  // ============================================================
  console.log("[TEST 1] Testing Fresh Guru Creation & Zero-Data Empty State...");
  const freshGuruId = `user_guru_prod_${Date.now()}`;
  const freshGuru: DbUser = {
    id: freshGuruId,
    authProviderId: freshGuruId,
    role: "guru",
    name: "His Grace Gauranga Das",
    spiritualName: "Gauranga Das",
    email: "gauranga@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dbStore.upsertUser(freshGuru);

  const guruOverview = await GuruService.getDashboardOverview(freshGuru.id);
  console.log(`-> Guru Total Active Shishyas: ${guruOverview.totalActiveShishyas}`);
  console.log(`-> Guru Submitted Count: ${guruOverview.todayStats.submittedCount}`);
  console.log(`-> Guru Attention List: ${guruOverview.attentionShishyas.length}`);
  console.log(`-> Guru Stable List: ${guruOverview.stableShishyas.length}`);

  if (guruOverview.totalActiveShishyas !== 0) {
    throw new Error(`Expected 0 Shishyas for new Guru, got ${guruOverview.totalActiveShishyas}`);
  }
  if (guruOverview.attentionShishyas.length !== 0 || guruOverview.stableShishyas.length !== 0) {
    throw new Error("Expected zero attention/stable items for new Guru!");
  }
  if (getPostAuthRedirectUrl("guru") !== "/guru") {
    throw new Error("Expected Guru redirect to /guru");
  }
  console.log("✓ TEST 1 PASSED: Fresh Guru starts with 100% clean zero-data state and routes to /guru.\n");

  // ============================================================
  // TEST 2: FRESH SHISHYA SIGNUP & ISOLATION
  // ============================================================
  console.log("[TEST 2] Testing Fresh Shishya Creation & Zero-Data Personal State...");
  const freshShishyaId = `user_shishya_prod_${Date.now()}`;
  const freshShishya: DbUser = {
    id: freshShishyaId,
    authProviderId: freshShishyaId,
    role: "shishya",
    name: "Mukunda Rao",
    spiritualName: "Mukunda Das",
    email: "mukunda@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dbStore.upsertUser(freshShishya);

  const shishyaDashboard = await reportService.getStudentDashboard(freshShishya.id);
  console.log(`-> Shishya Today Status: ${shishyaDashboard.status}`);
  console.log(`-> Shishya Report: ${shishyaDashboard.report}`);
  console.log(`-> Shishya Recent Reports: ${shishyaDashboard.recentReports.length}`);
  console.log(`-> Shishya Guiding Guru: ${shishyaDashboard.guidingGuru}`);
  console.log(`-> Shishya Streak: ${shishyaDashboard.consistency.currentStreak}`);

  if (shishyaDashboard.status !== "not_started") {
    throw new Error(`Expected status 'not_started', got '${shishyaDashboard.status}'`);
  }
  if (shishyaDashboard.report !== null || shishyaDashboard.recentReports.length !== 0) {
    throw new Error("Expected null report and empty recent reports for new Shishya!");
  }
  if (shishyaDashboard.consistency.currentStreak !== 0) {
    throw new Error(`Expected streak 0, got ${shishyaDashboard.consistency.currentStreak}`);
  }
  if (getPostAuthRedirectUrl("shishya") !== "/student") {
    throw new Error("Expected Shishya redirect to /student");
  }
  console.log("✓ TEST 2 PASSED: Fresh Shishya starts with 100% clean personal state and routes to /student.\n");

  // ============================================================
  // TEST 3: GURU GENERATES INVITATION & SHISHYA ONBOARDING
  // ============================================================
  console.log("[TEST 3] Testing Invitation Generation, Acceptance & Mentorship Binding...");
  const invitation = await InvitationService.createGuruInvitation(freshGuru);
  console.log(`-> Generated Invitation for Guru: ${invitation.rawCodeMasked}`);

  const validation = await InvitationService.validateInvitationSecret(invitation.rawToken);
  if (!validation.isValid || validation.guruName !== "Gauranga Das") {
    throw new Error(`Invitation validation failed: ${JSON.stringify(validation)}`);
  }

  const acceptResult = await InvitationService.acceptInvitation({
    secret: invitation.rawToken,
    shishya: freshShishya,
  });

  if (!acceptResult.success) {
    throw new Error(`Failed to accept invitation: ${acceptResult.error}`);
  }
  console.log(`-> Shishya connected to Guru: ${acceptResult.guruName}`);

  // Verify Guru Dashboard now reflects 1 Shishya with unsubmitted report
  const updatedGuruOverview = await GuruService.getDashboardOverview(freshGuru.id);
  console.log(`-> Updated Guru Shishyas: ${updatedGuruOverview.totalActiveShishyas}`);
  console.log(`-> Updated Guru Not Submitted Reports: ${updatedGuruOverview.todayStats.notSubmittedCount}`);

  if (updatedGuruOverview.totalActiveShishyas !== 1) {
    throw new Error(`Expected 1 Shishya for Guru, got ${updatedGuruOverview.totalActiveShishyas}`);
  }
  if (updatedGuruOverview.todayStats.notSubmittedCount !== 1) {
    throw new Error(`Expected 1 unsubmitted report, got ${updatedGuruOverview.todayStats.notSubmittedCount}`);
  }

  // Verify Shishya Dashboard now shows connected Guru
  const updatedShishyaDashboard = await reportService.getStudentDashboard(freshShishya.id);
  if (updatedShishyaDashboard.guidingGuru?.name !== "His Grace Gauranga Das") {
    throw new Error(`Expected guiding Guru 'His Grace Gauranga Das', got '${updatedShishyaDashboard.guidingGuru?.name}'`);
  }
  console.log("✓ TEST 3 PASSED: Guru invitation, acceptance, and mentorship connection verified.\n");

  // ============================================================
  // TEST 4: SHISHYA SUBMITS FIRST DAILY REPORT
  // ============================================================
  console.log("[TEST 4] Testing Shishya First Daily Report Submission...");
  const todayStr = new Date().toISOString().slice(0, 10);
  const saveResult = await reportService.saveOrSubmitReport({
    studentId: freshShishya.id,
    status: "submitted",
    input: {
      practiceDate: todayStr,
      wakeUpTime: "04:00",
      sleepTime: "22:00",
      japaRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 20,
      collegeStudyDurationMinutes: 60,
      selfStudyDurationMinutes: 60,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 10,
      notes: "First sincere report submitted.",
    },
  });

  if (!saveResult.success) {
    throw new Error(`Failed to submit report: ${saveResult.error}`);
  }

  const postReportShishyaDash = await reportService.getStudentDashboard(freshShishya.id);
  if (postReportShishyaDash.status !== "submitted") {
    throw new Error(`Expected status 'submitted', got '${postReportShishyaDash.status}'`);
  }
  if (postReportShishyaDash.report?.totalRounds !== 16) {
    throw new Error(`Expected 16 rounds, got ${postReportShishyaDash.report?.totalRounds}`);
  }

  const postReportGuruOverview = await GuruService.getDashboardOverview(freshGuru.id);
  if (postReportGuruOverview.todayStats.submittedCount !== 1) {
    throw new Error(`Expected 1 submitted report for Guru, got ${postReportGuruOverview.todayStats.submittedCount}`);
  }
  if (postReportGuruOverview.todayStats.pendingCount !== 0) {
    throw new Error(`Expected 0 pending reports for Guru, got ${postReportGuruOverview.todayStats.pendingCount}`);
  }
  console.log("✓ TEST 4 PASSED: First daily report submitted and reflected across Shishya & Guru dashboards.\n");

  // ============================================================
  // TEST 5: MULTI-TENANT GURU & SHISHYA ISOLATION
  // ============================================================
  console.log("[TEST 5] Testing Guru Multi-Tenant Isolation & IDOR Protection...");
  const otherGuruId = `user_guru_other_${Date.now()}`;
  const otherGuru: DbUser = {
    id: otherGuruId,
    authProviderId: otherGuruId,
    role: "guru",
    name: "His Grace Balaram Das",
    email: "balaram@iskconpune.org",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.upsertUser(otherGuru);

  // Other Guru attempts to access freshGuru's Shishya
  const unauthorizedDetail = await GuruService.getShishyaDetail(otherGuru.id, freshShishya.id);
  if (unauthorizedDetail !== null) {
    throw new Error("CRITICAL SECURITY VIOLATION: Guru B was able to access Guru A's Shishya!");
  }

  const otherGuruOverview = await GuruService.getDashboardOverview(otherGuru.id);
  if (otherGuruOverview.totalActiveShishyas !== 0) {
    throw new Error("Other Guru inherited Shishyas from another Guru!");
  }
  console.log("✓ TEST 5 PASSED: Strict cross-Guru isolation confirmed (null returned on IDOR attempt).\n");

  console.log("================================================================");
  console.log("=== ALL 5 PRODUCTION AUTH & ISOLATION TESTS PASSED (100%) ======");
  console.log("================================================================");
}

runProductionAuthFlowTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
