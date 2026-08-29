import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/branding/brand-mark";
import { LotusMotif } from "@/components/branding/devotional-motifs";
import { ArrowUpRight, Sparkles, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer
      className="relative overflow-hidden border-t border-[rgba(63,148,149,0.16)] bg-[#DDF0EC] text-[#193B3B]"
      aria-label="Site Footer"
    >
      {/* Background Atmosphere: Vrindavan Sacred Groves & Editorial Line Art */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft Ambient Warmth Halo */}
        <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(142,217,213,0.4)_0%,rgba(221,240,236,0)_70%)] blur-2xl" />
        <div className="absolute -bottom-24 right-[5%] h-[350px] w-[350px] rounded-full bg-[#56BFC0]/[0.04] blur-3xl" />
        <div className="absolute -bottom-24 left-[5%] h-[350px] w-[350px] rounded-full bg-[#D0B27A]/[0.035] blur-3xl" />

        {/* Delicate Architectural Arc & Peacock Feather Geometry Line Art */}
        <svg
          className="absolute -right-12 bottom-0 h-[420px] w-[420px] opacity-[0.05] sm:h-[540px] sm:w-[540px]"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sacred Temple Mandir Dome Arcs */}
          <path
            d="M250 50C150 150 100 280 50 500"
            stroke="#193B3B"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M250 50C350 150 400 280 450 500"
            stroke="#193B3B"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <circle cx="250" cy="50" r="12" stroke="#A9824D" strokeWidth="1.5" />
          <circle cx="250" cy="220" r="80" stroke="#3F9495" strokeWidth="1" />
          <circle cx="250" cy="220" r="140" stroke="#328A7A" strokeWidth="0.75" strokeDasharray="3 3" />
          {/* Subtle Peacock Feather Radiance */}
          <path d="M120 400Q250 250 380 400" stroke="#3F9495" strokeWidth="1.5" />
          <path d="M160 440Q250 320 340 440" stroke="#A9824D" strokeWidth="1.25" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* ============================================================ */}
        {/* LAYER 1: LARGE EDITORIAL BRAND STATEMENT                     */}
        {/* ============================================================ */}
        <div className="border-b border-[rgba(63,148,149,0.12)] py-14 sm:py-20">
          <Container size="default">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Brand Lockup, Manifesto & Sacred Shloka */}
              <div className="space-y-6 lg:col-span-7">
                {/* Brand Identity Lockup */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(63,148,149,0.20)] bg-white shadow-level1">
                    <BrandMark size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[22px] font-bold tracking-tight text-[#193B3B] sm:text-[26px]">
                        Nityasādhanā
                      </span>
                      <span className="font-serif text-[15px] font-semibold text-[#A9824D]">
                        • नित्यसाधना
                      </span>
                    </div>
                    <p className="text-[12px] font-medium tracking-wide text-[#547070] sm:text-[13px]">
                      A digital companion for conscious daily Sādhanā
                    </p>
                  </div>
                </div>

                {/* Editorial Manifesto */}
                <div className="space-y-2 pt-1">
                  <h2 className="text-balance text-[24px] font-bold leading-[1.2] tracking-tight text-[#193B3B] sm:text-[32px] md:text-[36px]">
                    Daily discipline.{" "}
                    <span className="text-[#3F9495]">A conscious journey.</span>{" "}
                    <br className="hidden sm:inline" />
                    A life of Sādhana.
                  </h2>
                  <p className="max-w-xl text-[14px] leading-relaxed text-[#547070] sm:text-[15px]">
                    Nurturing the sacred Guru–Shishya relationship through calm, contemplative
                    technology designed specifically for Brahmacharya students and spiritual teachers
                    at ISKCON Pune.
                  </p>
                </div>

                {/* Subtle Sanskrit Anchor Shloka */}
                <div className="inline-flex flex-col gap-1 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:p-4.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#A9824D]/10 text-[#A9824D]">
                    <LotusMotif size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-serif text-[13px] font-semibold tracking-wide text-[#A9824D] sm:text-[14px]">
                      अभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय
                    </p>
                    <p className="text-[12px] italic text-[#547070]">
                      &ldquo;By the steady practice of devotional yoga, you will reach Me.&rdquo; — Bhagavad-gītā 12.9
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Seva Philosophy Card */}
              <div className="lg:col-span-5 lg:pt-2">
                <div className="rounded-3xl border border-[rgba(63,148,149,0.14)] bg-white p-6 shadow-level1 sm:p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(63,148,149,0.14)] bg-[#EAF7F4] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#A9824D] uppercase">
                      <Sparkles className="h-3 w-3" />
                      <span>Philosophy of Seva</span>
                    </div>
                    <span className="font-serif text-[12px] text-[#547070]">सेवाभावः</span>
                  </div>

                  <blockquote className="border-l-2 border-[#3F9495] pl-3.5 text-[14px] font-medium leading-relaxed italic text-[#193B3B] sm:text-[15px]">
                    &ldquo;Don&apos;t make devotees spend their seva managing software. Make the
                    software reduce the work required to perform their seva.&rdquo;
                  </blockquote>

                  <div className="mt-5 flex items-center justify-between border-t border-[rgba(63,148,149,0.10)] pt-4 text-[12px] text-[#547070]">
                    <span>Devotional engineering principle</span>
                    <span className="font-semibold text-[#193B3B]">ISKCON Pune</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ============================================================ */}
        {/* LAYER 2 & 3: MINIMAL NAVIGATION & BRAND RELATIONSHIP         */}
        {/* ============================================================ */}
        <div className="py-12 sm:py-16">
          <Container size="default">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
              {/* Column 1: Explore Navigation */}
              <div className="space-y-4 lg:col-span-3">
                <p className="text-[12px] font-bold tracking-wider text-[#193B3B] uppercase">
                  Explore
                </p>
                <ul className="space-y-2.5 text-[14px]">
                  <li>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>About Nityasādhanā</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#purpose"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Core Purpose</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#journey"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Daily Sādhanā Journey</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Portals & Access */}
              <div className="space-y-4 lg:col-span-3">
                <p className="text-[12px] font-bold tracking-wider text-[#193B3B] uppercase">
                  Portals & Entry
                </p>
                <ul className="space-y-2.5 text-[14px]">
                  <li>
                    <Link
                      href="/login?role=student"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Shishya Sādhanā Portal</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login?role=guru"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Guru Mentorship Portal</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/invite"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Enter with Invitation Code</span>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#guru-shishya"
                      className="inline-flex items-center gap-1.5 py-1 text-[#547070] transition-colors hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] rounded-md"
                    >
                      <span>Guru–Shishya Sacred Bond</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 & 4: ISKCON Pune + GOLDSPADE Craftsmanship Presentation */}
              <div className="sm:col-span-2 lg:col-span-6 lg:pl-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* ISKCON Pune Relationship */}
                  <div className="flex flex-col justify-between rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-[#A9824D]/35">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#A9824D] uppercase">
                        <Heart className="h-3 w-3" />
                        <span>Spiritual Home</span>
                      </div>
                      <h3 className="mt-1.5 text-[16px] font-bold text-[#193B3B]">
                        ISKCON Pune
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#547070]">
                        Sri Sri Radha Kunjabihari Mandir & NVCC Pune. Dedicated to the guidance of devotees and ashram students.
                      </p>
                    </div>
                    <div className="mt-4 border-t border-[rgba(63,148,149,0.12)] pt-3 text-[12px] font-medium text-[#193B3B]">
                      Built with devotion
                    </div>
                  </div>

                  {/* GOLDSPADE Craftsmanship Credit */}
                  <a
                    href="https://goldspade.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-[#3F9495]/40 hover:shadow-level1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#3F9495] uppercase">
                        <Sparkles className="h-3 w-3" />
                        <span>Craftsmanship</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-sans text-[16px] font-bold tracking-tight text-[#193B3B]">
                          GOLDSPADE
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#547070] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3F9495]" />
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#547070]">
                        Design & technology craftsmanship. Curating quiet, high-craft digital experiences with reverence.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[rgba(63,148,149,0.12)] pt-3 text-[12px]">
                      <span className="text-[#547070]">Crafted with care</span>
                      <span className="font-semibold text-[#3F9495] transition-colors group-hover:underline">
                        GOLDSPADE →
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* ============================================================ */}
        {/* LAYER 4: FOOTER BOTTOM METADATA BAR                          */}
        {/* ============================================================ */}
        <div className="border-t border-[rgba(63,148,149,0.14)] py-6 text-[12px] sm:py-8 sm:text-[13px]">
          <Container size="default">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              {/* Left: Copyright & Devotional Note */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[#547070] sm:justify-start">
                <span>© {new Date().getFullYear()} Nityasādhanā.</span>
                <span className="hidden sm:inline">•</span>
                <span>Built with devotion for ISKCON Pune.</span>
              </div>

              {/* Right: Craftsmanship & Seva Heritage */}
              <div className="flex items-center gap-2 text-[#547070]">
                <span>Crafted by</span>
                <a
                  href="https://goldspade.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold tracking-wide text-[#193B3B] transition-colors hover:text-[#3F9495] hover:underline"
                >
                  GOLDSPADE
                </a>
                <span>•</span>
                <span className="font-serif text-[#A9824D]">हरे कृष्ण</span>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}
