"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import {
  formatDuration,
  generateWhatsAppSummary,
} from "@/lib/reports/calculations";
import { ReportReviewCard } from "./report-review-card";
import {
  History,
  ChevronDown,
  ChevronUp,
  Moon,
  CircleDot,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

export interface ReportHistoryListProps {
  reports: DbDailySadhanaReport[];
  total?: number;
}

export function ReportHistoryList({ reports }: ReportHistoryListProps) {
  const [expandedReportId, setExpandedReportId] = React.useState<string | null>(null);
  const [copiedReportId, setCopiedReportId] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedReportId((prev) => (prev === id ? null : id));
  };

  const handleCopySummary = async (report: DbDailySadhanaReport, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const text = generateWhatsAppSummary(report);
      await navigator.clipboard.writeText(text);
      setCopiedReportId(report.id);
      setTimeout(() => setCopiedReportId(null), 2500);
    } catch {
      // Fallback
    }
  };

  if (!reports || reports.length === 0) {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 text-center shadow-level1">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F4] text-[#3F9495]">
          <History className="h-5 w-5" />
        </div>
        <h4 className="mt-2 text-[14px] font-bold text-[#193B3B]">
          Your previous reports will appear here
        </h4>
        <p className="mt-1 text-[12px] text-[#547070]">
          As you submit daily reports, your historical entries and practice reflections will be
          organized here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => {
        const isExpanded = expandedReportId === report.id;
        const isCopied = copiedReportId === report.id;

        return (
          <div
            key={report.id}
            className="overflow-hidden rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white shadow-level1 transition-all duration-200"
          >
            {/* Header / Summary Bar (Click to expand) */}
            <button
              type="button"
              onClick={() => toggleExpand(report.id)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-[#EAF7F4]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#193B3B]">
                    {report.practiceDate}
                  </span>
                  <Badge
                    variant={report.status === "submitted" ? "krishna" : "neutral"}
                    size="sm"
                  >
                    {report.status === "submitted" ? "Submitted" : "Draft"}
                  </Badge>
                </div>

                {/* Quick metrics pills */}
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#547070]">
                  <span className="flex items-center gap-1 font-medium text-[#193B3B]">
                    <Moon className="h-3.5 w-3.5 text-[#3F9495]" />
                    <span>{formatDuration(report.sleepDurationMinutes)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-[#193B3B]">
                    <CircleDot className="h-3.5 w-3.5 text-[#A9824D]" />
                    <span>{report.totalRounds} rounds</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-[#193B3B]">
                    <BookOpen className="h-3.5 w-3.5 text-[#328A7A]" />
                    <span>{formatDuration(report.readingDurationMinutes)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleCopySummary(report, e)}
                  title="Copy Summary"
                  className="h-8 px-2.5 text-[11px]"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[#547070]">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {/* Expanded Detailed Breakdown */}
            {isExpanded && (
              <div className="border-t border-[rgba(63,148,149,0.12)] bg-[#F7F5EF]/30 p-4">
                <ReportReviewCard
                  practiceDate={report.practiceDate}
                  sleepTime={report.sleepTime}
                  wakeUpTime={report.wakeUpTime}
                  japaRounds={report.japaRounds}
                  extraRounds={report.extraRounds}
                  japaCompletedAt={report.japaCompletedAt}
                  readingDurationMinutes={report.readingDurationMinutes}
                  readingNote={report.readingNote}
                  hearingDurationMinutes={report.hearingDurationMinutes}
                  hearingNote={report.hearingNote}
                  collegeStudyDurationMinutes={report.collegeStudyDurationMinutes}
                  selfStudyDurationMinutes={report.selfStudyDurationMinutes}
                  dayRestDurationMinutes={report.dayRestDurationMinutes}
                  timeWastedDurationMinutes={report.timeWastedDurationMinutes}
                  notes={report.notes}
                  status={report.status}
                  className="border-none bg-transparent p-0 shadow-none"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
