import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { GuruHeader } from "@/components/guru/guru-header";
import { ReportingOverviewCard } from "@/components/guru/reporting-overview-card";
import { AttentionSection } from "@/components/guru/attention-section";
import { StableSection } from "@/components/guru/stable-section";
import { Button } from "@/components/ui/button";
import { requireGuru } from "@/lib/auth/guards";
import { GuruService } from "@/lib/guru/service";
import { ArrowRight, Users } from "lucide-react";
import { InviteModal } from "@/components/invitations/invite-modal";

export const dynamic = "force-dynamic";

export default async function GuruOverviewPage() {
  // Server-authoritative role guard (enforces role === 'guru')
  const user = await requireGuru();

  // Single-pass aggregated Guru overview
  const overview = await GuruService.getDashboardOverview(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F1E5] pb-20 md:pb-10">
      {/* Authenticated Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(32,32,29,0.08)] bg-white/90 backdrop-blur-md">
        <Container size="default">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Logo size="default" href="/" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <InviteModal triggerVariant="secondary" triggerSize="sm" />
              </div>
              <UserMenu role="guru" userName={user.name} userEmail={user.email} />
            </div>
          </div>
        </Container>
      </header>

      {/* Guru Desktop Sub-navigation */}
      <div className="hidden md:block">
        <GuruNavTabs />
      </div>

      {/* Main Protected Content */}
      <main className="flex-1 py-6 sm:py-10">
        <Container size="reading">
          <div className="space-y-6">
            {/* Header Greeting */}
            <GuruHeader
              guruName={user.name}
              currentDateStr={overview.currentDateStr}
              totalActiveCount={overview.totalActiveShishyas}
            />

            {/* If Guru has NO Shishyas yet, show welcoming empty state */}
            {overview.totalActiveShishyas === 0 ? (
              <div className="rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-8 text-center shadow-level2 sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9822B]/10 text-[#D9822B]">
                  <Users className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-[20px] font-bold text-[#20201D]">
                  Welcome, His Grace {user.name}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#66635D]">
                  Your Shishyas will appear here once they join through your invitation link or code.
                </p>
                <div className="mt-6 flex justify-center">
                  <InviteModal triggerText="Generate First Shishya Invite" triggerSize="lg" />
                </div>
              </div>
            ) : (
              <>
                {/* 1. Today's Administrative Reporting Overview */}
                <ReportingOverviewCard
                  totalActive={overview.totalActiveShishyas}
                  totalInactive={overview.totalInactiveShishyas}
                  submittedCount={overview.todayStats.submittedCount}
                  pendingCount={overview.todayStats.pendingCount}
                  notSubmittedCount={overview.todayStats.notSubmittedCount}
                />

                {/* 2. Top-Priority Section: Attention Suggested */}
                <AttentionSection shishyas={overview.attentionShishyas} />

                {/* 3. Secondary / Collapsible Section: Consistent Routine */}
                <StableSection shishyas={overview.stableShishyas} />

                {/* 4. Directory Link Footer */}
                <div className="flex items-center justify-between rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-[#66635D]" />
                    <span className="text-[13px] font-semibold text-[#20201D]">
                      View all {overview.totalActiveShishyas} Shishyas
                    </span>
                  </div>
                  <Link href="/guru/shishyas">
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      className="text-[12px] font-semibold"
                    >
                      Open Directory
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <GuruBottomNav />
    </div>
  );
}
