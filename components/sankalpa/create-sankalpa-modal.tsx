"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  SankalpaCategory,
  SankalpaTargetType,
  SankalpaTargetConfig,
  DbWeeklySankalpa,
} from "@/lib/db/schema";
import { SANKALPA_CATEGORIES, getCategoryDefinition } from "@/lib/sankalpa/catalog";
import { getSankalpaWeekBoundaries } from "@/lib/sankalpa/date-utils";
import {
  Sprout,
  X,
  Loader2,
  Check,
  CircleDot,
  Moon,
  BookOpen,
  Headphones,
  GraduationCap,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { createSankalpaAction } from "@/lib/actions/sankalpa";

export interface CreateSankalpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sankalpa: DbWeeklySankalpa) => void;
}

export function CreateSankalpaModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSankalpaModalProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<SankalpaCategory>("wake_up");
  const [selectedTitle, setSelectedTitle] = React.useState<string>("");
  const [customTitle, setCustomTitle] = React.useState<string>("");
  const [targetType, setTargetType] = React.useState<SankalpaTargetType>("metric_based");
  const [targetValue, setTargetValue] = React.useState<string | number>("");
  const [step, setStep] = React.useState<"select" | "confirm">("select");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const activeCategoryDef = getCategoryDefinition(selectedCategory);
  const weekBoundaries = getSankalpaWeekBoundaries();

  // Reset or initialize when category changes
  React.useEffect(() => {
    const def = getCategoryDefinition(selectedCategory);
    setSelectedTitle(def.defaultTitle);
    setCustomTitle("");
    if (selectedCategory === "other") {
      setTargetType("custom");
      setTargetValue("");
    } else {
      setTargetType("metric_based");
      setTargetValue(def.defaultTargetConfig?.targetValue || "");
    }
    setErrorMessage(null);
  }, [selectedCategory]);

  if (!isOpen) return null;

  const currentTitle =
    selectedCategory === "other" || customTitle.trim().length > 0
      ? customTitle.trim()
      : selectedTitle;

  const handleNextToConfirm = () => {
    if (!currentTitle) {
      setErrorMessage("Please enter or select an intention.");
      return;
    }
    if (currentTitle.length > 160) {
      setErrorMessage("Title must be 160 characters or less.");
      return;
    }
    setErrorMessage(null);
    setStep("confirm");
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    let targetConfig: SankalpaTargetConfig | undefined = undefined;
    if (targetType === "metric_based" && activeCategoryDef.defaultTargetConfig) {
      targetConfig = {
        ...activeCategoryDef.defaultTargetConfig,
        targetValue: targetValue || activeCategoryDef.defaultTargetConfig.targetValue,
      };
    }

    const res = await createSankalpaAction({
      category: selectedCategory,
      title: currentTitle,
      targetType,
      targetConfig,
      startDate: weekBoundaries.startDate,
      endDate: weekBoundaries.endDate,
    });

    setIsSubmitting(false);

    if (res.success && res.data?.sankalpa) {
      onSuccess(res.data.sankalpa);
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to create Sankalpa.");
    }
  };

  const renderCategoryIcon = (cat: SankalpaCategory) => {
    switch (cat) {
      case "wake_up":
        return <Moon className="h-4 w-4" />;
      case "japa":
        return <CircleDot className="h-4 w-4" />;
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      case "hearing":
        return <Headphones className="h-4 w-4" />;
      case "study":
        return <GraduationCap className="h-4 w-4" />;
      case "time_management":
        return <Clock className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level3 sm:p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3D765B]/10 text-[#3D765B]">
              <Sprout className="h-4 w-4" />
            </div>
            <h2 className="text-[16px] font-bold text-[#20201D] sm:text-[17px]">
              {step === "select" ? "Set Weekly Sankalpa" : "Confirm Your Intention"}
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

        {/* Step 1: Selection */}
        {step === "select" ? (
          <div className="mt-4 space-y-4">
            {/* 1. Category Selection Chips */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
                What would you like to focus on?
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                {SANKALPA_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                        isSelected
                          ? "bg-[#20201D] text-white shadow-xs"
                          : "border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/40 text-[#66635D] hover:bg-[#F7F1E5]"
                      }`}
                    >
                      {renderCategoryIcon(cat.key)}
                      <span>{cat.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Suggested Intentions */}
            {selectedCategory !== "other" && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
                  Suggested Focus
                </label>
                <div className="mt-1.5 space-y-1.5">
                  {activeCategoryDef.suggestedTitles.map((sugTitle, idx) => {
                    const isSelected = selectedTitle === sugTitle && !customTitle.trim();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedTitle(sugTitle);
                          setCustomTitle("");
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-[13px] font-medium transition-all ${
                          isSelected
                            ? "border-[#3D765B]/40 bg-[#3D765B]/10 text-[#20201D] font-semibold"
                            : "border-[rgba(32,32,29,0.08)] bg-white text-[#20201D] hover:bg-[#F7F1E5]/40"
                        }`}
                      >
                        <span>{sugTitle}</span>
                        {isSelected && <Check className="h-4 w-4 text-[#3D765B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Custom Intention Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#66635D]">
                {selectedCategory === "other"
                  ? "Your Custom Intention"
                  : "Or write your own intention"}
              </label>
              <textarea
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={
                  selectedCategory === "other"
                    ? "E.g. Offer prayers before studying, keep bedtime peaceful..."
                    : "Customize your focus in your own words..."
                }
                maxLength={160}
                rows={2}
                className="mt-1.5 w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-white p-3 text-[13px] text-[#20201D] placeholder:text-[#66635D]/50 focus:border-[#3D765B] focus:outline-hidden focus:ring-1 focus:ring-[#3D765B]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#66635D]">
                <span>Concise commitment for the week</span>
                <span>{customTitle.length}/160</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-[12px] font-semibold text-[#C53030]">{errorMessage}</p>
            )}

            {/* Step Navigation */}
            <div className="flex items-center justify-end gap-2 border-t border-[rgba(32,32,29,0.06)] pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-[12px]">
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNextToConfirm}
                className="text-[12px] font-semibold"
              >
                <span>Continue</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Calm Confirmation */
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[#3D765B]/20 bg-[#3D765B]/5 p-4 text-center sm:p-5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D765B]/15 text-[#3D765B]">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="mt-2 block text-[11px] font-bold uppercase tracking-wider text-[#3D765B]">
                🌱 Your Sankalpa
              </span>
              <h3 className="mt-1 text-[17px] font-bold text-[#20201D]">
                {currentTitle}
              </h3>
              <p className="mt-1 text-[12px] text-[#66635D]">
                {weekBoundaries.formattedRange}
              </p>
            </div>

            <p className="text-center text-[13px] text-[#66635D]">
              Ready to begin this conscious weekly focus?
            </p>

            {errorMessage && (
              <p className="text-center text-[12px] font-semibold text-[#C53030]">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-[rgba(32,32,29,0.06)] pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("select")}
                disabled={isSubmitting}
                className="text-[12px]"
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCreate}
                disabled={isSubmitting}
                className="text-[12px] font-semibold"
              >
                {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                <span>Begin Sankalpa</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
