"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DbNotification,
  DbNotificationPreferences,
  NotificationType,
} from "@/lib/notifications/types";
import {
  getNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notifications";
import { NotificationPreferencesCard } from "./notification-preferences-card";
import { UserRole } from "@/types/auth";
import {
  Bell,
  X,
  CheckCheck,
  Calendar,
  HeartHandshake,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  Settings,
  Check,
} from "lucide-react";

export interface NotificationDrawerProps {
  role?: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationDrawer({
  role = "shishya",
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "unread" | "preferences">("all");
  const [notifications, setNotifications] = React.useState<DbNotification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [preferences, setPreferences] = React.useState<DbNotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getNotificationsAction();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
        setPreferences(res.data.preferences);
        if (onUnreadCountChange) {
          onUnreadCountChange(res.data.unreadCount);
        }
      }
    } catch {
      // Failure isolation
    } finally {
      setIsLoading(false);
    }
  }, [onUnreadCountChange]);

  React.useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
    const newCount = Math.max(0, unreadCount - 1);
    setUnreadCount(newCount);
    if (onUnreadCountChange) onUnreadCountChange(newCount);
    await markNotificationReadAction(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
    setUnreadCount(0);
    if (onUnreadCountChange) onUnreadCountChange(0);
    await markAllNotificationsReadAction();
  };

  if (!isOpen) return null;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => n.status !== "read" && n.status !== "suppressed")
      : notifications.filter((n) => n.status !== "suppressed");

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "daily_report_reminder":
        return <Calendar className="h-4 w-4 text-[#D9822B]" />;
      case "weekly_reflection_reminder":
        return <HeartHandshake className="h-4 w-4 text-[#2457A6]" />;
      case "sankalpa_reminder":
        return <Sparkles className="h-4 w-4 text-[#3D765B]" />;
      case "guru_daily_summary":
        return <Users className="h-4 w-4 text-[#D9822B]" />;
      case "guru_follow_up_reminder":
        return <Clock className="h-4 w-4 text-[#2457A6]" />;
      default:
        return <Bell className="h-4 w-4 text-[#66635D]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity">
      {/* Drawer Card */}
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.08)] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#20201D]">
                Reminders • स्मृतयः
              </h2>
              <span className="text-[11px] text-[#66635D]">
                Peaceful, non-intrusive notifications
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-[#66635D] hover:text-[#20201D]"
            aria-label="Close reminders drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/30 px-5 py-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-[#20201D] shadow-xs"
                  : "text-[#66635D] hover:text-[#20201D]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold transition-all ${
                activeTab === "unread"
                  ? "bg-white text-[#20201D] shadow-xs"
                  : "text-[#66635D] hover:text-[#20201D]"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D9822B] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold transition-all ${
                activeTab === "preferences"
                  ? "bg-white text-[#20201D] shadow-xs"
                  : "text-[#66635D] hover:text-[#20201D]"
              }`}
            >
              <Settings className="h-3 w-3" />
              <span>Preferences</span>
            </button>
          </div>

          {activeTab !== "preferences" && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#66635D] hover:text-[#D9822B]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === "preferences" ? (
            preferences ? (
              <NotificationPreferencesCard
                role={role}
                initialPreferences={preferences}
                onSaved={fetchNotifications}
              />
            ) : (
              <div className="p-4 text-center text-[13px] text-[#66635D]">
                Loading preferences...
              </div>
            )
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-[rgba(32,32,29,0.04)]"
                />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3D765B]/10 text-[#3D765B]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-[15px] font-bold text-[#20201D]">
                All quiet and peaceful 🙏
              </h3>
              <p className="mt-1 max-w-xs text-[12px] text-[#66635D]">
                {activeTab === "unread"
                  ? "No unread reminders. Your Sādhanā routine is flowing smoothly."
                  : "No notifications recorded yet. Gentle reminders will appear here when relevant."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => {
                const isUnread = n.status !== "read";

                return (
                  <div
                    key={n.id}
                    className={`group relative flex flex-col gap-2 rounded-2xl border p-3.5 transition-all ${
                      isUnread
                        ? "border-[#D9822B]/25 bg-[#D9822B]/5 shadow-xs"
                        : "border-[rgba(32,32,29,0.06)] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                          {getTypeIcon(n.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-[#20201D]">
                              {n.title}
                            </span>
                            {isUnread && (
                              <Badge variant="saffron" size="sm">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-[#66635D]">
                            {n.message}
                          </p>
                        </div>
                      </div>

                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-[#66635D] opacity-0 transition-opacity hover:text-[#3D765B] group-hover:opacity-100"
                          title="Mark as read"
                          aria-label="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Action Link & Timestamp */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#66635D]">
                      <span>{n.scheduledForDate}</span>
                      {n.actionUrl && (
                        <Link
                          href={n.actionUrl}
                          onClick={() => {
                            if (isUnread) handleMarkAsRead(n.id);
                            onClose();
                          }}
                          className="flex items-center gap-1 font-semibold text-[#D9822B] hover:underline"
                        >
                          <span>Open</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
