// ============================================================
// NITYASĀDHANĀ — DEVELOPMENT GURU TEST DATA SEEDER
// ============================================================
// Strictly enabled in DEVELOPMENT environment only (NODE_ENV !== "production").
// Provisions a development Guru user and realistic test Shishyas with:
// - Daily Sādhanā Reports (14 days history for trend visualization)
// - Attention Engine signals (Stable, Observe, Follow-up Suggested)
// - Active Weekly Sankalpa & Weekly Reflection
// - Follow-up history and Private Notes
// ============================================================

import { dbStore } from "@/lib/db/store";
import {
  DbUser,
  DbGuruShishyaRelationship,
  DbDailySadhanaReport,
  DbWeeklySankalpa,
  DbWeeklyReflection,
  DbGuruFollowUp,
  DbGuruPrivateNote,
} from "@/lib/db/schema";
import { getSankalpaWeekBoundaries } from "@/lib/sankalpa/date-utils";

export async function ensureDevGuruProvisioned(guruInfo: {
  id: string;
  email: string;
  name: string;
  spiritualName?: string;
}): Promise<DbUser | null> {
  // CRITICAL PRODUCTION SAFETY: Never run in production
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return null;
  }

  const existing = await dbStore.getUserById(guruInfo.id);
  if (existing && existing.role === "guru") {
    return existing;
  }

  // 1. Provision Guru Account in Development DB Store
  const guruUser: DbUser = {
    id: guruInfo.id,
    authProviderId: guruInfo.id,
    role: "guru",
    name: guruInfo.name || "His Grace Radheshyam Das",
    spiritualName: guruInfo.spiritualName || "Radheshyam Das",
    email: guruInfo.email.toLowerCase(),
    ashramId: "iskcon_nvcc_pune",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dbStore.upsertUser(guruUser);

  // 2. Check if this Guru already has test Shishyas
  const shishyas = await dbStore.getShishyasByGuru(guruUser.id);
  if (shishyas.length > 0) {
    return guruUser;
  }

  // 3. Seed 4 Clearly Identifiable Development Test Shishyas
  const devShishyas: DbUser[] = [
    {
      id: `dev_shishya_arjuna_${guruUser.id}`,
      authProviderId: `auth_dev_s1_${guruUser.id}`,
      role: "shishya",
      name: "Arjun Sharma",
      spiritualName: "Arjuna Das (Dev Test 01)",
      email: `arjuna.dev+${guruUser.id}@nityasadhana.org`,
      status: "active",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `dev_shishya_bhima_${guruUser.id}`,
      authProviderId: `auth_dev_s2_${guruUser.id}`,
      role: "shishya",
      name: "Bhim Rao",
      spiritualName: "Bhima Das (Dev Test 02)",
      email: `bhima.dev+${guruUser.id}@nityasadhana.org`,
      status: "active",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `dev_shishya_nakula_${guruUser.id}`,
      authProviderId: `auth_dev_s3_${guruUser.id}`,
      role: "shishya",
      name: "Nakul Joshi",
      spiritualName: "Nakula Das (Dev Test 03)",
      email: `nakula.dev+${guruUser.id}@nityasadhana.org`,
      status: "active",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `dev_shishya_sahadeva_${guruUser.id}`,
      authProviderId: `auth_dev_s4_${guruUser.id}`,
      role: "shishya",
      name: "Sahadev Patil",
      spiritualName: "Sahadeva Das (Dev Test 04)",
      email: `sahadeva.dev+${guruUser.id}@nityasadhana.org`,
      status: "active",
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const s of devShishyas) {
    await dbStore.upsertUser(s);

    // Create Active Primary Mentorship Relationship
    const rel: DbGuruShishyaRelationship = {
      id: `rel_dev_${guruUser.id}_${s.id}`,
      guruId: guruUser.id,
      shishyaId: s.id,
      relationshipType: "primary_guru",
      status: "active",
      isPrimary: true,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await dbStore.createRelationshipDirect(rel);
  }

  // 4. Seed Sādhanā Reports for Last 14 Days
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Student 1 (Arjuna Das) - 🟢 STABLE: 14 days consecutive, 16 rounds, wake 03:30, 30m reading
  for (let i = 0; i < 14; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const rep: DbDailySadhanaReport = {
      id: `rep_arjuna_${dateStr}_${guruUser.id}`,
      studentId: devShishyas[0].id,
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
      notes: "Peaceful morning chanting and steady service.",
      status: "submitted",
      timezone: "Asia/Kolkata",
      submittedAt: new Date(d.getTime() + 18 * 3600000).toISOString(),
      createdAt: new Date(d.getTime() + 18 * 3600000).toISOString(),
      updatedAt: new Date(d.getTime() + 18 * 3600000).toISOString(),
    };
    await dbStore.saveDailyReport(rep);
  }

  // Student 2 (Bhima Das) - 🟡 OBSERVE: 13 days submitted, missed today's report
  for (let i = 1; i < 14; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const rep: DbDailySadhanaReport = {
      id: `rep_bhima_${dateStr}_${guruUser.id}`,
      studentId: devShishyas[1].id,
      practiceDate: dateStr,
      wakeUpTime: "04:00",
      sleepTime: "22:00",
      sleepDurationMinutes: 360,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 25,
      hearingDurationMinutes: 15,
      collegeStudyDurationMinutes: 60,
      selfStudyDurationMinutes: 60,
      totalStudyDurationMinutes: 120,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 15,
      notes: "Morning Japa completed before temple program.",
      status: "submitted",
      timezone: "Asia/Kolkata",
      submittedAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
      createdAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
      updatedAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
    };
    await dbStore.saveDailyReport(rep);
  }

  // Student 3 (Nakula Das) - 🔵 FOLLOW-UP SUGGESTED: Routine pattern shift today (Wake 05:15, Japa 8, Reading 10 vs Baseline 03:20, 16, 30)
  for (let i = 1; i < 14; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const rep: DbDailySadhanaReport = {
      id: `rep_nakula_${dateStr}_${guruUser.id}`,
      studentId: devShishyas[2].id,
      practiceDate: dateStr,
      wakeUpTime: "03:20",
      sleepTime: "21:30",
      sleepDurationMinutes: 350,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 30,
      hearingDurationMinutes: 30,
      collegeStudyDurationMinutes: 60,
      selfStudyDurationMinutes: 60,
      totalStudyDurationMinutes: 120,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 10,
      notes: "Attentive japa.",
      status: "submitted",
      timezone: "Asia/Kolkata",
      submittedAt: new Date(d.getTime() + 20 * 3600000).toISOString(),
      createdAt: new Date(d.getTime() + 20 * 3600000).toISOString(),
      updatedAt: new Date(d.getTime() + 20 * 3600000).toISOString(),
    };
    await dbStore.saveDailyReport(rep);
  }

  // Today's report for Nakula with major routine shift
  const todayNakulaRep: DbDailySadhanaReport = {
    id: `rep_nakula_${todayStr}_${guruUser.id}`,
    studentId: devShishyas[2].id,
    practiceDate: todayStr,
    wakeUpTime: "05:15",
    sleepTime: "23:45",
    sleepDurationMinutes: 330,
    japaRounds: 8,
    extraRounds: 0,
    totalRounds: 8,
    readingDurationMinutes: 10,
    hearingDurationMinutes: 10,
    collegeStudyDurationMinutes: 60,
    selfStudyDurationMinutes: 30,
    totalStudyDurationMinutes: 90,
    dayRestDurationMinutes: 45,
    timeWastedDurationMinutes: 60,
    notes: "Feeling tired from travel.",
    status: "submitted",
    timezone: "Asia/Kolkata",
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.saveDailyReport(todayNakulaRep);

  // Student 4 (Sahadeva Das) - 🟢 STABLE with steady reports
  for (let i = 0; i < 14; i++) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const rep: DbDailySadhanaReport = {
      id: `rep_sahadeva_${dateStr}_${guruUser.id}`,
      studentId: devShishyas[3].id,
      practiceDate: dateStr,
      wakeUpTime: "03:45",
      sleepTime: "21:45",
      sleepDurationMinutes: 360,
      japaRounds: 16,
      extraRounds: 0,
      totalRounds: 16,
      readingDurationMinutes: 35,
      hearingDurationMinutes: 25,
      collegeStudyDurationMinutes: 60,
      selfStudyDurationMinutes: 60,
      totalStudyDurationMinutes: 120,
      dayRestDurationMinutes: 0,
      timeWastedDurationMinutes: 10,
      notes: "Reading Bhagavad-gita As It Is Chapter 9.",
      status: "submitted",
      timezone: "Asia/Kolkata",
      submittedAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
      createdAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
      updatedAt: new Date(d.getTime() + 19 * 3600000).toISOString(),
    };
    await dbStore.saveDailyReport(rep);
  }

  // 5. Seed Active Weekly Sankalpa & Weekly Reflection for Arjuna Das
  const week = getSankalpaWeekBoundaries(todayStr);
  const sankalpa: DbWeeklySankalpa = {
    id: `sankalpa_dev_arjuna_${guruUser.id}`,
    studentId: devShishyas[0].id,
    category: "wake_up",
    title: "Maintain a consistent wake-up time",
    targetType: "metric_based",
    targetConfig: {
      metric: "wake_up_time",
      targetValue: "03:30",
      comparison: "at_or_before",
    },
    startDate: week.startDate,
    endDate: week.endDate,
    status: "active",
    createdAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.createSankalpa(sankalpa);

  const reflection: DbWeeklyReflection = {
    id: `refl_dev_arjuna_${guruUser.id}`,
    studentId: devShishyas[0].id,
    sankalpaId: sankalpa.id,
    weekStartDate: week.startDate,
    weekEndDate: week.endDate,
    state: "steady",
    wentWell: "Chanted all 16 rounds before 8:00 AM consistently with clear pronunciation.",
    difficult: "Late evening seva on Wednesday required conscious focus.",
    improve: "Retire to bed by 10:00 PM every night.",
    guruMessage: "Seeking Maharaj's blessings for steady morning absorption and hearing.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
  };
  await dbStore.saveWeeklyReflection(reflection);

  // 6. Seed Sample Follow-up and Private Note
  const devFollowUp: DbGuruFollowUp = {
    id: `fu_dev_${guruUser.id}_1`,
    guruId: guruUser.id,
    studentId: devShishyas[0].id,
    note: "Spoke regarding morning japa pacing and reading Srimad Bhagavatam Canto 1.",
    followUpDate: todayStr,
    status: "completed",
    createdAt: new Date(today.getTime() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.createFollowUp(devFollowUp);

  const devNote: DbGuruPrivateNote = {
    id: `note_dev_${guruUser.id}_1`,
    guruId: guruUser.id,
    studentId: devShishyas[0].id,
    content: "Observing excellent steady commitment to morning program. Encourage studying Bhakti-rasamrita-sindhu.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await dbStore.createPrivateNote(devNote);

  return guruUser;
}
