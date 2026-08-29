"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbDailySadhanaReport } from "@/lib/db/schema";
import { formatDuration } from "@/lib/reports/calculations";
import {
  Calendar,
  Eye,
  X,
  Moon,
  CircleDot,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export interface ReportHistoryListProps {
  reports: DbDailySadhanaReport[];
  totalReports: number;
}

export function ReportHistoryList({
  reports,
  totalReports: _totalReports,
}: ReportHistoryListProps) {
  const [selectedReport, setSelectedReport] =
    React.useState<DbDailySadhanaReport | null>(null);

  if (reports.length === 0) {
    return (
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-6 text-center shadow-level1">
        <p className="text-[13px] text-[#547070]">No past daily reports found for this student.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
                Report History
              </span>
              <h2 className="text-[17px] font-bold text-[#193B3B] sm:text-[18px]">
                Past Sādhanā Submissions ({reports.length})
              </h2>
            </div>
            <span className="text-[12px] text-[#547070]">Tap to inspect full report</span>
          </div>

          <div className="space-y-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-[rgba(63,148,149,0.14)] bg-white p-3 transition-all hover:border-[#3F9495]/40 hover:bg-[#EAF7F4] sm:p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7F4] text-[#193B3B]">
                    <Calendar className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#193B3B]">
                        {rep.practiceDate}
                      </span>
                      {rep.status === "submitted" ? (
                        <Badge variant="feather" size="sm">
                          <span>Received</span>
                        </Badge>
                      ) : (
                        <Badge variant="saffron" size="sm">
                          <span>Draft</span>
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[12px] text-[#547070]">
                      <span>{rep.totalRounds || rep.japaRounds || 0} rds</span>
                      {rep.wakeUpTime && <span>· Woke {rep.wakeUpTime}</span>}
                      {rep.readingDurationMinutes ? (
                        <span>· Read {rep.readingDurationMinutes}m</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="h-8 text-[12px]">
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  <span>Inspect</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* READ-ONLY Report Detail Modal */}
      {selectedReport && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[rgba(63,148,149,0.16)] bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[rgba(63,148,149,0.12)] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">
                  Read-Only Inspection
                </span>
                <h3 className="text-[18px] font-bold text-[#193B3B]">
                  Sādhanā for {selectedReport.practiceDate}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-full p-2 text-[#547070] hover:bg-[#EAF7F4]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Structured Report Breakdown */}
            <div className="mt-4 space-y-4">
              {/* Sleep */}
              <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3.5">
                <div className="flex items-center justify-between text-[13px] font-bold text-[#193B3B]">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-4 w-4 text-[#3F9495]" /> Sleep &amp; Wake
                  </span>
                  <span>{formatDuration(selectedReport.sleepDurationMinutes || 0)}</span>
                </div>
                <div className="mt-2 text-[12px] text-[#547070]">
                  Slept: {selectedReport.sleepTime} · Woke: {selectedReport.wakeUpTime}
                </div>
              </div>

              {/* Japa */}
              <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3.5">
                <div className="flex items-center justify-between text-[13px] font-bold text-[#193B3B]">
                  <span className="flex items-center gap-1.5">
                    <CircleDot className="h-4 w-4 text-[#A9824D]" /> Japa Meditation
                  </span>
                  <span>{selectedReport.totalRounds || selectedReport.japaRounds} rounds</span>
                </div>
                <div className="mt-2 text-[12px] text-[#547070]">
                  Standard: {selectedReport.japaRounds}
                  {selectedReport.extraRounds ? ` · Extra: +${selectedReport.extraRounds}` : ""}
                  {selectedReport.japaCompletedAt ? ` · Completed: ${selectedReport.japaCompletedAt}` : ""}
                </div>
              </div>

              {/* Reading / Hearing */}
              <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]">
                  <BookOpen className="h-4 w-4 text-[#328A7A]" /> Hearing &amp; Reading
                </div>
                <div className="mt-2 space-y-1 text-[12px] text-[#547070]">
                  <div>Reading: {formatDuration(selectedReport.readingDurationMinutes || 0)} {selectedReport.readingNote && `(${selectedReport.readingNote})`}</div>
                  <div>Hearing: {formatDuration(selectedReport.hearingDurationMinutes || 0)} {selectedReport.hearingNote && `(${selectedReport.hearingNote})`}</div>
                </div>
              </div>

              {/* Study / Rest */}
              <div className="rounded-xl border border-[rgba(63,148,149,0.14)] bg-[#F7F5EF]/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]">
                  <GraduationCap className="h-4 w-4 text-[#547070]" /> Study &amp; Time
                </div>
                <div className="mt-2 space-y-1 text-[12px] text-[#547070]">
                  <div>College Study: {formatDuration(selectedReport.collegeStudyDurationMinutes || 0)}</div>
                  <div>Self Study: {formatDuration(selectedReport.selfStudyDurationMinutes || 0)}</div>
                  {selectedReport.timeWastedDurationMinutes ? (
                    <div>Unused Time: {formatDuration(selectedReport.timeWastedDurationMinutes)}</div>
                  ) : null}
                </div>
              </div>

              {/* Optional Reflection */}
              {selectedReport.notes && (
                <div className="rounded-xl border border-[rgba(63,148,149,0.16)] bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]">
                    <Sparkles className="h-4 w-4 text-[#A9824D]" /> Student Reflection
                  </div>
                  <blockquote className="mt-2 text-[12px] italic text-[#193B3B]">
                    &ldquo;{selectedReport.notes}&rdquo;
                  </blockquote>
                </div>
              )}
            </div>

            {/* Read-Only Notice and Dismiss */}
            <div className="mt-6 flex items-center justify-between border-t border-[rgba(63,148,149,0.12)] pt-4">
              <span className="text-[11px] text-[#547070]">Read-only Guru inspection mode</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
