"use client";

import * as React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export interface ReportProgressBarProps {
  completedSections: number;
  totalRequiredSections?: number;
  className?: string;
}

export function ReportProgressBar({
  completedSections,
  totalRequiredSections = 5,
  className,
}: ReportProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.round((completedSections / totalRequiredSections) * 100)
  );

  const isAllComplete = completedSections >= totalRequiredSections;

  return (
    <div className={`space-y-1.5 ${className || ""}`}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1 font-medium text-[#66635D]">
          {isAllComplete ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-semibold text-emerald-800">All required sections complete</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>
                {completedSections} of {totalRequiredSections} sections completed
              </span>
            </>
          )}
        </span>
        <span className="font-bold text-[#20201D]">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(32,32,29,0.08)]">
        <div
          className={`h-full transition-all duration-300 ${
            isAllComplete ? "bg-emerald-600" : "bg-[#2457A6]"
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
