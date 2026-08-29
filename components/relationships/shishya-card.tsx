"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DbUser, DbGuruShishyaRelationship } from "@/lib/db/schema";
import { endMentorshipAction } from "@/lib/actions/relationships";
import {
  MoreVertical,
  Calendar,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  X,
  UserX,
  Shield,
} from "lucide-react";

export interface ShishyaCardProps {
  relationship: DbGuruShishyaRelationship;
  shishya: DbUser;
  onMentorshipEnded?: () => void;
}

export function ShishyaCard({
  relationship,
  shishya,
  onMentorshipEnded,
}: ShishyaCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Format connection date
  const connectedDate = new Date(relationship.createdAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Close menu on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle End Mentorship
  const handleEndMentorship = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await endMentorshipAction(shishya.id);
      if (!result.success) {
        setErrorMessage(result.error || "Could not end mentorship. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsDialogOpen(false);
      setIsMenuOpen(false);
      if (onMentorshipEnded) {
        onMentorshipEnded();
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        id={`shishya-card-${shishya.id}`}
        className="relative flex flex-col justify-between gap-3 border-[rgba(63,148,149,0.16)] bg-white p-4.5 shadow-level1 transition-all duration-200 hover:shadow-level2 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Avatar & Devotee Identity */}
          <div className="flex items-start gap-3.5">
            <Avatar name={shishya.name} size="lg" className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-[15px] font-bold text-[#193B3B] sm:text-[16px]">
                  {shishya.spiritualName || shishya.name}
                </span>
                <Badge variant="krishna" size="sm">
                  <span className="font-serif text-[10px]">शिष्यः</span>
                </Badge>
              </div>

              {shishya.spiritualName && (
                <div className="truncate text-[13px] text-[#547070]">{shishya.name}</div>
              )}

              {/* Status & Connection Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#547070]">
                <div className="flex items-center gap-1.5 font-medium text-[#328A7A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Active Shishya</span>
                </div>
                <span className="text-[rgba(63,148,149,0.25)]">•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#547070]" />
                  <span>Connected {connectedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Menu Trigger Button (≥44px Touch Target) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              id={`shishya-menu-trigger-${shishya.id}`}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={`Actions for ${shishya.spiritualName || shishya.name}`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-[#547070] transition-colors hover:bg-[#EAF7F4] hover:text-[#193B3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-[rgba(63,148,149,0.16)] bg-white p-1.5 shadow-level3 animate-in fade-in zoom-in-95"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDialogOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#8A6635] transition-colors hover:bg-[#EAF7F4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A9824D]"
                >
                  <UserX className="h-4 w-4" />
                  <span>End Mentorship</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Respectful "End Mentorship" Confirmation Modal */}
      {isDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="end-mentorship-title"
          aria-describedby="end-mentorship-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-level4 animate-in zoom-in-95 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#A9824D]/10 text-[#A9824D]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => !isLoading && setIsDialogOpen(false)}
                disabled={isLoading}
                aria-label="Close dialog"
                className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#547070] transition-colors hover:bg-[#EAF7F4] hover:text-[#193B3B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Title & Description */}
            <div className="mt-4 space-y-2">
              <h3 id="end-mentorship-title" className="text-[19px] font-bold text-[#193B3B]">
                End Mentorship with {shishya.spiritualName || shishya.name}?
              </h3>
              <p
                id="end-mentorship-desc"
                className="text-[14px] leading-relaxed text-[#547070]"
              >
                This will end the active Guru–Shishya connection. The devotee&apos;s account,
                daily records, and spiritual history will remain completely safe. They will no
                longer be actively connected to you.
              </p>
            </div>

            {/* Privacy & Retention Assurance */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3 text-[12px] text-[#547070]">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#328A7A]" />
              <span>
                Historical records are preserved. Deactivation does not delete the devotee&apos;s
                account.
              </span>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#B33927]/10 p-3 text-[13px] text-[#B33927]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons (Touch Target ≥ 44px) */}
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                size="default"
                disabled={isLoading}
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="saffron"
                size="default"
                isLoading={isLoading}
                onClick={handleEndMentorship}
                className="w-full sm:w-auto"
              >
                End Mentorship
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
