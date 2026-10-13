"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Clock } from "lucide-react";

export interface TimePicker12HourProps {
  id: string;
  label?: string;
  value: string; // 24-hour "HH:mm" format, e.g. "21:00" or "03:30"
  onChange: (value24: string) => void;
  disabled?: boolean;
  presetType?: "sleep" | "wake";
  className?: string;
}

const HOURS_12 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

const MINUTES_60 = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

const SLEEP_PRESETS = [
  { label: "8:30 PM", value: "20:30" },
  { label: "9:00 PM", value: "21:00", isDefault: true },
  { label: "9:30 PM", value: "21:30" },
  { label: "10:00 PM", value: "22:00" },
  { label: "10:30 PM", value: "22:30" },
];

const WAKE_PRESETS = [
  { label: "3:00 AM", value: "03:00" },
  { label: "3:30 AM", value: "03:30", isDefault: true },
  { label: "4:00 AM", value: "04:00" },
  { label: "4:30 AM", value: "04:30" },
  { label: "5:00 AM", value: "05:00" },
];

export function parse24To12(time24: string) {
  if (!time24 || !time24.includes(":")) {
    return { hour12: "09", minute: "00", period: "PM" as const };
  }
  const [hStr, mStr] = time24.split(":");
  const h24 = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const safeH = isNaN(h24) ? 0 : h24;
  const safeM = isNaN(m) ? 0 : m;

  const period: "AM" | "PM" = safeH >= 12 ? "PM" : "AM";
  const h12Raw = safeH % 12 === 0 ? 12 : safeH % 12;
  const hour12 = h12Raw.toString().padStart(2, "0");
  const minute = safeM.toString().padStart(2, "0");

  return { hour12, minute, period };
}

export function format12To24(hour12Str: string, minuteStr: string, period: "AM" | "PM"): string {
  const h12 = parseInt(hour12Str, 10) || 12;
  const m = parseInt(minuteStr, 10) || 0;
  let h24 = h12 % 12;
  if (period === "PM") {
    h24 += 12;
  }
  return `${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function TimePicker12Hour({
  id,
  label,
  value,
  onChange,
  disabled = false,
  presetType,
  className,
}: TimePicker12HourProps) {
  const { hour12, minute, period } = React.useMemo(() => parse24To12(value), [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    onChange(format12To24(newHour, minute, period));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value;
    onChange(format12To24(hour12, newMinute, period));
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    if (newPeriod !== period) {
      onChange(format12To24(hour12, minute, newPeriod));
    }
  };

  const presets = presetType === "sleep" ? SLEEP_PRESETS : presetType === "wake" ? WAKE_PRESETS : [];

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={`${id}-hour`}
          className="block text-[11px] font-semibold uppercase tracking-wider text-[#547070]"
        >
          {label}
        </label>
      )}

      {/* Main 12-Hour Input Control Box */}
      <div
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-2.5 transition-colors",
          "focus-within:border-[#3F9495] focus-within:ring-2 focus-within:ring-[#3F9495]/20",
          disabled && "opacity-60 cursor-not-allowed bg-[#F7F5EF]/60"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#3F9495] shrink-0" aria-hidden="true" />

          {/* Hour Select */}
          <div className="relative">
            <select
              id={`${id}-hour`}
              disabled={disabled}
              value={hour12}
              onChange={handleHourChange}
              aria-label={`${label || id} hour`}
              className="appearance-none bg-transparent py-1 pr-1 pl-0.5 text-[14px] font-bold text-[#193B3B] focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {HOURS_12.map((h) => (
                <option key={h} value={h} className="bg-white text-[#193B3B]">
                  {h}
                </option>
              ))}
            </select>
          </div>

          <span className="font-bold text-[#193B3B]/60 select-none">:</span>

          {/* Minute Select */}
          <div className="relative">
            <select
              id={`${id}-minute`}
              disabled={disabled}
              value={minute}
              onChange={handleMinuteChange}
              aria-label={`${label || id} minute`}
              className="appearance-none bg-transparent py-1 pr-1 pl-0.5 text-[14px] font-bold text-[#193B3B] focus:outline-none cursor-pointer disabled:cursor-not-allowed"
            >
              {MINUTES_60.map((m) => (
                <option key={m} value={m} className="bg-white text-[#193B3B]">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AM / PM Segmented Toggle */}
        <div
          role="group"
          aria-label={`${label || id} period`}
          className="flex items-center rounded-lg bg-white/90 p-0.5 border border-[rgba(63,148,149,0.16)] shadow-xs"
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange("AM")}
            aria-pressed={period === "AM"}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-extrabold transition-all",
              period === "AM"
                ? "bg-[#3F9495] text-white shadow-xs"
                : "text-[#547070] hover:text-[#193B3B] disabled:hover:text-[#547070]"
            )}
          >
            AM
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange("PM")}
            aria-pressed={period === "PM"}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-extrabold transition-all",
              period === "PM"
                ? "bg-[#3F9495] text-white shadow-xs"
                : "text-[#547070] hover:text-[#193B3B] disabled:hover:text-[#547070]"
            )}
          >
            PM
          </button>
        </div>
      </div>

      {/* Hidden standard input maintaining semantic ID and exact 24h string value */}
      <input
        type="hidden"
        id={id}
        name={id}
        value={value}
        readOnly
      />

      {/* Fast 1-Tap Presets */}
      {presets.length > 0 && !disabled && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {presets.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange(preset.value)}
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors border",
                  isSelected
                    ? "border-[#3F9495] bg-[#3F9495]/12 text-[#193B3B] font-bold"
                    : "border-[rgba(63,148,149,0.14)] bg-white text-[#547070] hover:border-[#3F9495]/40 hover:text-[#193B3B]"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
