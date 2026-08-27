"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Minus, Plus } from "lucide-react";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  sanskritLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 108,
  step = 1,
  unit,
  label,
  sanskritLabel,
  disabled = false,
  className,
}: StepperProps) {
  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <div className={cn("flex w-full select-none flex-col gap-2", className)}>
      {(label || sanskritLabel) && (
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#20201D]">{label}</span>
          {sanskritLabel && (
            <span className="font-serif text-[13px] text-[#D9822B]">{sanskritLabel}</span>
          )}
        </div>
      )}

      {/* Touch Stepper Control */}
      <div className="shadow-xs flex h-[52px] w-full items-center justify-between rounded-[12px] border border-[rgba(32,32,29,0.12)] bg-white p-1">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || isMin}
          aria-label={`Decrease ${label || "value"}`}
          className="flex h-[44px] min-h-[44px] w-[48px] min-w-[48px] items-center justify-center rounded-[8px] text-[#20201D] transition-colors hover:bg-[#F7F1E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6] active:bg-[#E8D9BF] disabled:pointer-events-none disabled:opacity-30"
        >
          <Minus className="h-5 w-5 stroke-[2]" />
        </button>

        {/* Counter Display */}
        <div className="flex items-baseline justify-center gap-1.5 px-4 font-sans">
          <span className="text-[22px] font-bold tracking-tight text-[#20201D]">{value}</span>
          {unit && <span className="text-[13px] font-medium text-[#66635D]">{unit}</span>}
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || isMax}
          aria-label={`Increase ${label || "value"}`}
          className="flex h-[44px] min-h-[44px] w-[48px] min-w-[48px] items-center justify-center rounded-[8px] bg-[#2457A6]/10 text-[#2457A6] transition-colors hover:bg-[#2457A6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6] active:bg-[#2457A6]/30 disabled:pointer-events-none disabled:opacity-30"
        >
          <Plus className="h-5 w-5 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
