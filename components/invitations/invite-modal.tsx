"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createInvitationAction } from "@/lib/actions/invitations";
import { GeneratedInvitationResult } from "@/lib/invitations/service";
import {
  UserPlus,
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";

export interface InviteModalProps {
  onInvitationCreated?: () => void;
  triggerText?: string;
  triggerVariant?: "primary" | "secondary" | "outline" | "ghost";
  triggerSize?: "default" | "sm" | "lg";
  triggerClassName?: string;
  iconOnly?: boolean;
}

export function InviteModal({
  onInvitationCreated,
  triggerText = "Invite Shishya",
  triggerVariant = "primary",
  triggerSize = "default",
  triggerClassName,
  iconOnly = false,
}: InviteModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [invitation, setInvitation] = React.useState<GeneratedInvitationResult | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setInvitation(null);
    setError(null);
    setHasCopied(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInvitation(null);
    setError(null);
    setHasCopied(false);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await createInvitationAction();
      if (res.success && res.data) {
        setInvitation(res.data);
        if (onInvitationCreated) onInvitationCreated();
      } else {
        setError(res.error || "Failed to generate invitation.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!invitation) return;
    try {
      await navigator.clipboard.writeText(invitation.inviteUrl);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!invitation) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Nityasādhanā Shishya Invitation",
          text: `Hare Krishna! You have been invited to connect with your Guru on Nityasādhanā. Join using invitation code ${invitation.rawCode}:`,
          url: invitation.inviteUrl,
        });
      } catch {
        // User cancelled share dialog
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        onClick={handleOpen}
        leftIcon={<UserPlus className="h-4 w-4" />}
        className={triggerClassName}
      >
        {!iconOnly && triggerText}
      </Button>

      {isOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm duration-200 sm:items-center sm:p-4">
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[rgba(32,32,29,0.08)] bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#20201D]">
                    {invitation ? "Invitation Ready" : "Invite a Shishya"}
                  </h2>
                  <p className="text-[12px] text-[#66635D]">
                    {invitation ? "Share with your student" : "शिष्यसंयोजनम्"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-[#66635D] transition-colors hover:bg-[#F7F1E5]"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="bg-[#B33927]/8 mb-5 flex items-start gap-2.5 rounded-xl border border-[#B33927]/20 p-3.5 text-[13px] text-[#B33927]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!invitation ? (
              /* State 1: Generation Prompt */
              <div className="space-y-5">
                <p className="text-[14px] leading-relaxed text-[#66635D]">
                  Create a unique, single-use invitation for your Shishya. Once accepted, they will
                  automatically be connected under your guidance with zero manual configuration.
                </p>

                <div className="space-y-2 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#20201D]">
                    <ShieldCheck className="h-4 w-4 text-[#3D765B]" />
                    <span>Cryptographically Protected</span>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-[12px] text-[#66635D]">
                    <li>Single-use bearer token (cannot be reused)</li>
                    <li>Valid for 7 days from generation</li>
                    <li>Can be revoked anytime from your dashboard</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleClose}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGenerate}
                    isLoading={isLoading}
                    className="flex-1"
                    rightIcon={!isLoading ? <Sparkles className="h-4 w-4" /> : undefined}
                  >
                    Generate Invitation
                  </Button>
                </div>
              </div>
            ) : (
              /* State 2: Generated Result */
              <div className="space-y-5">
                <Card className="space-y-3 border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5] p-5 text-center">
                  <span className="text-[12px] font-medium uppercase tracking-wider text-[#66635D]">
                    Invitation Code
                  </span>
                  <div className="font-mono text-[22px] font-bold tracking-widest text-[#20201D] selection:bg-[#2457A6] selection:text-white sm:text-[24px]">
                    {invitation.rawCode}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#66635D]">
                    <Calendar className="h-3.5 w-3.5 text-[#D9822B]" />
                    <span>
                      Expires in 7 days (
                      {new Date(invitation.expiresAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                      )
                    </span>
                  </div>
                </Card>

                <p className="text-center text-[13px] text-[#66635D]">
                  Anyone with this invitation can use it once to join under your guidance.
                </p>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleShare}
                    leftIcon={<Share2 className="h-4 w-4" />}
                    className="w-full"
                  >
                    Share Invitation
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleCopy}
                    leftIcon={
                      hasCopied ? (
                        <Check className="h-4 w-4 text-[#3D765B]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )
                    }
                    className="w-full"
                  >
                    {hasCopied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>

                <div className="pt-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-[#66635D]"
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
