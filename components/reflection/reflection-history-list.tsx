"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DbWeeklyReflection } from "@/lib/db/schema";
import { getReflectionStateDefinition } from "@/lib/reflection/service";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { ChevronRight, History } from "lucide-react";
import { WeeklyReflectionCard } from "./weekly-reflection-card";

export interface ReflectionHistoryListProps {
  reflections: DbWeeklyReflection[];
  total?: number;
}

export function ReflectionHistoryList({
  reflections,
  total: _total,
}: ReflectionHistoryListProps) {
  const [selectedReflection, setSelectedReflection] = React.useState<DbWeeklyReflection | null>(null);

  if (reflections.length === 0) {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#547070]" />
            <h2 className="text-[16px] font-bold text-[#193B3B]">Reflection Archives</h2>
          </div>
          <span className="text-[11px] text-[#547070]">Weekly pauses</span>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#547070]">
          No past reflections recorded yet. As you complete your weekly reflections, they will appear here.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
                Weekly Reflections
              </span>
              <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
                Reflection History ({reflections.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#547070]">Moments of pause</span>
          </div>

          <div className="space-y-2.5">
            {reflections.map((item) => {
              const stateDef = getReflectionStateDefinition(item.state);
              const formattedRange = formatSankalpaRange(item.weekStartDate, item.weekEndDate);
              const primarySnippet =
                item.wentWell || item.difficult || item.improve || item.guruMessage;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedReflection(item)}
                  className="group flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-xs transition-all hover:border-[#328A7A]/40 hover:bg-[#EAF7F4]/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#547070]">
                        {formattedRange}
                      </span>
                      <Badge variant="feather" size="sm">
                        <span className="mr-1">{stateDef.emoji}</span>
                        <span>{stateDef.label}</span>
                      </Badge>
                    </div>

                    {primarySnippet ? (
                      <p className="line-clamp-2 text-[13px] text-[#193B3B]">
                        &ldquo;{primarySnippet}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#547070] italic">
                        State recorded as {stateDef.label.toLowerCase()}.
                      </p>
                    )}
                  </div>

                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#547070]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#193B3B]" />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Detail Overlay */}
      {selectedReflection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg">
            <WeeklyReflectionCard
              reflection={selectedReflection}
              onEditClick={() => setSelectedReflection(null)}
            />
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setSelectedReflection(null)}
                className="rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold text-[#193B3B] shadow-sm hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
