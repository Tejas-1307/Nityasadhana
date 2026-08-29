import * as React from "react";
import { JourneyAnalytics, MetricComparison } from "@/lib/reports/calculations";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Sparkles } from "lucide-react";

export interface JourneyComparisonCardProps {
  analytics: JourneyAnalytics;
  className?: string;
}

export function JourneyComparisonCard({ analytics, className }: JourneyComparisonCardProps) {
  const { rangeDays, comparison, hasEnoughData } = analytics;

  const renderDirectionIcon = (direction: MetricComparison["direction"]) => {
    switch (direction) {
      case "increased":
        return <ArrowUpRight className="h-4 w-4 text-[#3F9495]" />;
      case "decreased":
        return <ArrowDownRight className="h-4 w-4 text-[#547070]" />;
      case "stable":
      default:
        return <ArrowRight className="h-4 w-4 text-[#547070]" />;
    }
  };

  const renderComparisonRow = (
    label: string,
    comp: MetricComparison,
    subtitle?: string
  ) => {
    return (
      <div className="flex items-center justify-between py-2.5">
        <div>
          <div className="text-[13px] font-bold text-[#193B3B]">{label}</div>
          {subtitle && <div className="text-[11px] text-[#547070]">{subtitle}</div>}
        </div>

        <div className="flex items-center gap-1.5 text-right">
          {hasEnoughData && comp.direction !== "insufficient_data" ? (
            <>
              {renderDirectionIcon(comp.direction)}
              <span
                className={`text-[13px] font-bold ${
                  comp.direction === "increased"
                    ? "text-[#3F9495]"
                    : comp.direction === "decreased"
                      ? "text-[#193B3B]"
                      : "text-[#547070]"
                }`}
              >
                {comp.label}
              </span>
            </>
          ) : (
            <span className="text-[12px] text-[#547070]">Need more days</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-6 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
        <div>
          <h3 className="text-[15px] font-bold text-[#193B3B]">
            Personal Progress Comparison
          </h3>
          <span className="text-[12px] text-[#547070]">
            Compared with your previous {rangeDays} days
          </span>
        </div>
        <Sparkles className="h-4 w-4 text-[#A9824D]" />
      </div>

      <div className="mt-2 divide-y divide-[rgba(63,148,149,0.12)]">
        {renderComparisonRow(
          "Japa Chanting",
          comparison.japa,
          hasEnoughData ? `Current avg: ${comparison.japa.formattedCurrent}` : undefined
        )}
        {renderComparisonRow(
          "Wake-Up Consistency",
          comparison.wakeUp,
          hasEnoughData ? `Current avg: ${comparison.wakeUp.formattedCurrent}` : undefined
        )}
        {renderComparisonRow(
          "Study & Seva",
          comparison.study,
          hasEnoughData ? `Current avg: ${comparison.study.formattedCurrent}` : undefined
        )}
        {renderComparisonRow(
          "Śāstra Reading",
          comparison.reading,
          hasEnoughData ? `Current avg: ${comparison.reading.formattedCurrent}` : undefined
        )}
        {renderComparisonRow(
          "Śravaṇam (Hearing)",
          comparison.hearing,
          hasEnoughData ? `Current avg: ${comparison.hearing.formattedCurrent}` : undefined
        )}
        {renderComparisonRow(
          "Time Wasted",
          comparison.timeWasted,
          hasEnoughData ? `Current avg: ${comparison.timeWasted.formattedCurrent}` : undefined
        )}
      </div>

      {!hasEnoughData && (
        <div className="mt-4 rounded-xl bg-[#F7F5EF]/80 p-3 text-[12px] text-[#547070]">
          Keep submitting your daily Sādhanā. Once you record at least 3 reports, personal trend comparisons will automatically emerge here.
        </div>
      )}
    </div>
  );
}
