import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: "display" | "h1" | "h2" | "h3" | "h4";
  as?: React.ElementType;
  serif?: boolean;
}

export function Heading({
  className,
  level = "h1",
  as,
  serif = false,
  children,
  ...props
}: HeadingProps) {
  const levelStyles = {
    display:
      "text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.15] tracking-tight text-[#20201D]",
    h1: "text-[28px] sm:text-[34px] md:text-[38px] font-bold leading-[1.2] tracking-tight text-[#20201D]",
    h2: "text-[22px] sm:text-[26px] md:text-[30px] font-semibold leading-[1.25] text-[#20201D]",
    h3: "text-[19px] sm:text-[22px] font-semibold leading-[1.3] text-[#20201D]",
    h4: "text-[16px] sm:text-[18px] font-semibold leading-[1.35] text-[#20201D]",
  };

  const tagMap: Record<string, React.ElementType> = {
    display: "h1",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
  };

  const Component = as || tagMap[level] || "h1";

  return (
    <Component className={cn(levelStyles[level], serif && "font-serif", className)} {...props}>
      {children}
    </Component>
  );
}
