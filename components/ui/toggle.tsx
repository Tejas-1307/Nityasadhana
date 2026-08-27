"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sanskritLabel?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  variant?: "krishna" | "saffron";
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  sanskritLabel,
  description,
  disabled = false,
  className,
  variant = "krishna",
  id,
}: ToggleProps) {
  const generatedId = React.useId();
  const toggleId = id || generatedId;

  const activeColor =
    variant === "saffron" ? "bg-[#D9822B] border-[#D9822B]" : "bg-[#2457A6] border-[#2457A6]";

  return (
    <div
      className={cn(
        "flex select-none items-center justify-between gap-4 py-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {(label || sanskritLabel || description) && (
        <label htmlFor={toggleId} className="flex cursor-pointer flex-col text-left">
          <div className="flex items-center gap-2">
            {label && <span className="text-[15px] font-medium text-[#20201D]">{label}</span>}
            {sanskritLabel && (
              <span className="font-serif text-[13px] text-[#D9822B]">({sanskritLabel})</span>
            )}
          </div>
          {description && <span className="mt-0.5 text-[13px] text-[#66635D]">{description}</span>}
        </label>
      )}

      {/* Accessible Switch Button */}
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-8 min-h-[48px] w-14 min-w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 p-1 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6] focus-visible:ring-offset-2",
          checked ? activeColor : "border-transparent bg-[rgba(32,32,29,0.12)]"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
            checked ? "translate-x-3" : "-translate-x-3"
          )}
        />
      </button>
    </div>
  );
}
