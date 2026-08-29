"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import {
  saveReportDraftAction,
  submitDailyReportAction,
} from "@/lib/actions/reports";
import {
  calculateSleepDuration,
  calculateTotalRounds,
  calculateTotalStudy,
  formatDuration,
} from "@/lib/reports/calculations";
import { REPORT_CONFIG } from "@/lib/reports/config";
import { QuickDurationPicker } from "./quick-duration-picker";
import { NumberStepper } from "./number-stepper";
import { ReportProgressBar } from "./report-progress-bar";
import { ReportReviewCard } from "./report-review-card";
import {
  saveLocalDraft,
  clearLocalDraft,
  SyncState,
  getSyncStatusMeta,
} from "@/lib/reports/offline";
import {
  Moon,
  CircleDot,
  BookOpen,
  GraduationCap,
  Sparkles,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Check,
  Zap,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Info,
} from "lucide-react";

export interface ReportFormProps {
  initialReport?: DbDailySadhanaReport | null;
  previousReport?: DbDailySadhanaReport | null;
  practiceDate: string;
  isEditable?: boolean;
  onSuccess?: (report: DbDailySadhanaReport) => void;
}

export function ReportForm({
  initialReport,
  previousReport,
  practiceDate,
  isEditable = true,
  onSuccess,
}: ReportFormProps) {
  const router = useRouter();

  // Step state: "form" | "review"
  const [step, setStep] = React.useState<"form" | "review">("form");

  // Form State (initialized from initialReport, or smart defaults)
  const [sleepTime, setSleepTime] = React.useState<string>(
    initialReport?.sleepTime || previousReport?.sleepTime || "20:45"
  );
  const [wakeUpTime, setWakeUpTime] = React.useState<string>(
    initialReport?.wakeUpTime || previousReport?.wakeUpTime || "03:20"
  );
  const [japaRounds, setJapaRounds] = React.useState<number>(
    initialReport?.japaRounds !== undefined
      ? initialReport.japaRounds
      : previousReport?.japaRounds !== undefined
        ? previousReport.japaRounds
        : 16
  );
  const [extraRounds, setExtraRounds] = React.useState<number>(
    initialReport?.extraRounds !== undefined
      ? initialReport.extraRounds
      : previousReport?.extraRounds !== undefined
        ? previousReport.extraRounds
        : 0
  );
  const [japaCompletedAt, setJapaCompletedAt] = React.useState<string>(
    initialReport?.japaCompletedAt || ""
  );
  const [readingDuration, setReadingDuration] = React.useState<number>(
    initialReport?.readingDurationMinutes !== undefined
      ? initialReport.readingDurationMinutes
      : previousReport?.readingDurationMinutes || 30
  );
  const [readingNote, setReadingNote] = React.useState<string>(
    initialReport?.readingNote || ""
  );
  const [hearingDuration, setHearingDuration] = React.useState<number>(
    initialReport?.hearingDurationMinutes !== undefined
      ? initialReport.hearingDurationMinutes
      : previousReport?.hearingDurationMinutes || 60
  );
  const [hearingNote, setHearingNote] = React.useState<string>(
    initialReport?.hearingNote || ""
  );
  const [collegeStudyMinutes, setCollegeStudyMinutes] = React.useState<number>(
    initialReport?.collegeStudyDurationMinutes !== undefined
      ? initialReport.collegeStudyDurationMinutes
      : previousReport?.collegeStudyDurationMinutes !== undefined
        ? previousReport.collegeStudyDurationMinutes
        : 360
  );
  const [selfStudyMinutes, setSelfStudyMinutes] = React.useState<number>(
    initialReport?.selfStudyDurationMinutes !== undefined
      ? initialReport.selfStudyDurationMinutes
      : previousReport?.selfStudyDurationMinutes !== undefined
        ? previousReport.selfStudyDurationMinutes
        : 120
  );
  const [dayRestMinutes, setDayRestMinutes] = React.useState<number>(
    initialReport?.dayRestDurationMinutes !== undefined
      ? initialReport.dayRestDurationMinutes
      : 0
  );
  const [timeWastedMinutes, setTimeWastedMinutes] = React.useState<number>(
    initialReport?.timeWastedDurationMinutes !== undefined
      ? initialReport.timeWastedDurationMinutes
      : 0
  );
  const [notes, setNotes] = React.useState<string>(initialReport?.notes || "");

  const [_quickSelectionsCount, setQuickSelectionsCount] = React.useState<number>(0);

  // Sync & Offline State
  const [syncState, setSyncState] = React.useState<SyncState>(
    initialReport?.status === "submitted" ? "synced" : "saved"
  );
  const [yesterdaySummary, setYesterdaySummary] = React.useState<string | null>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isDraftSaving, setIsDraftSaving] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Network listener
  React.useEffect(() => {
    const handleOnline = () => {
      setSyncState((prev) => (prev === "offline" ? "saved" : prev));
    };
    const handleOffline = () => {
      setSyncState("offline");
    };

    if (typeof window !== "undefined") {
      if (!navigator.onLine) setSyncState("offline");
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  const getPayload = React.useCallback(() => ({
    practiceDate,
    sleepTime,
    wakeUpTime,
    japaRounds: Number(japaRounds) || 0,
    extraRounds: Number(extraRounds) || 0,
    japaCompletedAt: japaCompletedAt.trim() || undefined,
    readingDurationMinutes: Number(readingDuration) || 0,
    readingNote: readingNote.trim() || undefined,
    hearingDurationMinutes: Number(hearingDuration) || 0,
    hearingNote: hearingNote.trim() || undefined,
    collegeStudyDurationMinutes: Number(collegeStudyMinutes) || 0,
    selfStudyDurationMinutes: Number(selfStudyMinutes) || 0,
    dayRestDurationMinutes: Number(dayRestMinutes) || 0,
    timeWastedDurationMinutes: Number(timeWastedMinutes) || 0,
    notes: notes.trim() || undefined,
  }), [
    practiceDate,
    sleepTime,
    wakeUpTime,
    japaRounds,
    extraRounds,
    japaCompletedAt,
    readingDuration,
    readingNote,
    hearingDuration,
    hearingNote,
    collegeStudyMinutes,
    selfStudyMinutes,
    dayRestMinutes,
    timeWastedMinutes,
    notes,
  ]);

  // Auto-save local draft on changes
  React.useEffect(() => {
    if (isEditable && (!initialReport || initialReport.status === "draft")) {
      saveLocalDraft(practiceDate, getPayload());
      setSyncState((prev) => (prev === "offline" ? "offline" : "saved"));
    }
  }, [practiceDate, getPayload, isEditable, initialReport]);

  // Real-time calculations
  const sleepDuration = calculateSleepDuration(sleepTime, wakeUpTime);
  const totalRounds = calculateTotalRounds(japaRounds, extraRounds);
  const totalStudy = calculateTotalStudy(collegeStudyMinutes, selfStudyMinutes);

  const isSubmitted = initialReport?.status === "submitted";

  // Compute 5 required sections completion
  const completedSections = React.useMemo(() => {
    let count = 0;
    if (sleepTime && wakeUpTime) count++;
    if (japaRounds !== undefined && japaRounds >= 0) count++;
    if (readingDuration !== undefined || hearingDuration !== undefined) count++;
    if (collegeStudyMinutes !== undefined || selfStudyMinutes !== undefined) count++;
    if (dayRestMinutes !== undefined && timeWastedMinutes !== undefined) count++;
    return count;
  }, [
    sleepTime,
    wakeUpTime,
    japaRounds,
    readingDuration,
    hearingDuration,
    collegeStudyMinutes,
    selfStudyMinutes,
    dayRestMinutes,
    timeWastedMinutes,
  ]);

  // Enhanced "Fill from yesterday" action
  const handleFillFromYesterday = () => {
    if (!previousReport) return;
    setSleepTime(previousReport.sleepTime);
    setWakeUpTime(previousReport.wakeUpTime);
    setJapaRounds(previousReport.japaRounds);
    setExtraRounds(previousReport.extraRounds || 0);
    setJapaCompletedAt(previousReport.japaCompletedAt || "");
    setReadingDuration(previousReport.readingDurationMinutes || 0);
    setHearingDuration(previousReport.hearingDurationMinutes || 0);
    setCollegeStudyMinutes(previousReport.collegeStudyDurationMinutes || 0);
    setSelfStudyMinutes(previousReport.selfStudyDurationMinutes || 0);
    setDayRestMinutes(previousReport.dayRestDurationMinutes || 0);
    // Safety rule: Time wasted and Reflections are NEVER copied automatically
    setTimeWastedMinutes(0);
    
    setQuickSelectionsCount((prev) => prev + 1);
    setYesterdaySummary(
      `Yesterday's routine loaded: Sleep (${previousReport.sleepTime} → ${previousReport.wakeUpTime}), Japa (${previousReport.japaRounds} rds), Reading (${previousReport.readingDurationMinutes || 0}m), Hearing (${previousReport.hearingDurationMinutes || 0}m), Study (${(previousReport.collegeStudyDurationMinutes || 0) + (previousReport.selfStudyDurationMinutes || 0)}m). Personal reflections and unused time were excluded.`
    );
  };

  const handleSaveDraft = async () => {
    if (isDraftSaving || isSubmitting || !isEditable) return;
    setIsDraftSaving(true);
    setSyncState("saving");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await saveReportDraftAction(getPayload());
      if (res.success && res.data?.report) {
        setSuccessMessage("Draft saved to server.");
        setSyncState("synced");
        onSuccess?.(res.data.report);
        router.refresh();
      } else {
        setSyncState("failed_sync");
        setErrorMessage(res.error || "Failed to save draft to server. Saved locally.");
      }
    } catch {
      setSyncState("failed_sync");
      setErrorMessage("Network error. Saved locally on this device.");
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting || isDraftSaving || !isEditable) return;

    setIsSubmitting(true);
    setSyncState("saving");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await submitDailyReportAction(getPayload());
      if (res.success && res.data?.report) {
        clearLocalDraft(practiceDate);
        setSyncState("synced");
        setSuccessMessage("Your Sādhanā for today is recorded. 🙏");
        onSuccess?.(res.data.report);
        router.refresh();
      } else {
        setSyncState("failed_sync");
        setErrorMessage(res.error || "Failed to submit report.");
        setStep("form"); // return to form if submission error
      }
    } catch {
      setSyncState("failed_sync");
      setErrorMessage("Network error. Your draft is preserved locally. Please check your connection and resubmit.");
      setStep("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // STEP 2: COMPACT CONFIRMATION REVIEW VIEW
  // -------------------------------------------------------------------------
  if (step === "review") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep("form")}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3F9495] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Edit Form</span>
          </button>
          <Badge variant="krishna" size="sm">
            <span>Ready for Submission</span>
          </Badge>
        </div>

        {/* Compact Review Card */}
        <ReportReviewCard
          practiceDate={practiceDate}
          sleepTime={sleepTime}
          wakeUpTime={wakeUpTime}
          japaRounds={japaRounds}
          extraRounds={extraRounds}
          japaCompletedAt={japaCompletedAt}
          readingDurationMinutes={readingDuration}
          readingNote={readingNote}
          hearingDurationMinutes={hearingDuration}
          hearingNote={hearingNote}
          collegeStudyDurationMinutes={collegeStudyMinutes}
          selfStudyDurationMinutes={selfStudyMinutes}
          dayRestDurationMinutes={dayRestMinutes}
          timeWastedDurationMinutes={timeWastedMinutes}
          notes={notes}
          status="submitted"
          className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level2 sm:p-6"
        />

        {/* Final Confirmation Buttons */}
        <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#EAF7F4]/95 p-4 shadow-level2">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              size="default"
              disabled={isSubmitting}
              onClick={() => setStep("form")}
              leftIcon={<Edit3 className="h-4 w-4" />}
              className="w-full text-[14px] sm:w-auto"
            >
              Make Changes
            </Button>

            <Button
              type="button"
              variant="primary"
              size="default"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              leftIcon={<Check className="h-4 w-4" />}
              className="w-full text-[15px] font-bold shadow-md sm:w-auto"
            >
              {isSubmitting
                ? "Recording..."
                : isSubmitted
                  ? "Update Today's Sādhanā"
                  : "Submit Today's Sādhanā"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // STEP 1: FAST INPUT FORM
  // -------------------------------------------------------------------------
  return (
    <form onSubmit={(e) => { e.preventDefault(); setStep("review"); }} className="space-y-5">
      {/* Read-only warning if outside edit window */}
      {!isEditable && (
        <div className="flex items-center gap-2 rounded-xl border border-[rgba(63,148,149,0.16)] bg-amber-50 p-4 text-[13px] text-amber-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
          <span>
            This report is outside the allowed {REPORT_CONFIG.REPORT_EDIT_WINDOW_DAYS}-day edit window
            and cannot be modified.
          </span>
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-[13px] font-medium text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Progress & Sync Status Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#193B3B]">
            Sādhanā Sections ({completedSections}/5 completed)
          </span>
          {(() => {
            const meta = getSyncStatusMeta(syncState);
            return (
              <Badge variant={meta.variant} size="sm" className={meta.colorClass}>
                <span>{meta.label}</span>
              </Badge>
            );
          })()}
        </div>
        <ReportProgressBar completedSections={completedSections} />
      </div>

      {/* FAST PATH HELPER: "Fill from yesterday" */}
      {previousReport && isEditable && (!initialReport || initialReport.status === "draft") && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1">
            <div className="flex items-center gap-2.5 text-[13px] text-[#193B3B]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#A9824D]/10 text-[#A9824D]">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold">Fast Path</div>
                <div className="text-[11px] text-[#547070]">Routine similar to yesterday?</div>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFillFromYesterday}
              className="text-[12px] font-semibold"
            >
              ⚡ Fill from yesterday
            </Button>
          </div>

          {/* Yesterday Loaded Detail Summary */}
          {yesterdaySummary && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[rgba(63,148,149,0.22)] bg-[#3F9495]/8 p-3 text-[12px] text-[#3F9495]">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 leading-relaxed">
                {yesterdaySummary}
              </div>
              <button
                type="button"
                onClick={() => setYesterdaySummary(null)}
                className="shrink-0 text-[11px] font-bold uppercase hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 1: SLEEP & WAKE */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3F9495]/12 text-[#3F9495]">
              <Moon className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">1. Sleep & Wake</h3>
          </div>
          {sleepTime && wakeUpTime && (
            <Badge variant="krishna" size="sm">
              <span>{formatDuration(sleepDuration)}</span>
            </Badge>
          )}
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="sleepTime"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#547070]"
            >
              Slept at
            </label>
            <input
              id="sleepTime"
              type="time"
              disabled={!isEditable}
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-2.5 text-[14px] font-bold text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label
              htmlFor="wakeUpTime"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#547070]"
            >
              Woke up at
            </label>
            <input
              id="wakeUpTime"
              type="time"
              disabled={!isEditable}
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-2.5 text-[14px] font-bold text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
              required
            />
          </div>
        </div>
      </Card>

      {/* SECTION 2: JAPA */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A9824D]/12 text-[#A9824D]">
              <CircleDot className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">2. Japa Meditation</h3>
          </div>
          <Badge variant="saffron" size="sm">
            <span>{totalRounds} rounds</span>
          </Badge>
        </div>

        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberStepper
            id="japaRounds"
            label="Standard Rounds"
            value={japaRounds}
            onChange={(val) => setJapaRounds(val)}
            min={0}
            max={REPORT_CONFIG.MAX_JAPA_ROUNDS}
            disabled={!isEditable}
            suggestedValue={previousReport?.japaRounds}
          />

          <NumberStepper
            id="extraRounds"
            label="Extra Rounds"
            value={extraRounds}
            onChange={(val) => setExtraRounds(val)}
            min={0}
            max={REPORT_CONFIG.MAX_EXTRA_ROUNDS}
            disabled={!isEditable}
            suggestedValue={previousReport?.extraRounds}
          />

          <div>
            <label
              htmlFor="japaCompletedAt"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#547070]"
            >
              Completed At <span className="text-[10px] lowercase text-[#547070]">(optional)</span>
            </label>
            <input
              id="japaCompletedAt"
              type="time"
              disabled={!isEditable}
              value={japaCompletedAt}
              onChange={(e) => setJapaCompletedAt(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-2.5 text-[14px] font-medium text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 3: READING & HEARING */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#328A7A]/12 text-[#328A7A]">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">3. Reading & Hearing</h3>
          </div>
        </div>

        <div className="mt-3.5 space-y-4">
          <QuickDurationPicker
            id="readingDuration"
            label="Reading"
            value={readingDuration}
            onChange={(val) => {
              setReadingDuration(val);
              setQuickSelectionsCount((c) => c + 1);
            }}
            presets={[0, 15, 30, 45, 60, 90]}
            suggestedValue={previousReport?.readingDurationMinutes}
            disabled={!isEditable}
            themeColor="forest"
            optionalNote={readingNote}
            onNoteChange={setReadingNote}
            notePlaceholder="Book title e.g. Coming Back (optional)"
          />

          <div className="border-t border-[rgba(63,148,149,0.12)] pt-3.5">
            <QuickDurationPicker
              id="hearingDuration"
              label="Hearing"
              value={hearingDuration}
              onChange={(val) => {
                setHearingDuration(val);
                setQuickSelectionsCount((c) => c + 1);
              }}
              presets={[0, 30, 45, 60, 90, 120]}
              suggestedValue={previousReport?.hearingDurationMinutes}
              disabled={!isEditable}
              themeColor="krishna"
              optionalNote={hearingNote}
              onNoteChange={setHearingNote}
              notePlaceholder="Lecture topic e.g. SB 1.2.6 (optional)"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 4: STUDY */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#547070]/12 text-[#547070]">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">4. Study & Seva</h3>
          </div>
          <Badge variant="neutral" size="sm">
            <span>Total {formatDuration(totalStudy)}</span>
          </Badge>
        </div>

        <div className="mt-3.5 space-y-4">
          <QuickDurationPicker
            id="collegeStudy"
            label="College / Academy Study"
            value={collegeStudyMinutes}
            onChange={(val) => {
              setCollegeStudyMinutes(val);
              setQuickSelectionsCount((c) => c + 1);
            }}
            presets={[0, 120, 240, 360, 480]}
            suggestedValue={previousReport?.collegeStudyDurationMinutes}
            disabled={!isEditable}
            themeColor="neutral"
          />

          <div className="border-t border-[rgba(63,148,149,0.12)] pt-3.5">
            <QuickDurationPicker
              id="selfStudy"
              label="Self Study"
              value={selfStudyMinutes}
              onChange={(val) => {
                setSelfStudyMinutes(val);
                setQuickSelectionsCount((c) => c + 1);
              }}
              presets={[0, 60, 120, 180, 240]}
              suggestedValue={previousReport?.selfStudyDurationMinutes}
              disabled={!isEditable}
              themeColor="neutral"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 5: REST & TIME */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#547070]/12 text-[#547070]">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">5. Rest & Awareness</h3>
          </div>
        </div>

        <div className="mt-3.5 space-y-4">
          <QuickDurationPicker
            id="dayRest"
            label="Day Rest"
            value={dayRestMinutes}
            onChange={(val) => {
              setDayRestMinutes(val);
              setQuickSelectionsCount((c) => c + 1);
            }}
            presets={[0, 15, 30, 45, 60]}
            disabled={!isEditable}
            themeColor="neutral"
          />

          <div className="border-t border-[rgba(63,148,149,0.12)] pt-3.5">
            <QuickDurationPicker
              id="timeWasted"
              label="Unused Time (Reflection)"
              value={timeWastedMinutes}
              onChange={(val) => {
                setTimeWastedMinutes(val);
                setQuickSelectionsCount((c) => c + 1);
              }}
              presets={[0, 15, 30, 45, 60]}
              disabled={!isEditable}
              themeColor="neutral"
            />
          </div>
        </div>
      </Card>

      {/* SECTION 6: REFLECTION (OPTIONAL) */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 sm:p-5">
        <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A9824D]/12 text-[#A9824D]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#193B3B]">6. Reflection</h3>
              <span className="text-[11px] text-[#547070]">Optional personal notes</span>
            </div>
          </div>
          <span className="text-[11px] text-[#547070]">
            {notes.length}/{REPORT_CONFIG.MAX_NOTES_LENGTH}
          </span>
        </div>

        <div className="mt-3">
          <textarea
            rows={2}
            maxLength={REPORT_CONFIG.MAX_NOTES_LENGTH}
            disabled={!isEditable}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 p-2.5 text-[13px] leading-relaxed text-[#193B3B] placeholder:text-[#547070]/60 focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
            placeholder="Anything to remember from today's practice..."
          />
        </div>
      </Card>

      {/* STICKY BOTTOM ACTIONS BAR */}
      {isEditable && (
        <div className="sticky bottom-20 z-20 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#EAF7F4]/95 p-3 shadow-level3 backdrop-blur-md sm:bottom-6 sm:p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              size="default"
              disabled={isDraftSaving || isSubmitting}
              onClick={handleSaveDraft}
              leftIcon={<Save className="h-4 w-4" />}
              className="w-full text-[14px] sm:w-auto"
            >
              {isDraftSaving ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isSubmitting || isDraftSaving}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="w-full text-[15px] font-bold shadow-md sm:w-auto"
            >
              Review Sādhanā
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
