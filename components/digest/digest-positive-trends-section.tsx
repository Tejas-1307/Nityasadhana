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
        return <Sun className="h-4 w-4 text-[#D9822B]" />;
      case "japa":
        return <CheckCircle className="h-4 w-4 text-[#3D765B]" />;
      case "reading":
        return <BookOpen className="h-4 w-4 text-[#2457A6]" />;
      case "time_waste":
        return <Clock className="h-4 w-4 text-[#66635D]" />;
      case "sankalpa":
      case "reflection":
        return <HeartHandshake className="h-4 w-4 text-[#D9822B]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#3D765B]" />;
    }
  };

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3D765B]/10 text-[#3D765B]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
              Positive Patterns
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Group Steady Growth ({positiveTrends.length})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#66635D]">Encouraging trends</span>
      </div>

      {/* Positive Trends List */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {positiveTrends.map((trend) => {
          return (
            <div
              key={trend.id}
              className="flex items-start gap-3 rounded-2xl border border-[#3D765B]/20 bg-[#3D765B]/5 p-4 transition-all"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                {getCategoryIcon(trend.category)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#20201D]">
                    {trend.title}
                  </span>
                  <Badge variant="krishna" size="sm">
                    {trend.studentCount} {trend.studentCount === 1 ? "student" : "students"}
                  </Badge>
                </div>
                <p className="text-[12px] leading-relaxed text-[#66635D]">
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
