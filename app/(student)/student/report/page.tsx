import * as React from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { requireShishya } from "@/lib/auth";
import { reportService } from "@/lib/reports/service";
import { ReportForm } from "@/components/reports/report-form";
import { ReportHistoryList } from "@/components/reports/report-history-list";
import { formatDevoteeDate } from "@/lib/utils/greeting";
import {
  Calendar,
  Sparkles,
  History,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentReportPage() {
  // Server-authoritative role guard (enforces role === 'shishya')
  const user = await requireShishya();

  // Load today's report, previous submitted report, and editing state
  const {
    todayDate,
    report: todayReport,
    previousReport,
    isEditable,
  } = await reportService.getTodayReport(user.id);

  // Load report history
  const { reports: historyReports, total: totalReports } = await reportService.getReportHistory(
    user.id,
    20
  );

  const formattedLongDate = formatDevoteeDate();
  const isSubmitted = todayReport?.status === "submitted";
  const isDraft = todayReport?.status === "draft";

  return (
    <main className="py-6 sm:py-10">
      <Container size="reading">
        {/* Report Page Header */}
        <div className="mb-6 space-y-1 sm:mb-8">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#D9822B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-serif">दैनिकप्रतिवेदनम्</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#20201D] sm:text-[28px]">
            Today&apos;s Sādhanā
          </h1>
          <p className="text-[14px] text-[#66635D]">
            Record your day with honesty and simplicity.
          </p>
        </div>

        {/* Date & Practice Status Card */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 sm:p-5">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#20201D]">
            <Calendar className="h-4 w-4 text-[#2457A6]" />
            <span>Practice Date: {formattedLongDate}</span>
          </div>

          <Badge
            variant={isSubmitted ? "krishna" : isDraft ? "saffron" : "neutral"}
            size="sm"
          >
            {isSubmitted ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Submitted</span>
              </span>
            ) : isDraft ? (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D9822B]" />
                <span>Draft Saved</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#66635D]" />
                <span>Not started</span>
              </span>
            )}
          </Badge>
        </div>

        {/* Dynamic Mobile-First Report Form */}
        <div className="mb-10">
          <ReportForm
            initialReport={todayReport}
            previousReport={previousReport}
            practiceDate={todayDate}
            isEditable={isEditable}
          />
        </div>

        {/* Report History Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#20201D]">
              <History className="h-4 w-4 text-[#2457A6]" />
              <span>Your Reports</span>
            </h2>
            <span className="text-[12px] text-[#66635D]">{totalReports} total entries</span>
          </div>

          <ReportHistoryList reports={historyReports} total={totalReports} />
        </div>
      </Container>
    </main>
  );
}
