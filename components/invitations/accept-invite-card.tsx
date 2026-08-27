"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicInvitationDetails } from "@/lib/db/schema";
import { acceptInvitationAction } from "@/lib/actions/invitations";
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  LogIn,
  UserPlus,
} from "lucide-react";

export function AcceptInviteCard({
  token,
  details,
}: {
  token: string;
  details: PublicInvitationDetails;
}) {
  const { isSignedIn, isLoaded } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    details.isValid ? null : details.errorReason || "Invalid invitation."
  );
  const [connectedGuruName, setConnectedGuruName] = React.useState<string | null>(null);

  const handleAccept = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await acceptInvitationAction(token);
      if (res.success && res.guruName) {
        setConnectedGuruName(res.guruName);
      } else {
        setErrorMessage(res.error || "Failed to accept invitation.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // State 1: Invalid / Expired / Revoked
  if (!details.isValid) {
    return (
      <Card className="space-y-4 border-[rgba(32,32,29,0.08)] bg-white p-6 text-center shadow-level2 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B33927]/10 text-[#B33927]">
          <AlertCircle className="h-7 w-7 stroke-[1.75]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-[20px] font-bold text-[#20201D]">Invitation Unavailable</h2>
          <p className="text-[14px] leading-relaxed text-[#66635D]">
            {errorMessage || "This invitation link is invalid or has expired."}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 pt-2 sm:flex-row">
          <Link href="/invite">
            <Button variant="secondary" size="default">
              Enter Another Code
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="default">
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // State 2: Acceptance Success
  if (connectedGuruName) {
    return (
      <Card className="animate-in fade-in zoom-in-95 space-y-5 border-[rgba(32,32,29,0.08)] bg-white p-6 text-center shadow-level2 sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3D765B]/10 text-[#3D765B]">
          <CheckCircle2 className="h-9 w-9 stroke-[1.75]" />
        </div>

        <div className="space-y-1.5">
          <span className="font-serif text-[14px] font-medium text-[#D9822B]">
            गुरुशिष्यसम्बन्धः • शुभारम्भः
          </span>
          <h2 className="text-[22px] font-bold text-[#20201D]">Your Journey Begins</h2>
          <p className="text-[14px] text-[#66635D]">You are now connected under the guidance of</p>
          <div className="inline-block rounded-xl border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5] px-4 py-2 text-[15px] font-bold text-[#20201D]">
            {connectedGuruName}
          </div>
        </div>

        <p className="mx-auto max-w-sm text-[13px] text-[#66635D]">
          Your Shishya profile has been activated. You can now record your daily Sadhana and seva.
        </p>

        <div className="pt-2">
          <Link href="/student">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue to Nityasādhanā
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // State 3: Valid Invitation Prompt
  return (
    <Card className="space-y-5 border-[rgba(32,32,29,0.08)] bg-white p-6 shadow-level2 sm:p-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F1E5] text-[#2457A6]">
          <Sparkles className="h-7 w-7 text-[#D9822B]" />
        </div>
        <Badge variant="saffron" size="sm">
          <span className="font-serif text-[11px]">निमन्त्रणम्</span>
        </Badge>
        <h2 className="text-[22px] font-bold tracking-tight text-[#20201D]">
          Nityasādhanā Invitation
        </h2>
        <p className="text-[14px] text-[#66635D]">
          Your Guru has invited you to begin your daily Sādhanā journey.
        </p>
      </div>

      {/* Guru Summary Box */}
      <div className="space-y-2 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/70 p-4 text-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#66635D]">
          Invited By
        </span>
        <div className="text-[16px] font-bold text-[#20201D]">{details.guruName}</div>
        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#66635D]">
          <Calendar className="h-3.5 w-3.5 text-[#D9822B]" />
          <span>
            Valid until{" "}
            {new Date(details.expiresAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-[#B33927]/8 flex items-start gap-2.5 rounded-xl border border-[#B33927]/20 p-3.5 text-[13px] text-[#B33927]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-1">
        {isLoaded && isSignedIn ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleAccept}
            isLoading={isLoading}
            className="w-full"
            rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Accept & Connect
          </Button>
        ) : (
          <div className="space-y-2.5">
            <Link href={`/signup?invitation_token=${encodeURIComponent(token)}`}>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Create Shishya Account
              </Button>
            </Link>

            <Link href={`/login?redirect_url=/invite/${encodeURIComponent(token)}`}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                leftIcon={<LogIn className="h-4 w-4" />}
              >
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-2 text-center">
        <Link href="/" className="text-[13px] text-[#66635D] hover:underline">
          ← Return to Home
        </Link>
      </div>
    </Card>
  );
}
