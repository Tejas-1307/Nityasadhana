import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type BrandMarkSize = 16 | 24 | 32 | 48 | 64 | 128 | 512 | number;

export interface BrandMarkProps extends React.SVGAttributes<SVGElement> {
  size?: BrandMarkSize;
  variant?: "full" | "monochrome" | "white" | "subtle";
}

/**
 * Nityasādhanā Minimal Brand Mark
 *
 * Geometric concept:
 * - Outer Feather Crown / Contour: Inspired by the Kadamba tree & Vrindavan peacock feather.
 * - Upward Radiance / Spiritual Path: Symbolizing continuous Sadhana discipline & ascent.
 * - Core Krishna Blue Eye & Saffron Bindu: Focused consciousness & devotion.
 *
 * Tested & crisp at 16px, 24px, 32px, 48px, 64px, 128px, and 512px.
 */
export function BrandMark({ size = 40, variant = "full", className, ...props }: BrandMarkProps) {
  const isMonochrome = variant === "monochrome";
  const isWhite = variant === "white";
  const isSubtle = variant === "subtle";

  const peacockColor = isWhite
    ? "#FFFFFF"
    : isMonochrome
      ? "#193B3B"
      : isSubtle
        ? "#547070"
        : "#56BFC0";

  const innerSurfaceColor = isWhite
    ? "rgba(255, 255, 255, 0.15)"
    : isMonochrome
      ? "rgba(25, 59, 59, 0.08)"
      : "#D8F1EE";

  const primaryBlueColor = isWhite ? "#FFFFFF" : isMonochrome ? "#193B3B" : "#3F9495";

  const saffronColor = isWhite ? "#FFFFFF" : isMonochrome ? "#193B3B" : "#A9824D";

  // For very small sizes (<=20px), slightly adjust stroke width for maximum optical clarity
  const strokeW = typeof size === "number" && size <= 20 ? 3 : 2.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none transition-transform duration-200", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Outer Feather Crown / Ascending Contour */}
      <path
        d="M32 4C32 4 48 16 48 32C48 42 41 50 32 58C23 50 16 42 16 32C16 16 32 4 32 4Z"
        fill={peacockColor}
        fillOpacity={isWhite ? 0.18 : isMonochrome ? 0.1 : 0.15}
        stroke={peacockColor}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Upward Pathway / Inner Radiance Curve */}
      <path
        d="M32 14C32 14 42 24 42 34C42 40 37.5 45 32 50C26.5 45 22 40 22 34C22 24 32 14 32 14Z"
        fill={innerSurfaceColor}
        stroke={primaryBlueColor}
        strokeWidth={strokeW - 0.5}
      />

      {/* Core Eye & Upward Sacred Flame Point */}
      <ellipse cx="32" cy="34" rx="5.5" ry="7.5" fill={primaryBlueColor} />

      {/* Spiritual Saffron Dot / Bindu of Focus */}
      <circle cx="32" cy="33" r="2.5" fill={saffronColor} />

      {/* Upward Discipline Axis */}
      <path d="M32 50V60" stroke={primaryBlueColor} strokeWidth={strokeW} strokeLinecap="round" />
    </svg>
  );
}
