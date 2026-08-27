"use client";

import * as React from "react";
import { ShishyaDetailForGuru } from "@/lib/guru/service";
import { ShishyaProfileHeader } from "./shishya-profile-header";
import { CurrentAttentionCard } from "./current-attention-card";
import { SadhanaSummaryCard } from "./sadhana-summary-card";
import { InteractiveTrendCard } from "./interactive-trend-card";
import { TodaySadhanaView } from "./today-sadhana-view";
import { ShishyaSankalpaView } from "./shishya-sankalpa-view";
import { ReportHistoryList } from "./report-history-list";
import { AttentionHistoryCard } from "./attention-history-card";
import { FollowUpSection } from "./follow-up-section";
import { PrivateNotesSection } from "./private-notes-section";

export interface ShishyaProfileViewProps {
  detail: ShishyaDetailForGuru;
}

export function ShishyaProfileView({ detail }: ShishyaProfileViewProps) {
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = React.useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      {/* 1. Header & Student Identity */}
      <ShishyaProfileHeader
        shishya={detail.shishya}
        relationship={detail.relationship}
        attentionLevel={detail.attentionLevel}
        signals={detail.signals}
        onOpenFollowUpModal={() => setIsFollowUpModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

      {/* 2. Current Attention State */}
      <CurrentAttentionCard
        assessment={detail.assessment}
        signals={detail.signals}
      />

      {/* 3. Sādhanā Summary (Last 7 Days) */}
      <SadhanaSummaryCard
        trendData={detail.sevenDayTrend}
        baseline={detail.baseline}
      />

      {/* 4. Weekly Focus & Reflection (Mentorship Growth Focus) */}
      <ShishyaSankalpaView
        activeSankalpa={detail.activeSankalpa || null}
        history={detail.sankalpaHistory || []}
        latestReflection={detail.latestReflection || null}
      />

      {/* 5. Interactive Trends (7 Days / 30 Days Multi-Metric) */}
      <InteractiveTrendCard
        sevenDayTrend={detail.sevenDayTrend}
        thirtyDayTrend={detail.thirtyDayTrend}
        baseline={detail.baseline}
        trendSummaries={detail.trendSummaries}
      />

      {/* 6. Today's Sādhanā Record */}
      <TodaySadhanaView
        report={detail.todayReport}
        practiceDate={todayStr}
      />

      {/* 7. Report History & Read-Only Inspection */}
      <ReportHistoryList
        reports={detail.recentHistory}
        totalReports={detail.totalReportCount}
      />

      {/* 8. Attention History (Past Pattern Records) */}
      <AttentionHistoryCard
        attentionHistory={detail.attentionHistory}
      />

      {/* 9. Follow-up History */}
      <FollowUpSection
        shishyaId={detail.shishya.id}
        followUps={detail.followUps}
        isComposerOpen={isFollowUpModalOpen}
        onCloseComposer={() => setIsFollowUpModalOpen(false)}
        onOpenComposer={() => setIsFollowUpModalOpen(true)}
      />

      {/* 10. Private Guru Notes */}
      <PrivateNotesSection
        shishyaId={detail.shishya.id}
        privateNotes={detail.privateNotes}
        isComposerOpen={isNoteModalOpen}
        onCloseComposer={() => setIsNoteModalOpen(false)}
        onOpenComposer={() => setIsNoteModalOpen(true)}
      />
    </div>
  );
}
