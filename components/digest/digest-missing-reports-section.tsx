"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigestMissingReportItem } from "@/lib/digest/types";
import { FileQuestion, ArrowRight } from "lucide-react";

export interface DigestMissingReportsSectionProps {
  missingReports: DigestMissingReportItem[];
}

export function DigestMissingReportsSection({ missingReports }: DigestMissingReportsSectionProps) {
  if (missingReports.length === 0) {
    return null;
  }

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
            <FileQuestion className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9822B]">
              Reporting Status
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Missing Reports ({missingReports.length} {missingReports.length === 1 ? "Student" : "Students"})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#66635D]">This week</span>
      </div>

      {/* Missing Reports Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {missingReports.map((item) => {
          return (
            <div
              key={item.shishya.id}
              className="flex items-center justify-between rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-3.5 shadow-xs transition-all hover:border-[#D9822B]/40"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#20201D]">
                    {item.shishya.spiritualName || item.shishya.name}
                  </span>
                  <Badge variant="feather" size="sm">
                    {item.missingCount} {item.missingCount === 1 ? "missing" : "missing"}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#66635D]">
                  {item.lastSubmittedDate
                    ? `Last report: ${item.lastSubmittedDate}`
                    : "No reports submitted yet"}
                </p>
              </div>

              <Link href={`/guru/shishyas/${item.shishya.id}`}>
                <Button variant="ghost" size="sm" className="h-8 text-[12px]">
                  <span>View</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
