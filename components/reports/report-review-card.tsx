"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  formatDuration,
  formatTime12Hour,
  calculateSleepDuration,
  calculateTotalRounds,
  calculateTotalStudy,
} from "@/lib/reports/calculations";
import {
  Moon,
  CircleDot,
  BookOpen,
  Headphones,
  GraduationCap,
  Clock,
} from "lucide-react";

export interface ReportReviewCardProps {
  practiceDate: string;
  sleepTime: string;
  wakeUpTime: string;
  japaRounds: number;
  extraRounds?: number;
  japaCompletedAt?: string;
  readingDurationMinutes?: number;
  readingNote?: string;
  hearingDurationMinutes?: number;
  hearingNote?: string;
  collegeStudyDurationMinutes?: number;
  selfStudyDurationMinutes?: number;
  dayRestDurationMinutes?: number;
  timeWastedDurationMinutes?: number;
  notes?: string;
  status?: "draft" | "submitted";
  className?: string;
}

export function ReportReviewCard({
  practiceDate,
  sleepTime,
  wakeUpTime,
  japaRounds,
  extraRounds = 0,
  japaCompletedAt,
  readingDurationMinutes = 0,
  readingNote,
  hearingDurationMinutes = 0,
  hearingNote,
  collegeStudyDurationMinutes = 0,
  selfStudyDurationMinutes = 0,
  dayRestDurationMinutes = 0,
  timeWastedDurationMinutes = 0,
  notes,
  status = "submitted",
  className,
}: ReportReviewCardProps) {
  const sleepDuration = calculateSleepDuration(sleepTime, wakeUpTime);
  const totalRounds = calculateTotalRounds(japaRounds, extraRounds);
  const totalStudy = calculateTotalStudy(collegeStudyDurationMinutes, selfStudyDurationMinutes);

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#66635D]">
              Practice Summary
            </div>
            <div className="text-[16px] font-bold text-[#20201D]">{practiceDate}</div>
          </div>
          <Badge variant={status === "submitted" ? "krishna" : "neutral"} size="sm">
            {status === "submitted" ? "Submitted" : "Draft"}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {/* Sleep & Wake */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Moon className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>Sleep</span>
            </div>
            <div className="mt-1 text-[14px] font-bold text-[#20201D]">
              {sleepTime && wakeUpTime ? formatDuration(sleepDuration) : "--"}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              {sleepTime ? formatTime12Hour(sleepTime) : "--"} →{" "}
              {wakeUpTime ? formatTime12Hour(wakeUpTime) : "--"}
            </div>
          </div>

          {/* Japa */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <CircleDot className="h-3.5 w-3.5 text-[#D9822B]" />
              <span>Japa</span>
            </div>
            <div className="mt-1 text-[14px] font-bold text-[#20201D]">
              {totalRounds} rounds
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              {japaRounds} std {extraRounds > 0 ? `+ ${extraRounds} extra` : ""}
              {japaCompletedAt ? ` · ${formatTime12Hour(japaCompletedAt)}` : ""}
            </div>
          </div>

          {/* Reading */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <BookOpen className="h-3.5 w-3.5 text-[#3D765B]" />
              <span>Reading</span>
            </div>
            <div className="mt-1 text-[14px] font-bold text-[#20201D]">
              {formatDuration(readingDurationMinutes)}
            </div>
            {readingNote && (
              <div className="mt-0.5 truncate text-[11px] text-[#66635D]">{readingNote}</div>
            )}
          </div>

          {/* Hearing */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Headphones className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>Hearing</span>
            </div>
            <div className="mt-1 text-[14px] font-bold text-[#20201D]">
              {formatDuration(hearingDurationMinutes)}
            </div>
            {hearingNote && (
              <div className="mt-0.5 truncate text-[11px] text-[#66635D]">{hearingNote}</div>
            )}
          </div>

          {/* Study */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <GraduationCap className="h-3.5 w-3.5 text-[#66635D]" />
              <span>Study</span>
            </div>
            <div className="mt-1 text-[14px] font-bold text-[#20201D]">
              {formatDuration(totalStudy)}
            </div>
            <div className="mt-0.5 text-[11px] text-[#66635D]">
              {formatDuration(collegeStudyDurationMinutes)} col +{" "}
              {formatDuration(selfStudyDurationMinutes)} self
            </div>
          </div>

          {/* Rest & Wasted */}
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Clock className="h-3.5 w-3.5 text-[#66635D]" />
              <span>Rest & Time</span>
            </div>
            <div className="mt-1 text-[13px] font-medium text-[#20201D]">
              Rest: {formatDuration(dayRestDurationMinutes)}
            </div>
            <div className="mt-0.5 text-[12px] text-[#66635D]">
              Wasted: {formatDuration(timeWastedDurationMinutes)}
            </div>
          </div>
        </div>

        {/* Notes / Reflection */}
        {notes && (
          <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3 text-[13px] text-[#66635D]">
            <span className="font-semibold text-[#20201D]">Reflection: </span>
            {notes}
          </div>
        )}
      </div>
    </Card>
  );
}
