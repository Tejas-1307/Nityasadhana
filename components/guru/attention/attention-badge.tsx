import * as React from "react";
import { AttentionLevel } from "@/lib/guru/attention";
import { CheckCircle2, Eye, AlertCircle } from "lucide-react";

export interface AttentionBadgeProps {
  level: AttentionLevel;
  size?: "sm" | "default" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function AttentionBadge({
  level,
  size = "default",
  className = "",
  showIcon = true,
}: AttentionBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    default: "px-2.5 py-1 text-[12px] gap-1.5",
    lg: "px-3 py-1.5 text-[13px] gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  if (level === "STABLE") {
    return (
      <span
        className={`inline-flex items-center rounded-full font-bold border border-[#328A7A]/25 bg-[#328A7A]/10 text-[#328A7A] ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <CheckCircle2 className={`${iconSizes[size]} shrink-0`} />}
        <span>Stable</span>
      </span>
    );
  }

  if (level === "OBSERVE") {
    return (
      <span
        className={`inline-flex items-center rounded-full font-bold border border-[#A9824D]/25 bg-[#A9824D]/10 text-[#A9824D] ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Eye className={`${iconSizes[size]} shrink-0`} />}
        <span>Observe</span>
      </span>
    );
  }

  // FOLLOW_UP_SUGGESTED
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border border-[#3F9495]/25 bg-[#3F9495]/10 text-[#3F9495] ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <AlertCircle className={`${iconSizes[size]} shrink-0`} />}
      <span>Follow-up Suggested</span>
    </span>
  );
}
