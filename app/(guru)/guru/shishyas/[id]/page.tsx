import * as React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { ShishyaProfileView } from "@/components/guru/profile/shishya-profile-view";
import { requireGuru } from "@/lib/auth/guards";
import { ShishyaDetailForGuru } from "@/lib/guru/service";
import { ArrowLeft, ShieldAlert, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface ShishyaProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ShishyaProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cookieStore = await cookies();
    const cookieValue = cookieStore.toString();
    const response = await fetch(`${apiUrl}/api/guru/shishyas/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieValue },
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      const titleName = data?.shishya?.spiritualName || data?.shishya?.name || "Counselee";
      return {
        title: `${titleName} · Counselee Profile | Nityasādhanā`,
        description: "Mentorship workspace, Sādhanā patterns, attention history, and private notes.",
      };
    }
  } catch {
    // Graceful fallback
  }

  return {
    title: "Counselee Profile | Nityasādhanā",
    description: "Mentorship workspace and Sādhanā reporting history.",
  };
}

export default async function ShishyaProfilePage({ params }: ShishyaProfilePageProps) {
  const { id } = await params;

  // 1. Authoritative Counsellor Auth Guard
  const user = await requireGuru();

  let detail: ShishyaDetailForGuru | null = null;
  let statusError: { code: number; message: string } | null = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const cookieStore = await cookies();
    const cookieValue = cookieStore.toString();

    const response = await fetch(`${apiUrl}/api/guru/shishyas/${encodeURIComponent(id)}`, {
      headers: { Cookie: cookieValue },
      cache: "no-store",
    });

    if (response.status === 403 || response.status === 401) {
      statusError = {
        code: response.status,
        message: "You do not have an active mentorship relationship with this Counselee, or access is restricted.",
      };
    } else if (response.status === 404) {
      statusError = {
        code: 404,
        message: "The requested Counselee record could not be found or has been deactivated.",
      };
    } else if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      statusError = {
        code: response.status,
        message: errBody?.detail || `Unable to load Counselee profile (status ${response.status}).`,
      };
    } else {
      detail = (await response.json()) as ShishyaDetailForGuru;
    }
  } catch (err: any) {
    statusError = {
      code: 500,
      message: err?.message || "A network error occurred while connecting to the server.",
    };
  }

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

      {/* Counsellor Desktop Sub-navigation */}
      <div className="hidden md:block">
        <GuruNavTabs />
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <Container size="reading">
          {statusError ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-[rgba(63,148,149,0.18)] bg-white p-6 text-center shadow-level2 sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7F4] text-[#A9824D]">
                {statusError.code === 403 ? (
                  <ShieldAlert className="h-7 w-7 text-[#A9824D]" />
                ) : (
                  <UserX className="h-7 w-7 text-[#547070]" />
                )}
              </div>
              <h1 className="text-[19px] font-bold text-[#193B3B] sm:text-[21px]">
                {statusError.code === 403 ? "Access Restricted" : "Counselee Record Unavailable"}
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[#547070]">
                {statusError.message}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Link href="/guru/shishyas">
                  <Button variant="primary" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to My Counselees
                  </Button>
                </Link>
                <Link href="/guru">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Counsellor Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : detail ? (
            <ShishyaProfileView detail={detail} />
          ) : (
            <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-8 text-center text-[14px] text-[#547070]">
              Loading Counselee profile...
            </div>
          )}
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <GuruBottomNav />
    </div>
  );
}
