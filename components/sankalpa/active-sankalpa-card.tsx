"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbWeeklySankalpa } from "@/lib/db/schema";
import { getCategoryDefinition } from "@/lib/sankalpa/catalog";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import {
  Sprout,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Loader2,
  Clock,
  CircleDot,
  Moon,
  BookOpen,
  Headphones,
  GraduationCap,
} from "lucide-react";
import { cancelSankalpaAction } from "@/lib/actions/sankalpa";

export interface ActiveSankalpaCardProps {
  sankalpa: DbWeeklySankalpa | null;
  onCreateClick?: () => void;
  onReflectClick?: (sankalpa: DbWeeklySankalpa) => void;
}

export function ActiveSankalpaCard({
  sankalpa,
  onCreateClick,
  onReflectClick,
}: ActiveSankalpaCardProps) {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = React.useState(false);

  // Empty State: When student has no active Sankalpa
  if (!sankalpa) {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-3.5 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#328A7A]/10 text-[#328A7A]">
            <Sprout className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              Choose your focus for this week
            </h2>
            <p className="max-w-md text-[13px] leading-relaxed text-[#547070]">
              One small intention. One week. One step forward in your personal Sādhanā.
            </p>
          </div>

          {onCreateClick && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onCreateClick}
              className="mt-2 text-[13px] font-semibold"
            >
              <Sprout className="mr-1.5 h-4 w-4" />
              <span>Create Sankalpa</span>
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const categoryDef = getCategoryDefinition(sankalpa.category);
  const formattedRange = formatSankalpaRange(sankalpa.startDate, sankalpa.endDate);
  const progress = sankalpa.progress;
  const alignedDays = progress?.alignedDays || 0;
  const totalDays = progress?.totalDays || 7;

  // Render category icon
  const renderCategoryIcon = () => {
    switch (sankalpa.category) {
      case "wake_up":
        return <Moon className="h-4 w-4 text-[#3F9495]" />;
      case "japa":
        return <CircleDot className="h-4 w-4 text-[#A9824D]" />;
      case "reading":
        return <BookOpen className="h-4 w-4 text-[#328A7A]" />;
      case "hearing":
        return <Headphones className="h-4 w-4 text-[#3F9495]" />;
      case "study":
        return <GraduationCap className="h-4 w-4 text-[#547070]" />;
      case "time_management":
        return <Clock className="h-4 w-4 text-[#A9824D]" />;
      default:
        return <Sprout className="h-4 w-4 text-[#328A7A]" />;
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelSankalpaAction({ sankalpaId: sankalpa.id });
    setIsCancelling(false);
    setShowConfirmCancel(false);
  };

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#328A7A]">
              <Sprout className="h-3.5 w-3.5" />
              <span>This Week&apos;s Focus</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#193B3B] sm:text-[20px]">
              {sankalpa.title}
            </h2>
            <div className="flex items-center gap-2 text-[12px] text-[#547070]">
              <span className="flex items-center gap-1 font-medium">
                {renderCategoryIcon()}
                <span>{categoryDef.label}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#547070]" />
                <span>{formattedRange}</span>
              </span>
            </div>
          </div>

          <Badge variant="feather" size="sm">
            <span>Active</span>
          </Badge>
        </div>

        {/* 7-Day Progress Dots & Daily Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-[#547070]">Weekly Progress</span>
            <span className="font-bold text-[#193B3B]">
              {alignedDays} / {totalDays} days
            </span>
          </div>

          {/* Daily 7-Grid Chips */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {progress?.dailyProgress.map((day, idx) => {
              const isCompleted = day.status === "completed";
              const isPending = day.status === "pending";
              const isFuture = day.status === "future";

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center rounded-xl border p-2 text-center transition-all ${
                    isCompleted
                      ? "border-[#328A7A]/30 bg-[#328A7A]/10 text-[#193B3B]"
                      : isPending
                      ? "border-[#A9824D]/30 bg-[#A9824D]/10 text-[#193B3B]"
                      : isFuture
                      ? "border-[rgba(63,148,149,0.1)] bg-[#F7F5EF]/30 text-[#547070]/60"
                      : "border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 text-[#547070]"
                  }`}
                >
                  <span className="text-[10px] font-bold">{day.dayLabel}</span>
                  <div className="my-1 flex h-6 w-6 items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#328A7A]" />
                    ) : isPending ? (
                      <span className="h-2 w-2 rounded-full bg-[#A9824D] animate-pulse" />
                    ) : isFuture ? (
                      <span className="h-2 w-2 rounded-full bg-[rgba(63,148,149,0.25)]" />
                    ) : (
                      <span className="text-[12px] font-semibold text-[#547070]">—</span>
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-[#547070]">
                    {isCompleted ? "Aligned" : isPending ? "Today" : isFuture ? "Upcoming" : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: End-of-week reflection / Cancel */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(63,148,149,0.12)] pt-3 text-[12px]">
          {onReflectClick && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onReflectClick(sankalpa)}
              className="text-[12px] font-semibold"
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-[#328A7A]" />
              <span>Reflect on this week</span>
            </Button>
          )}

          {showConfirmCancel ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#547070]">End this focus?</span>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="font-bold text-[#C53030] hover:underline"
              >
                {isCancelling ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, end"}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmCancel(false)}
                className="text-[#547070] hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmCancel(true)}
              className="text-[11px] text-[#547070] hover:text-[#193B3B] hover:underline"
            >
              End focus early
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
