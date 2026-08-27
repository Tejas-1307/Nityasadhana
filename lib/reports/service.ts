import { dbStore } from "@/lib/db/store";
import { DbDailySadhanaReport, DailySadhanaReportStatus } from "@/lib/db/schema";
import {
  DailySadhanaReportInput,
  validateReportInput,
  canEditReport,
} from "./validation";
import {
  calculateSleepDuration,
  calculateTotalRounds,
  calculateTotalStudy,
  getLocalDateString,
  calculateReportConsistency,
  ConsistencyMetrics,
  calculateJourneyAnalytics,
  JourneyAnalytics,
} from "./calculations";
import { REPORT_CONFIG } from "./config";

export interface SaveReportParams {
  studentId: string;
  input: Partial<DailySadhanaReportInput>;
  status: DailySadhanaReportStatus;
}

export interface SaveReportResult {
  success: boolean;
  report?: DbDailySadhanaReport;
  error?: string;
}

export interface StudentDashboardData {
  todayDate: string;
  status: "not_started" | "draft" | "submitted";
  report: DbDailySadhanaReport | null;
  isEditable: boolean;
  consistency: ConsistencyMetrics;
  recentReports: DbDailySadhanaReport[];
  guidingGuru: {
    name: string;
    spiritualName?: string;
  } | null;
}

export class DailySadhanaReportService {
  /**
   * Retrieves the report for a student for a specific practice date.
   */
  async getReport(studentId: string, practiceDate: string): Promise<DbDailySadhanaReport | null> {
    return dbStore.getReportByStudentAndDate(studentId, practiceDate);
  }

  /**
   * Retrieves the most recent submitted report for a student prior to the specified date.
   */
  async getPreviousReport(
    studentId: string,
    beforeDate?: string
  ): Promise<DbDailySadhanaReport | null> {
    const { reports } = await dbStore.getReportsByStudent(studentId, 10, 0);
    const targetDate = beforeDate || getLocalDateString();
    for (const rep of reports) {
      if (rep.practiceDate < targetDate && rep.status === "submitted") {
        return rep;
      }
    }
    return null;
  }

  /**
   * Retrieves today's report, previous submitted report, and editing state for a student.
   */
  async getTodayReport(
    studentId: string,
    timezone: string = REPORT_CONFIG.DEFAULT_TIMEZONE
  ): Promise<{
    todayDate: string;
    report: DbDailySadhanaReport | null;
    previousReport: DbDailySadhanaReport | null;
    isEditable: boolean;
  }> {
    const todayDate = getLocalDateString(new Date(), timezone);
    const report = await dbStore.getReportByStudentAndDate(studentId, todayDate);
    const previousReport = await this.getPreviousReport(studentId, todayDate);
    const isEditable = canEditReport(todayDate, timezone);

    return {
      todayDate,
      report,
      previousReport,
      isEditable,
    };
  }

  /**
   * Retrieves complete dashboard data for a student in an optimized single server call.
   */
  async getStudentDashboard(
    studentId: string,
    timezone: string = REPORT_CONFIG.DEFAULT_TIMEZONE
  ): Promise<StudentDashboardData> {
    const todayDate = getLocalDateString(new Date(), timezone);
    const isEditable = canEditReport(todayDate, timezone);

    // Fetch today's report, past reports for consistency, and guiding Guru in parallel
    const [todayReport, { reports: allStudentReports }, guruData] = await Promise.all([
      dbStore.getReportByStudentAndDate(studentId, todayDate),
      dbStore.getReportsByStudent(studentId, 30, 0),
      dbStore.getGuruByShishya(studentId, "active"),
    ]);

    // Compute consistency metrics (10-day window + streak)
    const consistency = calculateReportConsistency(allStudentReports, todayDate, 10);

    // Recent reports: latest 5 reports
    const recentReports = allStudentReports.slice(0, 5);

    // Status:
    let status: "not_started" | "draft" | "submitted" = "not_started";
    if (todayReport) {
      status = todayReport.status;
    }

    // Guiding Guru connection
    const guidingGuru = guruData
      ? {
          name: guruData.guru.name,
          spiritualName: guruData.guru.spiritualName,
        }
      : null;

    return {
      todayDate,
      status,
      report: todayReport,
      isEditable,
      consistency,
      recentReports,
      guidingGuru,
    };
  }

  /**
   * Atomically saves or submits a report.
   * Performs server-authoritative validation and calculations.
   */
  async saveOrSubmitReport(params: SaveReportParams): Promise<SaveReportResult> {
    const isDraft = params.status === "draft";
    const timezone = params.input.timezone || REPORT_CONFIG.DEFAULT_TIMEZONE;

    // 1. Validate Input
    const validation = validateReportInput(params.input, isDraft);
    if (!validation.success || !validation.data) {
      return {
        success: false,
        error: validation.error || "Invalid report data.",
      };
    }

    const valid = validation.data;
    const practiceDate = valid.practiceDate;

    // 2. Verify Edit Window
    if (!canEditReport(practiceDate, timezone)) {
      return {
        success: false,
        error: "This report is outside the allowed edit window.",
      };
    }

    // 3. Server-side Automatic Calculations (Source of Truth)
    const sleepDurationMinutes = calculateSleepDuration(valid.sleepTime, valid.wakeUpTime);
    const totalRounds = calculateTotalRounds(valid.japaRounds, valid.extraRounds);
    const totalStudyDurationMinutes = calculateTotalStudy(
      valid.collegeStudyDurationMinutes,
      valid.selfStudyDurationMinutes
    );

    // 4. Check for existing report for this student & practice date
    const existing = await dbStore.getReportByStudentAndDate(params.studentId, practiceDate);

    // Generate deterministic or preserved report ID
    const reportId = existing ? existing.id : `rep_${params.studentId}_${practiceDate}`;

    const reportToSave: DbDailySadhanaReport = {
      id: reportId,
      studentId: params.studentId, // STRICTLY server-derived from authenticated user
      practiceDate,
      sleepTime: valid.sleepTime,
      wakeUpTime: valid.wakeUpTime,
      sleepDurationMinutes,
      japaRounds: valid.japaRounds,
      extraRounds: valid.extraRounds || 0,
      totalRounds,
      japaCompletedAt: valid.japaCompletedAt,
      readingDurationMinutes: valid.readingDurationMinutes || 0,
      readingNote: valid.readingNote,
      hearingDurationMinutes: valid.hearingDurationMinutes || 0,
      hearingNote: valid.hearingNote,
      collegeStudyDurationMinutes: valid.collegeStudyDurationMinutes || 0,
      selfStudyDurationMinutes: valid.selfStudyDurationMinutes || 0,
      totalStudyDurationMinutes,
      dayRestDurationMinutes: valid.dayRestDurationMinutes || 0,
      timeWastedDurationMinutes: valid.timeWastedDurationMinutes || 0,
      notes: valid.notes,
      status: params.status,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Preserve original submittedAt on edit, or set new server timestamp on first submit
      submittedAt:
        params.status === "submitted"
          ? existing?.submittedAt || new Date().toISOString()
          : existing?.submittedAt,
      timezone,
    };

    try {
      const saved = await dbStore.saveDailyReport(reportToSave);
      return {
        success: true,
        report: saved,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save daily report.";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Retrieves paginated report history for an authenticated student.
   */
  async getReportHistory(
    studentId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ reports: DbDailySadhanaReport[]; total: number }> {
    return dbStore.getReportsByStudent(studentId, limit, offset);
  }

  /**
   * Retrieves a single report strictly verifying ownership.
   */
  async getReportByIdForStudent(
    reportId: string,
    studentId: string
  ): Promise<DbDailySadhanaReport | null> {
    const report = await dbStore.getReportById(reportId);
    if (!report || report.studentId !== studentId) {
      return null;
    }
    return report;
  }

  /**
   * Retrieves complete personal Journey analytics for a student for the selected date range.
   * Scoped strictly to the authenticated student's practice records.
   */
  async getStudentJourney(params: {
    studentId: string;
    rangeDays?: 7 | 30;
    timezone?: string;
  }): Promise<JourneyAnalytics> {
    const rangeDays = params.rangeDays === 30 ? 30 : 7;
    const timezone = params.timezone || REPORT_CONFIG.DEFAULT_TIMEZONE;
    const todayDateStr = getLocalDateString(new Date(), timezone);

    // Fetch reports up to 2 * rangeDays in the past (e.g. 65 reports for 30-day range comparison)
    const { reports } = await dbStore.getReportsByStudent(
      params.studentId,
      rangeDays * 2 + 5,
      0
    );

    return calculateJourneyAnalytics({
      reports,
      rangeDays,
      todayDateStr,
    });
  }
}

export const reportService = new DailySadhanaReportService();
