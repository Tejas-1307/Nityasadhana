"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DbWeeklySankalpa } from "@/lib/db/schema";
import { formatSankalpaRange } from "@/lib/sankalpa/date-utils";
import { MessageSquare, X, Loader2, Sparkles } from "lucide-react";
import { saveSankalpaReflectionAction } from "@/lib/actions/sankalpa";

export interface SankalpaReflectionModalProps {
  sankalpa: DbWeeklySankalpa | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: DbWeeklySankalpa) => void;
}

export function SankalpaReflectionModal({
  sankalpa,
  isOpen,
  onClose,
  onSuccess,
}: SankalpaReflectionModalProps) {
  const [content, setContent] = React.useState("");
  const [whatHelped, setWhatHelped] = React.useState("");
  const [whatDifficult, setWhatDifficult] = React.useState("");
  const [whatContinue, setWhatContinue] = React.useState("");
  const [showPrompts, setShowPrompts] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  if (!isOpen || !sankalpa) return null;

  const formattedRange = formatSankalpaRange(sankalpa.startDate, sankalpa.endDate);
  const alignedDays = sankalpa.progress?.alignedDays || 0;
  const totalDays = sankalpa.progress?.totalDays || 7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage("Please write a short reflection on your experience.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await saveSankalpaReflectionAction({
      sankalpaId: sankalpa.id,
      content: content.trim(),
      whatHelped: whatHelped.trim() || undefined,
      whatDifficult: whatDifficult.trim() || undefined,
      whatContinue: whatContinue.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.data?.sankalpa) {
      onSuccess(res.data.sankalpa);
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to save reflection.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3D765B]/10 text-[#3D765B]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h2 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
              End of Week Reflection
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#66635D] hover:bg-[#F7F1E5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sankalpa Context Box */}
        <div className="mt-4 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
              {formattedRange}
            </span>
            <span className="text-[12px] font-bold text-[#20201D]">
              {alignedDays} / {totalDays} days aligned
            </span>
          </div>
          <h3 className="mt-1 text-[15px] font-bold text-[#20201D]">{sankalpa.title}</h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Main Reflection Box */}
          <div>
            <label className="block text-[12px] font-semibold text-[#66635D]">
              How was your experience with this focus?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you notice about your rhythm and practice this week?"
              rows={3}
              required
              className="mt-1.5 w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-white p-3 text-[13px] text-[#20201D] placeholder:text-[#66635D]/50 focus:border-[#3D765B] focus:outline-hidden focus:ring-1 focus:ring-[#3D765B]"
            />
          </div>

          {/* Optional Prompts Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowPrompts(!showPrompts)}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#2457A6] hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{showPrompts ? "Hide optional questions" : "Answer optional guiding questions"}</span>
            </button>

            {showPrompts && (
              <div className="mt-2.5 space-y-2.5 rounded-2xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/20 p-3 text-[12px]">
                <div>
                  <label className="block font-medium text-[#66635D]">
                    What helped you stay consistent?
                  </label>
                  <input
                    type="text"
                    value={whatHelped}
                    onChange={(e) => setWhatHelped(e.target.value)}
                    placeholder="E.g. Sleeping before 10 PM..."
                    className="mt-1 w-full rounded-lg border border-[rgba(32,32,29,0.1)] bg-white px-2.5 py-1.5 text-[12px] text-[#20201D]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#66635D]">
                    What made it difficult?
                  </label>
                  <input
                    type="text"
                    value={whatDifficult}
                    onChange={(e) => setWhatDifficult(e.target.value)}
                    placeholder="E.g. Travel, late study schedule..."
                    className="mt-1 w-full rounded-lg border border-[rgba(32,32,29,0.1)] bg-white px-2.5 py-1.5 text-[12px] text-[#20201D]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#66635D]">
                    What would you like to continue next week?
                  </label>
                  <input
                    type="text"
                    value={whatContinue}
                    onChange={(e) => setWhatContinue(e.target.value)}
                    placeholder="E.g. Keep waking at 03:30 AM..."
                    className="mt-1 w-full rounded-lg border border-[rgba(32,32,29,0.1)] bg-white px-2.5 py-1.5 text-[12px] text-[#20201D]"
                  />
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <p className="text-[12px] font-semibold text-[#C53030]">{errorMessage}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-[rgba(32,32,29,0.06)] pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-[12px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="text-[12px] font-semibold"
            >
              {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              <span>Complete &amp; Save Reflection</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
