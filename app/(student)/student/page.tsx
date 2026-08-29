import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { requireShishya } from "@/lib/auth";
import { reportService } from "@/lib/reports/service";
import { SankalpaService } from "@/lib/sankalpa";
import { getTimeBasedGreeting, formatDevoteeDate } from "@/lib/utils/greeting";
import { TodaySummaryCard } from "@/components/dashboard/today-summary-card";
import { SadhanaMetricGrid } from "@/components/dashboard/sadhana-metric-grid";
import { ConsistencyCard } from "@/components/dashboard/consistency-card";
import { RecentReportsSection } from "@/components/dashboard/recent-reports-section";
import { DashboardSankalpaCard } from "@/components/sankalpa/dashboard-sankalpa-card";
import {
  HeartHandshake,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  // 1. Server-authoritative role guard (enforces role === 'shishya')
  const user = await requireShishya();

  // 2. Fetch complete Dashboard data and active Sankalpa in parallel
  const [dashboard, activeSankalpa] = await Promise.all([
    reportService.getStudentDashboard(user.id),
    SankalpaService.getActiveSankalpa(user.id),
  ]);

  // 3. Time-aware greeting & date context
  const greeting = getTimeBasedGreeting();
  const todayFormatted = formatDevoteeDate();
  const displayName = user.spiritualName || user.name;

  return (
    <main className="py-6 sm:py-10">
      <Container size="reading">
        {/* Contextual Header */}
        <div className="mb-6 space-y-1 sm:mb-8">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#A9824D]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-serif">नित्यसाधना • मुख्यपृष्ठम्</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#193B3B] sm:text-[28px]">
            {greeting.fullGreeting(displayName)}
          </h1>
          <p className="text-[14px] text-[#547070]">
            {greeting.timeGreeting}. Today is{" "}
            <span className="font-medium text-[#193B3B]">{todayFormatted}</span>.
          </p>
        </div>

        {/* 1. ABOVE-THE-FOLD PRIMARY SUMMARY CARD (Answers status in <= 3s) */}
        <div className="mb-6">
          <TodaySummaryCard
            todayDateStr={dashboard.todayDate}
            formattedDate={todayFormatted}
            status={dashboard.status}
            report={dashboard.report}
            isEditable={dashboard.isEditable}
          />
        </div>

        {/* 2. WEEKLY SANKALPA SUMMARY WIDGET */}
        <div className="mb-6">
          <DashboardSankalpaCard sankalpa={activeSankalpa} />
        </div>

        {/* 3. SĀDHANĀ METRICS OVERVIEW (2-column mobile-first grid) */}
        <div className="mb-6 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#193B3B]">
              Today&apos;s Sādhanā Breakdown
            </h2>
            {dashboard.report && (
              <span className="text-[12px] text-[#547070]">Recorded values</span>
            )}
          </div>
          <SadhanaMetricGrid report={dashboard.report} />
        </div>

        {/* 4. CALM CONSISTENCY SURFACE */}
        <div className="mb-6">
          <ConsistencyCard consistency={dashboard.consistency} />
        </div>

        {/* 5. RECENT PRACTICE REPORTS (Latest 3-5 reports) */}
        <div className="mb-6">
          <RecentReportsSection reports={dashboard.recentReports} />
        </div>

        {/* 6. SECONDARY ATTACHMENTS (Guiding Guru & Journey Shortcut) */}
        <div className="space-y-3.5 pt-2">
          {/* Connected Guru Card */}
          {dashboard.guidingGuru ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A9824D]/10 text-[#A9824D]">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#547070]">
                    Guiding Guru
                  </span>
                  <div className="text-[14px] font-bold text-[#193B3B]">
                    {dashboard.guidingGuru.spiritualName || dashboard.guidingGuru.name}
                  </div>
                </div>
              </div>

              <Badge variant="krishna" size="sm">
                <span>Active Guru</span>
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-[rgba(63,148,149,0.2)] bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#547070]/10 text-[#547070]">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#547070]">
                    Mentorship
                  </span>
                  <div className="text-[13px] text-[#547070]">
                    Not yet connected with a Guiding Guru
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Journey Deep Reflection Link */}
          <Link
            href="/student/journey"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 transition-colors hover:border-[#3F9495]/40 hover:bg-[#EAF7F4]/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3F9495]/10 text-[#3F9495] transition-transform group-hover:scale-105">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#547070]">
                  Long-Term Patterns
                </span>
                <div className="text-[14px] font-bold text-[#193B3B]">
                  Explore Your Sādhanā Journey &amp; Weekly Focus
                </div>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-[#547070] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3F9495]" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
