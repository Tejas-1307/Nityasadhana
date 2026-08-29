import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle, Users } from "lucide-react";

export interface ReportingOverviewCardProps {
  totalActive: number;
  totalInactive?: number;
  submittedCount: number;
  pendingCount: number;
  notSubmittedCount: number;
}

export function ReportingOverviewCard({
  totalActive,
  totalInactive = 0,
  submittedCount,
  pendingCount,
  notSubmittedCount,
}: ReportingOverviewCardProps) {
  const percentage =
    totalActive > 0 ? Math.round((submittedCount / totalActive) * 100) : 0;

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header & Total Active */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
              Today&apos;s Reporting Status
            </span>
            <h2 className="text-[18px] font-bold text-[#193B3B] sm:text-[20px]">
              {submittedCount} of {totalActive} Reports Received
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              <Users className="mr-1 h-3 w-3" />
              <span>{totalActive} Active</span>
            </Badge>
            {totalInactive > 0 && (
              <span className="text-[11px] text-[#547070]">({totalInactive} inactive)</span>
            )}
          </div>
        </div>

        {/* Quiet Administrative Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EAF7F4]">
            <div
              className="h-full rounded-full bg-[#328A7A] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#547070]">
            <span>Administrative reporting status for today</span>
            <span className="font-semibold text-[#193B3B]">{percentage}% received</span>
          </div>
        </div>

        {/* 3 Scannable Status Blocks */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Submitted */}
          <div className="rounded-2xl border border-[#328A7A]/20 bg-[#328A7A]/5 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#328A7A]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Received</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#193B3B] sm:text-[24px]">
              {submittedCount}
            </div>
            <div className="text-[10px] text-[#547070]">Completed today</div>
          </div>

          {/* Pending Draft */}
          <div className="rounded-2xl border border-[#A9824D]/20 bg-[#A9824D]/5 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A9824D]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Pending</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#193B3B] sm:text-[24px]">
              {pendingCount}
            </div>
            <div className="text-[10px] text-[#547070]">Draft started</div>
          </div>

          {/* Not Yet Submitted */}
          <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Awaiting</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#193B3B] sm:text-[24px]">
              {notSubmittedCount}
            </div>
            <div className="text-[10px] text-[#547070]">Not yet submitted</div>
          </div>
        </div>

        {/* Quick Link to Weekly Digest */}
        <div className="flex items-center justify-between rounded-xl border border-[#A9824D]/25 bg-[#A9824D]/5 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#193B3B]">
              Want a 2–5 min summary of this week?
            </span>
          </div>
          <a
            href="/guru/digest"
            className="text-[12px] font-bold text-[#A9824D] hover:underline"
          >
            Open Weekly Digest →
          </a>
        </div>
      </div>
    </Card>
  );
}
