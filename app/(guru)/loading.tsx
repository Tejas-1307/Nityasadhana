import * as React from "react";
import { Container } from "@/components/layout/container";

export default function GuruLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EAF7F4] pb-20 md:pb-10">
      {/* Top Header Bar Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.16)] bg-white/90 backdrop-blur-md">
        <Container size="default">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <div className="h-8 w-36 rounded-lg bg-[rgba(63,148,149,0.12)] animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-[rgba(63,148,149,0.12)] animate-pulse" />
          </div>
        </Container>
      </header>

      {/* Main Content Skeletons */}
      <main className="flex-1 py-6 sm:py-10 animate-pulse">
        <Container size="reading">
          <div className="space-y-6">
            {/* Header Greeting Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-[rgba(63,148,149,0.12)]" />
              <div className="h-7 w-64 rounded-lg bg-[rgba(63,148,149,0.16)]" />
              <div className="h-4 w-48 rounded bg-[rgba(63,148,149,0.08)]" />
            </div>

            {/* Reporting Overview Card Skeleton */}
            <div className="h-36 w-full rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/80 p-6" />

            {/* Attention Section Skeleton */}
            <div className="space-y-3">
              <div className="h-5 w-40 rounded bg-[rgba(63,148,149,0.12)]" />
              <div className="h-24 w-full rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/60 p-4" />
              <div className="h-24 w-full rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/60 p-4" />
            </div>

            {/* Stable Section Skeleton */}
            <div className="h-20 w-full rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white/50 p-4" />
          </div>
        </Container>
      </main>
    </div>
  );
}
