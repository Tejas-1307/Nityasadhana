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
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3D765B]/10 text-[#3D765B]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D765B]">
                Weekly Reflection
              </span>
              <h3 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
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
                className="h-8 px-2 text-[12px] text-[#66635D] hover:text-[#20201D]"
              >
                <Edit3 className="mr-1 h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>
        </div>

        {/* Linked Sankalpa Badge if available */}
        {sankalpa && (
          <div className="flex items-center justify-between rounded-xl border border-[#3D765B]/15 bg-[#3D765B]/5 px-3 py-2 text-[12px]">
            <div className="flex items-center gap-1.5 font-bold text-[#20201D]">
              <Sprout className="h-3.5 w-3.5 text-[#3D765B]" />
              <span>{sankalpa.title}</span>
            </div>
            {sankalpa.progress && (
              <span className="text-[11px] font-bold text-[#3D765B]">
                {sankalpa.progress.alignedDays} / {sankalpa.progress.totalDays} days aligned
              </span>
            )}
          </div>
        )}

        {/* Reflection Fields Breakdown */}
        <div className="space-y-3 pt-1 text-[13px]">
          {reflection.wentWell && (
            <div>
              <span className="font-semibold text-[#66635D]">What went well: </span>
              <span className="text-[#20201D]">&ldquo;{reflection.wentWell}&rdquo;</span>
            </div>
          )}

          {reflection.difficult && (
            <div>
              <span className="font-semibold text-[#66635D]">What was difficult: </span>
              <span className="text-[#20201D]">&ldquo;{reflection.difficult}&rdquo;</span>
            </div>
          )}

          {reflection.improve && (
            <div>
              <span className="font-semibold text-[#66635D]">Next week intention: </span>
              <span className="text-[#20201D]">&ldquo;{reflection.improve}&rdquo;</span>
            </div>
          )}

          {reflection.guruMessage && (
            <div className="rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D9822B]">
                <HeartHandshake className="h-3.5 w-3.5" />
                <span>Message for Guru</span>
              </div>
              <p className="mt-1 text-[12px] text-[#20201D] italic">
                &ldquo;{reflection.guruMessage}&rdquo;
              </p>
            </div>
          )}

          {!reflection.wentWell &&
            !reflection.difficult &&
            !reflection.improve &&
            !reflection.guruMessage && (
              <p className="text-[12px] text-[#66635D] italic">
                Weekly state recorded as {stateDef.label.toLowerCase()} ({stateDef.emoji}).
              </p>
            )}
        </div>
      </div>
    </Card>
  );
}
