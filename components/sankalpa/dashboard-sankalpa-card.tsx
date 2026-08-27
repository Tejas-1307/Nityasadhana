"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DbWeeklySankalpa } from "@/lib/db/schema";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { Sprout, ArrowRight } from "lucide-react";

export interface DashboardSankalpaCardProps {
  sankalpa: DbWeeklySankalpa | null;
}

export function DashboardSankalpaCard({ sankalpa }: DashboardSankalpaCardProps) {
  if (!sankalpa) {
    return (
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3D765B]/10 text-[#3D765B]">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3D765B]">
                Weekly Sankalpa
              </span>
              <div className="text-[14px] font-bold text-[#20201D]">
                Choose your focus for this week
              </div>
            </div>
          </div>

          <Link
            href="/student/journey"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#3D765B] hover:underline"
          >
            <span>Set Focus</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>
    );
  }

  const formattedRange = formatSankalpaRange(sankalpa.startDate, sankalpa.endDate);
  const alignedDays = sankalpa.progress?.alignedDays || 0;
  const totalDays = sankalpa.progress?.totalDays || 7;

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3D765B]/10 text-[#3D765B]">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
                This Week&apos;s Focus
              </span>
              <span className="text-[11px] text-[#66635D]">({formattedRange})</span>
            </div>
            <div className="text-[15px] font-bold text-[#20201D]">
              {sankalpa.title}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {sankalpa.progress?.dailyProgress.map((day, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    day.status === "completed"
                      ? "bg-[#3D765B]"
                      : day.status === "pending"
                      ? "bg-[#D9822B] animate-pulse"
                      : "bg-[rgba(32,32,29,0.15)]"
                  }`}
                  title={`${day.dayLabel}: ${day.status}`}
                />
              ))}
            </div>
            <span className="text-[12px] font-bold text-[#20201D]">
              {alignedDays}/{totalDays}
            </span>
          </div>

          <Link
            href="/student/journey"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-[#3D765B] hover:underline"
          >
            <span>Journey</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
