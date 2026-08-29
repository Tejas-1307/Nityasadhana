import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Sparkles } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
  sanskritMessage?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading with mindfulness...",
  sanskritMessage = "प्रतीक्ष्यताम्...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex select-none flex-col items-center justify-center p-12 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
        <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-[rgba(63,148,149,0.16)] border-t-[#3F9495]" />
        <Sparkles className="h-5 w-5 animate-pulse text-[#A9824D]" />
      </div>
      {sanskritMessage && (
        <p className="mb-0.5 font-serif text-[13px] text-[#A9824D]">{sanskritMessage}</p>
      )}
      <p className="text-[14px] font-medium text-[#547070]">{message}</p>
    </div>
  );
}
