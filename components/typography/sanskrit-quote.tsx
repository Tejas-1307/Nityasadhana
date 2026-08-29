import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SanskritQuoteProps extends React.HTMLAttributes<HTMLElement> {
  shloka: string;
  source?: string;
  translation?: string;
  variant?: "inline" | "card" | "hero";
}

export function SanskritQuote({
  className,
  shloka,
  source,
  translation,
  variant = "card",
  ...props
}: SanskritQuoteProps) {
  if (variant === "inline") {
    return (
      <span className={cn("font-serif italic text-[#A9824D]", className)} {...props}>
        &ldquo;{shloka}&rdquo;
        {source && <span className="ml-1 text-[12px] not-italic text-[#547070]">({source})</span>}
      </span>
    );
  }

  return (
    <figure
      className={cn(
        "relative rounded-[16px] border border-[rgba(63,148,149,0.16)] bg-[#D8F1EE]/30 p-5 text-center transition-colors",
        variant === "hero" &&
          "border-[#A9824D]/25 bg-gradient-to-b from-[#D8F1EE]/50 to-[#EAF7F4] p-6 sm:p-8",
        className
      )}
      {...props}
    >
      <blockquote className="font-serif text-[17px] font-medium leading-relaxed text-[#193B3B] sm:text-[19px]">
        {shloka}
      </blockquote>
      {translation && (
        <p className="mt-2 text-[13px] italic text-[#547070] sm:text-[14px]">
          &ldquo;{translation}&rdquo;
        </p>
      )}
      {source && (
        <figcaption className="mt-2.5 text-[12px] font-medium uppercase tracking-wide text-[#A9824D]">
          — {source}
        </figcaption>
      )}
    </figure>
  );
}
