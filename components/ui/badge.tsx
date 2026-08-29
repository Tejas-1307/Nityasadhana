import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "saffron" | "krishna" | "sand" | "feather" | "neutral";
  size?: "sm" | "default";
}

export function Badge({
  className,
  variant = "neutral",
  size = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[rgba(63,148,149,0.08)] text-[#193B3B] border-[rgba(63,148,149,0.18)]",
    saffron: "bg-[#A9824D]/15 text-[#8A6635] border-[#A9824D]/35",
    krishna: "bg-[#3F9495]/12 text-[#2A7576] border-[#3F9495]/25",
    sand: "bg-[#F3EFE5] text-[#193B3B] border-[#D0B27A]/35",
    feather: "bg-[#56BFC0]/15 text-[#246B6C] border-[#56BFC0]/30",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium tracking-wide",
    default: "px-2.5 py-1 text-[12px] font-medium tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border leading-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
