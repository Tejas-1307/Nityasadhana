import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ShriKrishnaEditorialArt } from "@/components/branding/devotional-motifs";
import { ArrowDown, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <Section spacing="default" className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-14">
      {/* Editorial Decorative Arcs (Vrindavan Morning Glow) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,191,0.45)_0%,rgba(247,241,229,0)_70%)] blur-2xl"
        aria-hidden="true"
      />

      <Container size="default">
        <div className="flex flex-col items-center text-center">
          {/* Spiritual Context Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(32,32,29,0.08)] bg-white/80 px-3.5 py-1.5 shadow-level1 backdrop-blur-sm">
            <span className="font-serif text-[12px] font-semibold text-[#D9822B]">नित्यसाधना</span>
            <span className="h-3 w-[1px] bg-[rgba(32,32,29,0.15)]" />
            <span className="text-[12px] font-medium text-[#66635D]">ISKCON Pune</span>
          </div>

          {/* Core Brand Headline */}
          <h1 className="max-w-3xl text-balance text-[32px] font-bold leading-[1.12] tracking-tight text-[#20201D] sm:text-[44px] md:text-[54px]">
            Your daily Sādhanā,{" "}
            <span className="relative inline-block text-[#2457A6]">
              consciously lived.
              <svg
                className="absolute -bottom-1.5 left-0 w-full text-[#D9822B]/60"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                height="6"
                aria-hidden="true"
              >
                <path
                  d="M0,5 Q50,0 100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Meaningful Supporting Narrative */}
          <p className="mt-5 max-w-xl text-balance text-[16px] leading-relaxed text-[#66635D] sm:text-[18px]">
            A calm digital companion designed for Brahmacharya students and spiritual teachers to
            nurture daily discipline, reflection, and the sacred Guru–Shishya journey.
          </p>

          {/* Editorial Devotional Composition */}
          <div className="relative my-8 flex flex-col items-center sm:my-10">
            {/* Sacred Devotional Aura & Artwork */}
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#E8D9BF] bg-white shadow-level2 sm:h-40 sm:w-40">
              <div className="absolute inset-2 animate-[spin_120s_linear_infinite] rounded-full border border-dashed border-[#D9822B]/25" />
              <ShriKrishnaEditorialArt size={96} className="relative z-10" />
            </div>

            {/* Subtle Sanskrit Mantra */}
            <p className="mt-3.5 font-serif text-[14px] tracking-wider text-[#D9822B]">
              अभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय
            </p>
            <p className="mt-0.5 text-[12px] text-[#66635D]">
              &ldquo;By the steady practice of devotion, you will reach Me.&rdquo;
            </p>
          </div>

          {/* Primary Action Suite */}
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#entry" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full min-w-[200px] sm:w-auto"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Begin the Journey
              </Button>
            </a>
            <a href="#journey" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full min-w-[180px] sm:w-auto"
                leftIcon={<ArrowDown className="h-4 w-4" />}
              >
                Explore Sādhanā
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
