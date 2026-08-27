"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected errors safely to console in development
    console.error("Nityasādhanā Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Container size="form">
        <Card className="space-y-5 border-[#B33927]/20 bg-white p-6 text-center shadow-level2 sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B33927]/10 text-[#B33927]">
            <AlertCircle className="h-7 w-7 stroke-[1.75]" />
          </div>

          <div className="space-y-1.5">
            <p className="font-serif text-[13px] font-medium text-[#D9822B]">
              शान्तिः • विघ्नशान्तिः
            </p>
            <h2 className="text-[22px] font-bold tracking-tight text-[#20201D]">
              An unexpected pause occurred
            </h2>
            <p className="mx-auto max-w-sm text-[14px] text-[#66635D]">
              The application encountered a temporary pause. Please try reloading or return to the
              home screen.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              variant="primary"
              onClick={() => reset()}
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="w-full min-w-[140px] sm:w-auto"
            >
              Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                leftIcon={<Home className="h-4 w-4" />}
                className="w-full min-w-[140px] sm:w-auto"
              >
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
