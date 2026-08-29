"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbWeeklyReflection, DbWeeklySankalpa } from "@/lib/db/schema";
import { getReflectionStateDefinition } from "@/lib/reflection/service";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { MessageSquare, Edit3, HeartHandshake, Sprout } from "lucide-react";

export interface WeeklyReflectionCardProps {
  reflection: DbWeeklyReflection;
  sankalpa?: DbWeeklySankalpa | null;
  onEditClick?: () => void;
}

export function WeeklyReflectionCard({
  reflection,
  sankalpa,
  onEditClick,
}: WeeklyReflectionCardProps) {
  const stateDef = getReflectionStateDefinition(reflection.state);
  const formattedRange = formatSankalpaRange(reflection.weekStartDate, reflection.weekEndDate);

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#328A7A]/10 text-[#328A7A]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#328A7A]">
                Weekly Reflection
              </span>
              <h3 className="text-[16px] font-bold text-[#193B3B] sm:text-[17px]">
                {formattedRange}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="feather" size="sm">
              <span className="mr-1">{stateDef.emoji}</span>
              <span>{stateDef.label}</span>
            </Badge>

            {onEditClick && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEditClick}
                className="h-8 px-2 text-[12px] text-[#547070] hover:text-[#193B3B]"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </div>

        {/* Linked Sankalpa Badge if available */}
        {sankalpa && (
          <div className="flex items-center justify-between rounded-xl border border-[#328A7A]/15 bg-[#328A7A]/5 px-3 py-2 text-[12px]">
            <div className="flex items-center gap-1.5 font-bold text-[#193B3B]">
              <Sprout className="h-3.5 w-3.5 text-[#328A7A]" />
              <span>{sankalpa.title}</span>
            </div>
            {sankalpa.progress && (
              <span className="text-[11px] font-bold text-[#328A7A]">
                {sankalpa.progress.alignedDays} / {sankalpa.progress.totalDays} days aligned
              </span>
            )}
          </div>
        )}

        {/* Reflection Fields Breakdown */}
        <div className="space-y-3 pt-1 text-[13px]">
          {reflection.wentWell && (
            <div>
              <span className="font-semibold text-[#547070]">What went well: </span>
              <span className="text-[#193B3B]">&ldquo;{reflection.wentWell}&rdquo;</span>
            </div>
          )}

          {reflection.difficult && (
            <div>
              <span className="font-semibold text-[#547070]">What was difficult: </span>
              <span className="text-[#193B3B]">&ldquo;{reflection.difficult}&rdquo;</span>
            </div>
          )}

          {reflection.improve && (
            <div>
              <span className="font-semibold text-[#547070]">Next week intention: </span>
              <span className="text-[#193B3B]">&ldquo;{reflection.improve}&rdquo;</span>
            </div>
          )}

          {reflection.guruMessage && (
            <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A9824D]">
                <HeartHandshake className="h-3.5 w-3.5" />
                <span>Message for Guru</span>
              </div>
              <p className="mt-1 text-[12px] text-[#193B3B] italic">
                &ldquo;{reflection.guruMessage}&rdquo;
              </p>
            </div>
          )}

          {!reflection.wentWell &&
            !reflection.difficult &&
            !reflection.improve &&
            !reflection.guruMessage && (
              <p className="text-[12px] text-[#547070] italic">
                Weekly state recorded as {stateDef.label.toLowerCase()} ({stateDef.emoji}).
              </p>
            )}
        </div>
      </div>
    </Card>
  );
}
