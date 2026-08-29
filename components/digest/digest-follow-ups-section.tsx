"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DigestFollowUpItem } from "@/lib/digest/types";
import { Clock, ArrowRight } from "lucide-react";

export interface DigestFollowUpsSectionProps {
  followUps: DigestFollowUpItem[];
}

export function DigestFollowUpsSection({ followUps }: DigestFollowUpsSectionProps) {
  if (followUps.length === 0) {
    return null;
  }

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#A9824D]/10 text-[#A9824D]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A9824D]">
              Mentorship Action
            </span>
            <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
              Follow-up Reminders ({followUps.length})
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-[#547070]">Scheduled discussions</span>
      </div>

      {/* Follow-ups List */}
      <div className="mt-4 space-y-3">
        {followUps.map((item) => {
          return (
            <div
              key={item.followUp.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-xs transition-all hover:border-[#A9824D]/40"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#193B3B]">
                    {item.shishya.spiritualName || item.shishya.name}
                  </span>
                  <Badge
                    variant={item.isOverdue ? "saffron" : "sand"}
                    size="sm"
                  >
                    {item.isOverdue
                      ? `Overdue (${item.followUp.followUpDate})`
                      : `Due ${item.followUp.followUpDate}`}
                  </Badge>
                </div>

                <p className="text-[12px] text-[#547070]">
                  {item.followUp.note || "Scheduled discussion regarding Sādhanā routine."}
                </p>
              </div>

              <Link href={`/guru/shishyas/${item.shishya.id}`}>
                <Button variant="ghost" size="sm" className="h-8 text-[12px]">
                  <span>Open Profile</span>
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
