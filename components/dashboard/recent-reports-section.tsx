import * as React from "react";
import Link from "next/link";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import { formatDuration, formatTime12Hour } from "@/lib/reports/calculations";
import { History, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

export interface RecentReportsSectionProps {
  reports: DbDailySadhanaReport[];
  className?: string;
}

export function RecentReportsSection({
  reports,
  className,
}: RecentReportsSectionProps) {
  if (!reports || reports.length === 0) {
    return (
      <div
        className={`rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 text-center shadow-level1 ${
          className || ""
        }`}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E5] text-[#66635D]">
          <History className="h-5 w-5" />
        </div>
        <h4 className="mt-3 text-[14px] font-bold text-[#20201D]">No reports yet</h4>
        <p className="mt-1 text-[12px] text-[#66635D]">
          Your recent practice records will appear here as you submit them.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-[#20201D]">
          <History className="h-4 w-4 text-[#2457A6]" />
          <span>Recent Practice Reports</span>
        </h3>
        <Link
          href="/student/report"
          className="flex items-center gap-1 text-[12px] font-semibold text-[#2457A6] hover:underline"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-[rgba(32,32,29,0.06)] overflow-hidden rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white shadow-level1">
        {reports.map((report) => {
          const isSubmitted = report.status === "submitted";
          const [year, month, day] = report.practiceDate.split("-");
          const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
          const formattedDate = dateObj.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });

          return (
            <Link
              key={report.id}
              href="/student/report"
              className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-[#F7F1E5]/50 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isSubmitted
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isSubmitted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-amber-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#20201D]">
                      {formattedDate}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isSubmitted ? "text-emerald-800" : "text-amber-800"
                      }`}
                    >
                      {isSubmitted ? "Complete" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#66635D]">
                    <span>{report.totalRounds} rounds</span>
                    <span>·</span>
                    <span>{formatDuration(report.totalStudyDurationMinutes)} study</span>
                    {report.wakeUpTime && (
                      <>
                        <span>·</span>
                        <span>Wake {formatTime12Hour(report.wakeUpTime)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-[#66635D]/50" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
