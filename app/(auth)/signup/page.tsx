import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Logo } from "@/components/branding/logo";
import { SignupForm } from "@/components/auth/signup-form";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ invitation_token?: string }>;
}) {
  const { invitation_token: invitationToken } = await searchParams;
  const hasInvitation = Boolean(invitationToken);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#EAF7F4]">
      <Section spacing="default" className="flex flex-1 items-center py-10 sm:py-16">
        <Container size="form">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo size="lg" variant="vertical" className="mb-4" />
            <h1 className="text-[24px] font-bold tracking-tight text-[#193B3B] sm:text-[28px]">
              {hasInvitation ? "Create Shishya Account" : "Create Devotee Account"}
            </h1>
            <p className="mt-1 text-[14px] text-[#547070]">
              {hasInvitation
                ? "Register through your Guru invitation to begin your guided Sādhanā journey."
                : "Begin your daily Sādhanā journey with ISKCON Pune."}
            </p>
          </div>

          <React.Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/60" />}>
            <SignupForm />
          </React.Suspense>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[13px] text-[#547070] hover:underline">
              ← Return to Home
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
