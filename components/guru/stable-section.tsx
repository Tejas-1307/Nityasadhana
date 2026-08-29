"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShishyaOverviewItem } from "@/lib/guru/service";
import { CheckCircle2, ChevronDown, ChevronUp, Eye } from "lucide-react";

export interface StableSectionProps {
  shishyas: ShishyaOverviewItem[];
}

export function StableSection({ shishyas }: StableSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  if (shishyas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-left transition-colors hover:bg-[rgba(63,148,149,0.06)]"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#328A7A]/10 text-[#328A7A]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-[15px] font-bold text-[#193B3B]">
            Consistent Routine ({shishyas.length})
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#547070]">
          <span>{isExpanded ? "Hide" : "Show"}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Expanded List */}
      {isExpanded && (
        <div className="space-y-2">
          {shishyas.map((item) => {
            const initials = item.shishya.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={item.shishya.id}
                className="flex items-center justify-between rounded-xl border border-[rgba(63,148,149,0.14)] bg-white p-3 shadow-sm sm:p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF7F4] font-serif text-[12px] font-bold text-[#193B3B]">
                    {initials}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#193B3B]">
                      {item.shishya.spiritualName || item.shishya.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#547070]">
                      <span>Today: {item.todayReport?.totalRounds || 16} rounds</span>
                      {item.todayReport?.wakeUpTime && (
                        <span>· Woke {item.todayReport.wakeUpTime}</span>
                      )}
                    </div>
                  </div>
                </div>

                <Link href={`/guru/shishyas/${item.shishya.id}`}>
                  <Button variant="ghost" size="sm" className="h-8 text-[12px]">
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
