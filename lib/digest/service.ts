// ============================================================
// NITYASĀDHANĀ — GURU WEEKLY DIGEST DOMAIN SERVICE
// ============================================================
// Provides high-performance, single-pass server-side weekly
// intelligence aggregation for Gurus managing 20-25 Shishyas.
// ============================================================

import { dbStore } from "@/lib/db/store";
import { evaluateAttention } from "@/lib/guru/attention";
import {
  getSankalpaWeekBoundaries,
  shiftSankalpaWeek,
  getSankalpaDaysList,
} from "@/lib/sankalpa/date-utils";
import { getLocalDateString } from "@/lib/reports/calculations";
import {
  GuruWeeklyDigest,
  DigestSummary,
  DigestAttentionItem,
  DigestMissingReportItem,
  DigestMajorChangeItem,
  DigestPositiveTrendItem,
  DigestFollowUpItem,
} from "./types";
import { WEEKLY_DIGEST_THRESHOLDS } from "./thresholds";

export class DigestService {
  /**
   * Generates the complete Weekly Digest for a specific Guru and week.
   * Single-pass in-memory aggregation prevents N+1 queries.
   */
  static async getGuruWeeklyDigest(
    guruId: string,
    referenceDateOrMonday?: string
  ): Promise<GuruWeeklyDigest> {
    const today = getLocalDateString();
    const week = getSankalpaWeekBoundaries(referenceDateOrMonday || today);
    const prevWeek = shiftSankalpaWeek(week.startDate, -1);
    const nextWeek = shiftSankalpaWeek(week.startDate, 1);

    const isWeekInProgress = today >= week.startDate && today <= week.endDate;

    // 1. Fetch authorized active Shishyas for this Guru
    const shishyaPairs = await dbStore.getShishyasByGuru(guruId, "active");
    const totalActiveShishyas = shishyaPairs.length;

    // Early exit for empty shishya roster
    if (totalActiveShishyas === 0) {
      return {
        weekStartDate: week.startDate,
        weekEndDate: week.endDate,
        formattedRange: week.formattedRange,
        isWeekInProgress,
        prevWeekMonday: prevWeek.startDate,
        nextWeekMonday: nextWeek.startDate,
        summary: {
          totalActiveShishyas: 0,
          studentsReportedCount: 0,
          expectedReportsCount: 0,
          submittedReportsCount: 0,
          reportingConsistencyPercentage: 100,
          studentsNeedingAttentionCount: 0,
          followUpsDueCount: 0,
          isWeekInProgress,
        },
        attentionSuggestions: [],
        missingReports: [],
        majorChanges: [],
        positiveTrends: [],
        followUps: [],
        isAllSteady: true,
        hasInsufficientData: true,
      };
    }

    // 2. Determine elapsed eligible days in current week
    const weekDays = getSankalpaDaysList(week.startDate, week.endDate, today);
    const eligibleDaysCount = isWeekInProgress
      ? weekDays.filter((d) => !d.isFuture).length
      : 7;

    // Aggregation buckets
    let totalSubmittedReportsInWeek = 0;
    let studentsWithAtLeastOneReport = 0;

    const attentionSuggestions: DigestAttentionItem[] = [];
    const missingReports: DigestMissingReportItem[] = [];
    const majorChanges: DigestMajorChangeItem[] = [];
    const followUps: DigestFollowUpItem[] = [];

    // Group-level positive trend counters
    let improvedWakeUpCount = 0;
    let steadyJapaCount = 0;
    let increasedReadingCount = 0;
    let reducedTimeWasteCount = 0;
    let completedSankalpaCount = 0;
    let completedReflectionCount = 0;

    // 3. Process each Shishya's data in single pass
    for (const { shishya } of shishyaPairs) {
      // Fetch recent 30-day reports to evaluate baselines, attention, and week comparisons
      const { reports: allStudentReports } = await dbStore.getReportsByStudent(shishya.id, 40, 0);

      // Current week reports (Monday to Sunday)
      const currentWeekReports = allStudentReports.filter(
        (r) => r.practiceDate >= week.startDate && r.practiceDate <= week.endDate && r.status === "submitted"
      );

      // Previous week reports (Monday to Sunday)
      const prevWeekReports = allStudentReports.filter(
        (r) => r.practiceDate >= prevWeek.startDate && r.practiceDate <= prevWeek.endDate && r.status === "submitted"
      );

      totalSubmittedReportsInWeek += currentWeekReports.length;
      if (currentWeekReports.length > 0) {
        studentsWithAtLeastOneReport++;
      }

      // Most recent report date
      const lastReport = currentWeekReports.length > 0
        ? currentWeekReports[0]
        : allStudentReports.find((r) => r.status === "submitted");

      const lastSubmittedDate = lastReport?.practiceDate;

      // --- A. Attention Engine Evaluation ---
      const todayReport = allStudentReports.find((r) => r.practiceDate === today && r.status === "submitted") || null;
      const attentionAssessment = evaluateAttention({
        student: shishya,
        todayReport,
        historicalReports: allStudentReports,
        currentDateStr: isWeekInProgress ? today : week.endDate,
      });
      const isAttentionNeeded = attentionAssessment.level !== "STABLE";

      const missingInWeek = Math.max(0, eligibleDaysCount - currentWeekReports.length);

      if (isAttentionNeeded) {
        const reasons = attentionAssessment.signals.map((s) => s.reason).filter(Boolean);
        if (reasons.length === 0 && attentionAssessment.summaryDetail) {
          reasons.push(attentionAssessment.summaryDetail);
        }

        attentionSuggestions.push({
          shishya,
          attentionLevel: attentionAssessment.level,
          headline: attentionAssessment.summaryHeadline || "Pattern shift detected",
          reasons,
          primarySignal: attentionAssessment.primarySignal,
          missingReportsInWeek: missingInWeek,
          lastReportDate: lastSubmittedDate,
        });
      }

      // --- B. Missing Reports Tracking ---
      if (missingInWeek >= WEEKLY_DIGEST_THRESHOLDS.MISSING_REPORTS_FLAG) {
        missingReports.push({
          shishya,
          missingCount: missingInWeek,
          expectedCount: eligibleDaysCount,
          lastSubmittedDate,
          attentionLevel: attentionAssessment.level,
        });
      }

      // --- C. Student vs Self: Major Changes & Trend Analysis ---
      // (Requires at least some data in current or previous week)
      if (currentWeekReports.length > 0 || prevWeekReports.length > 0) {
        // 1. Wake-up consistency (wake-up <= 04:00 AM)
        const currEarlyDays = currentWeekReports.filter((r) => {
          const [h, m] = r.wakeUpTime.split(":").map(Number);
          return h * 60 + m <= WEEKLY_DIGEST_THRESHOLDS.EARLY_RISING_TARGET_MINUTES;
        }).length;

        const prevEarlyDays = prevWeekReports.filter((r) => {
          const [h, m] = r.wakeUpTime.split(":").map(Number);
          return h * 60 + m <= WEEKLY_DIGEST_THRESHOLDS.EARLY_RISING_TARGET_MINUTES;
        }).length;

        const wakeUpDiff = currEarlyDays - prevEarlyDays;
        if (Math.abs(wakeUpDiff) >= WEEKLY_DIGEST_THRESHOLDS.WAKE_UP_CONSISTENCY_CHANGE_DAYS && prevWeekReports.length > 0) {
          majorChanges.push({
            shishya,
            metric: "wake_up_consistency",
            metricLabel: "Early Rising Consistency",
            currentValue: `${currEarlyDays}/${currentWeekReports.length || 7} days`,
            previousValue: `${prevEarlyDays}/${prevWeekReports.length || 7} days`,
            diffDescription: wakeUpDiff > 0 ? `+${wakeUpDiff} days` : `${wakeUpDiff} days`,
            isFavorable: wakeUpDiff > 0,
            factualExplanation:
              wakeUpDiff > 0
                ? `Woke up at or before 04:00 AM on ${currEarlyDays} days (increased from ${prevEarlyDays} days last week).`
                : `Early rising consistency changed from ${prevEarlyDays} days to ${currEarlyDays} days.`,
          });
        }

        if (wakeUpDiff > 0) {
          improvedWakeUpCount++;
        }

        // 2. Average Japa rounds
        const currAvgJapa = currentWeekReports.length > 0
          ? Math.round(currentWeekReports.reduce((s, r) => s + r.totalRounds, 0) / currentWeekReports.length)
          : 0;

        const prevAvgJapa = prevWeekReports.length > 0
          ? Math.round(prevWeekReports.reduce((s, r) => s + r.totalRounds, 0) / prevWeekReports.length)
          : 0;

        const japaDiff = currAvgJapa - prevAvgJapa;
        if (Math.abs(japaDiff) >= WEEKLY_DIGEST_THRESHOLDS.JAPA_ROUNDS_CHANGE && prevWeekReports.length > 0 && currentWeekReports.length > 0) {
          majorChanges.push({
            shishya,
            metric: "japa_average",
            metricLabel: "Japa Average",
            currentValue: `${currAvgJapa} rounds`,
            previousValue: `${prevAvgJapa} rounds`,
            diffDescription: japaDiff > 0 ? `+${japaDiff} rounds` : `${japaDiff} rounds`,
            isFavorable: japaDiff > 0,
            factualExplanation:
              japaDiff > 0
                ? `Japa average increased to ${currAvgJapa} rounds daily (from ${prevAvgJapa} rounds last week).`
                : `Japa average changed to ${currAvgJapa} rounds daily (from ${prevAvgJapa} rounds last week).`,
          });
        }

        if (currAvgJapa >= WEEKLY_DIGEST_THRESHOLDS.STEADY_JAPA_ROUNDS_TARGET) {
          steadyJapaCount++;
        }

        // 3. Average reading duration
        const currAvgReading = currentWeekReports.length > 0
          ? Math.round(currentWeekReports.reduce((s, r) => s + r.readingDurationMinutes, 0) / currentWeekReports.length)
          : 0;

        const prevAvgReading = prevWeekReports.length > 0
          ? Math.round(prevWeekReports.reduce((s, r) => s + r.readingDurationMinutes, 0) / prevWeekReports.length)
          : 0;

        const readingDiff = currAvgReading - prevAvgReading;
        if (Math.abs(readingDiff) >= WEEKLY_DIGEST_THRESHOLDS.READING_MINUTES_CHANGE && prevWeekReports.length > 0 && currentWeekReports.length > 0) {
          majorChanges.push({
            shishya,
            metric: "reading_average",
            metricLabel: "Reading Duration",
            currentValue: `${currAvgReading} min`,
            previousValue: `${prevAvgReading} min`,
            diffDescription: readingDiff > 0 ? `+${readingDiff} min` : `${readingDiff} min`,
            isFavorable: readingDiff > 0,
            factualExplanation:
              readingDiff > 0
                ? `Reading time averaged ${currAvgReading} minutes daily (up by ${readingDiff} min).`
                : `Reading time averaged ${currAvgReading} minutes daily (down by ${Math.abs(readingDiff)} min).`,
          });
        }

        if (readingDiff >= 10 || currAvgReading >= WEEKLY_DIGEST_THRESHOLDS.STEADY_READING_MINUTES_TARGET) {
          increasedReadingCount++;
        }

        // 4. Time wasted change
        const currAvgWaste = currentWeekReports.length > 0
          ? Math.round(currentWeekReports.reduce((s, r) => s + r.timeWastedDurationMinutes, 0) / currentWeekReports.length)
          : 0;

        const prevAvgWaste = prevWeekReports.length > 0
          ? Math.round(prevWeekReports.reduce((s, r) => s + r.timeWastedDurationMinutes, 0) / prevWeekReports.length)
          : 0;

        const wasteDiff = currAvgWaste - prevAvgWaste;
        if (Math.abs(wasteDiff) >= WEEKLY_DIGEST_THRESHOLDS.TIME_WASTED_CHANGE_MINUTES && prevWeekReports.length > 0 && currentWeekReports.length > 0) {
          majorChanges.push({
            shishya,
            metric: "time_wasted_average",
            metricLabel: "Time Waste Average",
            currentValue: `${currAvgWaste} min`,
            previousValue: `${prevAvgWaste} min`,
            diffDescription: wasteDiff > 0 ? `+${wasteDiff} min` : `${wasteDiff} min`,
            isFavorable: wasteDiff < 0, // Less waste is favorable
            factualExplanation:
              wasteDiff < 0
                ? `Reported time wasted reduced to ${currAvgWaste} minutes daily (down from ${prevAvgWaste} min).`
                : `Reported time wasted averaged ${currAvgWaste} minutes daily (up from ${prevAvgWaste} min).`,
          });
        }

        if (wasteDiff < 0 && prevAvgWaste > 0) {
          reducedTimeWasteCount++;
        }
      }

      // --- D. Weekly Sankalpa & Reflection Checks ---
      const sankalpas = await dbStore.getSankalpasByStudent(shishya.id, 1, 0);
      if (sankalpas.sankalpas.length > 0) {
        const s = sankalpas.sankalpas[0];
        if (s.startDate === week.startDate && s.status === "completed") {
          completedSankalpaCount++;
        }
      }

      const refl = await dbStore.getReflectionForWeek(shishya.id, week.startDate);
      if (refl) {
        completedReflectionCount++;
      }

      // --- E. Follow-Up Reminders ---
      const studentFollowUps = await dbStore.getFollowUps(guruId, shishya.id);
      for (const fu of studentFollowUps) {
        if (fu.status !== "completed") {
          const isDueThisWeek = fu.followUpDate >= week.startDate && fu.followUpDate <= week.endDate;
          const isOverdue = fu.followUpDate < today;

          followUps.push({
            followUp: fu,
            shishya,
            status: fu.status,
            isDueThisWeek,
            isOverdue,
          });
        }
      }
    }

    // 4. Assemble Group-Level Positive Trends
    const positiveTrends: DigestPositiveTrendItem[] = [];

    if (improvedWakeUpCount > 0) {
      positiveTrends.push({
        id: "trend_wake_up",
        title: "Early Rising Consistency",
        description: `${improvedWakeUpCount} ${improvedWakeUpCount === 1 ? "student" : "students"} improved early rising consistency compared with last week.`,
        studentCount: improvedWakeUpCount,
        category: "wake_up",
      });
    }

    if (steadyJapaCount > 0) {
      positiveTrends.push({
        id: "trend_japa",
        title: "Steady Japa Routine",
        description: `${steadyJapaCount} ${steadyJapaCount === 1 ? "student" : "students"} maintained a steady 16+ rounds daily average.`,
        studentCount: steadyJapaCount,
        category: "japa",
      });
    }

    if (increasedReadingCount > 0) {
      positiveTrends.push({
        id: "trend_reading",
        title: "Scripture Study & Reading",
        description: `${increasedReadingCount} ${increasedReadingCount === 1 ? "student" : "students"} maintained or increased reading discipline.`,
        studentCount: increasedReadingCount,
        category: "reading",
      });
    }

    if (reducedTimeWasteCount > 0) {
      positiveTrends.push({
        id: "trend_time_waste",
        title: "Reduced Time Waste",
        description: `${reducedTimeWasteCount} ${reducedTimeWasteCount === 1 ? "student" : "students"} reduced reported time waste this week.`,
        studentCount: reducedTimeWasteCount,
        category: "time_waste",
      });
    }

    if (completedSankalpaCount > 0) {
      positiveTrends.push({
        id: "trend_sankalpa",
        title: "Weekly Sankalpa Accomplished",
        description: `${completedSankalpaCount} ${completedSankalpaCount === 1 ? "student" : "students"} completed their weekly spiritual focus.`,
        studentCount: completedSankalpaCount,
        category: "sankalpa",
      });
    }

    if (completedReflectionCount > 0) {
      positiveTrends.push({
        id: "trend_reflection",
        title: "Weekly Reflections Saved",
        description: `${completedReflectionCount} ${completedReflectionCount === 1 ? "student" : "students"} completed their weekly honest reflection.`,
        studentCount: completedReflectionCount,
        category: "reflection",
      });
    }

    // 5. Summary calculations
    const expectedReportsCount = totalActiveShishyas * eligibleDaysCount;
    const reportingConsistencyPercentage = expectedReportsCount > 0
      ? Math.min(100, Math.round((totalSubmittedReportsInWeek / expectedReportsCount) * 100))
      : 0;

    const summary: DigestSummary = {
      totalActiveShishyas,
      studentsReportedCount: studentsWithAtLeastOneReport,
      expectedReportsCount,
      submittedReportsCount: totalSubmittedReportsInWeek,
      reportingConsistencyPercentage,
      studentsNeedingAttentionCount: attentionSuggestions.length,
      followUpsDueCount: followUps.length,
      isWeekInProgress,
    };

    const isAllSteady =
      attentionSuggestions.length === 0 &&
      missingReports.length === 0 &&
      followUps.length === 0;

    const hasInsufficientData = totalSubmittedReportsInWeek === 0;

    // Sort attention suggestions: FOLLOW_UP_SUGGESTED first, then OBSERVE
    attentionSuggestions.sort((a, b) => {
      if (a.attentionLevel === "FOLLOW_UP_SUGGESTED" && b.attentionLevel !== "FOLLOW_UP_SUGGESTED") return -1;
      if (b.attentionLevel === "FOLLOW_UP_SUGGESTED" && a.attentionLevel !== "FOLLOW_UP_SUGGESTED") return 1;
      return b.missingReportsInWeek - a.missingReportsInWeek;
    });

    // Sort missing reports descending by count
    missingReports.sort((a, b) => b.missingCount - a.missingCount);

    return {
      weekStartDate: week.startDate,
      weekEndDate: week.endDate,
      formattedRange: week.formattedRange,
      isWeekInProgress,
      prevWeekMonday: prevWeek.startDate,
      nextWeekMonday: nextWeek.startDate,
      summary,
      attentionSuggestions,
      missingReports,
      majorChanges,
      positiveTrends,
      followUps,
      isAllSteady,
      hasInsufficientData,
    };
  }
}
