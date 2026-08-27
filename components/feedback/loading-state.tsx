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
        <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-[rgba(32,32,29,0.1)] border-t-[#2457A6]" />
        <Sparkles className="h-5 w-5 animate-pulse text-[#D9822B]" />
      </div>
      {sanskritMessage && (
        <p className="mb-0.5 font-serif text-[13px] text-[#D9822B]">{sanskritMessage}</p>
      )}
      <p className="text-[14px] font-medium text-[#66635D]">{message}</p>
    </div>
  );
}
