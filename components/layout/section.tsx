import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "default" | "lg";
  as?: React.ElementType;
}

export function Section({
  className,
  spacing = "default",
  as: Component = "section",
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    none: "py-0",
    sm: "py-6 sm:py-8",
    default: "py-10 sm:py-12 md:py-16",
    lg: "py-16 sm:py-20 md:py-24",
  };

  return (
    <Component className={cn("w-full", spacingStyles[spacing], className)} {...props}>
      {children}
    </Component>
  );
}
