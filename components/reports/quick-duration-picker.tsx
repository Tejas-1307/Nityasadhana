"use client";

import * as React from "react";
import { formatDuration } from "@/lib/reports/calculations";
import { Check } from "lucide-react";

export interface QuickDurationPickerProps {
  id?: string;
  label: string;
  value: number; // Duration in minutes
  onChange: (minutes: number) => void;
  presets?: number[]; // Presets in minutes
  suggestedValue?: number; // Previous/remembered value
  disabled?: boolean;
  themeColor?: "krishna" | "saffron" | "forest" | "neutral";
  optionalNote?: string;
  onNoteChange?: (note: string) => void;
  notePlaceholder?: string;
}

export function QuickDurationPicker({
  id,
  label,
  value,
  onChange,
  presets = [0, 15, 30, 45, 60, 90],
  suggestedValue,
  disabled = false,
  themeColor = "krishna",
  optionalNote,
  onNoteChange,
  notePlaceholder,
}: QuickDurationPickerProps) {
  const [isCustom, setIsCustom] = React.useState<boolean>(
    !presets.includes(value) && value > 0
  );

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  const handlePresetClick = (presetMins: number) => {
    if (disabled) return;
    setIsCustom(false);
    onChange(presetMins);
  };

  const handleCustomToggle = () => {
    if (disabled) return;
    setIsCustom(true);
  };

  const handleHoursChange = (newHours: number) => {
    const h = Math.max(0, Math.min(24, newHours || 0));
    onChange(h * 60 + minutes);
  };

  const handleMinutesChange = (newMins: number) => {
    const m = Math.max(0, Math.min(59, newMins || 0));
    onChange(hours * 60 + m);
  };

  const getThemeClasses = (isSelected: boolean) => {
    if (!isSelected) {
      return "border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 text-[#193B3B] hover:bg-[#EAF7F4] active:scale-95";
    }

    switch (themeColor) {
      case "saffron":
        return "border-[#A9824D] bg-[#A9824D] text-white shadow-sm font-semibold";
      case "forest":
        return "border-[#328A7A] bg-[#328A7A] text-white shadow-sm font-semibold";
      case "neutral":
        return "border-[#193B3B] bg-[#193B3B] text-white shadow-sm font-semibold";
      case "krishna":
      default:
        return "border-[#3F9495] bg-[#3F9495] text-white shadow-sm font-semibold";
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Title and Current Value */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold uppercase tracking-wider text-[#547070]"
        >
          {label}
        </label>
        <span className="text-[14px] font-bold text-[#193B3B]">{formatDuration(value)}</span>
      </div>

      {/* Quick Selection Chips */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${label} options`}>
        {presets.map((preset) => {
          const isSelected = !isCustom && value === preset;
          const isSuggested = suggestedValue !== undefined && suggestedValue === preset;

          return (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              onClick={() => handlePresetClick(preset)}
              className={`relative flex min-h-[44px] min-w-[52px] items-center justify-center rounded-xl border px-3 py-2 text-[13px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] ${getThemeClasses(
                isSelected
              )} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span className="flex items-center gap-1">
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                <span>{preset === 0 ? "0m" : formatDuration(preset)}</span>
              </span>
              {isSuggested && !isSelected && (
                <span
                  title="Suggested from previous report"
                  className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#A9824D]"
                />
              )}
            </button>
          );
        })}

        {/* Custom Toggle Chip */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleCustomToggle}
          className={`flex min-h-[44px] items-center justify-center rounded-xl border px-3 py-2 text-[13px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] ${getThemeClasses(
            isCustom
          )} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <span className="flex items-center gap-1">
            {isCustom && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
            <span>Custom</span>
          </span>
        </button>
      </div>

      {/* Inline Compact Custom Hours + Minutes Input */}
      {isCustom && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-2.5">
          <div className="flex flex-1 items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={24}
              disabled={disabled}
              value={hours || ""}
              onChange={(e) => handleHoursChange(parseInt(e.target.value, 10) || 0)}
              className="h-10 w-full rounded-lg border border-[rgba(63,148,149,0.18)] bg-white px-2 text-center text-[14px] font-bold text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20"
              placeholder="0"
            />
            <span className="text-[12px] font-semibold text-[#547070]">hr</span>
          </div>

          <div className="flex flex-1 items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              disabled={disabled}
              value={minutes || ""}
              onChange={(e) => handleMinutesChange(parseInt(e.target.value, 10) || 0)}
              className="h-10 w-full rounded-lg border border-[rgba(63,148,149,0.18)] bg-white px-2 text-center text-[14px] font-bold text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20"
              placeholder="0"
            />
            <span className="text-[12px] font-semibold text-[#547070]">min</span>
          </div>
        </div>
      )}

      {/* Optional Note / Topic Input */}
      {onNoteChange && (
        <input
          type="text"
          maxLength={100}
          disabled={disabled}
          value={optionalNote || ""}
          onChange={(e) => onNoteChange(e.target.value)}
          className="mt-1 h-10 w-full rounded-xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/30 px-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/60 focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
          placeholder={notePlaceholder || "Topic / Title (optional)"}
        />
      )}
    </div>
  );
}
