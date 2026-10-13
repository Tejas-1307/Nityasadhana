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
import { TimePicker12Hour } from "./time-picker-12h";
import { DailySadhanaReportInput } from "@/lib/reports/validation";
import {
  saveLocalDraft,
  getLocalDraft,
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
  ArrowLeft,
  Edit3,
  ChevronDown,
  ChevronUp,
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

  // Form State (initialized from initialReport, or production defaults 9:00 PM / 3:30 AM)
  const [sleepTime, setSleepTime] = React.useState<string>(
    initialReport?.sleepTime || "21:00"
  );
  const [wakeUpTime, setWakeUpTime] = React.useState<string>(
    initialReport?.wakeUpTime || "03:30"
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

  // Progressive disclosure: Collapsible sections (default open for 0-tap reporting)
  const [collapsedSections, setCollapsedSections] = React.useState<Record<number, boolean>>({});
  const toggleSection = (section: number) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  const isCollapsed = (section: number) => !!collapsedSections[section];

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

  const isDraftRestoredRef = React.useRef(false);

  // Restore unsaved local draft if no server report exists
  React.useEffect(() => {
    if (!initialReport && typeof window !== "undefined") {
      const local = getLocalDraft<DailySadhanaReportInput>(practiceDate);
      if (local?.sleepTime) {
        setSleepTime(local.sleepTime);
      }
      if (local?.wakeUpTime) {
        setWakeUpTime(local.wakeUpTime);
      }
    }
    isDraftRestoredRef.current = true;
  }, [practiceDate, initialReport]);

  // Auto-save local draft on changes (after local draft restoration check)
  React.useEffect(() => {
    if (!isDraftRestoredRef.current && !initialReport) return;
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
    setYesterdaySummary("Loaded yesterday's routine.");
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
      <div className="space-y-4 pb-16 sm:pb-8">
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
          className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level2 sm:p-6"
        />

        {/* Final Confirmation Buttons */}
        <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-[#EAF7F4]/95 p-3 shadow-level2 sm:p-4">
          <div className="flex items-center gap-2.5 sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              size="default"
              disabled={isSubmitting}
              onClick={() => setStep("form")}
              leftIcon={<Edit3 className="h-4 w-4" />}
              className="h-11 px-3 text-[13px] font-semibold sm:w-auto"
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
              className="h-11 flex-1 text-[13px] font-bold shadow-md sm:flex-none sm:w-auto sm:text-[14px]"
            >
              {isSubmitting
                ? "Recording..."
                : isSubmitted
                  ? "Update Sādhanā"
                  : "Submit Sādhanā"}
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
    <form onSubmit={handleSubmit} className="space-y-3.5 pb-28 sm:pb-12">
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

      {/* Progress & Sync Status Unified Strip */}
      <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-white/80 p-2.5 shadow-level1">
        <ReportProgressBar
          completedSections={completedSections}
          syncBadge={(() => {
            const meta = getSyncStatusMeta(syncState);
            return (
              <Badge variant={meta.variant} size="sm" className={`text-[10px] py-0 px-2 h-5 ${meta.colorClass}`}>
                <span>{meta.label}</span>
              </Badge>
            );
          })()}
        />
      </div>

      {/* FAST PATH HELPER: "Fill from yesterday" */}
      {previousReport && isEditable && (!initialReport || initialReport.status === "draft") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-2.5 shadow-level1 sm:p-3">
            <div className="flex items-center gap-2 text-[13px] text-[#193B3B]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#A9824D]/10 text-[#A9824D]">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold">Same as yesterday?</span>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFillFromYesterday}
              className="h-8 px-2.5 text-[12px] font-semibold"
            >
              Fill from yesterday
            </Button>
          </div>

          {/* Yesterday Loaded Detail Summary */}
          {yesterdaySummary && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[rgba(63,148,149,0.22)] bg-[#3F9495]/8 px-3 py-2 text-[12px] text-[#3F9495]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{yesterdaySummary}</span>
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
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(1)}
          aria-expanded={!isCollapsed(1)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3F9495]/12 text-[#3F9495]">
              <Moon className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">1. Sleep & Wake</h3>
          </div>
          <div className="flex items-center gap-2">
            {sleepTime && wakeUpTime && (
              <Badge variant="krishna" size="sm" className="font-semibold">
                <span>{formatDuration(sleepDuration)}</span>
              </Badge>
            )}
            <span className="text-[#547070]">
              {isCollapsed(1) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(1) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TimePicker12Hour
                id="sleepTime"
                label="Slept at"
                value={sleepTime}
                onChange={(val) => setSleepTime(val)}
                disabled={!isEditable}
                presetType="sleep"
              />

              <TimePicker12Hour
                id="wakeUpTime"
                label="Woke up at"
                value={wakeUpTime}
                onChange={(val) => setWakeUpTime(val)}
                disabled={!isEditable}
                presetType="wake"
              />
            </div>
          </div>
        )}
      </Card>

      {/* SECTION 2: JAPA */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(2)}
          aria-expanded={!isCollapsed(2)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#A9824D]/12 text-[#A9824D]">
              <CircleDot className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">2. Japa</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="saffron" size="sm" className="font-semibold">
              <span>{totalRounds} rounds</span>
            </Badge>
            <span className="text-[#547070]">
              {isCollapsed(2) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(2) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                  className="mt-1 h-11 w-full rounded-xl border border-[rgba(63,148,149,0.18)] bg-[#F7F5EF]/30 px-2.5 text-[14px] font-medium text-[#193B3B] focus:border-[#3F9495] focus:outline-none focus:ring-2 focus:ring-[#3F9495]/20 disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* SECTION 3: READING & HEARING */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(3)}
          aria-expanded={!isCollapsed(3)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#328A7A]/12 text-[#328A7A]">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">3. Reading & Hearing</h3>
          </div>
          <div className="flex items-center gap-2">
            {(readingDuration > 0 || hearingDuration > 0) && (
              <Badge variant="feather" size="sm" className="font-semibold">
                <span>{formatDuration(readingDuration + hearingDuration)}</span>
              </Badge>
            )}
            <span className="text-[#547070]">
              {isCollapsed(3) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(3) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)] space-y-3.5">
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

            <div className="border-t border-[rgba(63,148,149,0.12)] pt-3">
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
        )}
      </Card>

      {/* SECTION 4: STUDY */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(4)}
          aria-expanded={!isCollapsed(4)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#547070]/12 text-[#547070]">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">4. Study</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm" className="font-semibold">
              <span>Total {formatDuration(totalStudy)}</span>
            </Badge>
            <span className="text-[#547070]">
              {isCollapsed(4) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(4) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)] space-y-3.5">
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

            <div className="border-t border-[rgba(63,148,149,0.12)] pt-3">
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
        )}
      </Card>

      {/* SECTION 5: REST & TIME */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(5)}
          aria-expanded={!isCollapsed(5)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#547070]/12 text-[#547070]">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-[14px] font-bold text-[#193B3B]">5. Rest & Time</h3>
          </div>
          <div className="flex items-center gap-2">
            {(dayRestMinutes > 0 || timeWastedMinutes > 0) && (
              <Badge variant="neutral" size="sm" className="font-semibold">
                <span>Rest {formatDuration(dayRestMinutes)}</span>
              </Badge>
            )}
            <span className="text-[#547070]">
              {isCollapsed(5) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(5) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)] space-y-3.5">
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

            <div className="border-t border-[rgba(63,148,149,0.12)] pt-3">
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
        )}
      </Card>

      {/* SECTION 6: REFLECTION (OPTIONAL) */}
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-3.5 shadow-level1 sm:p-5">
        <button
          type="button"
          onClick={() => toggleSection(6)}
          aria-expanded={!isCollapsed(6)}
          className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#A9824D]/12 text-[#A9824D]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#193B3B]">6. Reflection</h3>
              <span className="text-[11px] text-[#547070]">Optional notes</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#547070]">
              {notes.length}/{REPORT_CONFIG.MAX_NOTES_LENGTH}
            </span>
            <span className="text-[#547070]">
              {isCollapsed(6) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </span>
          </div>
        </button>

        {!isCollapsed(6) && (
          <div className="mt-3.5 pt-3 border-t border-[rgba(63,148,149,0.12)]">
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
        )}
      </Card>

      {/* STICKY BOTTOM ACTIONS BAR */}
      {isEditable && (
        <div className="sticky bottom-20 z-20 rounded-2xl border border-[rgba(63,148,149,0.2)] bg-[#EAF7F4]/95 p-2.5 shadow-level3 backdrop-blur-md sm:bottom-6 sm:p-3.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="default"
              disabled={isDraftSaving || isSubmitting}
              onClick={handleSaveDraft}
              leftIcon={<Save className="h-4 w-4 shrink-0" />}
              className="h-11 px-3 text-[13px] font-semibold text-[#193B3B] shrink-0"
            >
              <span className="hidden xs:inline">Save</span> Draft
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="default"
              disabled={isDraftSaving || isSubmitting}
              onClick={() => setStep("review")}
              className="h-11 px-2.5 text-[12px] font-semibold text-[#2457A6] hover:bg-[#2457A6]/10 shrink-0"
              title="Preview Summary"
            >
              <span>Preview</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isSubmitting || isDraftSaving}
              leftIcon={<Check className="h-4 w-4 shrink-0" />}
              className="h-11 flex-1 text-[13px] sm:text-[14px] font-bold shadow-md truncate justify-center"
            >
              {isSubmitting
                ? "Recording..."
                : isSubmitted
                  ? "Update Sādhanā"
                  : "Submit Sādhanā"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
