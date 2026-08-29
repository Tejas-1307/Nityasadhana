import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import { formatDuration } from "@/lib/reports/calculations";
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Edit3,
  Eye,
  FileEdit,
  Sparkles,
} from "lucide-react";

export interface TodaySummaryCardProps {
  todayDateStr: string;
  formattedDate: string;
  status: "not_started" | "draft" | "submitted";
  report?: DbDailySadhanaReport | null;
  isEditable?: boolean;
}

export function TodaySummaryCard({
  formattedDate,
  status,
  report,
  isEditable = true,
}: TodaySummaryCardProps) {
  const isSubmitted = status === "submitted";
  const isDraft = status === "draft";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-6">
      {/* Decorative calm background accent */}
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#3F9495]/5 blur-2xl" />

      <div className="relative flex flex-col justify-between gap-5">
        {/* Card Header: Practice Date & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#547070]">
            <Calendar className="h-4 w-4 text-[#3F9495]" />
            <span>Today · {formattedDate}</span>
          </div>

          <Badge
            variant={isSubmitted ? "krishna" : isDraft ? "saffron" : "neutral"}
            size="sm"
          >
            {isSubmitted ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Report complete</span>
              </span>
            ) : isDraft ? (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A9824D]" />
                <span>In progress (Draft)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#547070]" />
                <span>Not recorded yet</span>
              </span>
            )}
          </Badge>
        </div>

        {/* Core State Headline */}
        <div>
          {isSubmitted ? (
            <div className="space-y-1">
              <h2 className="text-[20px] font-bold tracking-tight text-[#193B3B] sm:text-[24px]">
                Today&apos;s Sādhanā is Recorded
              </h2>
              <p className="text-[13px] text-[#547070]">
                Your daily practice has been peacefully documented.
              </p>
            </div>
          ) : isDraft ? (
            <div className="space-y-1">
              <h2 className="text-[20px] font-bold tracking-tight text-[#193B3B] sm:text-[24px]">
                Continue Today&apos;s Sādhanā
              </h2>
              <p className="text-[13px] text-[#547070]">
                You have an unfinished draft from earlier today.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="text-[20px] font-bold tracking-tight text-[#193B3B] sm:text-[24px]">
                Begin Today&apos;s Sādhanā Record
              </h2>
              <p className="text-[13px] text-[#547070]">
                A quiet moment to observe your rounds, study, and routine.
              </p>
            </div>
          )}
        </div>

        {/* Quick Highlights if Data Recorded */}
        {report && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[rgba(63,148,149,0.12)]">
            <span className="rounded-xl bg-[#EAF7F4] px-3 py-1.5 text-[12px] font-semibold text-[#193B3B]">
              🌙 {formatDuration(report.sleepDurationMinutes)} sleep
            </span>
            <span className="rounded-xl bg-[#EAF7F4] px-3 py-1.5 text-[12px] font-semibold text-[#193B3B]">
              📿 {report.totalRounds} rounds
            </span>
            <span className="rounded-xl bg-[#EAF7F4] px-3 py-1.5 text-[12px] font-semibold text-[#193B3B]">
              📚 {formatDuration(report.totalStudyDurationMinutes)} study
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isSubmitted ? (
            <>
              <Link href="/student/report" className="flex-1 sm:flex-none">
                <Button
                  variant="primary"
                  size="default"
                  leftIcon={<Eye className="h-4 w-4" />}
                  className="w-full text-[14px] font-semibold shadow-sm sm:w-auto"
                >
                  View Today&apos;s Report
                </Button>
              </Link>

              {isEditable && (
                <Link href="/student/report" className="flex-1 sm:flex-none">
                  <Button
                    variant="secondary"
                    size="default"
                    leftIcon={<Edit3 className="h-4 w-4" />}
                    className="w-full text-[14px] sm:w-auto"
                  >
                    Edit
                  </Button>
                </Link>
              )}
            </>
          ) : isDraft ? (
            <Link href="/student/report" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="default"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                leftIcon={<FileEdit className="h-4 w-4" />}
                className="w-full text-[14px] font-bold shadow-md sm:w-auto"
              >
                Continue Today&apos;s Sādhanā
              </Button>
            </Link>
          ) : (
            <Link href="/student/report" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="default"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                leftIcon={<Sparkles className="h-4 w-4" />}
                className="w-full text-[14px] font-bold shadow-md sm:w-auto"
              >
                Record Today&apos;s Sādhanā
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
