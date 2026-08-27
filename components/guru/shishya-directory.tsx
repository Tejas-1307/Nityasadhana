"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InviteModal } from "@/components/invitations/invite-modal";
import { ShishyaOverviewItem } from "@/lib/guru/service";
import { AttentionBadge } from "@/components/guru/attention/attention-badge";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  UserX,
} from "lucide-react";

export type FilterOption =
  | "all"
  | "attention"
  | "submitted"
  | "pending"
  | "stable";

export type SortOption = "attention" | "name" | "joined" | "activity";

export interface ShishyaDirectoryProps {
  shishyas: ShishyaOverviewItem[];
  initialFilter?: FilterOption;
}

export function ShishyaDirectory({
  shishyas,
  initialFilter = "all",
}: ShishyaDirectoryProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [filter, setFilter] = React.useState<FilterOption>(initialFilter);
  const [sort, setSort] = React.useState<SortOption>("attention");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = React.useState<boolean>(false);

  // Filter & Search Logic
  const filteredShishyas = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return shishyas.filter((item) => {
      // 1. Search Query Filter
      if (q) {
        const nameMatch = item.shishya.name.toLowerCase().includes(q);
        const spiritualMatch =
          item.shishya.spiritualName?.toLowerCase().includes(q) || false;
        const emailMatch = item.shishya.email.toLowerCase().includes(q);
        if (!nameMatch && !spiritualMatch && !emailMatch) {
          return false;
        }
      }

      // 2. Status / Category Filter
      if (filter === "attention") {
        return item.needsAttention;
      }
      if (filter === "submitted") {
        return item.reportingState === "submitted";
      }
      if (filter === "pending") {
        return item.reportingState === "draft" || item.reportingState === "not_submitted";
      }
      if (filter === "stable") {
        return item.isStable;
      }

      return true;
    });
  }, [shishyas, searchQuery, filter]);

  // Sort Logic
  const sortedShishyas = React.useMemo(() => {
    const list = [...filteredShishyas];

    if (sort === "name") {
      return list.sort((a, b) =>
        (a.shishya.spiritualName || a.shishya.name).localeCompare(
          b.shishya.spiritualName || b.shishya.name
        )
      );
    }

    if (sort === "joined") {
      return list.sort(
        (a, b) =>
          new Date(b.relationship.createdAt).getTime() -
          new Date(a.relationship.createdAt).getTime()
      );
    }

    if (sort === "activity") {
      return list.sort((a, b) => {
        const dateA = a.todayReport?.submittedAt || a.relationship.createdAt;
        const dateB = b.todayReport?.submittedAt || b.relationship.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }

    // Default "attention" sort:
    return list.sort((a, b) => {
      if (a.needsAttention && !b.needsAttention) return -1;
      if (!a.needsAttention && b.needsAttention) return 1;
      if (a.reportingState !== "submitted" && b.reportingState === "submitted") return -1;
      if (a.reportingState === "submitted" && b.reportingState !== "submitted") return 1;
      return a.shishya.name.localeCompare(b.shishya.name);
    });
  }, [filteredShishyas, sort]);

  const filterTabs: Array<{ id: FilterOption; label: string; count?: number }> = [
    { id: "all", label: "All", count: shishyas.length },
    {
      id: "attention",
      label: "Needs Attention",
      count: shishyas.filter((s) => s.needsAttention).length,
    },
    {
      id: "submitted",
      label: "Report Received",
      count: shishyas.filter((s) => s.reportingState === "submitted").length,
    },
    {
      id: "pending",
      label: "Report Pending",
      count: shishyas.filter((s) => s.reportingState !== "submitted").length,
    },
    {
      id: "stable",
      label: "Consistent",
      count: shishyas.filter((s) => s.isStable).length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Action Bar with Search, Filter & Invite */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66635D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Shishyas by name or email..."
            className="h-11 w-full rounded-2xl border border-[rgba(32,32,29,0.12)] bg-white pl-10 pr-4 text-[14px] text-[#20201D] placeholder:text-[#66635D] focus:border-[#D9822B] focus:outline-none focus:ring-2 focus:ring-[#D9822B]/20"
          />
        </div>

        {/* Filter / Sort / Invite Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Button
            type="button"
            variant="secondary"
            size="default"
            onClick={() => setIsFilterSheetOpen(true)}
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            className="sm:hidden"
          >
            Filters
          </Button>

          {/* Desktop Sort Dropdown */}
          <div className="relative hidden items-center gap-1.5 rounded-2xl border border-[rgba(32,32,29,0.12)] bg-white px-3 py-2 text-[13px] font-semibold text-[#20201D] sm:flex">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#66635D]" />
            <span>Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent font-medium text-[#20201D] focus:outline-none"
            >
              <option value="attention">Attention First</option>
              <option value="name">Name (A–Z)</option>
              <option value="joined">Recently Joined</option>
              <option value="activity">Recent Activity</option>
            </select>
          </div>

          {/* Invite Shishya Modal */}
          <InviteModal />
        </div>
      </div>

      {/* Desktop Filter Tabs */}
      <div className="hidden items-center gap-1.5 overflow-x-auto pb-1 sm:flex">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all ${
                isActive
                  ? "bg-[#20201D] text-white shadow-sm"
                  : "bg-white text-[#66635D] hover:bg-[#F7F1E5] hover:text-[#20201D]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-[#F7F1E5] text-[#66635D]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:hidden">
          <div className="w-full rounded-t-3xl border-t border-[rgba(32,32,29,0.08)] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-[16px] font-bold text-[#20201D]">Filter Shishyas</h3>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="text-[13px] font-semibold text-[#D9822B]"
              >
                Done
              </button>
            </div>

            <div className="space-y-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilter(tab.id);
                    setIsFilterSheetOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl p-3 text-[14px] font-semibold ${
                    filter === tab.id
                      ? "bg-[#20201D] text-white"
                      : "bg-[#F7F1E5]/40 text-[#20201D]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && <span>({tab.count})</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shishya List */}
      {sortedShishyas.length === 0 ? (
        <Card className="border-[rgba(32,32,29,0.08)] bg-white p-8 text-center shadow-level1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F1E5] text-[#66635D]">
            <UserX className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-[16px] font-bold text-[#20201D]">No Shishyas Found</h3>
          <p className="mt-1 text-[13px] text-[#66635D]">
            {searchQuery
              ? `No students matched your search "${searchQuery}".`
              : "No students in this filter view."}
          </p>
          {searchQuery && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[12px]"
            >
              Clear Search
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-2.5">
          {sortedShishyas.map((item) => {
            const initials = item.shishya.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            const primarySignal = item.signals[0];

            return (
              <Card
                key={item.shishya.id}
                className="border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 transition-all hover:border-[#D9822B]/40 sm:p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F1E5] font-serif text-[14px] font-bold text-[#20201D]">
                      {initials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-bold text-[#20201D]">
                          {item.shishya.spiritualName || item.shishya.name}
                        </span>
                        {item.shishya.spiritualName &&
                          item.shishya.name !== item.shishya.spiritualName && (
                            <span className="text-[12px] text-[#66635D]">
                              ({item.shishya.name})
                            </span>
                          )}

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <AttentionBadge level={item.attentionLevel} size="sm" />
                          {item.reportingState === "submitted" ? (
                            <Badge variant="feather" size="sm">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              <span>Report Received</span>
                            </Badge>
                          ) : item.reportingState === "draft" ? (
                            <Badge variant="saffron" size="sm">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Draft Pending</span>
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              <HelpCircle className="mr-1 h-3 w-3" />
                              <span>Awaiting Report</span>
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Today's Summary & Signal Info */}
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#66635D]">
                        {item.todayReport ? (
                          <>
                            <span>
                              Today: {item.todayReport.totalRounds || item.todayReport.japaRounds || 0} rounds
                            </span>
                            {item.todayReport.wakeUpTime && (
                              <span>· Woke {item.todayReport.wakeUpTime}</span>
                            )}
                          </>
                        ) : (
                          <span>Last active: {item.lastActiveFormatted}</span>
                        )}

                        {primarySignal && (
                          <span className="font-semibold text-[#8F5B1E]">
                            · {primarySignal.reason}
                          </span>
                        )}

                        {item.additionalSignalsCount > 0 && (
                          <span className="font-semibold text-[#66635D]">
                            (+{item.additionalSignalsCount} more)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Inspect Profile Action */}
                  <div className="flex items-center justify-end self-end sm:self-center">
                    <Link
                      href={`/guru/shishyas/${item.shishya.id}${
                        primarySignal?.type === "JAPA_CHANGE"
                          ? "?focus=japa"
                          : primarySignal?.type === "WAKE_TIME_CHANGE"
                            ? "?focus=wakeup"
                            : ""
                      }`}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                        className="text-[12px] font-semibold"
                      >
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
