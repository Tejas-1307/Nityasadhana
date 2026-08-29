import * as React from "react";
import { Badge } from "@/components/ui/badge";

export interface GuruHeaderProps {
  guruName: string;
  currentDateStr?: string;
  totalActiveCount: number;
}

export function GuruHeader({
  guruName,
  currentDateStr,
  totalActiveCount,
}: GuruHeaderProps) {
  // Format current date in Asia/Kolkata friendly format
  const dateObj = currentDateStr ? new Date(currentDateStr) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Top Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-[13px] tracking-wide text-[#A9824D]">
                हरे कृष्ण · गुरुमार्गः
              </span>
              <span className="text-[#547070]/40">·</span>
              <span className="text-[12px] font-medium text-[#547070]">{formattedDate}</span>
            </div>

            <h1 className="text-[22px] font-bold tracking-tight text-[#193B3B] sm:text-[26px]">
              Hare Krishna, Prabhu {guruName} 🙏
            </h1>

            <p className="text-[13px] text-[#547070]">
              Guiding <span className="font-semibold text-[#193B3B]">{totalActiveCount} Shishyas</span> under your spiritual shelter.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Badge variant="krishna" size="default">
              <span className="font-serif text-[12px]">साधना संदर्शनम्</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
