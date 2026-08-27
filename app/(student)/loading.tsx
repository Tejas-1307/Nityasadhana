import * as React from "react";
import { Container } from "@/components/layout/container";

export default function StudentLoading() {
  return (
    <main className="py-6 sm:py-10 animate-pulse">
      <Container size="reading">
        {/* Greeting Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-4 w-28 rounded bg-[rgba(32,32,29,0.08)]" />
          <div className="h-7 w-56 rounded-lg bg-[rgba(32,32,29,0.1)]" />
          <div className="h-4 w-36 rounded bg-[rgba(32,32,29,0.06)]" />
        </div>

        {/* Primary Card Skeleton */}
        <div className="mb-6 h-48 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/70 p-6" />

        {/* Secondary Card Skeleton */}
        <div className="h-28 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50 p-5" />
      </Container>
    </main>
  );
}
