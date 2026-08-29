"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

export interface NumberStepperProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  unit?: string;
  suggestedValue?: number;
  className?: string;
}

export function NumberStepper({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 108,
  step = 1,
  disabled = false,
  unit,
  suggestedValue,
  className,
}: NumberStepperProps) {
  const handleDecrement = () => {
    if (disabled || value <= min) return;
    onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    onChange(Math.min(max, value + step));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onChange(min);
    } else {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const isSuggested = suggestedValue !== undefined && suggestedValue === value;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold uppercase tracking-wider text-[#547070]"
        >
          {label}
        </label>
        {isSuggested && (
          <span className="text-[11px] font-medium text-[#A9824D]">From yesterday</span>
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={disabled || value <= min}
          onClick={handleDecrement}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(63,148,149,0.18)] bg-white text-[#193B3B] transition-all hover:bg-[#EAF7F4] active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <Minus className="h-4 w-4 stroke-[2.25]" />
        </button>

        <div className="relative flex flex-1 items-center">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            disabled={disabled}
            value={value}
            onChange={handleInputChange}
            className="h-12 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-3 text-center text-[16px] font-bold text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
          />
          {unit && (
            <span className="pointer-events-none absolute right-3 text-[12px] font-medium text-[#547070]">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={disabled || value >= max}
          onClick={handleIncrement}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(63,148,149,0.18)] bg-white text-[#193B3B] transition-all hover:bg-[#EAF7F4] active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <Plus className="h-4 w-4 stroke-[2.25]" />
        </button>
      </div>
    </div>
  );
}
