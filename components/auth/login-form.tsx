"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { resolvePostLoginRedirectAction } from "@/lib/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleHint = searchParams.get("role"); // "guru" | "student" (for UI hint / intent only)
  const redirectParam = searchParams.get("redirect_url");
  const errorParam = searchParams.get("error");

  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResolvingRole, setIsResolvingRole] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Surface URL error parameters to devotee cleanly
  React.useEffect(() => {
    if (errorParam === "unauthorized_role") {
      setErrorMessage("Your account role could not be authorized for that section.");
    } else if (errorParam === "account_suspended") {
      setErrorMessage("Your account is currently inactive. Please contact your coordinator.");
    }
  }, [errorParam]);

  // If already signed in and no active error, resolve server-authoritative role and redirect
  React.useEffect(() => {
    if (isSignedIn && !errorParam) {
      let isMounted = true;
      setIsResolvingRole(true);
      resolvePostLoginRedirectAction(redirectParam)
        .then((res) => {
          if (isMounted && res.redirectUrl) {
            router.replace(res.redirectUrl);
          }
        })
        .finally(() => {
          if (isMounted) setIsResolvingRole(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isSignedIn, redirectParam, router, errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setIsResolvingRole(true);
        const res = await resolvePostLoginRedirectAction(redirectParam);
        router.replace(res.redirectUrl);
      } else {
        console.log("[Auth] Additional step required:", result.status);
        const res = await resolvePostLoginRedirectAction(redirectParam);
        router.replace(res.redirectUrl);
      }
    } catch (err: unknown) {
      console.error("[Auth] Login error:", err);
      const clerkError = err as { errors?: Array<{ message?: string; code?: string }> };
      const firstError = clerkError.errors?.[0];

      if (
        firstError?.code === "form_identifier_not_found" ||
        firstError?.code === "form_password_incorrect"
      ) {
        setErrorMessage("Incorrect email or password. Please check and try again.");
      } else if (firstError?.message) {
        setErrorMessage(firstError.message);
      } else {
        setErrorMessage("Unable to sign in. Please verify your connection or try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isResolvingRole) {
    return (
      <Card className="flex min-h-[300px] flex-col items-center justify-center border-[rgba(32,32,29,0.08)] bg-white p-6 text-center shadow-level2 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9822B]/10 text-[#D9822B]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <h3 className="mt-4 text-[16px] font-bold text-[#20201D]">
          Entering Sādhanā Portal...
        </h3>
        <p className="mt-1 text-[13px] text-[#66635D]">
          Verifying your account authorization.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-6 shadow-level2 sm:p-8">
      {/* Role Intent Banner */}
      {roleHint && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#20201D]">
            <Sparkles className="h-4 w-4 text-[#D9822B]" />
            <span>Signing in as {roleHint === "guru" ? "Guru" : "Shishya"}</span>
          </div>
          <Badge variant={roleHint === "guru" ? "saffron" : "krishna"} size="sm">
            <span className="font-serif">{roleHint === "guru" ? "गुरुमार्गः" : "शिष्यमार्गः"}</span>
          </Badge>
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          <div className="mb-1 flex items-center justify-between">
            <Label htmlFor="password" required sanskritHint="कूटशब्दः">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-[#2457A6] hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-2 w-full"
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          Continue to Sādhanā
        </Button>
      </form>

      {/* Footer link to invitation or signup */}
      <div className="mt-6 space-y-2 border-t border-[rgba(32,32,29,0.06)] pt-5 text-center text-[13px] text-[#66635D]">
        <div>
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-[#2457A6] hover:underline">
            Register
          </Link>
        </div>
        <div>
          Received an invitation from your Guru?{" "}
          <Link href="/invite" className="font-semibold text-[#D9822B] hover:underline">
            Accept Invite
          </Link>
        </div>
      </div>
    </Card>
  );
}
