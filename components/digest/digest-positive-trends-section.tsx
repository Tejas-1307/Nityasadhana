"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DigestPositiveTrendItem } from "@/lib/digest/types";
import { Sparkles, Sun, CheckCircle, BookOpen, Clock, HeartHandshake } from "lucide-react";

export interface DigestPositiveTrendsSectionProps {
  positiveTrends: DigestPositiveTrendItem[];
}

export function DigestPositiveTrendsSection({ positiveTrends }: DigestPositiveTrendsSectionProps) {
  if (positiveTrends.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: DigestPositiveTrendItem["category"]) => {
    switch (category) {
      case "wake_up":
        return <Sun className="h-4 w-4 text-[#A9824D]" />;
      case "japa":
        return <CheckCircle className="h-4 w-4 text-[#328A7A]" />;
      case "reading":
        return <BookOpen className="h-4 w-4 text-[#3F9495]" />;
      case "time_waste":
        return <Clock className="h-4 w-4 text-[#547070]" />;
      case "sankalpa":
      case "reflection":
        return <HeartHandshake className="h-4 w-4 text-[#A9824D]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#328A7A]" />;
    }
  };

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#328A7A]/10 text-[#328A7A]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#328A7A]">
              Positive Patterns
            </span>
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              Group Steady Growth ({positiveTrends.length})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#547070]">Encouraging trends</span>
      </div>

      {/* Positive Trends List */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {positiveTrends.map((trend) => {
          return (
            <div
              key={trend.id}
              className="flex items-start gap-3 rounded-2xl border border-[#328A7A]/20 bg-[#328A7A]/5 p-4 transition-all"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                {getCategoryIcon(trend.category)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#193B3B]">
                    {trend.title}
                  </span>
                  <Badge variant="krishna" size="sm">
                    {trend.studentCount} {trend.studentCount === 1 ? "student" : "students"}
                  </Badge>
                </div>
                <p className="text-[12px] leading-relaxed text-[#547070]">
                  {trend.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
