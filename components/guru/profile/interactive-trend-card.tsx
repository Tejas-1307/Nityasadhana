"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { SevenDayDataPoint, TrendSummaries, MonthAggregateDataPoint } from "@/lib/guru/service";
import { PersonalBaseline } from "@/lib/guru/attention";
import { formatDuration } from "@/lib/reports/calculations";
import { CircleDot, Moon, BookOpen, Headphones, GraduationCap, Clock, Sparkles, CheckCircle2 } from "lucide-react";

export type TrendMetricKey = "japa" | "wakeUp" | "reading" | "hearing" | "study" | "unused";
export type TimePeriod = "7d" | "30d" | "1y";

export interface InteractiveTrendCardProps {
  sevenDayTrend: SevenDayDataPoint[];
  thirtyDayTrend: SevenDayDataPoint[];
  yearlyTrend?: MonthAggregateDataPoint[];
  baseline: PersonalBaseline;
  trendSummaries: TrendSummaries;
}

export function InteractiveTrendCard({
  sevenDayTrend,
  thirtyDayTrend,
  yearlyTrend = [],
  baseline,
  trendSummaries,
}: InteractiveTrendCardProps) {
  const [period, setPeriod] = React.useState<TimePeriod>("7d");
  const [metric, setMetric] = React.useState<TrendMetricKey>("japa");

  // Metrics definitions
  const metrics: Array<{ key: TrendMetricKey; label: string; icon: React.ReactNode }> = [
    { key: "japa", label: "Japa Rounds", icon: <CircleDot className="h-3.5 w-3.5" /> },
    { key: "wakeUp", label: "Wake-up", icon: <Moon className="h-3.5 w-3.5" /> },
    { key: "reading", label: "Reading", icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: "hearing", label: "Hearing", icon: <Headphones className="h-3.5 w-3.5" /> },
    { key: "study", label: "Study", icon: <GraduationCap className="h-3.5 w-3.5" /> },
    { key: "unused", label: "Unused Time", icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  // Helper for 7d & 30d daily points
  const getDailyValue = (point: SevenDayDataPoint): number | null => {
    if (!point.isSubmitted) return null;
    switch (metric) {
      case "japa":
        return point.totalRounds ?? 16;
      case "wakeUp":
        return point.wakeUpMinutes ?? 240;
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

  // Helper for 1y monthly points
  const getMonthlyValue = (m: MonthAggregateDataPoint): number | null => {
    if (!m.hasData) return null;
    switch (metric) {
      case "japa":
        return m.avgRounds;
      case "wakeUp":
        if (m.avgWakeUpTime && m.avgWakeUpTime.includes(":")) {
          const [h, min] = m.avgWakeUpTime.split(":").map(Number);
          return h * 60 + min;
        }
        return 240;
      case "reading":
        return m.avgReadingMinutes;
      case "hearing":
        return m.avgHearingMinutes;
      case "study":
        return m.avgStudyMinutes;
      case "unused":
        return m.avgUnusedMinutes ?? 0;
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

  // Period-specific summary calculations
  const sevenDaySubmitted = sevenDayTrend.filter((d) => d.isSubmitted);
  const thirtyDaySubmitted = thirtyDayTrend.filter((d) => d.isSubmitted);
  const yearlyActiveMonths = yearlyTrend.filter((m) => m.hasData);
  const yearlyTotalSubmitted = yearlyTrend.reduce((acc, m) => acc + m.submittedCount, 0);

  // Find latest submitted report for 7d highlight
  const latestReport = [...sevenDayTrend].reverse().find((d) => d.isSubmitted);

  // Top summary text based on active period
  let periodSummaryHeadline = "";
  let periodDetailText = "";

  if (period === "7d") {
    periodSummaryHeadline = `Reports submitted on ${sevenDaySubmitted.length} of 7 days (${Math.round(
      (sevenDaySubmitted.length / 7) * 100
    )}% consistency)`;
    if (latestReport) {
      periodDetailText = `Latest report received for ${latestReport.date}: ${
        latestReport.totalRounds ?? 16
      } rounds, wake-up at ${latestReport.wakeUpTime || "—"}.`;
    } else {
      periodDetailText = "Awaiting initial reports for the trailing 7 days.";
    }
  } else if (period === "30d") {
    periodSummaryHeadline = `Reports submitted on ${thirtyDaySubmitted.length} of the last 30 days (${Math.round(
      (thirtyDaySubmitted.length / 30) * 100
    )}% consistency)`;
    periodDetailText = trendSummaries[metric] || trendSummaries.overall;
  } else {
    periodSummaryHeadline = `Trailing 12 Months: ${yearlyTotalSubmitted} reports across ${yearlyActiveMonths.length} active months`;
    if (yearlyActiveMonths.length > 0) {
      const totalRoundsYear = yearlyTrend.reduce((acc, m) => acc + m.totalRounds, 0);
      periodDetailText = `Total Japa completed over the year: ${totalRoundsYear.toLocaleString()} rounds. Monthly averages reflect only valid submitted reports.`;
    } else {
      periodDetailText = "Records will accumulate into monthly trends as reports are submitted over time.";
    }
  }

  // Value bounds for chart scaling
  let maxVal = 1;
  let minVal = 0;

  if (period === "7d") {
    const vals = sevenDayTrend.map(getDailyValue).filter((v): v is number => v !== null);
    maxVal = Math.max(...vals, baselineVal ?? 0, 1);
    minVal = metric === "wakeUp" ? Math.min(...vals, baselineVal ?? 180, 180) : 0;
  } else if (period === "30d") {
    const vals = thirtyDayTrend.map(getDailyValue).filter((v): v is number => v !== null);
    maxVal = Math.max(...vals, baselineVal ?? 0, 1);
    minVal = metric === "wakeUp" ? Math.min(...vals, baselineVal ?? 180, 180) : 0;
  } else {
    const vals = yearlyTrend.map(getMonthlyValue).filter((v): v is number => v !== null);
    maxVal = Math.max(...vals, baselineVal ?? 0, 1);
    minVal = metric === "wakeUp" ? Math.min(...vals, baselineVal ?? 180, 180) : 0;
  }

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Top Controls Header: Time Range Segmented Control */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
              Historical Sādhanā &amp; Trends
            </span>
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              {period === "7d"
                ? "7-Day Weekly View"
                : period === "30d"
                ? "1-Month Perspective"
                : "1-Year Annual Progress"}
            </h2>
          </div>

          {/* Simple Mobile-Friendly Segmented Control */}
          <div className="inline-flex rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/80 p-1">
            <button
              type="button"
              onClick={() => setPeriod("7d")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                period === "7d"
                  ? "bg-[#193B3B] text-white shadow-xs"
                  : "text-[#547070] hover:text-[#193B3B]"
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setPeriod("30d")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                period === "30d"
                  ? "bg-[#193B3B] text-white shadow-xs"
                  : "text-[#547070] hover:text-[#193B3B]"
              }`}
            >
              1 Month
            </button>
            <button
              type="button"
              onClick={() => setPeriod("1y")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                period === "1y"
                  ? "bg-[#193B3B] text-white shadow-xs"
                  : "text-[#547070] hover:text-[#193B3B]"
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Concise Summary Banner: Displayed before detailed charts */}
        <div className="rounded-2xl border border-[rgba(63,148,149,0.18)] bg-[#EAF7F4]/50 p-3.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#328A7A] shrink-0" />
            <span className="text-[13px] font-bold text-[#193B3B]">{periodSummaryHeadline}</span>
          </div>
          <p className="mt-1 text-[12px] text-[#547070] pl-6 leading-relaxed">
            {periodDetailText}
          </p>
        </div>

        {/* Metric Selector Chips */}
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
                    ? "bg-[#193B3B] text-white shadow-xs"
                    : "border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 text-[#547070] hover:bg-[#EAF7F4]"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Renderers by Period */}
        {period === "7d" ? (
          /* 7-DAY VIEW: Daily Cards with highlight for the latest report */
          sevenDaySubmitted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[rgba(63,148,149,0.2)] bg-[#F7F5EF]/60 p-8 text-center">
              <p className="text-[14px] font-medium text-[#193B3B]">No reports available for this period yet.</p>
              <p className="mt-1 text-[12px] text-[#547070]">
                Daily records will appear as the Counselee submits reports.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {sevenDayTrend.map((day, idx) => {
                const val = getDailyValue(day);
                const isLatest = latestReport && latestReport.date === day.date;

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                      isLatest
                        ? "border-[#328A7A] bg-[#328A7A]/10 ring-2 ring-[#328A7A]/30 text-[#193B3B]"
                        : day.isSubmitted
                        ? "border-[#328A7A]/20 bg-[#328A7A]/5 text-[#193B3B]"
                        : "border-dashed border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/60 text-[#547070]"
                    }`}
                  >
                    {isLatest && (
                      <span className="absolute -top-2 rounded-full bg-[#193B3B] px-1.5 py-0.2 text-[8px] font-bold text-white uppercase tracking-wider">
                        Latest
                      </span>
                    )}
                    <span className="text-[11px] font-bold">{day.dayLabel}</span>
                    <span className="text-[9px] text-[#547070]">{day.date.slice(8)}</span>

                    <div className="my-2 flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold shadow-xs">
                      {day.isSubmitted ? (
                        <span className="text-[11px] font-bold text-[#193B3B]">
                          {formatValueLabel(val)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#547070]/50">—</span>
                      )}
                    </div>

                    <span className="text-[9px] font-medium text-[#547070]">
                      {day.isSubmitted ? "Submitted" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        ) : period === "30d" ? (
          /* 30-DAY VIEW: Responsive Bar Series with clear tooltip & baseline */
          thirtyDaySubmitted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[rgba(63,148,149,0.2)] bg-[#F7F5EF]/60 p-8 text-center">
              <p className="text-[14px] font-medium text-[#193B3B]">No reports available for this period yet.</p>
              <p className="mt-1 text-[12px] text-[#547070]">
                Monthly trends will establish as daily reports accumulate.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/40 p-4">
              <div className="flex h-36 items-end gap-1 sm:gap-1.5">
                {thirtyDayTrend.map((day, idx) => {
                  const val = getDailyValue(day);
                  const heightPercent =
                    val !== null && maxVal > minVal
                      ? Math.max(12, Math.round(((val - minVal) / (maxVal - minVal || 1)) * 100))
                      : 6;

                  return (
                    <div
                      key={idx}
                      title={`${day.date}: ${day.isSubmitted ? formatValueLabel(val) : "No report"}`}
                      className="group relative flex flex-1 flex-col items-center"
                    >
                      {/* Tooltip on hover */}
                      <div className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap rounded-md bg-[#193B3B] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs group-hover:block">
                        {day.date.slice(5)}: {day.isSubmitted ? formatValueLabel(val) : "Missing"}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-sm transition-all ${
                          day.isSubmitted
                            ? "bg-[#328A7A] group-hover:bg-[#193B3B]"
                            : "bg-[rgba(63,148,149,0.15)] border-t border-dashed border-[rgba(63,148,149,0.3)]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[#547070]">
                <span>30 days ago</span>
                <span>15 days ago</span>
                <span>Today</span>
              </div>
            </div>
          )
        ) : (
          /* 1-YEAR VIEW: 12-Month Calendar Aggregation */
          yearlyActiveMonths.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[rgba(63,148,149,0.2)] bg-[#F7F5EF]/60 p-8 text-center">
              <p className="text-[14px] font-medium text-[#193B3B]">No reports available for this period yet.</p>
              <p className="mt-1 text-[12px] text-[#547070]">
                Annual history and long-term consistency will be summarized here across calendar months.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 12-Month Bar Visualizer */}
              <div className="rounded-2xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/40 p-4">
                <div className="flex h-36 items-end gap-1.5 sm:gap-2">
                  {yearlyTrend.map((m, idx) => {
                    const val = getMonthlyValue(m);
                    const heightPercent =
                      val !== null && maxVal > minVal
                        ? Math.max(14, Math.round(((val - minVal) / (maxVal - minVal || 1)) * 100))
                        : 6;

                    return (
                      <div
                        key={idx}
                        title={`${m.monthLabel}: ${
                          m.hasData
                            ? `${formatValueLabel(val)} (${m.submittedCount}/${m.expectedDays} days)`
                            : "No reports"
                        }`}
                        className="group relative flex flex-1 flex-col items-center"
                      >
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute -top-10 z-10 hidden whitespace-nowrap rounded-md bg-[#193B3B] px-2 py-1 text-[10px] font-bold text-white shadow-xs group-hover:block">
                          {m.monthLabel}: {m.hasData ? formatValueLabel(val) : "No data"}
                          <div className="text-[9px] font-normal text-white/80">
                            {m.submittedCount}/{m.expectedDays} days ({m.consistencyPercentage}%)
                          </div>
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-sm transition-all ${
                            m.hasData
                              ? "bg-[#328A7A] group-hover:bg-[#193B3B]"
                              : "bg-[rgba(63,148,149,0.15)]"
                          }`}
                        />
                        <span className="mt-1.5 text-[9px] font-bold text-[#547070] group-hover:text-[#193B3B]">
                          {m.monthLabel.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Aggregation Table / Cards for Mobile Scannability */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {yearlyTrend.filter((m) => m.hasData).map((m) => (
                  <div
                    key={m.monthKey}
                    className="rounded-xl border border-[rgba(63,148,149,0.16)] bg-white p-2.5 text-left shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#193B3B]">{m.monthLabel}</span>
                      <span className="text-[10px] font-bold text-[#328A7A]">{m.consistencyPercentage}%</span>
                    </div>
                    <div className="mt-1 text-[13px] font-extrabold text-[#193B3B]">
                      {formatValueLabel(getMonthlyValue(m))}
                    </div>
                    <div className="text-[9px] text-[#547070]">
                      {m.submittedCount} of {m.expectedDays} days reported
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Factual Non-Judgmental Interpretation Note */}
        <div className="flex items-start gap-2 rounded-xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-3 text-[12px] text-[#193B3B]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A9824D]" />
          <span>{trendSummaries[metric] || trendSummaries.overall}</span>
        </div>
      </div>
    </Card>
  );
}
