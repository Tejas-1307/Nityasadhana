"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/client";
import { KeyRound, ArrowRight, AlertCircle } from "lucide-react";

export function CodeEntryForm() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setErrorMessage("Please enter your invitation code.");
      return;
    }

    setIsLoading(true);

    try {
      const validation = await api.get<{ is_valid: boolean; error_reason?: string }>(`/api/invitations/validate/${encodeURIComponent(trimmed)}`);
      if (validation.is_valid) {
        // Route to the invite acceptance page with the code
        router.push(`/invite/${encodeURIComponent(trimmed)}`);
      } else {
        setErrorMessage(validation.error_reason || "Invalid or expired invitation code.");
      }
    } catch {
      setErrorMessage("Unable to verify invitation. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="space-y-4 border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-level2 sm:p-8">
      {errorMessage && (
        <div
          role="alert"
          className="bg-[#B33927]/8 flex items-start gap-2.5 rounded-xl border border-[#B33927]/20 p-3.5 text-[13px] text-[#B33927]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="inviteCode" required sanskritHint="निमन्त्रण-सङ्केतः">
            Invitation Code
          </Label>
          <Input
            id="inviteCode"
            placeholder="e.g. NITYA-7K4P-X9QM"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            leftIcon={<KeyRound className="h-4 w-4" />}
            className="text-center font-mono text-[16px] uppercase tracking-wider"
            required
            disabled={isLoading}
          />
          <p className="mt-1.5 text-[12px] text-[#547070]">
            Provided in the invitation message from your Guru.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-2 w-full"
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          Verify & Continue
        </Button>
      </form>
    </Card>
  );
}
