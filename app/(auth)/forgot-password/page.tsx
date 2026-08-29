import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Logo } from "@/components/branding/logo";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F7F1E5]">
      <Section spacing="default" className="flex flex-1 items-center py-10 sm:py-16">
        <Container size="form">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo size="lg" variant="vertical" className="mb-4" />
            <h1 className="text-[24px] font-bold tracking-tight text-[#20201D] sm:text-[28px]">
              Reset Your Password
            </h1>
            <p className="mt-1 text-[14px] text-[#66635D]">
              Enter your registered email to receive a secure recovery code.
            </p>
          </div>

          <React.Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/60" />}>
            <ForgotPasswordForm />
          </React.Suspense>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-[13px] text-[#66635D] hover:underline">
              ← Return to Sign In
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
