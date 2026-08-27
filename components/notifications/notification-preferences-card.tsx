"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DbNotificationPreferences } from "@/lib/notifications/types";
import { updateNotificationPreferencesAction } from "@/lib/actions/notifications";
import { UserRole } from "@/types/auth";
import { Moon, Bell, Check, Clock } from "lucide-react";

export interface NotificationPreferencesCardProps {
  role?: UserRole;
  initialPreferences: DbNotificationPreferences;
  onSaved?: () => void;
}

export function NotificationPreferencesCard({
  role = "shishya",
  initialPreferences,
  onSaved,
}: NotificationPreferencesCardProps) {
  const [prefs, setPrefs] = React.useState<DbNotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleToggle = (key: keyof DbNotificationPreferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await updateNotificationPreferencesAction({
        dailyReportReminder: prefs.dailyReportReminder,
        weeklyReflectionReminder: prefs.weeklyReflectionReminder,
        sankalpaReminder: prefs.sankalpaReminder,
        guruDailySummary: prefs.guruDailySummary,
        guruFollowUpReminder: prefs.guruFollowUpReminder,
        quietHoursStart: prefs.quietHoursStart,
        quietHoursEnd: prefs.quietHoursEnd,
        timezone: prefs.timezone,
      });

      if (res.success && res.data) {
        setPrefs(res.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        if (onSaved) onSaved();
      }
    } catch {
      // Ignored
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-sm sm:p-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Reminders (Role-adapted) */}
        <div>
          <div className="flex items-center gap-2 border-b border-[rgba(32,32,29,0.06)] pb-2.5">
            <Bell className="h-4 w-4 text-[#D9822B]" />
            <h3 className="text-[14px] font-bold text-[#20201D]">
              Gentle Reminders • स्मृतयः
            </h3>
          </div>
          <p className="mt-1 text-[12px] text-[#66635D]">
            Control which peaceful reminders reach you. Maximum 1 routine reminder per day.
          </p>

          <div className="mt-3 divide-y divide-[rgba(32,32,29,0.06)]">
            {role === "shishya" ? (
              <>
                {/* Student: Daily Sādhanā Reminder */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20201D]">
                      Daily Sādhanā Report
                    </div>
                    <div className="text-[11px] text-[#66635D]">
                      Gentle reminder when today&apos;s report is ready. Automatically cancels when submitted.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("dailyReportReminder")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      prefs.dailyReportReminder ? "bg-[#3D765B]" : "bg-[rgba(32,32,29,0.2)]"
                    }`}
                    role="switch"
                    aria-checked={prefs.dailyReportReminder}
                    aria-label="Toggle daily report reminder"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        prefs.dailyReportReminder ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Student: Weekly Reflection Reminder */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20201D]">
                      Weekly Reflection
                    </div>
                    <div className="text-[11px] text-[#66635D]">
                      Gentle reminder when the weekly reflection period opens.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("weeklyReflectionReminder")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      prefs.weeklyReflectionReminder ? "bg-[#3D765B]" : "bg-[rgba(32,32,29,0.2)]"
                    }`}
                    role="switch"
                    aria-checked={prefs.weeklyReflectionReminder}
                    aria-label="Toggle weekly reflection reminder"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        prefs.weeklyReflectionReminder ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Student: Sankalpa Reminder */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20201D]">
                      Weekly Sankalpa Focus
                    </div>
                    <div className="text-[11px] text-[#66635D]">
                      Peaceful reminder supporting your chosen spiritual intention.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("sankalpaReminder")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      prefs.sankalpaReminder ? "bg-[#3D765B]" : "bg-[rgba(32,32,29,0.2)]"
                    }`}
                    role="switch"
                    aria-checked={prefs.sankalpaReminder}
                    aria-label="Toggle Sankalpa reminder"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        prefs.sankalpaReminder ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guru: Daily Summary */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20201D]">
                      Daily Group Summary
                    </div>
                    <div className="text-[11px] text-[#66635D]">
                      One compact summary of Shishya reporting rhythms per day.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("guruDailySummary")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      prefs.guruDailySummary ? "bg-[#D9822B]" : "bg-[rgba(32,32,29,0.2)]"
                    }`}
                    role="switch"
                    aria-checked={prefs.guruDailySummary}
                    aria-label="Toggle Guru daily summary"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        prefs.guruDailySummary ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Guru: Follow-up Reminder */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-[#20201D]">
                      Scheduled Follow-up Reminders
                    </div>
                    <div className="text-[11px] text-[#66635D]">
                      Reminder on dates where you intentionally scheduled a Shishya discussion.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle("guruFollowUpReminder")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      prefs.guruFollowUpReminder ? "bg-[#D9822B]" : "bg-[rgba(32,32,29,0.2)]"
                    }`}
                    role="switch"
                    aria-checked={prefs.guruFollowUpReminder}
                    aria-label="Toggle Guru follow-up reminder"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        prefs.guruFollowUpReminder ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Quiet Hours */}
        <div>
          <div className="flex items-center gap-2 border-b border-[rgba(32,32,29,0.06)] pb-2.5">
            <Moon className="h-4 w-4 text-[#2457A6]" />
            <h3 className="text-[14px] font-bold text-[#20201D]">
              Quiet Hours • प्रशान्ति-कालः
            </h3>
          </div>
          <p className="mt-1 text-[12px] text-[#66635D]">
            During quiet hours, no push notifications are dispatched to protect sleep and morning Japa.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="quietStart" className="text-[12px]">
                Quiet Hours Start
              </Label>
              <div className="relative mt-1">
                <input
                  id="quietStart"
                  type="time"
                  value={prefs.quietHoursStart}
                  onChange={(e) =>
                    setPrefs((prev) => ({ ...prev, quietHoursStart: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/40 px-3 py-2 text-[13px] font-semibold text-[#20201D]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quietEnd" className="text-[12px]">
                Quiet Hours End
              </Label>
              <div className="relative mt-1">
                <input
                  id="quietEnd"
                  type="time"
                  value={prefs.quietHoursEnd}
                  onChange={(e) =>
                    setPrefs((prev) => ({ ...prev, quietHoursEnd: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/40 px-3 py-2 text-[13px] font-semibold text-[#20201D]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Timezone */}
        <div>
          <div className="flex items-center gap-2 border-b border-[rgba(32,32,29,0.06)] pb-2.5">
            <Clock className="h-4 w-4 text-[#66635D]" />
            <h3 className="text-[14px] font-bold text-[#20201D]">
              Timezone • देश-कालः
            </h3>
          </div>
          <div className="mt-2">
            <select
              value={prefs.timezone}
              onChange={(e) =>
                setPrefs((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className="w-full rounded-xl border border-[rgba(32,32,29,0.12)] bg-[#F7F1E5]/40 px-3 py-2 text-[13px] font-medium text-[#20201D]"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST · UTC+5:30)</option>
              <option value="America/New_York">America/New_York (EST · UTC-5:00)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST · UTC-8:00)</option>
              <option value="Europe/London">Europe/London (GMT · UTC+0:00)</option>
              <option value="UTC">UTC (Universal Coordinated Time)</option>
            </select>
          </div>
        </div>

        {/* Submit & Confirmation */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3D765B]">
              <Check className="h-4 w-4" />
              <span>Preferences saved peacefully.</span>
            </div>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            className="text-[13px]"
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </Card>
  );
}
