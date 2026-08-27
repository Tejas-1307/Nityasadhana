"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { AttentionBadge } from "@/components/guru/attention/attention-badge";
import { DbAttentionHistoryItem } from "@/lib/db/schema";
import { History } from "lucide-react";

export interface AttentionHistoryCardProps {
  attentionHistory: DbAttentionHistoryItem[];
}

export function AttentionHistoryCard({ attentionHistory }: AttentionHistoryCardProps) {
  if (attentionHistory.length === 0) {
    return (
      <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#66635D]" />
            <h2 className="text-[16px] font-bold text-[#20201D]">Attention History</h2>
          </div>
          <span className="text-[11px] text-[#66635D]">Pattern records</span>
        </div>
        <p className="mt-4 text-center text-[13px] text-[#66635D]">
          No attention changes recorded yet. Sādhanā reporting has remained consistent.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
              Pattern Observations
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Attention History ({attentionHistory.length})
            </h2>
          </div>
          <span className="text-[11px] text-[#66635D]">Chronological records</span>
        </div>

        {/* Timeline Items */}
        <div className="space-y-2.5">
          {attentionHistory.map((item, idx) => {
            const formattedDate = new Date(item.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });

            return (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#20201D]">
                      {formattedDate}
                    </span>
                    <AttentionBadge level={item.level} size="sm" />
                  </div>
                  <p className="text-[12px] text-[#66635D]">{item.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
