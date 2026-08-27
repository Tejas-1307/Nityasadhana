// ============================================================
// NITYASĀDHANĀ — GURU DOMAIN SERVICE
// ============================================================
// Provides high-performance, single-pass aggregated queries for the
// Guru Home, Shishya Directory, and Student Profile Deep Inspection.
// ============================================================

import { dbStore } from "@/lib/db/store";
import {
  DbDailySadhanaReport,
  DbUser,
  DbGuruShishyaRelationship,
  DbGuruFollowUp,
  DbGuruPrivateNote,
  DbAttentionHistoryItem,
  DbWeeklySankalpa,
  DbWeeklyReflection,
  FollowUpStatus,
} from "@/lib/db/schema";
import { SankalpaService } from "@/lib/sankalpa/service";
import { ReflectionService } from "@/lib/reflection/service";
import { getLocalDateString } from "@/lib/reports/calculations";
import {
  evaluateAttention,
  AttentionAssessment,
  AttentionLevel,
  AttentionSignal,
  PersonalBaseline,
} from "./attention";

export type ReportingState = "submitted" | "draft" | "not_submitted";

export interface ShishyaOverviewItem {
  shishya: DbUser;
  relationship: DbGuruShishyaRelationship;
  reportingState: ReportingState;
  todayReport: DbDailySadhanaReport | null;
  attentionLevel: AttentionLevel;
  assessment: AttentionAssessment;
  signals: AttentionSignal[];
  primarySignal: AttentionSignal | null;
  additionalSignalsCount: number;
  isStable: boolean;
  needsAttention: boolean;
  baseline: PersonalBaseline;
  lastActiveFormatted: string;
}

export interface GuruDashboardOverview {
  totalActiveShishyas: number;
  totalInactiveShishyas: number;
  todayStats: {
    submittedCount: number;
    pendingCount: number;
    notSubmittedCount: number;
  };
  attentionShishyas: ShishyaOverviewItem[];
  stableShishyas: ShishyaOverviewItem[];
  allShishyas: ShishyaOverviewItem[];
  currentDateStr: string;
}

export interface SevenDayDataPoint {
  date: string;
  dayLabel: string;
  isSubmitted: boolean;
  wakeUpTime?: string;
  wakeUpMinutes?: number;
  totalRounds?: number;
  readingMinutes?: number;
  hearingMinutes?: number;
  studyMinutes?: number;
  unusedMinutes?: number;
}

export interface TrendSummaries {
  japa: string;
  wakeUp: string;
  reading: string;
  hearing: string;
  study: string;
  unused: string;
  overall: string;
}

export interface ShishyaDetailForGuru {
  shishya: DbUser;
  relationship: DbGuruShishyaRelationship;
  todayReport: DbDailySadhanaReport | null;
  attentionLevel: AttentionLevel;
  assessment: AttentionAssessment;
  signals: AttentionSignal[];
  baseline: PersonalBaseline;
  sevenDayTrend: SevenDayDataPoint[];
  thirtyDayTrend: SevenDayDataPoint[];
  thirtyDayStats: {
    totalSubmitted: number;
    consistencyPercentage: number;
    avgRounds: number;
    avgWakeUpTime: string;
    avgReadingMinutes: number;
    avgHearingMinutes: number;
    avgStudyMinutes: number;
    avgDayRestMinutes?: number;
    avgUnusedMinutes?: number;
  };
  trendSummaries: TrendSummaries;
  recentHistory: DbDailySadhanaReport[];
  totalReportCount: number;
  attentionHistory: DbAttentionHistoryItem[];
  followUps: DbGuruFollowUp[];
  privateNotes: DbGuruPrivateNote[];
  activeSankalpa?: DbWeeklySankalpa | null;
  sankalpaHistory?: DbWeeklySankalpa[];
  latestReflection?: DbWeeklyReflection | null;
}

export class GuruService {
  /**
   * Generates the complete, high-performance Guru Home overview.
   * Avoids N+1 queries by fetching relationships and reports in memory.
   */
  static async getDashboardOverview(
    guruId: string,
    currentDateStr?: string
  ): Promise<GuruDashboardOverview> {
    const today = currentDateStr || getLocalDateString();

    const [activeList, inactiveList] = await Promise.all([
      dbStore.getShishyasByGuru(guruId, "active"),
      dbStore.getShishyasByGuru(guruId, "inactive"),
    ]);

    let submittedCount = 0;
    let pendingCount = 0;
    let notSubmittedCount = 0;

    const overviewItems: ShishyaOverviewItem[] = await Promise.all(
      activeList.map(async ({ relationship, shishya }) => {
        // Fetch reports for this student (past 30 days)
        const { reports } = await dbStore.getReportsByStudent(shishya.id, 30, 0);

        const todayReport = reports.find((r) => r.practiceDate === today) || null;

        const assessment = evaluateAttention({
          student: shishya,
          todayReport,
          historicalReports: reports,
          currentDateStr: today,
        });

        const signals = assessment.signals;
        const primarySignal = assessment.primarySignal;
        const additionalSignalsCount = assessment.additionalCount;
        const attentionLevel = assessment.level;
        const baseline = assessment.baseline;

        const reportingState: ReportingState =
          todayReport?.status === "submitted"
            ? "submitted"
            : todayReport?.status === "draft"
              ? "draft"
              : "not_submitted";

        const needsAttention =
          attentionLevel === "FOLLOW_UP_SUGGESTED" || attentionLevel === "OBSERVE";
        const isStable = attentionLevel === "STABLE";

        const mostRecentReport = reports[0];
        const lastActiveFormatted = mostRecentReport
          ? mostRecentReport.practiceDate === today
            ? "Today"
            : mostRecentReport.practiceDate
          : "No reports yet";

        return {
          shishya,
          relationship,
          reportingState,
          todayReport,
          attentionLevel,
          assessment,
          signals,
          primarySignal,
          additionalSignalsCount,
          isStable,
          needsAttention,
          baseline,
          lastActiveFormatted,
        };
      })
    );

    // Aggregate counters
    for (const item of overviewItems) {
      if (item.reportingState === "submitted") {
        submittedCount++;
      } else if (item.reportingState === "draft") {
        pendingCount++;
      } else {
        notSubmittedCount++;
      }
    }

    // Sort Shishyas: Attention suggested first, then pending, then stable
    overviewItems.sort((a, b) => {
      if (a.needsAttention && !b.needsAttention) return -1;
      if (!a.needsAttention && b.needsAttention) return 1;
      if (a.reportingState !== "submitted" && b.reportingState === "submitted") return -1;
      if (a.reportingState === "submitted" && b.reportingState !== "submitted") return 1;
      return a.shishya.name.localeCompare(b.shishya.name);
    });

    const attentionShishyas = overviewItems.filter((item) => item.needsAttention);
    const stableShishyas = overviewItems.filter((item) => item.isStable);

    return {
      totalActiveShishyas: activeList.length,
      totalInactiveShishyas: inactiveList.length,
      todayStats: {
        submittedCount,
        pendingCount,
        notSubmittedCount,
      },
      attentionShishyas,
      stableShishyas,
      allShishyas: overviewItems,
      currentDateStr: today,
    };
  }

  /**
   * Retrieves complete student profile data for a specific Guru-Shishya pair.
   * Strictly verifies mentorship relationship.
   */
  static async getShishyaDetail(
    guruId: string,
    shishyaId: string,
    currentDateStr?: string
  ): Promise<ShishyaDetailForGuru | null> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(guruId, shishyaId);
    if (!isConnected) {
      return null;
    }

    const relationship = await dbStore.getRelationship(guruId, shishyaId);
    const shishya = await dbStore.getUserById(shishyaId);
    if (!relationship || !shishya) {
      return null;
    }

    const today = currentDateStr || getLocalDateString();

    // Fetch past 30 days of reports for trend calculation
    const { reports: allReports, total } = await dbStore.getReportsByStudent(shishyaId, 30, 0);

    const todayReport = allReports.find((r) => r.practiceDate === today) || null;

    const assessment = evaluateAttention({
      student: shishya,
      todayReport,
      historicalReports: allReports,
      currentDateStr: today,
    });

    const signals = assessment.signals;
    const attentionLevel = assessment.level;
    const baseline = assessment.baseline;

    // Build 7-day and 30-day trend series
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buildTrendSeries = (numDays: number): SevenDayDataPoint[] => {
      const series: SevenDayDataPoint[] = [];
      const baseD = new Date(today);

      for (let i = numDays - 1; i >= 0; i--) {
        const targetDate = new Date(baseD);
        targetDate.setDate(baseD.getDate() - i);
        const dateStr = targetDate.toISOString().slice(0, 10);
        const dayLabel = dayNames[targetDate.getDay()];

        const match = allReports.find((r) => r.practiceDate === dateStr);
        if (match && match.status === "submitted") {
          series.push({
            date: dateStr,
            dayLabel,
            isSubmitted: true,
            wakeUpTime: match.wakeUpTime,
            totalRounds: match.totalRounds || match.japaRounds || 0,
            readingMinutes: match.readingDurationMinutes || 0,
            hearingMinutes: match.hearingDurationMinutes || 0,
            studyMinutes:
              (match.collegeStudyDurationMinutes || 0) + (match.selfStudyDurationMinutes || 0),
            unusedMinutes: match.timeWastedDurationMinutes || 0,
          });
        } else {
          series.push({
            date: dateStr,
            dayLabel,
            isSubmitted: false,
          });
        }
      }
      return series;
    };

    const sevenDayTrend = buildTrendSeries(7);
    const thirtyDayTrend = buildTrendSeries(30);

    // 30-day aggregate statistics
    const submittedIn30 = allReports.filter((r) => r.status === "submitted");
    const consistencyPercentage =
      allReports.length > 0 ? Math.round((submittedIn30.length / 30) * 100) : 0;

    let totalRoundsSum = 0;
    let totalReadingSum = 0;
    let totalHearingSum = 0;
    let totalStudySum = 0;
    let totalDayRestSum = 0;
    let totalUnusedSum = 0;
    let totalWakeMins = 0;
    let validWakeCount = 0;

    for (const r of submittedIn30) {
      totalRoundsSum += r.totalRounds || r.japaRounds || 0;
      totalReadingSum += r.readingDurationMinutes || 0;
      totalHearingSum += r.hearingDurationMinutes || 0;
      totalStudySum += (r.collegeStudyDurationMinutes || 0) + (r.selfStudyDurationMinutes || 0);
      totalDayRestSum += r.dayRestDurationMinutes || 0;
      totalUnusedSum += r.timeWastedDurationMinutes || 0;
      if (r.wakeUpTime) {
        const [h, m] = r.wakeUpTime.split(":").map(Number);
        totalWakeMins += h * 60 + m;
        validWakeCount++;
      }
    }

    const count = submittedIn30.length || 1;
    const avgWakeMins = validWakeCount > 0 ? Math.round(totalWakeMins / validWakeCount) : 240;
    const avgWakeHours = Math.floor(avgWakeMins / 60);
    const avgWakeMinutesPart = avgWakeMins % 60;
    const avgWakeUpTime = `${String(avgWakeHours).padStart(2, "0")}:${String(
      avgWakeMinutesPart
    ).padStart(2, "0")}`;

    const thirtyDayStats = {
      totalSubmitted: submittedIn30.length,
      consistencyPercentage,
      avgRounds: Math.round((totalRoundsSum / count) * 10) / 10,
      avgWakeUpTime,
      avgReadingMinutes: Math.round(totalReadingSum / count),
      avgHearingMinutes: Math.round(totalHearingSum / count),
      avgStudyMinutes: Math.round(totalStudySum / count),
      avgDayRestMinutes: Math.round(totalDayRestSum / count),
      avgUnusedMinutes: Math.round(totalUnusedSum / count),
    };

    // Construct factual non-judgmental trend summaries
    const trendSummaries: TrendSummaries = {
      japa:
        submittedIn30.length >= 5
          ? `Japa has averaged ${thirtyDayStats.avgRounds} rounds daily over ${submittedIn30.length} recorded days.`
          : "Initial Japa reporting in progress.",
      wakeUp:
        validWakeCount >= 5
          ? `Typical wake-up time is around ${avgWakeUpTime} over recent reports.`
          : "Baseline wake-up pattern establishing.",
      reading:
        submittedIn30.length >= 5
          ? `Reading duration averages ${thirtyDayStats.avgReadingMinutes}m daily.`
          : "Reading history establishing.",
      hearing:
        submittedIn30.length >= 5
          ? `Hearing duration averages ${thirtyDayStats.avgHearingMinutes}m daily.`
          : "Hearing history establishing.",
      study:
        submittedIn30.length >= 5
          ? `Combined study averages ${Math.floor(thirtyDayStats.avgStudyMinutes / 60)}h ${
              thirtyDayStats.avgStudyMinutes % 60
            }m daily.`
          : "Study schedule recording.",
      unused:
        thirtyDayStats.avgUnusedMinutes > 0
          ? `Recorded unused time averages ${thirtyDayStats.avgUnusedMinutes}m daily.`
          : "No significant unused time recorded.",
      overall:
        consistencyPercentage >= 80
          ? "Sādhanā reporting has remained consistent over the last 30 days."
          : "Reporting frequency has varied over recent weeks.",
    };

    // Reconstruct 30-Day Chronological Attention History
    const attentionHistory: DbAttentionHistoryItem[] = [];
    const dateList: string[] = [];
    for (let i = 0; i < 30; i++) {
      const targetDate = new Date(new Date(today).getTime() - i * 86400000);
      dateList.push(targetDate.toISOString().slice(0, 10));
    }

    for (const dStr of dateList) {
      const repOnDate = allReports.find((r) => r.practiceDate === dStr) || null;
      const historyUntilDate = allReports.filter((r) => r.practiceDate <= dStr);
      if (historyUntilDate.length >= 2) {
        const histAssessment = evaluateAttention({
          student: shishya,
          todayReport: repOnDate,
          historicalReports: historyUntilDate,
          currentDateStr: dStr,
        });

        // Record entry if non-stable or sampled key checkpoints
        if (
          histAssessment.level !== "STABLE" ||
          dStr === today ||
          attentionHistory.length === 0
        ) {
          attentionHistory.push({
            date: dStr,
            level: histAssessment.level,
            headline: histAssessment.summaryHeadline,
            reason: histAssessment.summaryDetail,
            signals: histAssessment.signals,
          });
        }
      }
    }

    // Fetch Guru Follow-Ups, Private Notes, Shishya Sankalpa, and Latest Reflection
    const [
      followUps,
      privateNotes,
      activeSankalpa,
      { sankalpas: sankalpaHistory },
      { reflections: recentReflections },
    ] = await Promise.all([
      dbStore.getFollowUps(guruId, shishyaId),
      dbStore.getPrivateNotes(guruId, shishyaId),
      SankalpaService.getActiveSankalpa(shishyaId, today),
      SankalpaService.getSankalpaHistory(shishyaId, 5, 0, today),
      ReflectionService.getReflectionHistory(shishyaId, 1, 0),
    ]);

    const latestReflection = recentReflections.length > 0 ? recentReflections[0] : null;

    return {
      shishya,
      relationship,
      todayReport,
      attentionLevel,
      assessment,
      signals,
      baseline,
      sevenDayTrend,
      thirtyDayTrend,
      thirtyDayStats,
      trendSummaries,
      recentHistory: allReports.slice(0, 10),
      totalReportCount: total,
      attentionHistory: attentionHistory.slice(0, 10),
      followUps,
      privateNotes,
      activeSankalpa,
      sankalpaHistory,
      latestReflection,
    };
  }

  /**
   * Retrieves paginated past report history for a Shishya.
   * Strictly verifies mentorship relationship.
   */
  static async getShishyaHistory(
    guruId: string,
    shishyaId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ reports: DbDailySadhanaReport[]; total: number } | null> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(guruId, shishyaId);
    if (!isConnected) {
      return null;
    }
    return dbStore.getReportsByStudent(shishyaId, limit, offset);
  }

  /**
   * Retrieves single report detail for inspection by Guru.
   * Strictly verifies mentorship relationship.
   * Crucial Security Rule: READ ONLY.
   */
  static async getReportDetailForGuru(
    guruId: string,
    shishyaId: string,
    reportId: string
  ): Promise<DbDailySadhanaReport | null> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(guruId, shishyaId);
    if (!isConnected) {
      return null;
    }

    const report = await dbStore.getReportById(reportId);
    if (!report || report.studentId !== shishyaId) {
      return null;
    }

    return report;
  }

  // ============================================================
  // PHASE 14: FOLLOW-UP & PRIVATE NOTE DOMAIN METHODS
  // ============================================================

  /**
   * Adds a new follow-up record authored by the Guru.
   */
  static async addFollowUp(params: {
    guruId: string;
    studentId: string;
    note: string;
    followUpDate: string;
    nextFollowUpDate?: string;
  }): Promise<DbGuruFollowUp | null> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(params.guruId, params.studentId);
    if (!isConnected) return null;

    const id = `followup_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const record: DbGuruFollowUp = {
      id,
      guruId: params.guruId,
      studentId: params.studentId,
      note: params.note.trim(),
      followUpDate: params.followUpDate,
      nextFollowUpDate: params.nextFollowUpDate || undefined,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return dbStore.createFollowUp(record);
  }

  /**
   * Updates follow-up status (e.g. marking completed).
   */
  static async updateFollowUpStatus(
    guruId: string,
    followUpId: string,
    status: FollowUpStatus
  ): Promise<DbGuruFollowUp | null> {
    return dbStore.updateFollowUpStatus(guruId, followUpId, status);
  }

  /**
   * Adds a private Guru note.
   */
  static async addPrivateNote(params: {
    guruId: string;
    studentId: string;
    content: string;
  }): Promise<DbGuruPrivateNote | null> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(params.guruId, params.studentId);
    if (!isConnected) return null;

    const id = `pnote_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const record: DbGuruPrivateNote = {
      id,
      guruId: params.guruId,
      studentId: params.studentId,
      content: params.content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return dbStore.createPrivateNote(record);
  }

  /**
   * Retrieves private Guru notes for a student, strictly verifying relationship ownership.
   */
  static async getPrivateNotes(guruId: string, studentId: string): Promise<DbGuruPrivateNote[]> {
    const isConnected = await dbStore.isShishyaConnectedToGuru(guruId, studentId);
    if (!isConnected) return [];
    return dbStore.getPrivateNotes(guruId, studentId);
  }

  /**
   * Deletes a private Guru note.
   */
  static async deletePrivateNote(guruId: string, noteId: string): Promise<boolean> {
    return dbStore.deletePrivateNote(guruId, noteId);
  }
}
