import * as React from "react";
import { JourneyAnalytics } from "@/lib/reports/calculations";
import { CalendarCheck, CircleDot, GraduationCap, Moon, BookOpen } from "lucide-react";

export interface JourneySummaryCardProps {
  analytics: JourneyAnalytics;
  className?: string;
}

export function JourneySummaryCard({ analytics, className }: JourneySummaryCardProps) {
  const { rangeDays, overview, comparison, hasEnoughData } = analytics;

  return (
    <div
      className={`rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-6 ${
        className || ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(32,32,29,0.06)] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2457A6]/10 text-[#2457A6]">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#20201D]">
              Your Last {rangeDays} Days Summary
            </h3>
            <span className="text-[11px] text-[#66635D]">
              {overview.submittedCount} of {overview.totalDays} reports recorded
            </span>
          </div>
        </div>

        {overview.currentStreak > 0 && (
          <span className="rounded-full bg-[#2457A6]/10 px-3 py-1 text-[12px] font-bold text-[#2457A6]">
            {overview.currentStreak} consecutive {overview.currentStreak === 1 ? "day" : "days"}
          </span>
        )}
      </div>

      {/* Primary Key Metric Pills */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* Japa Average */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/30 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
            <CircleDot className="h-3.5 w-3.5 text-[#D9822B]" />
            <span>Japa Avg</span>
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#20201D]">
            {hasEnoughData ? comparison.japa.formattedCurrent : "--"}
          </div>
        </div>

        {/* Study Average */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/30 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
            <GraduationCap className="h-3.5 w-3.5 text-[#66635D]" />
            <span>Study Avg</span>
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#20201D]">
            {hasEnoughData ? comparison.study.formattedCurrent : "--"}
          </div>
        </div>

        {/* Wake-Up Average */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/30 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
            <Moon className="h-3.5 w-3.5 text-[#2457A6]" />
            <span>Wake Avg</span>
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#20201D]">
            {hasEnoughData ? comparison.wakeUp.formattedCurrent : "--"}
          </div>
        </div>

        {/* Reading Average */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/30 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
            <BookOpen className="h-3.5 w-3.5 text-[#3D765B]" />
            <span>Reading Avg</span>
          </div>
          <div className="mt-1 text-[16px] font-bold text-[#20201D]">
            {hasEnoughData ? comparison.reading.formattedCurrent : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}
