import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  sanskritLabel?: string;
}

export function Divider({ className, label, sanskritLabel, ...props }: DividerProps) {
  if (!label && !sanskritLabel) {
    return (
      <hr
        className={cn("my-6 border-0 border-t border-[rgba(63,148,149,0.16)]", className)}
        {...props}
      />
    );
  }

  return (
    <div className={cn("my-6 flex items-center gap-4", className)} {...props}>
      <div className="h-px flex-1 bg-[rgba(63,148,149,0.16)]" />
      <span className="text-[13px] font-medium uppercase tracking-wider text-[#547070]">
        {label}
        {sanskritLabel && (
          <span className="ml-1.5 font-serif text-[12px] lowercase text-[#A9824D]">
            ({sanskritLabel})
          </span>
        )}
      </span>
      <div className="h-px flex-1 bg-[rgba(63,148,149,0.16)]" />
    </div>
  );
}
