import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/reports/calculations";
import { Calendar, CircleDot, Moon, BookOpen } from "lucide-react";

export interface ThirtyDayTrendProps {
  stats: {
    totalSubmitted: number;
    consistencyPercentage: number;
    avgRounds: number;
    avgWakeUpTime: string;
    avgReadingMinutes: number;
    avgHearingMinutes: number;
    avgStudyMinutes: number;
  };
}

export function ThirtyDayTrend({ stats }: ThirtyDayTrendProps) {
  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              30-Day Rolling Perspective
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Longer-Term Sādhanā Baseline
            </h2>
          </div>
          <Badge variant="saffron" size="sm">
            <span>{stats.consistencyPercentage}% 30d Consistency</span>
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Calendar className="h-3.5 w-3.5 text-[#D9822B]" />
              <span>Reports Submitted</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D]">
              {stats.totalSubmitted} / 30
            </div>
            <span className="text-[10px] text-[#66635D]">Days recorded</span>
          </div>

          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <CircleDot className="h-3.5 w-3.5 text-[#D9822B]" />
              <span>30-Day Avg Japa</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D]">
              {stats.avgRounds} rds
            </div>
            <span className="text-[10px] text-[#66635D]">Daily average</span>
          </div>

          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <Moon className="h-3.5 w-3.5 text-[#2457A6]" />
              <span>Avg Wake-up</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D]">
              {stats.avgWakeUpTime}
            </div>
            <span className="text-[10px] text-[#66635D]">Typical time</span>
          </div>

          <div className="rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#66635D]">
              <BookOpen className="h-3.5 w-3.5 text-[#3D765B]" />
              <span>Avg Shravan/Kirtan</span>
            </div>
            <div className="mt-1 text-[20px] font-bold text-[#20201D]">
              {formatDuration(stats.avgReadingMinutes + stats.avgHearingMinutes)}
            </div>
            <span className="text-[10px] text-[#66635D]">Reading &amp; hearing</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
