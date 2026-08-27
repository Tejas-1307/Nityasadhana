"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalBaseline } from "@/lib/guru/attention";
import { SevenDayDataPoint } from "@/lib/guru/service";
import { formatDuration } from "@/lib/reports/calculations";
import { Moon, CircleDot, BookOpen, Headphones, GraduationCap, Clock } from "lucide-react";

export interface SadhanaSummaryCardProps {
  trendData: SevenDayDataPoint[];
  baseline: PersonalBaseline;
}

export function SadhanaSummaryCard({ trendData, baseline }: SadhanaSummaryCardProps) {
  const submittedDays = trendData.filter((d) => d.isSubmitted);
  const count = submittedDays.length || 1;

  // Calculate 7-day averages from submitted reports
  let totalWakeMins = 0;
  let validWakeCount = 0;
  let totalRounds = 0;
  let totalReading = 0;
  let totalHearing = 0;
  let totalStudy = 0;
  let totalUnused = 0;

  for (const day of submittedDays) {
    if (day.wakeUpMinutes !== undefined && day.wakeUpMinutes !== null) {
      totalWakeMins += day.wakeUpMinutes;
      validWakeCount++;
    }
    totalRounds += day.totalRounds || 0;
    totalReading += day.readingMinutes || 0;
    totalHearing += day.hearingMinutes || 0;
    totalStudy += day.studyMinutes || 0;
    totalUnused += day.unusedMinutes || 0;
  }

  const avgWakeMins = validWakeCount > 0 ? Math.round(totalWakeMins / validWakeCount) : null;
  const avgWakeHours = avgWakeMins !== null ? Math.floor(avgWakeMins / 60) : null;
  const avgWakeMinsPart = avgWakeMins !== null ? avgWakeMins % 60 : null;
  const avgWakeFormatted =
    avgWakeHours !== null && avgWakeMinsPart !== null
      ? `${String(avgWakeHours).padStart(2, "0")}:${String(avgWakeMinsPart).padStart(2, "0")}`
      : "—";

  const avgRounds = submittedDays.length > 0 ? Math.round((totalRounds / count) * 10) / 10 : 0;
  const avgReading = submittedDays.length > 0 ? Math.round(totalReading / count) : 0;
  const avgHearing = submittedDays.length > 0 ? Math.round(totalHearing / count) : 0;
  const avgStudy = submittedDays.length > 0 ? Math.round(totalStudy / count) : 0;
  const avgUnused = submittedDays.length > 0 ? Math.round(totalUnused / count) : 0;

  // Baseline Formatted
  const baseWakeFormatted =
    baseline.medianWakeUpMinutes !== null
      ? `${Math.floor(baseline.medianWakeUpMinutes / 60)}:${String(
          baseline.medianWakeUpMinutes % 60
        ).padStart(2, "0")}`
      : "—";

  const baseRounds = baseline.medianTotalRounds !== null ? `${baseline.medianTotalRounds} rds` : "—";
  const baseReading =
    baseline.medianReadingMinutes !== null ? formatDuration(baseline.medianReadingMinutes) : "—";
  const baseHearing =
    baseline.medianHearingMinutes !== null ? formatDuration(baseline.medianHearingMinutes) : "—";
  const baseStudy =
    baseline.medianStudyMinutes !== null ? formatDuration(baseline.medianStudyMinutes) : "—";

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Sādhanā · Last 7 Days
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Recent Routine Summary
            </h2>
          </div>
          <Badge variant={submittedDays.length >= 6 ? "feather" : "saffron"} size="sm">
            <span>{submittedDays.length}/7 Days Recorded</span>
          </Badge>
        </div>

        {/* 6-Grid Metrics Matrix */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {/* 1. Wake-up */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Moon className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>Wake-up</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {validWakeCount > 0 ? `${avgWakeFormatted} AM` : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              base: <strong className="font-semibold text-[#20201D]">{baseWakeFormatted}</strong>
            </div>
          </div>

          {/* 2. Japa */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <CircleDot className="h-3.5 w-3.5 text-[#D9822B]" />
              <span>Japa</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {submittedDays.length > 0 ? `${avgRounds} avg` : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              base: <strong className="font-semibold text-[#20201D]">{baseRounds}</strong>
            </div>
          </div>

          {/* 3. Reading */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <BookOpen className="h-3.5 w-3.5 text-[#3D765B]" />
              <span>Reading</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {submittedDays.length > 0 ? formatDuration(avgReading) : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              base: <strong className="font-semibold text-[#20201D]">{baseReading}</strong>
            </div>
          </div>

          {/* 4. Hearing */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Headphones className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>Hearing</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {submittedDays.length > 0 ? formatDuration(avgHearing) : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              base: <strong className="font-semibold text-[#20201D]">{baseHearing}</strong>
            </div>
          </div>

          {/* 5. Study */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <GraduationCap className="h-3.5 w-3.5 text-[#66635D]" />
              <span>Study</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {submittedDays.length > 0 ? formatDuration(avgStudy) : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              base: <strong className="font-semibold text-[#20201D]">{baseStudy}</strong>
            </div>
          </div>

          {/* 6. Unused / Waste */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Clock className="h-3.5 w-3.5 text-[#8F5B1E]" />
              <span>Unused Time</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-[#20201D]">
              {submittedDays.length > 0 ? formatDuration(avgUnused) : "—"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              daily average
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
