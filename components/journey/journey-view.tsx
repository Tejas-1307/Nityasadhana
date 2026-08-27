"use client";

import * as React from "react";
import { JourneyAnalytics, formatDuration, formatTime12Hour } from "@/lib/reports/calculations";
import { DbWeeklySankalpa, DbWeeklyReflection } from "@/lib/db/schema";
import { getStudentJourneyDataAction } from "@/lib/actions/reports";
import { JourneyRangeSelector } from "./journey-range-selector";
import { JourneySummaryCard } from "./journey-summary-card";
import { JourneyComparisonCard } from "./journey-comparison-card";
import { JourneyConsistencyGrid } from "./journey-consistency-grid";
import { JourneyTrendChart } from "./journey-trend-chart";
import { JourneySankalpaSection } from "./journey-sankalpa-section";
import { Sparkles, Sprout, BarChart3 } from "lucide-react";

export interface JourneyViewProps {
  initialAnalytics: JourneyAnalytics;
  initialActiveSankalpa?: DbWeeklySankalpa | null;
  initialSankalpaHistory?: DbWeeklySankalpa[];
  totalSankalpaHistory?: number;
  initialCurrentReflection?: DbWeeklyReflection | null;
  initialReflectionHistory?: DbWeeklyReflection[];
  totalReflectionHistory?: number;
}

export function JourneyView({
  initialAnalytics,
  initialActiveSankalpa = null,
  initialSankalpaHistory = [],
  totalSankalpaHistory = 0,
  initialCurrentReflection = null,
  initialReflectionHistory = [],
  totalReflectionHistory = 0,
}: JourneyViewProps) {
  const [activeTab, setActiveTab] = React.useState<"sankalpa" | "trends">("sankalpa");
  const [rangeDays, setRangeDays] = React.useState<7 | 30>(initialAnalytics.rangeDays);
  const [analytics, setAnalytics] = React.useState<JourneyAnalytics>(initialAnalytics);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleRangeChange = async (newRange: 7 | 30) => {
    if (newRange === rangeDays) return;
    setRangeDays(newRange);
    setIsLoading(true);

    try {
      const res = await getStudentJourneyDataAction(newRange);
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch {
      console.error("Failed to load journey for range:", newRange);
    } finally {
      setIsLoading(false);
    }
  };

  const { dailySeries } = analytics;

  // Prepare Chart Datasets
  const japaData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.totalRounds,
    formattedValue: d.totalRounds !== undefined ? `${d.totalRounds} rounds` : "Missing",
  }));

  const wakeUpData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.wakeUpMinutes,
    formattedValue: d.wakeUpTime ? formatTime12Hour(d.wakeUpTime) : "Missing",
  }));

  const sleepData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.sleepDurationMinutes,
    formattedValue: d.sleepDurationMinutes ? formatDuration(d.sleepDurationMinutes) : "Missing",
  }));

  const studyData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.totalStudyMinutes,
    formattedValue: d.totalStudyMinutes !== undefined ? formatDuration(d.totalStudyMinutes) : "Missing",
  }));

  const readingData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.readingDurationMinutes,
    formattedValue: d.readingDurationMinutes !== undefined ? formatDuration(d.readingDurationMinutes) : "Missing",
  }));

  const timeWastedData = dailySeries.map((d) => ({
    date: d.date,
    label: d.dayLabel,
    value: d.timeWastedMinutes,
    formattedValue: d.timeWastedMinutes !== undefined ? formatDuration(d.timeWastedMinutes) : "Missing",
  }));

  return (
    <div className="space-y-6">
      {/* Top Workspace Tab Switcher */}
      <div className="flex border-b border-[rgba(32,32,29,0.08)]">
        <button
          type="button"
          onClick={() => setActiveTab("sankalpa")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-[14px] font-bold transition-all ${
            activeTab === "sankalpa"
              ? "border-[#3D765B] text-[#3D765B]"
              : "border-transparent text-[#66635D] hover:text-[#20201D]"
          }`}
        >
          <Sprout className="h-4 w-4" />
          <span>Weekly Focus &amp; Reflection</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trends")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-[14px] font-bold transition-all ${
            activeTab === "trends"
              ? "border-[#2457A6] text-[#2457A6]"
              : "border-transparent text-[#66635D] hover:text-[#20201D]"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Patterns &amp; Trends</span>
        </button>
      </div>

      {/* Tab 1: Weekly Focus & Reflection Experience */}
      {activeTab === "sankalpa" ? (
        <JourneySankalpaSection
          initialActiveSankalpa={initialActiveSankalpa}
          initialHistory={initialSankalpaHistory}
          totalHistory={totalSankalpaHistory}
          initialCurrentReflection={initialCurrentReflection}
          initialReflectionHistory={initialReflectionHistory}
          totalReflectionHistory={totalReflectionHistory}
        />
      ) : (
        /* Tab 2: Patterns & Analytics Workspace */
        <div className={`space-y-6 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
          {/* Range Selector */}
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#66635D]">
              Observational Range
            </div>
            <JourneyRangeSelector
              value={rangeDays}
              onChange={handleRangeChange}
              disabled={isLoading}
            />
          </div>

          {/* Top Summary Card */}
          <JourneySummaryCard analytics={analytics} />

          {/* Personal Comparison Card (YOU vs YOU Previously) */}
          <JourneyComparisonCard analytics={analytics} />

          {/* Calendar Consistency Grid */}
          <JourneyConsistencyGrid rangeDays={rangeDays} dailySeries={dailySeries} />

          {/* Detailed Trend Charts */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2457A6]" />
              <h3 className="text-[16px] font-bold text-[#20201D]">
                Daily Practice Patterns
              </h3>
            </div>

            {/* Japa Meditation Trend */}
            <JourneyTrendChart
              title="Japa Chanting"
              subtitle="Daily total rounds recorded"
              data={japaData}
              colorTheme="krishna"
              chartType="bar"
              yAxisFormatter={(v) => `${v} rounds`}
            />

            {/* Wake-Up Trend */}
            <JourneyTrendChart
              title="Wake-Up Time"
              subtitle="Time of morning rise"
              data={wakeUpData}
              colorTheme="saffron"
              chartType="line"
              yAxisFormatter={(v) =>
                formatTime12Hour(
                  `${Math.floor(v / 60)
                    .toString()
                    .padStart(2, "0")}:${Math.round(v % 60)
                    .toString()
                    .padStart(2, "0")}`
                )
              }
            />

            {/* Sleep Duration Trend */}
            <JourneyTrendChart
              title="Sleep Duration"
              subtitle="Hours and minutes of nightly rest"
              data={sleepData}
              colorTheme="forest"
              chartType="line"
              yAxisFormatter={(v) => formatDuration(v)}
            />

            {/* Study Trend */}
            <JourneyTrendChart
              title="Study & Seva"
              subtitle="College, academy, and self-study total"
              data={studyData}
              colorTheme="neutral"
              chartType="bar"
              yAxisFormatter={(v) => formatDuration(v)}
            />

            {/* Reading Trend */}
            <JourneyTrendChart
              title="Śāstra Reading"
              subtitle="Daily reading duration"
              data={readingData}
              colorTheme="forest"
              chartType="bar"
              yAxisFormatter={(v) => formatDuration(v)}
            />

            {/* Time Wasted Trend */}
            <JourneyTrendChart
              title="Time Wasted Awareness"
              subtitle="Unproductive time observed without judgment"
              data={timeWastedData}
              colorTheme="neutral"
              chartType="bar"
              yAxisFormatter={(v) => formatDuration(v)}
            />
          </div>

          {/* Peaceful Personal Reflection Footer */}
          <div className="rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white/70 p-5 text-center shadow-level1">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="mt-3 text-[14px] font-bold text-[#20201D]">
              Continuity Over Perfection
            </h4>
            <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-[#66635D]">
              True spiritual growth is quiet and steady. Every sincere round and every moment dedicated to hearing builds a lasting inner foundation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
