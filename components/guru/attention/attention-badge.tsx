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
        className={`inline-flex items-center rounded-full font-bold border border-[#3D765B]/20 bg-[#3D765B]/10 text-[#3D765B] ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <CheckCircle2 className={`${iconSizes[size]} shrink-0`} />}
        <span>Stable</span>
      </span>
    );
  }

  if (level === "OBSERVE") {
    return (
      <span
        className={`inline-flex items-center rounded-full font-bold border border-[#D9822B]/20 bg-[#D9822B]/10 text-[#D9822B] ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <Eye className={`${iconSizes[size]} shrink-0`} />}
        <span>Observe</span>
      </span>
    );
  }

  // FOLLOW_UP_SUGGESTED
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border border-[#2457A6]/20 bg-[#2457A6]/10 text-[#2457A6] ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <AlertCircle className={`${iconSizes[size]} shrink-0`} />}
      <span>Follow-up Suggested</span>
    </span>
  );
}
