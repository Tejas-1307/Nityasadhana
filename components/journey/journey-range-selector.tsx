"use client";

import * as React from "react";

export interface JourneyRangeSelectorProps {
  value: 7 | 30;
  onChange: (range: 7 | 30) => void;
  disabled?: boolean;
}

export function JourneyRangeSelector({
  value,
  onChange,
  disabled = false,
}: JourneyRangeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Journey date range"
      className="inline-flex items-center rounded-2xl border border-[rgba(32,32,29,0.1)] bg-[#F7F1E5]/80 p-1 shadow-sm"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 7}
        disabled={disabled}
        onClick={() => onChange(7)}
        className={`min-h-[40px] rounded-xl px-4 py-1.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6] ${
          value === 7
            ? "bg-[#2457A6] text-white shadow-sm"
            : "text-[#66635D] hover:text-[#20201D]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        7 Days
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={value === 30}
        disabled={disabled}
        onClick={() => onChange(30)}
        className={`min-h-[40px] rounded-xl px-4 py-1.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6] ${
          value === 30
            ? "bg-[#2457A6] text-white shadow-sm"
            : "text-[#66635D] hover:text-[#20201D]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        30 Days
      </button>
    </div>
  );
}
