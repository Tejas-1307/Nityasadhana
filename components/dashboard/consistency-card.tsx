import * as React from "react";
import { ConsistencyMetrics } from "@/lib/reports/calculations";
import { Sparkles, CalendarCheck } from "lucide-react";

export interface ConsistencyCardProps {
  consistency: ConsistencyMetrics;
  className?: string;
}

export function ConsistencyCard({ consistency, className }: ConsistencyCardProps) {
  const { completedDays, windowDays, currentStreak, totalSubmitted } = consistency;
  const isNewDevotee = totalSubmitted === 0;

  const percentage = Math.min(
    100,
    Math.round((completedDays / Math.max(1, windowDays)) * 100)
  );

  return (
    <div
      className={`rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D9822B]/10 text-[#D9822B]">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#20201D]">Consistency</h3>
            <span className="text-[11px] text-[#66635D]">Recent 10-day practice window</span>
          </div>
        </div>

        {!isNewDevotee && currentStreak > 0 && (
          <span className="rounded-full bg-[#2457A6]/10 px-2.5 py-1 text-[11px] font-bold text-[#2457A6]">
            {currentStreak} consecutive {currentStreak === 1 ? "day" : "days"}
          </span>
        )}
      </div>

      <div className="mt-4">
        {isNewDevotee ? (
          <div className="flex items-center gap-3 text-[13px] text-[#66635D]">
            <Sparkles className="h-4 w-4 text-[#D9822B] shrink-0" />
            <p>
              Your practice consistency will build steadily each day you record your Sādhanā.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[22px] font-bold tracking-tight text-[#20201D]">
                  {completedDays}
                </span>
                <span className="text-[14px] font-medium text-[#66635D]">
                  {" "}
                  of last {windowDays} days
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[#2457A6]">{percentage}%</span>
            </div>

            {/* Subtle Progress Track */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(32,32,29,0.08)]">
              <div
                className="h-full rounded-full bg-[#2457A6] transition-all duration-300"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Consistency: ${completedDays} of ${windowDays} days`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#66635D] pt-0.5">
              <span>{totalSubmitted} total {totalSubmitted === 1 ? "report" : "reports"} submitted</span>
              <span>Encouragement · Non-judgmental</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
