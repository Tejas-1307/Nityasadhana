"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DigestSummary } from "@/lib/digest/types";
import { Users, CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";

export interface DigestSummaryCardProps {
  summary: DigestSummary;
  formattedRange: string;
}

export function DigestSummaryCard({ summary, formattedRange }: DigestSummaryCardProps) {
  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Top Range & Progress Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(32,32,29,0.06)] pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#D9822B]" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#66635D]">
            Weekly Group Snapshot
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#20201D]">{formattedRange}</span>
          {summary.isWeekInProgress ? (
            <Badge variant="saffron" size="sm">
              Week in progress
            </Badge>
          ) : (
            <Badge variant="krishna" size="sm">
              Completed week
            </Badge>
          )}
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Metric 1: Students Reported */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#66635D]">
            <Users className="h-4 w-4 text-[#2457A6]" />
            <span>Reported</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[22px] font-bold text-[#20201D] sm:text-[26px]">
              {summary.studentsReportedCount}
            </span>
            <span className="text-[13px] font-medium text-[#66635D]">
              / {summary.totalActiveShishyas}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#66635D]">
            {summary.studentsReportedCount === summary.totalActiveShishyas
              ? "All Shishyas reported"
              : `${summary.totalActiveShishyas - summary.studentsReportedCount} yet to submit`}
          </p>
        </div>

        {/* Metric 2: Reporting Consistency */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#66635D]">
            <CheckCircle className="h-4 w-4 text-[#3D765B]" />
            <span>Consistency</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-[#20201D] sm:text-[26px]">
              {summary.reportingConsistencyPercentage}%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#66635D]">
            {summary.submittedReportsCount} / {summary.expectedReportsCount} reports
          </p>
        </div>

        {/* Metric 3: Attention Needed */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#66635D]">
            <AlertCircle className="h-4 w-4 text-[#D9822B]" />
            <span>Attention</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-[#20201D] sm:text-[26px]">
              {summary.studentsNeedingAttentionCount}
            </span>
            <span className="text-[12px] font-medium text-[#66635D]">
              {summary.studentsNeedingAttentionCount === 1 ? "student" : "students"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#66635D]">
            {summary.studentsNeedingAttentionCount === 0
              ? "All patterns steady"
              : "Review suggested"}
          </p>
        </div>

        {/* Metric 4: Follow-ups Due */}
        <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#66635D]">
            <Clock className="h-4 w-4 text-[#66635D]" />
            <span>Follow-ups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[22px] font-bold text-[#20201D] sm:text-[26px]">
              {summary.followUpsDueCount}
            </span>
            <span className="text-[12px] font-medium text-[#66635D]">
              {summary.followUpsDueCount === 1 ? "due" : "due"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#66635D]">
            {summary.followUpsDueCount === 0 ? "None scheduled" : "Scheduled discussions"}
          </p>
        </div>
      </div>
    </Card>
  );
}
