import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import { formatDuration } from "@/lib/reports/calculations";
import {
  Moon,
  CircleDot,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export interface TodaySadhanaViewProps {
  report: DbDailySadhanaReport | null;
  practiceDate: string;
}

export function TodaySadhanaView({ report, practiceDate }: TodaySadhanaViewProps) {
  if (!report || report.status !== "submitted") {
    return (
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-6 text-center shadow-level1">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F1E5] text-[#66635D]">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h3 className="mt-3 text-[15px] font-bold text-[#20201D]">
          Today&apos;s Sādhanā Not Yet Received
        </h3>
        <p className="mt-1 text-[13px] text-[#66635D]">
          {report?.status === "draft"
            ? "The student has started a draft report but not yet submitted it."
            : `No report recorded for today (${practiceDate}).`}
        </p>
      </Card>
    );
  }

  const totalStudyMinutes =
    (report.collegeStudyDurationMinutes || 0) + (report.selfStudyDurationMinutes || 0);

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Today&apos;s Sādhanā Record
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              {practiceDate}
            </h2>
          </div>
          <Badge variant="feather" size="sm">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            <span>Report Received</span>
          </Badge>
        </div>

        {/* Structured Sections Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 1. Sleep & Wake */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#20201D]">
                <Moon className="h-4 w-4 text-[#2457A6]" />
                <span>Sleep & Wake</span>
              </div>
              <Badge variant="krishna" size="sm">
                <span>{formatDuration(report.sleepDurationMinutes || 0)}</span>
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-[13px]">
              <span className="text-[#66635D]">Slept at: <strong className="text-[#20201D]">{report.sleepTime}</strong></span>
              <span className="text-[#66635D]">Woke up: <strong className="text-[#20201D]">{report.wakeUpTime}</strong></span>
            </div>
          </div>

          {/* 2. Japa Meditation */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#20201D]">
                <CircleDot className="h-4 w-4 text-[#D9822B]" />
                <span>Japa Meditation</span>
              </div>
              <Badge variant="saffron" size="sm">
                <span>{report.totalRounds || report.japaRounds} rounds</span>
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between text-[13px]">
              <span className="text-[#66635D]">Base: <strong className="text-[#20201D]">{report.japaRounds}</strong></span>
              {report.extraRounds ? (
                <span className="text-[#66635D]">Extra: <strong className="text-[#20201D]">+{report.extraRounds}</strong></span>
              ) : null}
              {report.japaCompletedAt && (
                <span className="text-[#66635D]">Completed: <strong className="text-[#20201D]">{report.japaCompletedAt}</strong></span>
              )}
            </div>
          </div>

          {/* 3. Hearing & Reading */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#20201D]">
                <BookOpen className="h-4 w-4 text-[#3D765B]" />
                <span>Hearing & Reading</span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#66635D]">Reading:</span>
                <span className="font-bold text-[#20201D]">
                  {formatDuration(report.readingDurationMinutes || 0)}
                  {report.readingNote ? ` (${report.readingNote})` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66635D]">Hearing:</span>
                <span className="font-bold text-[#20201D]">
                  {formatDuration(report.hearingDurationMinutes || 0)}
                  {report.hearingNote ? ` (${report.hearingNote})` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Study & Rest */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#20201D]">
                <GraduationCap className="h-4 w-4 text-[#66635D]" />
                <span>Study & Time</span>
              </div>
              <span className="text-[12px] font-bold text-[#20201D]">
                Total {formatDuration(totalStudyMinutes)}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#66635D]">College Study:</span>
                <span className="font-bold text-[#20201D]">
                  {formatDuration(report.collegeStudyDurationMinutes || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66635D]">Self Study:</span>
                <span className="font-bold text-[#20201D]">
                  {formatDuration(report.selfStudyDurationMinutes || 0)}
                </span>
              </div>
              {report.timeWastedDurationMinutes ? (
                <div className="flex justify-between border-t border-[rgba(32,32,29,0.06)] pt-1 text-[12px] text-[#D9822B]">
                  <span>Unused Time:</span>
                  <span className="font-bold">
                    {formatDuration(report.timeWastedDurationMinutes)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 5. Student Reflection (Optional, Read-Only) */}
        {report.notes && (
          <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#20201D]">
              <Sparkles className="h-4 w-4 text-[#D9822B]" />
              <span>Student Reflection</span>
            </div>
            <blockquote className="mt-2.5 rounded-xl border-l-2 border-[#D9822B] bg-[#F7F1E5]/40 p-3.5 text-[13px] italic leading-relaxed text-[#20201D]">
              &ldquo;{report.notes}&rdquo;
            </blockquote>
          </div>
        )}
      </div>
    </Card>
  );
}
