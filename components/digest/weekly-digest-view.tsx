"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GuruWeeklyDigest } from "@/lib/digest/types";
import { DigestSummaryCard } from "./digest-summary-card";
import { DigestAttentionSection } from "./digest-attention-section";
import { DigestMissingReportsSection } from "./digest-missing-reports-section";
import { DigestMajorChangesSection } from "./digest-major-changes-section";
import { DigestPositiveTrendsSection } from "./digest-positive-trends-section";
import { DigestFollowUpsSection } from "./digest-follow-ups-section";
import { DigestEmptyState } from "./digest-empty-state";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, ArrowRight, RefreshCw } from "lucide-react";

export interface WeeklyDigestViewProps {
  initialDigest: GuruWeeklyDigest;
}

export function WeeklyDigestView({ initialDigest }: WeeklyDigestViewProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const digest = initialDigest;

  const navigateToWeek = (mondayDateStr: string) => {
    setIsNavigating(true);
    router.push(`/guru/digest?week=${mondayDateStr}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Week Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-3.5 shadow-sm sm:p-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToWeek(digest.prevWeekMonday)}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
            disabled={isNavigating}
            className="text-[12px] font-semibold text-[#66635D] hover:text-[#20201D]"
          >
            <span className="hidden sm:inline">Previous Week</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <div className="mx-1 h-4 w-px bg-[rgba(32,32,29,0.12)]" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToWeek(digest.nextWeekMonday)}
            rightIcon={<ChevronRight className="h-4 w-4" />}
            disabled={isNavigating}
            className="text-[12px] font-semibold text-[#66635D] hover:text-[#20201D]"
          >
            <span className="hidden sm:inline">Next Week</span>
            <span className="sm:hidden">Next</span>
          </Button>
        </div>

        {/* Current Range & Return to Current Week */}
        <div className="flex items-center gap-2">
          {!digest.isWeekInProgress && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsNavigating(true);
                router.push("/guru/digest");
              }}
              className="text-[11px] font-semibold text-[#D9822B]"
            >
              Current Week
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.refresh()}
            className="h-8 w-8 p-0 text-[#66635D] hover:text-[#20201D]"
            aria-label="Refresh digest"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isNavigating ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 2. Empty States */}
      {digest.summary.totalActiveShishyas === 0 ? (
        <DigestEmptyState type="no_shishyas" />
      ) : digest.hasInsufficientData ? (
        <div className="space-y-6">
          <DigestSummaryCard summary={digest.summary} formattedRange={digest.formattedRange} />
          <DigestEmptyState type="insufficient_data" />
        </div>
      ) : (
        <>
          {/* 3. Top Compact Summary Card */}
          <DigestSummaryCard summary={digest.summary} formattedRange={digest.formattedRange} />

          {/* 4. Attention Suggested (What matters now) */}
          <DigestAttentionSection attentionSuggestions={digest.attentionSuggestions} />

          {/* 5. Missing Reports List */}
          <DigestMissingReportsSection missingReports={digest.missingReports} />

          {/* 6. Major Changes (Student vs Self) */}
          <DigestMajorChangesSection majorChanges={digest.majorChanges} />

          {/* 7. Positive Trends (Group Steady Growth) */}
          <DigestPositiveTrendsSection positiveTrends={digest.positiveTrends} />

          {/* 8. Follow-up Reminders */}
          <DigestFollowUpsSection followUps={digest.followUps} />

          {/* 9. Calm Steady State (if nothing requires attention) */}
          {digest.isAllSteady && (
            <DigestEmptyState
              type="all_steady"
              totalStudents={digest.summary.totalActiveShishyas}
              reportedStudents={digest.summary.studentsReportedCount}
            />
          )}

          {/* 10. Footer Link to All Students Directory */}
          <div className="flex items-center justify-between rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-[#66635D]" />
              <span className="text-[13px] font-semibold text-[#20201D]">
                View all {digest.summary.totalActiveShishyas} Shishyas
              </span>
            </div>
            <Link href="/guru/shishyas">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                className="text-[12px] font-semibold"
              >
                Open Directory
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
