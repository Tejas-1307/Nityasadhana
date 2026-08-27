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
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header & Total Active */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Today&apos;s Reporting Status
            </span>
            <h2 className="text-[18px] font-bold text-[#20201D] sm:text-[20px]">
              {submittedCount} of {totalActive} Reports Received
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              <Users className="mr-1 h-3 w-3" />
              <span>{totalActive} Active</span>
            </Badge>
            {totalInactive > 0 && (
              <span className="text-[11px] text-[#66635D]">({totalInactive} inactive)</span>
            )}
          </div>
        </div>

        {/* Quiet Administrative Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#F7F1E5]">
            <div
              className="h-full rounded-full bg-[#3D765B] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#66635D]">
            <span>Administrative reporting status for today</span>
            <span className="font-semibold text-[#20201D]">{percentage}% received</span>
          </div>
        </div>

        {/* 3 Scannable Status Blocks */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Submitted */}
          <div className="rounded-2xl border border-[#3D765B]/15 bg-[#3D765B]/5 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3D765B]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Received</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D] sm:text-[24px]">
              {submittedCount}
            </div>
            <div className="text-[10px] text-[#66635D]">Completed today</div>
          </div>

          {/* Pending Draft */}
          <div className="rounded-2xl border border-[#D9822B]/15 bg-[#D9822B]/5 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D9822B]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Pending</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D] sm:text-[24px]">
              {pendingCount}
            </div>
            <div className="text-[10px] text-[#66635D]">Draft started</div>
          </div>

          {/* Not Yet Submitted */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/40 p-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Awaiting</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D] sm:text-[24px]">
              {notSubmittedCount}
            </div>
            <div className="text-[10px] text-[#66635D]">Not yet submitted</div>
          </div>
        </div>

        {/* Quick Link to Weekly Digest */}
        <div className="flex items-center justify-between rounded-xl border border-[#D9822B]/20 bg-[#D9822B]/5 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#20201D]">
              Want a 2–5 min summary of this week?
            </span>
          </div>
          <a
            href="/guru/digest"
            className="text-[12px] font-bold text-[#D9822B] hover:underline"
          >
            Open Weekly Digest →
          </a>
        </div>
      </div>
    </Card>
  );
}
