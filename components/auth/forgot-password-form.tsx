"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api/client";

export function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") || "";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/password-reset/request", { email });
      setSuccessMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err: unknown) {
      console.error("[Auth] Password reset error:", err);
      // To prevent account enumeration, show generic guidance
      setSuccessMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetToken || !password || !confirmPassword) {
      setErrorMessage("Please open the password reset link and enter your new password.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/auth/password-reset/confirm", { token: resetToken || code, password });
      router.replace("/login?message=password_reset_success");
    } catch (err: unknown) {
      console.error("[Auth] Reset confirmation error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Invalid or expired reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-level2 sm:p-8">
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

      {/* Success Feedback */}
      {successMessage && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#328A7A]/20 bg-[#328A7A]/10 p-3.5 text-[13px] text-[#328A7A]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {!resetToken ? (
        <form onSubmit={handleSendResetLink} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" required sanskritHint="विद्युत्पत्रम्">
              Registered Email Address
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full"
            isLoading={isLoading}
            rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            Send Password Reset Link
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="password" required sanskritHint="नवीनकूटशब्दः">
              New Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="new-password"
              required
              disabled={isLoading}
              rightIcon={<button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" required>Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={<button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((value) => !value)}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              autoComplete="new-password"
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
            Set New Password & Sign In
          </Button>
        </form>
      )}

      {/* Footer Return Link */}
      <div className="mt-6 border-t border-[rgba(63,148,149,0.12)] pt-5 text-center text-[13px] text-[#547070]">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-[#3F9495] hover:underline">
          Return to Sign In
        </Link>
      </div>
    </Card>
  );
}
