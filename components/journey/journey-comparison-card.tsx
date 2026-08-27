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
        return <ArrowUpRight className="h-4 w-4 text-[#2457A6]" />;
      case "decreased":
        return <ArrowDownRight className="h-4 w-4 text-[#66635D]" />;
      case "stable":
      default:
        return <ArrowRight className="h-4 w-4 text-[#66635D]" />;
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
          <div className="text-[13px] font-bold text-[#20201D]">{label}</div>
          {subtitle && <div className="text-[11px] text-[#66635D]">{subtitle}</div>}
        </div>

        <div className="flex items-center gap-1.5 text-right">
          {hasEnoughData && comp.direction !== "insufficient_data" ? (
            <>
              {renderDirectionIcon(comp.direction)}
              <span
                className={`text-[13px] font-bold ${
                  comp.direction === "increased"
                    ? "text-[#2457A6]"
                    : comp.direction === "decreased"
                      ? "text-[#20201D]"
                      : "text-[#66635D]"
                }`}
              >
                {comp.label}
              </span>
            </>
          ) : (
            <span className="text-[12px] text-[#66635D]">Need more days</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-6 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
        <div>
          <h3 className="text-[15px] font-bold text-[#20201D]">
            Personal Progress Comparison
          </h3>
          <span className="text-[12px] text-[#66635D]">
            Compared with your previous {rangeDays} days
          </span>
        </div>
        <Sparkles className="h-4 w-4 text-[#D9822B]" />
      </div>

      <div className="mt-2 divide-y divide-[rgba(32,32,29,0.06)]">
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
        <div className="mt-4 rounded-xl bg-[#F7F1E5]/60 p-3 text-[12px] text-[#66635D]">
          Keep submitting your daily Sādhanā. Once you record at least 3 reports, personal trend comparisons will automatically emerge here.
        </div>
      )}
    </div>
  );
}
