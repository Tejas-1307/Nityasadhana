"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";

export default function GuruError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <Container size="reading">
        <Card className="border-[rgba(32,32,29,0.08)] bg-white p-8 text-center shadow-level2 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F1E5] text-[#D9822B]">
            <Users className="h-7 w-7 stroke-[1.75]" />
          </div>

          <div className="mt-4 space-y-2">
            <span className="font-serif text-[13px] text-[#D9822B]">
              शान्तिः • विघ्नशान्तिः
            </span>
            <h2 className="text-[20px] font-bold text-[#20201D]">
              We couldn&apos;t load the Guru workspace
            </h2>
            <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-[#66635D]">
              A temporary interruption occurred. Please take a mindful breath and try again.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="default"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => reset()}
            >
              Try Again
            </Button>
            <Link href="/guru">
              <Button variant="secondary" size="default">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}
