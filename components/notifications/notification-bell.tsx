"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { NotificationDrawer } from "./notification-drawer";
import { getNotificationsAction } from "@/lib/actions/notifications";
import { UserRole } from "@/types/auth";

export interface NotificationBellProps {
  role?: UserRole;
}

export function NotificationBell({ role = "shishya" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      try {
        const res = await getNotificationsAction(1, 0);
        if (isMounted && res.success && res.data) {
          setUnreadCount(res.data.unreadCount);
        }
      } catch {
        // Failure isolation
      }
    }

    loadCount();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(32,32,29,0.08)] bg-white text-[#66635D] shadow-2xs transition-colors hover:border-[rgba(32,32,29,0.15)] hover:text-[#20201D]"
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread reminders`
            : "View reminders and notifications"
        }
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D9822B] px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationDrawer
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUnreadCountChange={(count) => setUnreadCount(count)}
      />
    </>
  );
}
