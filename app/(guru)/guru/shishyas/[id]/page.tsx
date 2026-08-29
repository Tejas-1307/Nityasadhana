import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { ShishyaProfileView } from "@/components/guru/profile/shishya-profile-view";
import { requireGuruOwnsShishya } from "@/lib/auth/authorization";
import { GuruService } from "@/lib/guru/service";

export const dynamic = "force-dynamic";

interface ShishyaProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ShishyaProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const authCheck = await requireGuruOwnsShishya(id);
    const titleName = authCheck.shishya.spiritualName || authCheck.shishya.name;
    return {
      title: `${titleName} · Shishya Profile | Nityasādhanā`,
      description: "Mentorship workspace, Sādhanā patterns, attention history, and private notes.",
    };
  } catch {
    return {
      title: "Shishya Profile | Nityasādhanā",
    };
  }
}

export default async function ShishyaProfilePage({ params }: ShishyaProfilePageProps) {
  const { id } = await params;

  let guruUser;
  try {
    const authCheck = await requireGuruOwnsShishya(id);
    guruUser = authCheck.guru;
  } catch {
    notFound();
  }

  const detail = await GuruService.getShishyaDetail(guruUser.id, id);
  if (!detail) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#EAF7F4] pb-20 md:pb-10">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.16)] bg-white/90 backdrop-blur-md">
        <Container size="default">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Logo size="default" href="/" />
            <UserMenu role="guru" userName={guruUser.name} userEmail={guruUser.email} />
          </div>
        </Container>
      </header>

      {/* Guru Desktop Sub-navigation */}
      <div className="hidden md:block">
        <GuruNavTabs />
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <Container size="reading">
          <ShishyaProfileView detail={detail} />
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <GuruBottomNav />
    </div>
  );
}
