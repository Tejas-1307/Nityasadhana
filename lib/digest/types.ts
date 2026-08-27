// ============================================================
// NITYASĀDHANĀ — GURU WEEKLY DIGEST TYPES
// ============================================================
// Domain types for 2-5 minute weekly intelligence workspace.
// ============================================================

import { DbUser, DbGuruFollowUp, FollowUpStatus } from "@/lib/db/schema";
import { AttentionLevel, AttentionSignal } from "@/lib/guru/attention";

export interface DigestSummary {
  totalActiveShishyas: number;
  studentsReportedCount: number;
  expectedReportsCount: number;
  submittedReportsCount: number;
  reportingConsistencyPercentage: number;
  studentsNeedingAttentionCount: number;
  followUpsDueCount: number;
  isWeekInProgress: boolean;
}

export interface DigestAttentionItem {
  shishya: DbUser;
  attentionLevel: AttentionLevel;
  headline: string;
  reasons: string[];
  primarySignal: AttentionSignal | null;
  missingReportsInWeek: number;
  lastReportDate?: string;
}

export interface DigestMissingReportItem {
  shishya: DbUser;
  missingCount: number;
  expectedCount: number;
  lastSubmittedDate?: string;
  attentionLevel: AttentionLevel;
}

export type MajorChangeMetric =
  | "wake_up_consistency"
  | "japa_average"
  | "reading_average"
  | "hearing_average"
  | "time_wasted_average";

export interface DigestMajorChangeItem {
  shishya: DbUser;
  metric: MajorChangeMetric;
  metricLabel: string;
  currentValue: string | number;
  previousValue: string | number;
  diffDescription: string;
  isFavorable: boolean;
  factualExplanation: string;
}

export interface DigestPositiveTrendItem {
  id: string;
  title: string;
  description: string;
  studentCount: number;
  category: "wake_up" | "japa" | "reading" | "sankalpa" | "reflection" | "time_waste";
}

export interface DigestFollowUpItem {
  followUp: DbGuruFollowUp;
  shishya: DbUser;
  status: FollowUpStatus;
  isDueThisWeek: boolean;
  isOverdue: boolean;
}

export interface GuruWeeklyDigest {
  weekStartDate: string; // YYYY-MM-DD (Monday)
  weekEndDate: string; // YYYY-MM-DD (Sunday)
  formattedRange: string; // "18 Aug — 24 Aug 2026"
  isWeekInProgress: boolean;
  prevWeekMonday: string;
  nextWeekMonday: string;
  summary: DigestSummary;
  attentionSuggestions: DigestAttentionItem[];
  missingReports: DigestMissingReportItem[];
  majorChanges: DigestMajorChangeItem[];
  positiveTrends: DigestPositiveTrendItem[];
  followUps: DigestFollowUpItem[];
  isAllSteady: boolean;
  hasInsufficientData: boolean;
}
