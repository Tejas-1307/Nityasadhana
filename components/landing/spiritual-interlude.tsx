import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BrandMark } from "@/components/branding/brand-mark";

export function SpiritualInterlude() {
  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden bg-[#F7F1E5] py-16 text-center sm:py-24"
    >
      {/* Delicate background geometry */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] rounded-full border border-[#D9822B]/25" />
        <div className="absolute h-[580px] w-[580px] rounded-full border border-dashed border-[#2457A6]/20" />
      </div>

      <Container size="reading">
        <div className="flex flex-col items-center space-y-5">
          {/* Subtle Spiritual Mark */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8D9BF] bg-white/80 shadow-sm">
            <BrandMark size={28} />
          </div>

          {/* Authentic Shloka */}
          <div className="space-y-2">
            <p className="font-serif text-[20px] font-medium leading-relaxed tracking-wide text-[#20201D] sm:text-[24px] md:text-[28px]">
              अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते
            </p>
            <p className="mx-auto max-w-lg font-serif text-[15px] italic text-[#66635D] sm:text-[17px]">
              &ldquo;By constant practice and detachment, O son of Kuntī, the restless mind can be
              steadily trained.&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="h-[1px] w-8 bg-[#D9822B]/50" />
            <span className="font-serif text-[12px] font-semibold uppercase tracking-wider text-[#D9822B]">
              Śrīmad Bhagavad-gītā 6.35
            </span>
            <span className="h-[1px] w-8 bg-[#D9822B]/50" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
