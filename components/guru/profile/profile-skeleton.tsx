"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-level1">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#EAF7F4]" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-md bg-[#EAF7F4]" />
            <div className="h-4 w-32 rounded-md bg-[#EAF7F4]" />
          </div>
        </div>
      </div>

      {/* Attention Skeleton */}
      <Card className="border border-[rgba(63,148,149,0.16)] bg-white p-6">
        <div className="space-y-3">
          <div className="h-4 w-36 rounded-md bg-[#EAF7F4]" />
          <div className="h-5 w-64 rounded-md bg-[#EAF7F4]" />
          <div className="h-4 w-full rounded-md bg-[#EAF7F4]" />
        </div>
      </Card>

      {/* Summary Skeleton */}
      <Card className="border border-[rgba(63,148,149,0.16)] bg-white p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#EAF7F4]" />
          ))}
        </div>
      </Card>

      {/* Trends Skeleton */}
      <Card className="border border-[rgba(63,148,149,0.16)] bg-white p-6">
        <div className="h-40 rounded-2xl bg-[#EAF7F4]" />
      </Card>
    </div>
  );
}
