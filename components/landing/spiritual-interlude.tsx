import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandMark } from "@/components/branding/brand-mark";

export function SpiritualInterlude() {
  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden bg-[#EAF7F4] py-16 text-center sm:py-24"
    >
      {/* Delicate background geometry */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] rounded-full border border-[#A9824D]/25" />
        <div className="absolute h-[580px] w-[580px] rounded-full border border-dashed border-[#3F9495]/20" />
      </div>

      <Container size="reading">
        <div className="flex flex-col items-center space-y-5">
          {/* Subtle Spiritual Mark */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(63,148,149,0.22)] bg-white/80 shadow-sm">
            <BrandMark size={28} />
          </div>

          {/* Authentic Shloka */}
          <div className="space-y-2">
            <p className="font-serif text-[20px] font-medium leading-relaxed tracking-wide text-[#193B3B] sm:text-[24px] md:text-[28px]">
              अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते
            </p>
            <p className="mx-auto max-w-lg font-serif text-[15px] italic text-[#547070] sm:text-[17px]">
              &ldquo;By constant practice and detachment, O son of Kuntī, the restless mind can be
              steadily trained.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="h-[1px] w-8 bg-[#A9824D]/50" />
            <span className="font-serif text-[12px] font-semibold uppercase tracking-wider text-[#A9824D]">
              Śrīmad Bhagavad-gītā 6.35
            </span>
            <span className="h-[1px] w-8 bg-[#A9824D]/50" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
