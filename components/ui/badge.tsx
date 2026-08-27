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
    neutral: "bg-[rgba(32,32,29,0.06)] text-[#20201D] border-[rgba(32,32,29,0.08)]",
    saffron: "bg-[#D9822B]/15 text-[#A95620] border-[#D9822B]/30",
    krishna: "bg-[#2457A6]/10 text-[#2457A6] border-[#2457A6]/20",
    sand: "bg-[#E8D9BF] text-[#20201D] border-[#E8D9BF]",
    feather: "bg-[#3D765B]/15 text-[#3D765B] border-[#3D765B]/30",
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
