import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { BrandMark, BrandMarkProps } from "./brand-mark";

export type LogoVariant =
  | "horizontal" // Primary horizontal lockup (BrandMark + Nityasādhanā + Devanagari)
  | "compact" // Compact for mobile headers
  | "vertical" // Centered stacked lockup (for splash, login screens)
  | "symbol" // Symbol only
  | "monochrome" // Deep charcoal single-color
  | "dark"; // Light elements for dark surface containers

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  variant?: LogoVariant;
  vertical?: boolean;
  size?: "sm" | "default" | "lg" | "xl";
  showSanskrit?: boolean;
  href?: string;
  asDiv?: boolean;
}

export function Logo({
  className,
  variant = "horizontal",
  vertical = false,
  size = "default",
  showSanskrit = true,
  href = "/",
  asDiv = false,
  ...props
}: LogoProps) {
  const isVertical = variant === "vertical" || vertical;
  const isSymbolOnly = variant === "symbol";
  const isMonochrome = variant === "monochrome";
  const isDark = variant === "dark";

  const markSizes = {
    sm: 26,
    default: 36,
    lg: 48,
    xl: 64,
  };

  const titleSizes = {
    sm: "text-[15px]",
    default: "text-[18px]",
    lg: "text-[24px]",
    xl: "text-[32px]",
  };

  const sanskritSizes = {
    sm: "text-[11px]",
    default: "text-[12px]",
    lg: "text-[14px]",
    xl: "text-[18px]",
  };

  const markVariant: BrandMarkProps["variant"] = isDark
    ? "white"
    : isMonochrome
      ? "monochrome"
      : "full";

  const titleColor = isDark ? "text-white" : isMonochrome ? "text-[#20201D]" : "text-[#20201D]";

  const sanskritColor = isDark
    ? "text-white/80"
    : isMonochrome
      ? "text-[#66635D]"
      : "text-[#D9822B]";

  const content = (
    <>
      <BrandMark
        size={markSizes[size]}
        variant={markVariant}
        className="transition-transform duration-200 group-hover:scale-105"
      />
      {!isSymbolOnly && (
        <div
          className={cn(
            "flex flex-col leading-tight",
            isVertical ? "mt-2 items-center text-center" : "items-start"
          )}
        >
          <span
            className={cn(
              "font-sans font-bold tracking-tight transition-colors",
              titleSizes[size],
              titleColor
            )}
          >
            Nityasādhanā
          </span>
          {showSanskrit && (
            <span
              className={cn(
                "font-serif font-medium tracking-wide transition-colors",
                sanskritSizes[size],
                sanskritColor
              )}
            >
              नित्यसाधना
            </span>
          )}
        </div>
      )}
    </>
  );

  const containerClasses = cn(
    "group inline-flex items-center gap-2.5 sm:gap-3 rounded-[8px] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6]",
    isVertical ? "flex-col" : "flex-row",
    className
  );

  if (asDiv) {
    return (
      <div className={containerClasses} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={containerClasses} {...props}>
      {content}
    </Link>
  );
}
