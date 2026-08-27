"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DbWeeklySankalpa } from "@/lib/db/schema";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { History, CheckCircle2, ChevronRight } from "lucide-react";
import { SankalpaDetailModal } from "./sankalpa-detail-modal";

export interface SankalpaHistoryListProps {
  sankalpas: DbWeeklySankalpa[];
  total?: number;
}

export function SankalpaHistoryList({ sankalpas, total: _total }: SankalpaHistoryListProps) {
  const [selectedSankalpa, setSelectedSankalpa] = React.useState<DbWeeklySankalpa | null>(null);

  // Filter out the currently active one if present in the history list
  const pastSankalpas = sankalpas.filter((s) => s.status !== "active");

  if (pastSankalpas.length === 0) {
    return (
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#66635D]" />
            <h2 className="text-[16px] font-bold text-[#20201D]">Sankalpa Journey</h2>
          </div>
          <span className="text-[11px] text-[#66635D]">Weekly archives</span>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#66635D]">
          No past weekly Sankalpas yet. As you complete your weekly intentions, your growth journal will appear here.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
                Personal Growth Journal
              </span>
              <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
                Past Weekly Sankalpas ({pastSankalpas.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#66635D]">Step-by-step progress</span>
          </div>

          {/* List Items */}
          <div className="space-y-2.5">
            {pastSankalpas.map((item) => {
              const formattedRange = formatSankalpaRange(item.startDate, item.endDate);
              const alignedDays = item.progress?.alignedDays || 0;
              const isCompleted = item.status === "completed";
              const isCancelled = item.status === "cancelled";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSankalpa(item)}
                  className="group flex cursor-pointer items-start justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-3.5 shadow-xs transition-all hover:border-[#3D765B]/40 hover:bg-[#F7F1E5]/20"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#66635D]">
                        {formattedRange}
                      </span>
                      {isCompleted ? (
                        <Badge variant="feather" size="sm">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          <span>{alignedDays} / 7 days aligned</span>
                        </Badge>
                      ) : isCancelled ? (
                        <Badge variant="neutral" size="sm">
                          <span>Cancelled</span>
                        </Badge>
                      ) : (
                        <Badge variant="saffron" size="sm">
                          <span>{alignedDays} / 7 days</span>
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-[14px] font-bold text-[#20201D]">
                      {item.title}
                    </h3>

                    {item.reflection && (
                      <p className="mt-1 line-clamp-1 text-[12px] text-[#66635D] italic">
                        &ldquo;{item.reflection.content}&rdquo;
                      </p>
                    )}
                  </div>

                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#66635D]/40 transition-transform group-hover:translate-x-0.5 group-hover:text-[#20201D]" />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedSankalpa && (
        <SankalpaDetailModal
          sankalpa={selectedSankalpa}
          onClose={() => setSelectedSankalpa(null)}
        />
      )}
    </>
  );
}
