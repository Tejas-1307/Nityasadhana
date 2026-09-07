"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { register } from "@/lib/auth/client";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get("invitation_token");
  const roleParam = searchParams.get("role");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!firstName || !email || !password) return setErrorMessage("Please complete all required fields.");
    if (password.length < 8) return setErrorMessage("Password must be at least 8 characters long.");
    if (password !== confirmPassword) return setErrorMessage("Passwords do not match.");
    setIsLoading(true);
    try {
      const user = await register({ name: `${firstName} ${lastName}`.trim(), email, password, role: roleParam === "guru" && !invitationToken ? "guru" : "shishya" });
      if (invitationToken) router.replace(`/invite/${encodeURIComponent(invitationToken)}`);
      else router.replace(user.role === "guru" ? "/guru" : "/student");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-level2 sm:p-8">
      {roleParam && <div className="mb-5 flex items-center justify-between rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF] p-3"><div className="flex items-center gap-2 text-[13px] font-medium text-[#193B3B]"><Sparkles className="h-4 w-4 text-[#A9824D]" /><span>Signing up as {roleParam === "guru" ? "Guru" : "Shishya"}</span></div><Badge variant={roleParam === "guru" ? "saffron" : "krishna"} size="sm"><span className="font-serif">{roleParam === "guru" ? "गुरुमार्गः" : "शिष्यमार्गः"}</span></Badge></div>}
      {errorMessage && <div role="alert" className="bg-[#B33927]/8 mb-5 flex items-start gap-2.5 rounded-xl border border-[#B33927]/20 p-3.5 text-[13px] text-[#B33927]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{errorMessage}</span></div>}
      <form onSubmit={handleSignup} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div><Label htmlFor="firstName" required>First Name</Label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} leftIcon={<User className="h-4 w-4" />} required disabled={isLoading} /></div><div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} /></div></div>
        <div><Label htmlFor="email" required>Email Address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="h-4 w-4" />} autoComplete="email" required disabled={isLoading} /></div>
        <div><Label htmlFor="password" required>Password</Label><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="h-4 w-4" />} rightIcon={<button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} autoComplete="new-password" required disabled={isLoading} /><p className="mt-1 text-[12px] text-[#547070]">Must be at least 8 characters long.</p></div>
        <div><Label htmlFor="confirmPassword" required>Confirm Password</Label><Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} leftIcon={<Lock className="h-4 w-4" />} rightIcon={<button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((value) => !value)}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} autoComplete="new-password" required disabled={isLoading} /></div>
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>Create Account</Button>
      </form>
    </Card>
  );
}
