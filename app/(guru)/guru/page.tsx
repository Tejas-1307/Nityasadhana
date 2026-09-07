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
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import { requireGuru } from "@/lib/auth/guards";
import { GuruDashboardOverview } from "@/lib/guru/service";
import { ArrowRight, RefreshCw, Users } from "lucide-react";
import { InviteModal } from "@/components/invitations/invite-modal";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function GuruOverviewPage() {
  // Server-authoritative role guard (enforces role === 'guru')
  const user = await requireGuru();

  let overview: GuruDashboardOverview | null = null;
  let fetchError: string | null = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cookieStore = await cookies();
    const cookieValue = cookieStore.toString();
    const response = await fetch(`${apiUrl}/api/guru-dashboard`, {
      headers: { Cookie: cookieValue },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      if (isJson) {
        const errorBody = (await response.json().catch(() => null)) as { detail?: string } | null;
        fetchError = errorBody?.detail || `API returned status ${response.status}`;
      } else {
        const textBody = await response.text().catch(() => "");
        fetchError = textBody ? `Server error: ${textBody}` : `API returned status ${response.status}`;
      }
    } else if (!isJson) {
      fetchError = "Received an unexpected non-JSON response from the server.";
    } else {
      overview = (await response.json()) as GuruDashboardOverview;
    }
  } catch (err: any) {
    fetchError = err?.message || "Failed to load Guru dashboard.";
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EAF7F4] pb-20 md:pb-10">
      {/* Authenticated Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.16)] bg-white/90 backdrop-blur-md">
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
            {fetchError || !overview ? (
              <div className="space-y-4 py-6">
                <ErrorState
                  title="Could not load Guru overview"
                  message={fetchError || "An unexpected error occurred while loading dashboard data."}
                />
                <div className="flex justify-center">
                  <Link href="/guru">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<RefreshCw className="h-4 w-4" />}
                    >
                      Retry Loading
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Header Greeting */}
                <GuruHeader
                  guruName={user.name}
                  currentDateStr={overview.currentDateStr}
                  totalActiveCount={overview.totalActiveShishyas}
                />

                {/* If Guru has NO Shishyas yet, show welcoming empty state */}
                {overview.totalActiveShishyas === 0 ? (
                  <div className="rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level2 sm:p-10">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A9824D]/10 text-[#A9824D]">
                      <Users className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-[20px] font-bold text-[#193B3B]">
                      Welcome, His Grace {user.name}
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[#547070]">
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
                    <div className="flex items-center justify-between rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <Users className="h-4 w-4 text-[#547070]" />
                        <span className="text-[13px] font-semibold text-[#193B3B]">
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
