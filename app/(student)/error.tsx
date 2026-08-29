"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCw, HeartHandshake } from "lucide-react";

export default function StudentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="py-12 sm:py-16">
      <Container size="reading">
        <Card className="border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level2 sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4] text-[#A9824D]">
            <HeartHandshake className="h-7 w-7 stroke-[1.75]" />
          </div>

          <div className="mt-4 space-y-2">
            <span className="font-serif text-[13px] text-[#A9824D]">
              शान्तिः • धैर्यम्
            </span>
            <h2 className="text-[20px] font-bold text-[#193B3B]">
              We couldn&apos;t load this page right now
            </h2>
            <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-[#547070]">
              A temporary interruption occurred. Please take a mindful breath and try again.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              size="default"
              leftIcon={<RotateCw className="h-4 w-4" />}
              onClick={() => reset()}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
}
