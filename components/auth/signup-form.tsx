"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { resolvePostLoginRedirectAction } from "@/lib/actions/auth";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitation_token");

  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password || !firstName) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Trigger email verification code from Clerk
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      console.error("[Auth] Signup error:", err);
      const clerkError = err as { errors?: Array<{ message?: string }> };
      setErrorMessage(
        clerkError.errors?.[0]?.message || "Unable to create account. Please check your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code) {
      setErrorMessage("Please enter the verification code sent to your email.");
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        // If an invitation token was attached, return to the invitation acceptance page
        if (invitationToken) {
          router.replace(`/invite/${encodeURIComponent(invitationToken)}`);
        } else {
          const res = await resolvePostLoginRedirectAction();
          router.replace(res.redirectUrl);
        }
      } else {
        console.log("[Auth] Additional step needed:", completeSignUp.status);
        if (invitationToken) {
          router.replace(`/invite/${encodeURIComponent(invitationToken)}`);
        } else {
          const res = await resolvePostLoginRedirectAction();
          router.replace(res.redirectUrl);
        }
      }
    } catch (err: unknown) {
      console.error("[Auth] Verification error:", err);
      const clerkError = err as { errors?: Array<{ message?: string }> };
      setErrorMessage(
        clerkError.errors?.[0]?.message || "Invalid verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-6 shadow-level2 sm:p-8">
      {/* Error Feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="bg-[#B33927]/8 mb-5 flex items-start gap-2.5 rounded-xl border border-[#B33927]/20 p-3.5 text-[13px] text-[#B33927]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!pendingVerification ? (
        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName" required sanskritHint="नाम">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="e.g. Radhanath"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="lastName" sanskritHint="उपनाम">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="e.g. Das"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" required sanskritHint="विद्युत्पत्रम्">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="devotee@iskconpune.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password" required sanskritHint="कूटशब्दः">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-[12px] text-[#66635D]">Must be at least 8 characters long.</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full"
            isLoading={isLoading}
            rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Create Sādhanā Account
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#3D765B]/10 text-[#3D765B]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-[17px] font-bold text-[#20201D]">Verify your email</h3>
            <p className="mt-1 text-[13px] text-[#66635D]">
              We have sent a verification code to{" "}
              <span className="font-semibold text-[#20201D]">{email}</span>.
            </p>
          </div>

          <div>
            <Label htmlFor="code" required sanskritHint="सत्यापनसङ्केतः">
              Verification Code
            </Label>
            <Input
              id="code"
              placeholder="e.g. 123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              leftIcon={<KeyRound className="h-4 w-4" />}
              className="text-center font-mono text-[18px] tracking-widest"
              autoComplete="one-time-code"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Verify & Activate Account
          </Button>
        </form>
      )}

      {/* Footer link to sign in */}
      <div className="mt-6 border-t border-[rgba(32,32,29,0.06)] pt-5 text-center text-[13px] text-[#66635D]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2457A6] hover:underline">
          Sign In
        </Link>
      </div>
    </Card>
  );
}
