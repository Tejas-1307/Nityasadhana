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
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#328A7A]/10 text-[#328A7A]">
              <Sprout className="h-4 w-4" />
            </div>
            <h2 className="text-[16px] font-bold text-[#193B3B] sm:text-[17px]">
              Sankalpa Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#547070] hover:bg-[#EAF7F4]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4">
          {/* Identity Box */}
          <div className="rounded-2xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#328A7A]">
                {categoryDef.label}
              </span>
              <span className="text-[11px] text-[#547070]">{formattedRange}</span>
            </div>
            <h3 className="mt-1 text-[17px] font-bold text-[#193B3B]">
              {sankalpa.title}
            </h3>
            {sankalpa.description && (
              <p className="mt-1 text-[12px] text-[#547070]">{sankalpa.description}</p>
            )}
          </div>

          {/* 7-Day Progress Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#547070]">Weekly Progress</span>
              <span className="font-bold text-[#193B3B]">
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
                        ? "border-[#328A7A]/30 bg-[#328A7A]/10 text-[#193B3B]"
                        : "border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/40 text-[#547070]"
                    }`}
                  >
                    <span className="text-[10px] font-bold">{day.dayLabel}</span>
                    <div className="my-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-[#328A7A]" />
                      ) : (
                        <span className="text-[11px] font-semibold text-[#547070]">—</span>
                      )}
                    </div>
                    <span className="text-[8px] font-medium text-[#547070]">
                      {isCompleted ? "Aligned" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Reflection Section */}
          {sankalpa.reflection && (
            <div className="space-y-2 rounded-2xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-4">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#193B3B]">
                <MessageSquare className="h-3.5 w-3.5 text-[#328A7A]" />
                <span>Your Reflection</span>
              </div>
              <p className="text-[13px] leading-relaxed text-[#193B3B] whitespace-pre-wrap">
                {sankalpa.reflection.content}
              </p>

              {sankalpa.reflection.whatHelped && (
                <div className="pt-2 text-[12px]">
                  <span className="font-semibold text-[#547070]">What helped: </span>
                  <span className="text-[#193B3B]">{sankalpa.reflection.whatHelped}</span>
                </div>
              )}

              {sankalpa.reflection.whatDifficult && (
                <div className="text-[12px]">
                  <span className="font-semibold text-[#547070]">What was difficult: </span>
                  <span className="text-[#193B3B]">{sankalpa.reflection.whatDifficult}</span>
                </div>
              )}

              {sankalpa.reflection.whatContinue && (
                <div className="text-[12px]">
                  <span className="font-semibold text-[#547070]">Continuing forward: </span>
                  <span className="text-[#193B3B]">{sankalpa.reflection.whatContinue}</span>
                </div>
              )}
            </div>
          )}

          {/* Close Action */}
          <div className="flex justify-end border-t border-[rgba(63,148,149,0.12)] pt-3">
            <Button type="button" variant="secondary" size="sm" onClick={onClose} className="text-[12px]">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
