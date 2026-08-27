"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DbWeeklySankalpa, DbWeeklyReflection } from "@/lib/db/schema";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { getReflectionStateDefinition } from "@/lib/reflection/service";
import { Sprout, MessageSquare, HeartHandshake } from "lucide-react";

export interface ShishyaSankalpaViewProps {
  activeSankalpa: DbWeeklySankalpa | null;
  history?: DbWeeklySankalpa[];
  latestReflection?: DbWeeklyReflection | null;
}

export function ShishyaSankalpaView({
  activeSankalpa,
  history = [],
  latestReflection = null,
}: ShishyaSankalpaViewProps) {
  if (!activeSankalpa && history.length === 0 && !latestReflection) {
    return (
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-[#3D765B]" />
            <h2 className="text-[16px] font-bold text-[#20201D]">Weekly Focus &amp; Reflection</h2>
          </div>
          <span className="text-[11px] text-[#66635D]">Mentorship view</span>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#66635D]">
          No weekly Sankalpa or reflection recorded for this Shishya yet.
        </p>
      </Card>
    );
  }

  const formattedRange = activeSankalpa
    ? formatSankalpaRange(activeSankalpa.startDate, activeSankalpa.endDate)
    : "";
  const alignedDays = activeSankalpa?.progress?.alignedDays || 0;
  const totalDays = activeSankalpa?.progress?.totalDays || 7;

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3D765B]/10 text-[#3D765B]">
              <Sprout className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
                Weekly Focus &amp; Reflection
              </h2>
            </div>
          </div>

          <span className="text-[11px] font-medium text-[#66635D]">
            Mentorship insight (Read-only)
          </span>
        </div>

        {/* 1. Active Sankalpa Card */}
        {activeSankalpa ? (
          <div className="rounded-2xl border border-[#3D765B]/30 bg-[#3D765B]/5 p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
                Current Focus · {formattedRange}
              </span>
              <Badge variant="feather" size="sm">
                <span>{alignedDays} / {totalDays} days aligned</span>
              </Badge>
            </div>

            <h3 className="text-[16px] font-bold text-[#20201D]">
              {activeSankalpa.title}
            </h3>

            {/* 7-Day Mini Dots */}
            <div className="flex items-center gap-1.5 pt-1">
              {activeSankalpa.progress?.dailyProgress.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      day.status === "completed"
                        ? "bg-[#3D765B]"
                        : day.status === "pending"
                        ? "bg-[#D9822B] animate-pulse"
                        : "bg-[rgba(32,32,29,0.15)]"
                    }`}
                    title={`${day.dayLabel}: ${day.status}`}
                  />
                  <span className="text-[8px] text-[#66635D]">{day.dayLabel[0]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/30 p-4 text-center text-[13px] text-[#66635D]">
            No active focus set for this week.
          </div>
        )}

        {/* 2. Latest Weekly Reflection by Shishya */}
        {latestReflection && (
          <div className="rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-2.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#3D765B]" />
                <span className="text-[13px] font-bold text-[#20201D]">
                  Latest Weekly Reflection
                </span>
                <span className="text-[11px] text-[#66635D]">
                  ({formatSankalpaRange(latestReflection.weekStartDate, latestReflection.weekEndDate)})
                </span>
              </div>

              {(() => {
                const stateDef = getReflectionStateDefinition(latestReflection.state);
                return (
                  <Badge variant="feather" size="sm">
                    <span className="mr-1">{stateDef.emoji}</span>
                    <span>{stateDef.label}</span>
                  </Badge>
                );
              })()}
            </div>

            <div className="space-y-2 text-[12px]">
              {latestReflection.wentWell && (
                <div>
                  <span className="font-semibold text-[#66635D]">Went well: </span>
                  <span className="text-[#20201D]">&ldquo;{latestReflection.wentWell}&rdquo;</span>
                </div>
              )}

              {latestReflection.difficult && (
                <div>
                  <span className="font-semibold text-[#66635D]">Difficult: </span>
                  <span className="text-[#20201D]">&ldquo;{latestReflection.difficult}&rdquo;</span>
                </div>
              )}

              {latestReflection.improve && (
                <div>
                  <span className="font-semibold text-[#66635D]">Next week intention: </span>
                  <span className="text-[#20201D]">&ldquo;{latestReflection.improve}&rdquo;</span>
                </div>
              )}

              {/* Message for Guru */}
              {latestReflection.guruMessage && (
                <div className="mt-2.5 rounded-xl border border-[#D9822B]/20 bg-[#D9822B]/5 p-3 text-[12px]">
                  <div className="flex items-center gap-1.5 font-bold text-[#D9822B]">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    <span>Message from Shishya to You</span>
                  </div>
                  <p className="mt-1 text-[#20201D] italic">
                    &ldquo;{latestReflection.guruMessage}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Past Sankalpa Reflections Preview */}
        {history.length > 0 && (
          <div className="space-y-2 border-t border-[rgba(32,32,29,0.06)] pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Recent Past Reflections
            </span>
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3 text-[12px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#20201D]">{item.title}</span>
                    <span className="text-[10px] text-[#66635D]">
                      {formatSankalpaRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.reflection && (
                    <p className="text-[#66635D] italic">&ldquo;{item.reflection.content}&rdquo;</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
