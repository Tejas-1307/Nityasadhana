import * as React from "react";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import {
  formatDuration,
  formatTime12Hour,
} from "@/lib/reports/calculations";
import {
  Moon,
  CircleDot,
  BookOpen,
  Headphones,
  GraduationCap,
  Clock,
} from "lucide-react";

export interface SadhanaMetricGridProps {
  report?: DbDailySadhanaReport | null;
  className?: string;
}

export function SadhanaMetricGrid({ report, className }: SadhanaMetricGridProps) {
  const hasData = Boolean(report);

  return (
    <div className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 ${className || ""}`}>
      {/* 1. Wake & Sleep */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <Moon className="h-3.5 w-3.5 text-[#3F9495]" />
          <span>Wake & Sleep</span>
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
          {hasData && report?.wakeUpTime ? formatTime12Hour(report.wakeUpTime) : "--:--"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report?.sleepDurationMinutes
            ? `${formatDuration(report.sleepDurationMinutes)} sleep`
            : "Not recorded"}
        </div>
      </div>

      {/* 2. Japa */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <CircleDot className="h-3.5 w-3.5 text-[#A9824D]" />
          <span>Japa Chanting</span>
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
          {hasData && report ? `${report.totalRounds} rounds` : "-- rounds"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report
            ? report.extraRounds > 0
              ? `${report.japaRounds} std + ${report.extraRounds} extra`
              : "Standard rounds"
            : "Not recorded"}
        </div>
      </div>

      {/* 3. Study */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <GraduationCap className="h-3.5 w-3.5 text-[#547070]" />
          <span>Study & Seva</span>
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
          {hasData && report ? formatDuration(report.totalStudyDurationMinutes) : "--"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report
            ? `${formatDuration(report.collegeStudyDurationMinutes)} col + ${formatDuration(report.selfStudyDurationMinutes)} self`
            : "Not recorded"}
        </div>
      </div>

      {/* 4. Reading */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <BookOpen className="h-3.5 w-3.5 text-[#328A7A]" />
          <span>Śāstra Reading</span>
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
          {hasData && report ? formatDuration(report.readingDurationMinutes) : "--"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report?.readingNote ? report.readingNote : "Daily reading"}
        </div>
      </div>

      {/* 5. Hearing */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <Headphones className="h-3.5 w-3.5 text-[#3F9495]" />
          <span>Śravaṇam (Hearing)</span>
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
          {hasData && report ? formatDuration(report.hearingDurationMinutes) : "--"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report?.hearingNote ? report.hearingNote : "Lectures & discourses"}
        </div>
      </div>

      {/* 6. Rest & Time (Neutral tone) */}
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#547070]">
          <Clock className="h-3.5 w-3.5 text-[#547070]" />
          <span>Rest & Time</span>
        </div>
        <div className="mt-1.5 text-[14px] font-bold text-[#193B3B]">
          {hasData && report ? `Rest ${formatDuration(report.dayRestDurationMinutes)}` : "--"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[#547070]">
          {hasData && report ? `Wasted ${formatDuration(report.timeWastedDurationMinutes)}` : "--"}
        </div>
      </div>
    </div>
  );
}
