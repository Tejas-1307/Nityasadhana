"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Calendar, Users } from "lucide-react";
import { InviteModal } from "@/components/invitations/invite-modal";

export interface DigestEmptyStateProps {
  type: "all_steady" | "insufficient_data" | "no_shishyas";
  totalStudents?: number;
  reportedStudents?: number;
}

export function DigestEmptyState({
  type,
  totalStudents = 0,
  reportedStudents = 0,
}: DigestEmptyStateProps) {
  if (type === "all_steady") {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 text-center shadow-level2 sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#328A7A]/10 text-[#328A7A]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-[17px] font-bold text-[#193B3B]">
          All looks steady this week 🌱
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-[#547070]">
          {reportedStudents} / {totalStudents} Students reported. All devotional routines and
          reporting rhythms remain balanced. No follow-ups currently due.
        </p>
      </Card>
    );
  }

  if (type === "insufficient_data") {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 text-center shadow-level2 sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A9824D]/10 text-[#A9824D]">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-[17px] font-bold text-[#193B3B]">
          No weekly report data yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-[#547070]">
          Weekly intelligence will appear as your Shishyas submit their Daily Sādhanā reports
          for this week.
        </p>
      </Card>
    );
  }

  // No shishyas connected
  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level2 sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A9824D]/10 text-[#A9824D]">
        <Users className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-[20px] font-bold text-[#193B3B]">
        Connect Your First Shishya
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#547070]">
        Your weekly group insights, pattern alerts, and positive trends will populate here once
        your Shishyas connect through your invitation link or code.
      </p>
      <div className="mt-6 flex justify-center">
        <InviteModal triggerText="Generate Shishya Invite" triggerSize="lg" />
      </div>
    </Card>
  );
}
