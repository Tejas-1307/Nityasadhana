import * as React from "react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { WeeklyDigestView } from "@/components/digest/weekly-digest-view";
import { requireGuru } from "@/lib/auth/guards";
import { DigestService } from "@/lib/digest/service";
import { InviteModal } from "@/components/invitations/invite-modal";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface GuruWeeklyDigestPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function GuruWeeklyDigestPage({ searchParams }: GuruWeeklyDigestPageProps) {
  const user = await requireGuru();
  const resolvedParams = await searchParams;
  const weekParam = resolvedParams.week;

  const digest = await DigestService.getGuruWeeklyDigest(user.id, weekParam);

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

      {/* Main Protected Digest Workspace */}
      <main className="flex-1 py-6 sm:py-10">
        <Container size="reading">
          <div className="space-y-6">
            {/* Digest Header */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#D9822B]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[12px] font-bold uppercase tracking-wider">
                  Weekly Mentorship Intelligence • साप्ताहिक विवरणम्
                </span>
              </div>
              <h1 className="text-[24px] font-bold text-[#20201D] sm:text-[28px]">
                Weekly Sādhanā Digest
              </h1>
              <p className="text-[13px] text-[#66635D]">
                A concise 2–5 minute summary of reporting rhythms, personal pattern changes, and active follow-ups.
              </p>
            </div>

            {/* Weekly Digest Interactive Workspace */}
            <WeeklyDigestView initialDigest={digest} />
          </div>
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <GuruBottomNav />
    </div>
  );
}
