"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SevenDayDataPoint, TrendSummaries } from "@/lib/guru/service";
import { PersonalBaseline } from "@/lib/guru/attention";
import { formatDuration } from "@/lib/reports/calculations";
import { CircleDot, Moon, BookOpen, Headphones, GraduationCap, Clock, Sparkles } from "lucide-react";

export type TrendMetricKey = "japa" | "wakeUp" | "reading" | "hearing" | "study" | "unused";

export interface InteractiveTrendCardProps {
  sevenDayTrend: SevenDayDataPoint[];
  thirtyDayTrend: SevenDayDataPoint[];
  baseline: PersonalBaseline;
  trendSummaries: TrendSummaries;
}

export function InteractiveTrendCard({
  sevenDayTrend,
  thirtyDayTrend,
  baseline,
  trendSummaries,
}: InteractiveTrendCardProps) {
  const [period, setPeriod] = React.useState<"7d" | "30d">("7d");
  const [metric, setMetric] = React.useState<TrendMetricKey>("japa");

  const currentSeries = period === "7d" ? sevenDayTrend : thirtyDayTrend;
  const submittedDays = currentSeries.filter((d) => d.isSubmitted);

  // Metric Tab Definitions
  const metrics: Array<{ key: TrendMetricKey; label: string; icon: React.ReactNode }> = [
    { key: "japa", label: "Japa", icon: <CircleDot className="h-3.5 w-3.5" /> },
    { key: "wakeUp", label: "Wake-up", icon: <Moon className="h-3.5 w-3.5" /> },
    { key: "reading", label: "Reading", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: "hearing", label: "Hearing", icon: <Headphones className="h-3.5 w-3.5" /> },
    { key: "study", label: "Study", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { key: "unused", label: "Unused", icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  // Helper to get numeric value for the selected metric
  const getValue = (point: SevenDayDataPoint): number | null => {
    if (!point.isSubmitted) return null;
    switch (metric) {
      case "japa":
        return point.totalRounds ?? 16;
      case "wakeUp":
        return point.wakeUpMinutes ?? 200;
      case "reading":
        return point.readingMinutes ?? 0;
      case "hearing":
        return point.hearingMinutes ?? 0;
      case "study":
        return point.studyMinutes ?? 0;
      case "unused":
        return point.unusedMinutes ?? 0;
    }
  };

  const formatValueLabel = (val: number | null): string => {
    if (val === null) return "—";
    if (metric === "japa") return `${val}`;
    if (metric === "wakeUp") {
      const h = Math.floor(val / 60);
      const m = val % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    return formatDuration(val);
  };

  // Compute baseline reference value
  const getBaselineValue = (): number | null => {
    switch (metric) {
      case "japa":
        return baseline.medianTotalRounds;
      case "wakeUp":
        return baseline.medianWakeUpMinutes;
      case "reading":
        return baseline.medianReadingMinutes;
      case "hearing":
        return baseline.medianHearingMinutes;
      case "study":
        return baseline.medianStudyMinutes;
      case "unused":
        return baseline.medianTimeWastedMinutes;
    }
  };

  const baselineVal = getBaselineValue();
  const summaryText = trendSummaries[metric] || trendSummaries.overall;

  // Chart max bounds calculation
  const values = currentSeries.map(getValue).filter((v): v is number => v !== null);
  const maxVal = Math.max(...values, baselineVal ?? 0, 1);
  const minVal = metric === "wakeUp" ? Math.min(...values, baselineVal ?? 180, 180) : 0;

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Top Controls Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Trends &amp; Patterns
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              {period === "7d" ? "7-Day Weekly View" : "30-Day Monthly Perspective"}
            </h2>
          </div>

          {/* Period Toggle Switch */}
          <div className="inline-flex rounded-xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/60 p-1">
            <button
              type="button"
              onClick={() => setPeriod("7d")}
              className={`rounded-lg px-3 py-1 text-[12px] font-bold transition-all ${
                period === "7d"
                  ? "bg-white text-[#20201D] shadow-xs"
                  : "text-[#66635D] hover:text-[#20201D]"
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setPeriod("30d")}
              className={`rounded-lg px-3 py-1 text-[12px] font-bold transition-all ${
                period === "30d"
                  ? "bg-white text-[#20201D] shadow-xs"
                  : "text-[#66635D] hover:text-[#20201D]"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Horizontal Metric Selector Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:gap-2">
          {metrics.map((m) => {
            const isSelected = metric === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMetric(m.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                  isSelected
                    ? "bg-[#20201D] text-white shadow-xs"
                    : "border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/40 text-[#66635D] hover:bg-[#F7F1E5]"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* SVG/CSS Visual Trend Bar Chart */}
        {submittedDays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/30 p-8 text-center text-[13px] text-[#66635D]">
            Not enough history recorded for this period yet.
          </div>
        ) : period === "7d" ? (
          /* 7-Day Clean Scannable Matrix */
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {sevenDayTrend.map((day, idx) => {
              const val = getValue(day);

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                    day.isSubmitted
                      ? "border-[#3D765B]/20 bg-[#3D765B]/5 text-[#20201D]"
                      : "border-dashed border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/20 text-[#66635D]"
                  }`}
                >
                  <span className="text-[11px] font-bold">{day.dayLabel}</span>
                  <span className="text-[9px] text-[#66635D]">{day.date.slice(8)}</span>

                  <div className="my-2 flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold shadow-xs">
                    {day.isSubmitted ? (
                      <span className="text-[11px] font-bold text-[#20201D]">
                        {formatValueLabel(val)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#66635D]/50">—</span>
                    )}
                  </div>

                  <span className="text-[9px] font-medium text-[#66635D]">
                    {day.isSubmitted ? "Received" : "Missing"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* 30-Day Responsive Bar Series */
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/20 p-4">
            <div className="flex h-32 items-end gap-1 sm:gap-1.5">
              {thirtyDayTrend.map((day, idx) => {
                const val = getValue(day);
                const heightPercent =
                  val !== null && maxVal > minVal
                    ? Math.max(12, Math.round(((val - minVal) / (maxVal - minVal || 1)) * 100))
                    : 4;

                return (
                  <div
                    key={idx}
                    title={`${day.date}: ${day.isSubmitted ? formatValueLabel(val) : "No report"}`}
                    className="group relative flex flex-1 flex-col items-center"
                  >
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded-md bg-[#20201D] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs group-hover:block">
                      {day.date.slice(5)}: {formatValueLabel(val)}
                    </div>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all ${
                        day.isSubmitted
                          ? "bg-[#3D765B] group-hover:bg-[#20201D]"
                          : "bg-[rgba(32,32,29,0.1)]"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#66635D]">
              <span>30 days ago</span>
              <span>15 days ago</span>
              <span>Today</span>
            </div>
          </div>
        )}

        {/* Factual Non-Judgmental Interpretation Note */}
        <div className="flex items-start gap-2 rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3 text-[12px] text-[#20201D]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D9822B]" />
          <span>{summaryText}</span>
        </div>
      </div>
    </Card>
  );
}
