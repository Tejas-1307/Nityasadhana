import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbUser, DbGuruShishyaRelationship } from "@/lib/db/schema";
import { AttentionLevel, AttentionSignal } from "@/lib/guru/attention";
import { AttentionBadge } from "@/components/guru/attention/attention-badge";
import { ArrowLeft, Calendar, ShieldCheck, UserCheck, MessageSquarePlus, FileText, UserX } from "lucide-react";

export interface ShishyaProfileHeaderProps {
  shishya: DbUser;
  relationship: DbGuruShishyaRelationship;
  attentionLevel?: AttentionLevel;
  signals?: AttentionSignal[];
  onOpenFollowUpModal?: () => void;
  onOpenNoteModal?: () => void;
}

export function ShishyaProfileHeader({
  shishya,
  relationship,
  attentionLevel = "STABLE",
  onOpenFollowUpModal,
  onOpenNoteModal,
}: ShishyaProfileHeaderProps) {
  const initials = shishya.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDateFormatted = new Date(relationship.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isActive = relationship.status === "active";

  return (
    <div className="space-y-4">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/guru/shishyas"
          className="inline-flex items-center gap-1.5 rounded-lg py-1 text-[13px] font-semibold text-[#2457A6] transition-colors hover:text-[#1D4585] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shishyas</span>
        </Link>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2">
          {onOpenFollowUpModal && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenFollowUpModal}
              className="h-8 text-[12px] font-semibold"
            >
              <MessageSquarePlus className="mr-1 h-3.5 w-3.5 text-[#D9822B]" />
              <span>+ Follow-up</span>
            </Button>
          )}

          {onOpenNoteModal && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenNoteModal}
              className="h-8 text-[12px] font-semibold"
            >
              <FileText className="mr-1 h-3.5 w-3.5 text-[#2457A6]" />
              <span>+ Note</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Student Identity Card */}
      <div className="rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F7F1E5] font-serif text-[18px] font-bold text-[#20201D] shadow-xs">
              {initials}
            </div>

            {/* Name & Metadata */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-bold text-[#20201D] sm:text-[24px]">
                  {shishya.spiritualName || shishya.name}
                </h1>
                <AttentionBadge level={attentionLevel} size="sm" />
                {isActive ? (
                  <Badge variant="krishna" size="sm">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    <span>Shishya</span>
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm" className="text-[#66635D]">
                    <UserX className="mr-1 h-3 w-3" />
                    <span>Relationship inactive</span>
                  </Badge>
                )}
              </div>

              {shishya.spiritualName && shishya.name !== shishya.spiritualName && (
                <p className="text-[13px] text-[#66635D]">Legal Name: {shishya.name}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#66635D]">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-[#3D765B]" />
                  <span>{isActive ? "Active mentorship" : "Archived relationship"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#D9822B]" />
                  <span>With you since {joinedDateFormatted}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
