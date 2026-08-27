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
      <span className={cn("font-serif italic text-[#D9822B]", className)} {...props}>
        &ldquo;{shloka}&rdquo;
        {source && <span className="ml-1 text-[12px] not-italic text-[#66635D]">({source})</span>}
      </span>
    );
  }

  return (
    <figure
      className={cn(
        "relative rounded-[16px] border border-[rgba(32,32,29,0.08)] bg-[#E8D9BF]/25 p-5 text-center transition-colors",
        variant === "hero" &&
          "border-[#D9822B]/20 bg-gradient-to-b from-[#E8D9BF]/40 to-[#F7F1E5] p-6 sm:p-8",
        className
      )}
      {...props}
    >
      <blockquote className="font-serif text-[17px] font-medium leading-relaxed text-[#20201D] sm:text-[19px]">
        {shloka}
      </blockquote>
      {translation && (
        <p className="mt-2 text-[13px] italic text-[#66635D] sm:text-[14px]">
          &ldquo;{translation}&rdquo;
        </p>
      )}
      {source && (
        <figcaption className="mt-2.5 text-[12px] font-medium uppercase tracking-wide text-[#D9822B]">
          — {source}
        </figcaption>
      )}
    </figure>
  );
}
