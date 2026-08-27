import * as React from "react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { ShishyaDirectory } from "@/components/guru/shishya-directory";
import { PendingInvitationsList } from "@/components/invitations/pending-invitations";
import { requireGuru } from "@/lib/auth/guards";
import { GuruService } from "@/lib/guru/service";
import { dbStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function GuruShishyasPage() {
  const user = await requireGuru();

  const [overview, invitations] = await Promise.all([
    GuruService.getDashboardOverview(user.id),
    dbStore.getInvitationsByGuru(user.id),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F1E5] pb-20 md:pb-10">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(32,32,29,0.08)] bg-white/90 backdrop-blur-md">
        <Container size="default">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Logo size="default" href="/" />
            <UserMenu role="guru" userName={user.name} userEmail={user.email} />
          </div>
        </Container>
      </header>

      {/* Guru Desktop Sub-navigation */}
      <div className="hidden md:block">
        <GuruNavTabs />
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <Container size="default">
          <div className="mb-6">
            <h1 className="text-[22px] font-bold tracking-tight text-[#20201D] sm:text-[26px]">
              My Shishyas
            </h1>
            <p className="text-[14px] text-[#66635D]">
              Guide and care for your {overview.totalActiveShishyas} active students on their spiritual journey.
            </p>
          </div>

          <div className="space-y-10">
            {/* Shishya Directory with Search, Filter & Sort */}
            <ShishyaDirectory shishyas={overview.allShishyas} />

            {/* Pending & Historical Invitations */}
            <div className="border-t border-[rgba(32,32,29,0.08)] pt-8">
              <h2 className="mb-4 text-[18px] font-bold text-[#20201D]">
                Active Invitations
              </h2>
              <PendingInvitationsList invitations={invitations} />
            </div>
          </div>
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <GuruBottomNav />
    </div>
  );
}
