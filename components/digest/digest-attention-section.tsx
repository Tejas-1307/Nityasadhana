"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigestAttentionItem } from "@/lib/digest/types";
import { ArrowRight, Eye } from "lucide-react";

export interface DigestAttentionSectionProps {
  attentionSuggestions: DigestAttentionItem[];
}

export function DigestAttentionSection({ attentionSuggestions }: DigestAttentionSectionProps) {
  if (attentionSuggestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3F9495]/10 text-[#3F9495]">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3F9495]">
              Attention Suggested
            </span>
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              Patterns Requiring Mentorship Review ({attentionSuggestions.length})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#547070]">What matters now</span>
      </div>

      {/* Attention Cards List */}
      <div className="mt-4 space-y-3">
        {attentionSuggestions.map((item) => {
          const isFollowUp = item.attentionLevel === "FOLLOW_UP_SUGGESTED";

          return (
            <div
              key={item.shishya.id}
              className={`rounded-2xl border p-4 transition-all ${
                isFollowUp
                  ? "border-[#3F9495]/30 bg-[#3F9495]/5"
                  : "border-[#A9824D]/30 bg-[#A9824D]/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#193B3B]">
                      {item.shishya.spiritualName || item.shishya.name}
                    </span>
                    {item.shishya.spiritualName && item.shishya.name && (
                      <span className="text-[12px] text-[#547070]">
                        ({item.shishya.name})
                      </span>
                    )}
                    {isFollowUp ? (
                      <Badge variant="krishna" size="sm">
                        <span className="mr-1">🔵</span>
                        <span>Follow-up suggested</span>
                      </Badge>
                    ) : (
                      <Badge variant="saffron" size="sm">
                        <span className="mr-1">🟡</span>
                        <span>Observe</span>
                      </Badge>
                    )}
                  </div>

                  <p className="text-[13px] font-semibold text-[#193B3B]">
                    {item.headline}
                  </p>

                  <ul className="mt-1.5 space-y-1 text-[12px] text-[#547070]">
                    {item.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#193B3B]">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Link to Student Profile */}
                <Link href={`/guru/shishyas/${item.shishya.id}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    className="text-[12px] font-semibold"
                  >
                    View Student
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
