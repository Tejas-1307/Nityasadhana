"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbGuruFollowUp } from "@/lib/db/schema";
import {
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { addGuruFollowUpAction, toggleFollowUpCompletedAction } from "@/lib/actions/guru";

export interface FollowUpSectionProps {
  shishyaId: string;
  followUps: DbGuruFollowUp[];
  isComposerOpen?: boolean;
  onCloseComposer?: () => void;
  onOpenComposer?: () => void;
}

export function FollowUpSection({
  shishyaId,
  followUps: initialFollowUps,
  isComposerOpen = false,
  onCloseComposer,
  onOpenComposer,
}: FollowUpSectionProps) {
  const [followUps, setFollowUps] = React.useState<DbGuruFollowUp[]>(initialFollowUps);
  const [showLocalComposer, setShowLocalComposer] = React.useState(isComposerOpen);

  // Form state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [note, setNote] = React.useState("");
  const [followUpDate, setFollowUpDate] = React.useState(todayStr);
  const [hasNextDate, setHasNextDate] = React.useState(false);
  const [nextDate, setNextDate] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFollowUps(initialFollowUps);
  }, [initialFollowUps]);

  React.useEffect(() => {
    setShowLocalComposer(isComposerOpen);
  }, [isComposerOpen]);

  const handleClose = () => {
    setShowLocalComposer(false);
    if (onCloseComposer) onCloseComposer();
    setNote("");
    setHasNextDate(false);
    setNextDate("");
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSaving(true);
    setFeedback(null);

    const res = await addGuruFollowUpAction({
      shishyaId,
      note: note.trim(),
      followUpDate,
      nextFollowUpDate: hasNextDate && nextDate ? nextDate : undefined,
    });

    setIsSaving(false);

    if (res.success && res.data?.followUp) {
      setFollowUps([res.data.followUp, ...followUps]);
      setFeedback("Follow-up recorded successfully.");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      setFeedback(res.error || "Failed to record follow-up.");
    }
  };

  const handleToggleComplete = async (followUp: DbGuruFollowUp) => {
    const newCompleted = followUp.status !== "completed";
    const res = await toggleFollowUpCompletedAction({
      shishyaId,
      followUpId: followUp.id,
      completed: newCompleted,
    });

    if (res.success && res.data?.followUp) {
      setFollowUps(
        followUps.map((f) => (f.id === followUp.id ? (res.data?.followUp as DbGuruFollowUp) : f))
      );
    }
  };

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D9822B]/10 text-[#D9822B]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
                Follow-up History ({followUps.length})
              </h2>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowLocalComposer(true);
              if (onOpenComposer) onOpenComposer();
            }}
            className="h-8 text-[12px] font-semibold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            <span>Record Follow-up</span>
          </Button>
        </div>

        {/* Quick Composer Modal / Overlay */}
        {showLocalComposer && (
          <div className="rounded-2xl border border-[#D9822B]/30 bg-[#F7F1E5]/40 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-2.5">
              <span className="text-[13px] font-bold text-[#20201D]">Record Discussion &amp; Follow-up</span>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-[#66635D] hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-3 space-y-3.5">
              {/* Note Content */}
              <div>
                <label className="block text-[12px] font-semibold text-[#66635D]">
                  What did you discuss?
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Discussed wake-up routine, chanting pace, study schedule..."
                  rows={3}
                  required
                  className="mt-1 w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-white p-3 text-[13px] text-[#20201D] placeholder:text-[#66635D]/50 focus:border-[#D9822B] focus:outline-hidden focus:ring-1 focus:ring-[#D9822B]"
                />
              </div>

              {/* Discussion Date Presets */}
              <div>
                <label className="block text-[12px] font-semibold text-[#66635D]">
                  Discussion Date
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFollowUpDate(todayStr)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                      followUpDate === todayStr
                        ? "bg-[#20201D] text-white"
                        : "border border-[rgba(32,32,29,0.08)] bg-white text-[#66635D]"
                    }`}
                  >
                    Today
                  </button>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="rounded-lg border border-[rgba(32,32,29,0.12)] bg-white px-2.5 py-1 text-[12px] text-[#20201D]"
                  />
                </div>
              </div>

              {/* Optional Next Follow-up Date */}
              <div className="border-t border-[rgba(32,32,29,0.06)] pt-2.5">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#66635D]">
                  <input
                    type="checkbox"
                    checked={hasNextDate}
                    onChange={(e) => setHasNextDate(e.target.checked)}
                    className="rounded text-[#D9822B] focus:ring-[#D9822B]"
                  />
                  <span>Schedule next follow-up target date</span>
                </label>

                {hasNextDate && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="rounded-lg border border-[rgba(32,32,29,0.12)] bg-white px-2.5 py-1 text-[12px] text-[#20201D]"
                    />
                  </div>
                )}
              </div>

              {feedback && (
                <p className="text-[12px] font-semibold text-[#3D765B]">{feedback}</p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="text-[12px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSaving || !note.trim()}
                  className="text-[12px] font-semibold"
                >
                  {isSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  <span>Save Record</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Follow-up List */}
        {followUps.length === 0 && !showLocalComposer ? (
          <div className="rounded-2xl border border-dashed border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/30 p-6 text-center">
            <p className="text-[13px] text-[#66635D]">No follow-up records yet.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLocalComposer(true)}
              className="mt-3 text-[12px]"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              <span>Record your first discussion</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {followUps.map((item) => {
              const isCompleted = item.status === "completed";
              const formattedDate = new Date(item.followUpDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3.5 transition-all ${
                    isCompleted
                      ? "border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/20 opacity-80"
                      : "border-[rgba(32,32,29,0.08)] bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-bold text-[#66635D]">
                          {formattedDate}
                        </span>
                        {item.nextFollowUpDate && (
                          <Badge variant="krishna" size="sm">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>Next: {item.nextFollowUpDate}</span>
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="feather" size="sm">
                            <Check className="mr-1 h-3 w-3" />
                            <span>Completed</span>
                          </Badge>
                        )}
                      </div>

                      <p className="text-[13px] leading-relaxed text-[#20201D] whitespace-pre-wrap">
                        {item.note}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleComplete(item)}
                      title={isCompleted ? "Mark as upcoming" : "Mark as completed"}
                      className={`shrink-0 rounded-full p-1.5 transition-colors ${
                        isCompleted
                          ? "bg-[#3D765B]/10 text-[#3D765B] hover:bg-[#3D765B]/20"
                          : "border border-[rgba(32,32,29,0.12)] text-[#66635D] hover:bg-[#F7F1E5]"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
