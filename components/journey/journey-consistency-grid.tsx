import * as React from "react";
import { JourneyDayData } from "@/lib/reports/calculations";
import { CheckCircle2, Calendar } from "lucide-react";

export interface JourneyConsistencyGridProps {
  rangeDays: 7 | 30;
  dailySeries: JourneyDayData[];
  className?: string;
}

export function JourneyConsistencyGrid({
  rangeDays,
  dailySeries,
  className,
}: JourneyConsistencyGridProps) {
  return (
    <div
      className={`rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#3F9495]" />
          <h3 className="text-[14px] font-bold text-[#193B3B]">
            {rangeDays}-Day Practice Continuity
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#547070]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#3F9495]" /> Recorded
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[rgba(63,148,149,0.2)]" /> Missing
          </span>
        </div>
      </div>

      {rangeDays === 7 ? (
        /* 7-DAY WEEKDAY PILLS */
        <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
          {dailySeries.map((day) => {
            return (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all ${
                  day.isSubmitted
                    ? "border-[#3F9495]/20 bg-[#3F9495]/10 text-[#3F9495]"
                    : "border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 text-[#547070]"
                }`}
              >
                <span className="text-[11px] font-semibold">{day.dayLabel}</span>
                <div className="mt-1 flex h-6 w-6 items-center justify-center">
                  {day.isSubmitted ? (
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  ) : (
                    <span className="text-[12px] font-bold text-[#547070]/50">—</span>
                  )}
                </div>
                <span className="mt-0.5 text-[10px] font-medium">
                  {day.isSubmitted ? `${day.totalRounds || 0}r` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* 30-DAY DOT GRID */
        <div className="mt-4">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
            {dailySeries.map((day, idx) => {
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.isSubmitted ? `${day.totalRounds} rounds` : "No report"}`}
                  className={`flex flex-col items-center justify-center rounded-xl border p-1.5 transition-all ${
                    day.isSubmitted
                      ? "border-[#3F9495]/20 bg-[#3F9495] text-white shadow-xs"
                      : "border-[rgba(63,148,149,0.14)] bg-[rgba(63,148,149,0.06)] text-[#547070]/50"
                  }`}
                >
                  <span className="text-[9px] font-bold opacity-80">{idx + 1}</span>
                  <span className="text-[10px] font-bold">
                    {day.isSubmitted ? "✓" : "·"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
