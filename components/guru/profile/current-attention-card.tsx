"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { AttentionBadge } from "@/components/guru/attention/attention-badge";
import { AttentionAssessment, AttentionSignal } from "@/lib/guru/attention";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Eye } from "lucide-react";

export interface CurrentAttentionCardProps {
  assessment: AttentionAssessment;
  signals: AttentionSignal[];
}

export function CurrentAttentionCard({ assessment, signals }: CurrentAttentionCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isStable = assessment.level === "STABLE";
  const isFollowUp = assessment.level === "FOLLOW_UP_SUGGESTED";

  return (
    <Card
      className={`border p-5 shadow-level1 transition-all sm:p-6 ${
        isStable
          ? "border-[#328A7A]/25 bg-[#328A7A]/5"
          : isFollowUp
          ? "border-[#3F9495]/25 bg-[#3F9495]/5"
          : "border-[#A9824D]/25 bg-[#A9824D]/5"
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isStable ? (
              <CheckCircle2 className="h-5 w-5 text-[#328A7A]" />
            ) : isFollowUp ? (
              <AlertCircle className="h-5 w-5 text-[#3F9495]" />
            ) : (
              <Eye className="h-5 w-5 text-[#A9824D]" />
            )}
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#547070]">
              Current Attention State
            </span>
          </div>

          <AttentionBadge level={assessment.level} size="default" />
        </div>

        {/* Primary Observation */}
        <div className="space-y-1">
          <h3 className="text-[16px] font-bold text-[#193B3B] sm:text-[17px]">
            {assessment.summaryHeadline}
          </h3>
          <p className="text-[13px] leading-relaxed text-[#547070]">
            {assessment.summaryDetail}
          </p>
        </div>

        {/* Multi-Signal Details Toggle */}
        {signals.length > 1 && (
          <div className="border-t border-[rgba(63,148,149,0.12)] pt-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#3F9495] hover:underline"
            >
              <span>
                {isExpanded
                  ? "Hide additional details"
                  : `View details (${signals.length} changes detected)`}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2">
                {signals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-white p-3 text-[12px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#193B3B]">{sig.title}</span>
                      {sig.metric && (
                        <span className="font-semibold text-[#547070]">{sig.metric}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[#547070]">{sig.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
