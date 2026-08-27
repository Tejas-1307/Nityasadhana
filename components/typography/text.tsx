import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "lead" | "body" | "small" | "caption";
  muted?: boolean;
  as?: React.ElementType;
}

export function Text({
  className,
  variant = "body",
  muted = false,
  as: Component = "p",
  children,
  ...props
}: TextProps) {
  const variantStyles = {
    lead: "text-[18px] sm:text-[20px] leading-relaxed",
    body: "text-[15px] sm:text-[16px] leading-normal",
    small: "text-[14px] leading-normal",
    caption: "text-[12px] sm:text-[13px] leading-snug",
  };

  return (
    <Component
      className={cn(variantStyles[variant], muted ? "text-[#66635D]" : "text-[#20201D]", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
