"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DbWeeklySankalpa } from "@/lib/db/schema";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { getCategoryDefinition } from "@/lib/sankalpa/catalog";
import { Sprout, X, CheckCircle2, MessageSquare } from "lucide-react";

export interface SankalpaDetailModalProps {
  sankalpa: DbWeeklySankalpa;
  onClose: () => void;
}

export function SankalpaDetailModal({
  sankalpa,
  onClose,
}: SankalpaDetailModalProps) {
  const categoryDef = getCategoryDefinition(sankalpa.category);
  const formattedRange = formatSankalpaRange(sankalpa.startDate, sankalpa.endDate);
  const progress = sankalpa.progress;
  const alignedDays = progress?.alignedDays || 0;
  const totalDays = progress?.totalDays || 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3D765B]/10 text-[#3D765B]">
              <Sprout className="h-4 w-4" />
            </div>
            <h2 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
              Sankalpa Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#66635D] hover:bg-[#F7F1E5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Identity Box */}
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
                {categoryDef.label}
              </span>
              <span className="text-[11px] text-[#66635D]">{formattedRange}</span>
            </div>
            <h3 className="mt-1 text-[17px] font-bold text-[#20201D]">
              {sankalpa.title}
            </h3>
            {sankalpa.description && (
              <p className="mt-1 text-[12px] text-[#66635D]">{sankalpa.description}</p>
            )}
          </div>

          {/* 7-Day Progress Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#66635D]">Weekly Progress</span>
              <span className="font-bold text-[#20201D]">
                {alignedDays} / {totalDays} days aligned
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {progress?.dailyProgress.map((day, idx) => {
                const isCompleted = day.status === "completed";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center rounded-xl border p-2 text-center ${
                      isCompleted
                        ? "border-[#3D765B]/30 bg-[#3D765B]/10 text-[#20201D]"
                        : "border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/20 text-[#66635D]"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{day.dayLabel}</span>
                    <div className="my-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-[#3D765B]" />
                      ) : (
                        <span className="text-[11px] font-semibold text-[#66635D]">—</span>
                      )}
                    </div>
                    <span className="text-[8px] font-medium text-[#66635D]">
                      {isCompleted ? "Aligned" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Reflection Section */}
          {sankalpa.reflection && (
            <div className="space-y-2 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/40 p-4">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#20201D]">
                <MessageSquare className="h-3.5 w-3.5 text-[#3D765B]" />
                <span>Your Reflection</span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#20201D] whitespace-pre-wrap">
                {sankalpa.reflection.content}
              </p>

              {sankalpa.reflection.whatHelped && (
                <div className="pt-2 text-[12px]">
                  <span className="font-semibold text-[#66635D]">What helped: </span>
                  <span className="text-[#20201D]">{sankalpa.reflection.whatHelped}</span>
                </div>
              )}

              {sankalpa.reflection.whatDifficult && (
                <div className="text-[12px]">
                  <span className="font-semibold text-[#66635D]">What was difficult: </span>
                  <span className="text-[#20201D]">{sankalpa.reflection.whatDifficult}</span>
                </div>
              )}

              {sankalpa.reflection.whatContinue && (
                <div className="text-[12px]">
                  <span className="font-semibold text-[#66635D]">Continuing forward: </span>
                  <span className="text-[#20201D]">{sankalpa.reflection.whatContinue}</span>
                </div>
              )}
            </div>
          )}

          {/* Close Action */}
          <div className="flex justify-end border-t border-[rgba(32,32,29,0.06)] pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose} className="text-[12px]">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
