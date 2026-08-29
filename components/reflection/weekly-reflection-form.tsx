"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DbWeeklyReflection, DbWeeklySankalpa, ReflectionState } from "@/lib/db/schema";
import { REFLECTION_STATES } from "@/lib/reflection/service";
import { formatSankalpaRange, getSankalpaWeekBoundaries } from "@/lib/sankalpa/date-utils";
import {
  MessageSquare,
  Sprout,
  HeartHandshake,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { saveWeeklyReflectionAction } from "@/lib/actions/reflection";

export interface WeeklyReflectionFormProps {
  sankalpa?: DbWeeklySankalpa | null;
  existingReflection?: DbWeeklyReflection | null;
  onSuccess: (reflection: DbWeeklyReflection) => void;
  onCancel?: () => void;
}

export function WeeklyReflectionForm({
  sankalpa,
  existingReflection,
  onSuccess,
  onCancel,
}: WeeklyReflectionFormProps) {
  const boundaries = getSankalpaWeekBoundaries();

  const [state, setState] = React.useState<ReflectionState>(
    existingReflection?.state || "steady"
  );
  const [wentWell, setWentWell] = React.useState<string>(
    existingReflection?.wentWell || ""
  );
  const [difficult, setDifficult] = React.useState<string>(
    existingReflection?.difficult || ""
  );
  const [improve, setImprove] = React.useState<string>(
    existingReflection?.improve || ""
  );
  const [guruMessage, setGuruMessage] = React.useState<string>(
    existingReflection?.guruMessage || ""
  );
  const [isGuruMessageOpen, setIsGuruMessageOpen] = React.useState<boolean>(
    Boolean(existingReflection?.guruMessage)
  );

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const weekStartDate = sankalpa?.startDate || existingReflection?.weekStartDate || boundaries.startDate;
  const weekEndDate = sankalpa?.endDate || existingReflection?.weekEndDate || boundaries.endDate;
  const formattedRange = formatSankalpaRange(weekStartDate, weekEndDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await saveWeeklyReflectionAction({
      sankalpaId: sankalpa?.id || existingReflection?.sankalpaId,
      weekStartDate,
      weekEndDate,
      state,
      wentWell: wentWell.trim() || undefined,
      difficult: difficult.trim() || undefined,
      improve: improve.trim() || undefined,
      guruMessage: guruMessage.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.data?.reflection) {
      setSuccessMessage("Reflection saved. Take the next step when you're ready.");
      setTimeout(() => {
        onSuccess(res.data!.reflection);
      }, 700);
    } else {
      setErrorMessage(res.error || "Your reflection could not be saved. Please try again.");
    }
  };

  return (
    <div className="rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-7">
      {/* Editorial Header */}
      <div className="border-b border-[rgba(63,148,149,0.12)] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#328A7A]/10 text-[#328A7A]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#328A7A]">
                Weekly Pause &amp; Reflection
              </span>
              <h2 className="text-[18px] font-bold text-[#193B3B] sm:text-[20px]">
                Reflect on Your Week
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#547070]">{formattedRange}</span>
        </div>

        {/* Linked Sankalpa Context Box (if available) */}
        {sankalpa && (
          <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-[#328A7A]/20 bg-[#328A7A]/5 p-3 text-[12px]">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[#328A7A]" />
              <div>
                <span className="font-bold text-[#193B3B]">{sankalpa.title}</span>
              </div>
            </div>
            {sankalpa.progress && (
              <span className="font-bold text-[#328A7A]">
                {sankalpa.progress.alignedDays} / {sankalpa.progress.totalDays} days
              </span>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* 1. Mood / State Selector (44px min touch target) */}
        <div>
          <label className="block text-[13px] font-bold text-[#193B3B]">
            How was your week?
          </label>
          <p className="text-[11px] text-[#547070]">
            Choose the state that best resonates with your rhythm.
          </p>

          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {REFLECTION_STATES.map((s) => {
              const isSelected = state === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setState(s.key)}
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-[13px] font-bold transition-all ${
                    isSelected
                      ? "border-[#328A7A] bg-[#328A7A]/10 text-[#193B3B] shadow-xs"
                      : "border-[rgba(63,148,149,0.16)] bg-white text-[#547070] hover:bg-[#EAF7F4]/50"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-[16px]">{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. What went well? */}
        <div>
          <label className="block text-[13px] font-bold text-[#193B3B]">
            What went well? <span className="text-[11px] font-normal text-[#547070]">(Optional)</span>
          </label>
          <textarea
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            placeholder="Something you felt good about this week..."
            maxLength={300}
            rows={3}
            className="mt-1.5 w-full rounded-2xl border border-[rgba(63,148,149,0.18)] bg-white p-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/50 focus:border-[#3F9495] focus:outline-hidden focus:ring-1 focus:ring-[#3F9495]"
          />
          <div className="mt-1 flex justify-end text-[10px] text-[#547070]">
            {wentWell.length}/300
          </div>
        </div>

        {/* 3. What was difficult? */}
        <div>
          <label className="block text-[13px] font-bold text-[#193B3B]">
            What was difficult? <span className="text-[11px] font-normal text-[#547070]">(Optional)</span>
          </label>
          <textarea
            value={difficult}
            onChange={(e) => setDifficult(e.target.value)}
            placeholder="Something that was challenging..."
            maxLength={300}
            rows={3}
            className="mt-1.5 w-full rounded-2xl border border-[rgba(63,148,149,0.18)] bg-white p-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/50 focus:border-[#3F9495] focus:outline-hidden focus:ring-1 focus:ring-[#3F9495]"
          />
          <div className="mt-1 flex justify-end text-[10px] text-[#547070]">
            {difficult.length}/300
          </div>
        </div>

        {/* 4. What would you improve? */}
        <div>
          <label className="block text-[13px] font-bold text-[#193B3B]">
            What would you improve next week? <span className="text-[11px] font-normal text-[#547070]">(Optional)</span>
          </label>
          <textarea
            value={improve}
            onChange={(e) => setImprove(e.target.value)}
            placeholder="One thing I would like to work on..."
            maxLength={300}
            rows={3}
            className="mt-1.5 w-full rounded-2xl border border-[rgba(63,148,149,0.18)] bg-white p-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/50 focus:border-[#3F9495] focus:outline-hidden focus:ring-1 focus:ring-[#3F9495]"
          />
          <div className="mt-1 flex justify-end text-[10px] text-[#547070]">
            {improve.length}/300
          </div>
        </div>

        {/* 5. Collapsible Optional Message for Guru */}
        <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-3.5 sm:p-4">
          <button
            type="button"
            onClick={() => setIsGuruMessageOpen(!isGuruMessageOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-[#A9824D]" />
              <div>
                <span className="text-[13px] font-bold text-[#193B3B]">
                  Message for Guru
                </span>
                <span className="ml-2 text-[11px] font-normal text-[#547070]">
                  (Optional · Visible to your Guru)
                </span>
              </div>
            </div>
            {isGuruMessageOpen ? (
              <ChevronUp className="h-4 w-4 text-[#547070]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#547070]" />
            )}
          </button>

          {isGuruMessageOpen && (
            <div className="mt-3">
              <textarea
                value={guruMessage}
                onChange={(e) => setGuruMessage(e.target.value)}
                placeholder="Anything you'd like your Guru to know or seek guidance on..."
                maxLength={300}
                rows={3}
                className="w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-white p-3 text-[13px] text-[#193B3B] placeholder:text-[#547070]/50 focus:border-[#A9824D] focus:outline-hidden focus:ring-1 focus:ring-[#A9824D]"
              />
              <div className="mt-1 flex justify-end text-[10px] text-[#547070]">
                {guruMessage.length}/300
              </div>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <p className="text-[12px] font-semibold text-[#C53030]">{errorMessage}</p>
        )}

        {successMessage && (
          <div className="flex items-center gap-1.5 rounded-xl bg-[#328A7A]/10 p-3 text-[12px] font-bold text-[#328A7A]">
            <Check className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-[rgba(63,148,149,0.12)] pt-4">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-[12px]"
            >
              Skip for now
            </Button>
          ) : (
            <span />
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="text-[12px] font-semibold"
          >
            {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            <span>Save Reflection</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
