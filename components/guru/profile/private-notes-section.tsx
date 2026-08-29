"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DbGuruPrivateNote } from "@/lib/db/schema";
import { Lock, Plus, Trash2, X, Loader2 } from "lucide-react";
import { addGuruPrivateNoteAction, deleteGuruPrivateNoteAction } from "@/lib/actions/guru";

export interface PrivateNotesSectionProps {
  shishyaId: string;
  privateNotes: DbGuruPrivateNote[];
  isComposerOpen?: boolean;
  onCloseComposer?: () => void;
  onOpenComposer?: () => void;
}

export function PrivateNotesSection({
  shishyaId,
  privateNotes: initialNotes,
  isComposerOpen = false,
  onCloseComposer,
  onOpenComposer,
}: PrivateNotesSectionProps) {
  const [notes, setNotes] = React.useState<DbGuruPrivateNote[]>(initialNotes);
  const [showLocalComposer, setShowLocalComposer] = React.useState(isComposerOpen);
  const [content, setContent] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  React.useEffect(() => {
    setShowLocalComposer(isComposerOpen);
  }, [isComposerOpen]);

  const handleClose = () => {
    setShowLocalComposer(false);
    if (onCloseComposer) onCloseComposer();
    setContent("");
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    setFeedback(null);

    const res = await addGuruPrivateNoteAction({
      shishyaId,
      content: content.trim(),
    });

    setIsSaving(false);

    if (res.success && res.data?.note) {
      setNotes([res.data.note, ...notes]);
      setFeedback("Private note saved.");
      setTimeout(() => {
        handleClose();
      }, 1000);
    } else {
      setFeedback(res.error || "Failed to save private note.");
    }
  };

  const handleDelete = async (noteId: string) => {
    const res = await deleteGuruPrivateNoteAction({
      shishyaId,
      noteId,
    });

    if (res.success) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }
  };

  return (
    <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F9495]/10 text-[#3F9495]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#193B3B] sm:text-[17px]">
                Private Guru Notes
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[11px] font-medium text-[#547070] sm:inline-flex">
              <Lock className="h-3 w-3" /> Private to you
            </span>
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
              <span>Add Note</span>
            </Button>
          </div>
        </div>

        {/* Quick Note Composer */}
        {showLocalComposer && (
          <div className="rounded-2xl border border-[#3F9495]/30 bg-[#F7F5EF]/80 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
              <span className="text-[13px] font-bold text-[#193B3B]">
                New Private Note
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-[#547070] hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-3 space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#547070]">
                  What would you like to remember?
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Personal observations, devotional guidance topics, health notes..."
                  rows={3}
                  required
                  className="mt-1 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-white p-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/50 focus:border-[#3F9495] focus:outline-hidden focus:ring-1 focus:ring-[#3F9495]"
                />
              </div>

              {feedback && (
                <p className="text-[12px] font-semibold text-[#328A7A]">{feedback}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#547070]">
                  🔒 Visible only to you as Guru
                </span>
                <div className="flex items-center gap-2">
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
                    disabled={isSaving || !content.trim()}
                    className="text-[12px] font-semibold"
                  >
                    {isSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    <span>Save Note</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        {notes.length === 0 && !showLocalComposer ? (
          <div className="rounded-2xl border border-dashed border-[rgba(63,148,149,0.2)] bg-[#F7F5EF]/60 p-6 text-center">
            <p className="text-[13px] text-[#547070]">No private notes yet.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLocalComposer(true)}
              className="mt-3 text-[12px]"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              <span>Add your first private note</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notes.map((note) => {
              const formattedDate = new Date(note.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={note.id}
                  className="group rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#547070]">
                        {formattedDate}
                      </span>
                      <p className="text-[13px] leading-relaxed text-[#193B3B] whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                      className="rounded-full p-1 text-[#547070]/40 opacity-0 transition-all hover:bg-[#EAF7F4] hover:text-[#C53030] group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
