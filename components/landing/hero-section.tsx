import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <Section spacing="default" className="relative overflow-hidden pb-14 pt-6 sm:pb-20 sm:pt-12">
      {/* Editorial Decorative Arcs (Vrindavan Morning Glow) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(142,217,213,0.45)_0%,rgba(234,247,244,0)_70%)] blur-2xl"
        aria-hidden="true"
      />

      <Container size="default">
        <div className="flex flex-col items-center text-center">
          {/* Spiritual Context Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(63,148,149,0.16)] bg-white/85 px-3.5 py-1.5 shadow-level1 backdrop-blur-sm">
            <span className="font-serif text-[12px] font-semibold text-[#A9824D]">नित्यसाधना</span>
            <span className="h-3 w-[1px] bg-[rgba(63,148,149,0.25)]" />
            <span className="text-[12px] font-medium text-[#547070]">ISKCON Pune</span>
          </div>

          {/* Core Brand Headline */}
          <h1 className="max-w-3xl text-balance text-[32px] font-bold leading-[1.15] tracking-tight text-[#193B3B] sm:text-[44px] md:text-[52px]">
            Your daily Sādhanā,{" "}
            <span className="relative inline-block text-[#3F9495]">
              simply recorded.
              <svg
                className="absolute -bottom-1.5 left-0 w-full text-[#A9824D]/70"
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

          {/* Meaningful Concise Narrative */}
          <p className="mt-3.5 max-w-lg text-balance text-[15px] leading-relaxed text-[#547070] sm:text-[17px]">
            Your daily practice, in one place. Calm, tap-based Sādhanā recording for devotees and counsellors.
          </p>

          {/* Devotional Hero Artwork Showcase */}
          <div className="relative my-7 flex flex-col items-center sm:my-9">
            <div className="relative overflow-hidden rounded-3xl border border-[rgba(63,148,149,0.24)] bg-white p-2 shadow-level2 sm:p-2.5">
              <div className="relative h-[220px] w-[290px] overflow-hidden rounded-2xl sm:h-[300px] sm:w-[400px] md:h-[340px] md:w-[460px]">
                <Image
                  src="/images/krishna-hero.jpg"
                  alt="Shri Krishna playing flute by the Yamuna at Vrindavan sunrise"
                  fill
                  priority
                  sizes="(max-width: 640px) 290px, (max-width: 768px) 400px, 460px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Subtle Sanskrit Shloka */}
            <p className="mt-4 font-serif text-[14px] tracking-wider text-[#A9824D]">
              अभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय
            </p>
            <p className="mt-0.5 text-[12px] text-[#547070]">
              &ldquo;By the steady practice of devotion, you will reach Me.&rdquo;
            </p>
          </div>

          {/* Primary Action Suite */}
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#entry" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full min-w-[190px] sm:w-auto"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Get Started
              </Button>
            </a>
            <a href="#journey" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full min-w-[170px] sm:w-auto"
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
