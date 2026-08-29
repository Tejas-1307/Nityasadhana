"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  sanskritLabel?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  sanskritLabel?: string;
  className?: string;
  size?: "default" | "sm";
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
  sanskritLabel,
  className,
  size = "default",
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("flex w-full select-none flex-col gap-1.5", className)}>
      {(label || sanskritLabel) && (
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#193B3B]">{label}</span>
          {sanskritLabel && (
            <span className="font-serif text-[13px] text-[#A9824D]">{sanskritLabel}</span>
          )}
        </div>
      )}

      <div
        role="radiogroup"
        className={cn(
          "flex w-full items-center rounded-[12px] border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF] p-1",
          size === "default" ? "h-[52px]" : "h-[44px]"
        )}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;

          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={opt.disabled}
              onClick={() => onChange(opt.value)}
              className={cn(
                "relative flex h-full flex-1 items-center justify-center rounded-[8px] px-2 text-[14px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]",
                isSelected
                  ? "shadow-xs bg-white text-[#3F9495]"
                  : "text-[#547070] hover:text-[#193B3B] active:scale-[0.98]",
                opt.disabled && "pointer-events-none opacity-40"
              )}
            >
              <span>{opt.label}</span>
              {opt.sanskritLabel && (
                <span className="ml-1 font-serif text-[11px] opacity-75">
                  ({opt.sanskritLabel})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
