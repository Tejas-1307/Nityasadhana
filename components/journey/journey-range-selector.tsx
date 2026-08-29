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
      className="inline-flex items-center rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/80 p-1 shadow-sm"
    >
      <button
        type="button"
        role="tab"
        aria-selected={value === 7}
        disabled={disabled}
        onClick={() => onChange(7)}
        className={`min-h-[40px] rounded-xl px-4 py-1.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] ${
          value === 7
            ? "bg-[#3F9495] text-white shadow-sm"
            : "text-[#547070] hover:text-[#193B3B]"
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
        className={`min-h-[40px] rounded-xl px-4 py-1.5 text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] ${
          value === 30
            ? "bg-[#3F9495] text-white shadow-sm"
            : "text-[#547070] hover:text-[#193B3B]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        30 Days
      </button>
    </div>
  );
}
