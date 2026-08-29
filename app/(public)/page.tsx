import * as React from "react";
import { VrindavanAtmosphere } from "@/components/branding/vrindavan-atmosphere";
import {
  LandingNavbar,
  HeroSection,
  PurposeSection,
  DailyJourneySection,
  GuruShishyaSection,
  ShishyaSection,
  GuruSection,
  SpiritualInterlude,
  RoleEntrySection,
  LandingFooter,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#EAF7F4] text-[#193B3B] selection:bg-[#3F9495] selection:text-white">
      {/* Subtle Vrindavan Atmosphere */}
      <VrindavanAtmosphere />

      {/* 01 — Arrival & Minimal Navbar */}
      <LandingNavbar />

      <main>
        {/* 02 — Hero Section */}
        <HeroSection />

        {/* 03 — Why Nityasādhanā / Purpose */}
        <PurposeSection />

        {/* 04 — The Daily Sādhanā Journey */}
        <DailyJourneySection />

        {/* 05 — The Guru–Shishya Sacred Bond */}
        <GuruShishyaSection />

        {/* 06 — Designed for Shishyas */}
        <ShishyaSection />

        {/* 07 — Designed for Gurus */}
        <GuruSection />

        {/* 08 — Spiritual Interlude (Breathing Space) */}
        <SpiritualInterlude />

        {/* 09, 10, 11 — A Quiet Invitation & Role Entry */}
        <RoleEntrySection />
      </main>

      {/* 12 — Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
