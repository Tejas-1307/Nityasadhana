"use server";

import { requireShishya } from "@/lib/auth";
import { reportService, StudentDashboardData } from "@/lib/reports/service";
import { DailySadhanaReportInput, canEditReport } from "@/lib/reports/validation";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import { REPORT_CONFIG } from "@/lib/reports/config";
import { JourneyAnalytics } from "@/lib/reports/calculations";
import { rateLimiter, RATE_LIMITS } from "@/lib/security/rate-limit";
import { NotificationService } from "@/lib/notifications/service";

export interface ReportActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Fetches today's report and editing state for the authenticated Shishya.
 */
export async function getTodayReportDataAction(): Promise<
  ReportActionResponse<{
    todayDate: string;
    report: DbDailySadhanaReport | null;
    previousReport: DbDailySadhanaReport | null;
    isEditable: boolean;
  }>
> {
  try {
    const shishya = await requireShishya();
    const result = await reportService.getTodayReport(shishya.id);

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load today's report.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Saves a partial or draft report for the authenticated Shishya.
 */
export async function saveReportDraftAction(
  input: Partial<DailySadhanaReportInput>
): Promise<ReportActionResponse<{ report: DbDailySadhanaReport }>> {
  try {
    const shishya = await requireShishya();
    const result = await reportService.saveOrSubmitReport({
      studentId: shishya.id,
      input,
      status: "draft",
    });

    if (!result.success || !result.report) {
      return { success: false, error: result.error || "Failed to save draft." };
    }

    return {
      success: true,
      data: { report: result.report },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to save draft.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Validates, calculates, and submits a completed report.
 */
export async function submitDailyReportAction(
  input: Partial<DailySadhanaReportInput>
): Promise<ReportActionResponse<{ report: DbDailySadhanaReport }>> {
  try {
    const shishya = await requireShishya();

    const rateCheck = rateLimiter.check(
      `report_submit:${shishya.id}`,
      RATE_LIMITS.REPORT_SUBMISSION.limit,
      RATE_LIMITS.REPORT_SUBMISSION.windowMs
    );
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: "Too many report submissions. Please wait a moment before submitting again.",
      };
    }

    const result = await reportService.saveOrSubmitReport({
      studentId: shishya.id,
      input,
      status: "submitted",
    });

    if (!result.success || !result.report) {
      return { success: false, error: result.error || "Failed to submit report." };
    }

    // Smart Suppression: cancel any pending daily report reminders for this practice date
    try {
      await NotificationService.suppressDailyReportReminder(shishya.id, result.report.practiceDate);
    } catch {
      // Failure isolation: notification failure never disrupts report submission
    }

    return {
      success: true,
      data: { report: result.report },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to submit report.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Retrieves paginated past reports strictly for the authenticated Shishya.
 */
export async function getReportHistoryDataAction(
  limit: number = 20,
  offset: number = 0
): Promise<
  ReportActionResponse<{
    reports: DbDailySadhanaReport[];
    total: number;
  }>
> {
  try {
    const shishya = await requireShishya();
    const result = await reportService.getReportHistory(shishya.id, limit, offset);

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch report history.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Retrieves a specific report detail strictly verifying ownership.
 */
export async function getReportDetailDataAction(reportId: string): Promise<
  ReportActionResponse<{
    report: DbDailySadhanaReport;
    isEditable: boolean;
  }>
> {
  try {
    const shishya = await requireShishya();
    const report = await reportService.getReportByIdForStudent(reportId, shishya.id);

    if (!report) {
      return { success: false, error: "Report not found or unauthorized." };
    }

    const isEditable = canEditReport(report.practiceDate, report.timezone || REPORT_CONFIG.DEFAULT_TIMEZONE);

    return {
      success: true,
      data: { report, isEditable },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch report details.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Fetches complete student dashboard orientation data.
 */
export async function getStudentDashboardDataAction(): Promise<
  ReportActionResponse<StudentDashboardData>
> {
  try {
    const shishya = await requireShishya();
    const result = await reportService.getStudentDashboard(shishya.id);

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load student dashboard.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Server Action: Fetches personal Journey analytics for the authenticated Shishya.
 */
export async function getStudentJourneyDataAction(
  rangeDays: 7 | 30 = 7
): Promise<ReportActionResponse<JourneyAnalytics>> {
  try {
    const shishya = await requireShishya();
    const result = await reportService.getStudentJourney({
      studentId: shishya.id,
      rangeDays,
    });

    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load student journey.";
    return { success: false, error: errorMsg };
  }
}
