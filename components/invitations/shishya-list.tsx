"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { DbUser, DbGuruShishyaRelationship } from "@/lib/db/schema";
import { InviteModal } from "./invite-modal";
import { ShishyaCard } from "@/components/relationships/shishya-card";
import { Users } from "lucide-react";

export interface ShishyaItem {
  relationship: DbGuruShishyaRelationship;
  shishya: DbUser;
}

export function ShishyaList({
  shishyas,
  onRefresh,
}: {
  shishyas: ShishyaItem[];
  onRefresh?: () => void;
}) {
  if (shishyas.length === 0) {
    return (
      <Card
        id="shishya-empty-state"
        className="space-y-4 border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level1 sm:p-12"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4] text-[#3F9495]">
          <Users className="h-7 w-7 stroke-[1.75]" />
        </div>
        <div className="mx-auto max-w-sm space-y-1">
          <h3 className="text-[18px] font-bold text-[#193B3B]">No active Shishyas yet</h3>
          <p className="text-[14px] leading-relaxed text-[#547070]">
            Your journey with your Shishyas begins here. Create an invitation to connect with your
            students on their spiritual path.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <InviteModal onInvitationCreated={onRefresh} />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#193B3B]">
          Connected Shishyas ({shishyas.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {shishyas.map(({ relationship, shishya }) => (
          <ShishyaCard
            key={relationship.id}
            relationship={relationship}
            shishya={shishya}
            onMentorshipEnded={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
