import * as React from "react";
import { Container } from "@/components/layout/container";

export function DashboardSkeleton() {
  return (
    <main className="py-6 sm:py-10 animate-pulse">
      <Container size="reading">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-4 w-28 rounded bg-[rgba(32,32,29,0.08)]" />
          <div className="h-7 w-64 rounded-lg bg-[rgba(32,32,29,0.1)]" />
          <div className="h-4 w-44 rounded bg-[rgba(32,32,29,0.06)]" />
        </div>

        {/* Primary Today Summary Card Skeleton */}
        <div className="mb-6 h-56 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/70 p-6" />

        {/* Metrics Grid Skeleton */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-24 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
        </div>

        {/* Consistency Surface Skeleton */}
        <div className="mb-6 h-28 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50 p-5" />

        {/* Recent Reports Skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-36 rounded bg-[rgba(32,32,29,0.08)]" />
          <div className="h-16 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
          <div className="h-16 w-full rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white/50" />
        </div>
      </Container>
    </main>
  );
}
