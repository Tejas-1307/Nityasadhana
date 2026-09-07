import * as React from "react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { ShishyaDirectory } from "@/components/guru/shishya-directory";
import { PendingInvitationsList } from "@/components/invitations/pending-invitations";
import { requireGuru } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function GuruShishyasPage() {
  const user = await requireGuru();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const cookieHeader = (await import("next/headers")).cookies;
  const cookieValue = (await cookieHeader()).toString();
  const response = await fetch(`${apiUrl}/api/relationships/guru`, { headers: { Cookie: cookieValue }, cache: "no-store" });
  const relationshipData = await response.json() as { shishyas: any[]; invitations: any[] };
  const overview = { totalActiveShishyas: relationshipData.shishyas.filter((item) => item.relationship?.status === "active").length, allShishyas: relationshipData.shishyas };
  const invitations = relationshipData.invitations;

  return (
    <div className="flex min-h-screen flex-col bg-[#EAF7F4] pb-20 md:pb-10">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.16)] bg-white/90 backdrop-blur-md">
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
            <h1 className="text-[22px] font-bold tracking-tight text-[#193B3B] sm:text-[26px]">
              My Shishyas
            </h1>
            <p className="text-[14px] text-[#547070]">
              Guide and care for your {overview.totalActiveShishyas} active students on their spiritual journey.
            </p>
          </div>

          <div className="space-y-10">
            {/* Shishya Directory with Search, Filter & Sort */}
            <ShishyaDirectory shishyas={overview.allShishyas} />

            {/* Pending & Historical Invitations */}
            <div className="border-t border-[rgba(63,148,149,0.12)] pt-8">
              <h2 className="mb-4 text-[18px] font-bold text-[#193B3B]">
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
