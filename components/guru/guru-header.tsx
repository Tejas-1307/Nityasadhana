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
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-[13px] tracking-wide text-[#D9822B]">
                हरे कृष्ण · गुरुमार्गः
              </span>
              <span className="text-[#66635D]/40">·</span>
              <span className="text-[12px] font-medium text-[#66635D]">{formattedDate}</span>
            </div>

            <h1 className="text-[22px] font-bold tracking-tight text-[#20201D] sm:text-[26px]">
              Hare Krishna, Prabhu {guruName} 🙏
            </h1>

            <p className="text-[13px] text-[#66635D]">
              Guiding <span className="font-semibold text-[#20201D]">{totalActiveCount} Shishyas</span> under your spiritual shelter.
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
