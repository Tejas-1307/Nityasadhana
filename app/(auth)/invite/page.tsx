import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Logo } from "@/components/branding/logo";
import { CodeEntryForm } from "@/components/invitations/code-entry-form";

export const dynamic = "force-dynamic";

export default function InvitePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#EAF7F4]">
      <Section spacing="default" className="flex flex-1 items-center py-10 sm:py-16">
        <Container size="form">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo size="lg" variant="vertical" className="mb-4" />
            <h1 className="text-[24px] font-bold tracking-tight text-[#193B3B] sm:text-[28px]">
              Accept Ashram Invitation
            </h1>
            <p className="mt-1 text-[14px] text-[#547070]">
              Enter the unique invitation code provided by your Guru.
            </p>
          </div>

          <React.Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-white/60" />}>
            <CodeEntryForm />
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
