"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Sparkles, Calendar } from "lucide-react";
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
          All steady this week 🌱
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-[#547070]">
          {reportedStudents} / {totalStudents} Counselees reported. Devotional routines and
          reporting rhythms remain balanced.
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
          Weekly trends will appear as your Counselees submit their Daily Sādhanā reports
          for this week.
        </p>
      </Card>
    );
  }

  // No shishyas connected
  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level2 sm:p-10">
      <div className="relative mx-auto mb-3 h-20 w-20 overflow-hidden rounded-2xl border border-[rgba(63,148,149,0.2)] shadow-sm">
        <Image
          src="/images/devotional-path-empty.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <h2 className="mt-2 text-[20px] font-bold text-[#193B3B]">
        Connect Your First Counselee
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#547070]">
        Weekly group insights and trends will appear once Counselees connect using your invite code.
      </p>
      <div className="mt-6 flex justify-center">
        <InviteModal triggerText="Invite Counselee" triggerSize="lg" />
      </div>
    </Card>
  );
}
