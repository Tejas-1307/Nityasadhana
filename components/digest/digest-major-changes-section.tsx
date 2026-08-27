"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigestMajorChangeItem } from "@/lib/digest/types";
import { ArrowUpDown, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export interface DigestMajorChangesSectionProps {
  majorChanges: DigestMajorChangeItem[];
}

export function DigestMajorChangesSection({ majorChanges }: DigestMajorChangesSectionProps) {
  if (majorChanges.length === 0) {
    return null;
  }

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2457A6]/10 text-[#2457A6]">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2457A6]">
              Personal Patterns (Student vs Self)
            </span>
            <h2 className="text-[17px] font-bold text-[#20201D] sm:text-[18px]">
              Major Routine Changes ({majorChanges.length})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#66635D]">vs Previous week</span>
      </div>

      {/* Changes List */}
      <div className="mt-4 space-y-3">
        {majorChanges.map((item, idx) => {
          return (
            <div
              key={`${item.shishya.id}_${item.metric}_${idx}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-3.5 shadow-xs transition-all hover:border-[#2457A6]/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#20201D]">
                    {item.shishya.spiritualName || item.shishya.name}
                  </span>
                  <span className="text-[12px] font-semibold text-[#66635D]">
                    • {item.metricLabel}
                  </span>
                  <Badge variant={item.isFavorable ? "krishna" : "saffron"} size="sm">
                    {item.isFavorable ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    <span>{item.diffDescription}</span>
                  </Badge>
                </div>

                <p className="text-[12px] text-[#66635D]">
                  {item.factualExplanation}
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
