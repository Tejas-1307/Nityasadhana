"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SevenDayDataPoint } from "@/lib/guru/service";
import { PersonalBaseline } from "@/lib/guru/attention-engine";
import { formatDuration } from "@/lib/reports/calculations";

export interface SevenDayTrendProps {
  trendData: SevenDayDataPoint[];
  baseline: PersonalBaseline;
}

export function SevenDayTrend({ trendData, baseline }: SevenDayTrendProps) {
  const submittedDays = trendData.filter((d) => d.isSubmitted).length;

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
              7-Day Personal Trend
            </span>
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              Recent Routine &amp; Consistency
            </h2>
          </div>
          <Badge variant="krishna" size="sm">
            <span>{submittedDays}/7 Days Submitted</span>
          </Badge>
        </div>

        {/* 7-Day Scannable Matrix */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {trendData.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                day.isSubmitted
                  ? "border-[#328A7A]/20 bg-[#328A7A]/5 text-[#193B3B]"
                  : "border-dashed border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/60 text-[#547070]"
              }`}
            >
              <span className="text-[11px] font-bold">{day.dayLabel}</span>
              <span className="text-[9px] text-[#547070]">{day.date.slice(8)}</span>

              <div className="my-2 flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold shadow-xs">
                {day.isSubmitted ? (
                  <span className="text-[11px] text-[#328A7A]">{day.totalRounds || 16}</span>
                ) : (
                  <span className="text-[10px] text-[#547070]/50">—</span>
                )}
              </div>

              <span className="text-[10px] font-medium text-[#547070]">
                {day.isSubmitted && day.wakeUpTime ? day.wakeUpTime : "No report"}
              </span>
            </div>
          ))}
        </div>

        {/* Personal Baseline Comparison Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
          <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3">
            <span className="text-[11px] font-semibold text-[#547070]">Avg Wake-up</span>
            <div className="mt-1 text-[16px] font-bold text-[#193B3B]">
              {baseline.medianWakeUpMinutes !== null && baseline.medianWakeUpMinutes !== undefined
                ? `${Math.floor(baseline.medianWakeUpMinutes / 60)}:${String(
                    baseline.medianWakeUpMinutes % 60
                  ).padStart(2, "0")}`
                : "—"}
            </div>
            <span className="text-[10px] text-[#547070]">Personal baseline</span>
          </div>

          <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3">
            <span className="text-[11px] font-semibold text-[#547070]">Avg Japa</span>
            <div className="mt-1 text-[16px] font-bold text-[#193B3B]">
              {baseline.medianTotalRounds !== null && baseline.medianTotalRounds !== undefined
                ? `${baseline.medianTotalRounds} rds`
                : "—"}
            </div>
            <span className="text-[10px] text-[#547070]">Personal baseline</span>
          </div>

          <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3">
            <span className="text-[11px] font-semibold text-[#547070]">Avg Reading</span>
            <div className="mt-1 text-[16px] font-bold text-[#193B3B]">
              {baseline.medianReadingMinutes !== null && baseline.medianReadingMinutes !== undefined
                ? formatDuration(baseline.medianReadingMinutes)
                : "—"}
            </div>
            <span className="text-[10px] text-[#547070]">Personal baseline</span>
          </div>

          <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3">
            <span className="text-[11px] font-semibold text-[#547070]">Avg Study</span>
            <div className="mt-1 text-[16px] font-bold text-[#193B3B]">
              {baseline.medianStudyMinutes !== null && baseline.medianStudyMinutes !== undefined
                ? formatDuration(baseline.medianStudyMinutes)
                : "—"}
            </div>
            <span className="text-[10px] text-[#547070]">Personal baseline</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
