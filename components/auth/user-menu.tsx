"use client";

import * as React from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserRole } from "@/types/auth";
import { NotificationBell } from "@/components/notifications/notification-bell";

export interface UserMenuProps {
  role?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function UserMenu({ role = "shishya", userName, userEmail }: UserMenuProps) {
  const { user } = useUser();

  const displayName = userName || user?.fullName || "Devotee";
  const displayEmail = userEmail || user?.primaryEmailAddress?.emailAddress || "";
  const displayRole: UserRole = role || (user?.publicMetadata?.role as UserRole) || "shishya";

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      {/* Peaceful Reminders Notification Bell */}
      <NotificationBell role={displayRole} />

      {/* Devotee Info */}
      <div className="flex items-center gap-2.5">
        <Avatar name={displayName} size="sm" />
        <div className="hidden flex-col text-left sm:flex">
          <div className="flex items-center gap-1.5">
            <span className="max-w-[140px] truncate text-[13px] font-semibold text-[#20201D]">
              {displayName}
            </span>
            <Badge variant={displayRole === "guru" ? "saffron" : "krishna"} size="sm">
              <span className="font-serif text-[10px]">
                {displayRole === "guru" ? "गुरुः" : "शिष्यः"}
              </span>
            </Badge>
          </div>
          {displayEmail && (
            <span className="max-w-[140px] truncate text-[11px] text-[#66635D]">
              {displayEmail}
            </span>
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <SignOutButton redirectUrl="/login">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-[#B33927]/8 px-2.5 text-[#66635D] hover:text-[#B33927]"
          aria-label="Sign out of Nityasādhanā"
        >
          <LogOut className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden text-[13px] sm:inline">Sign Out</span>
        </Button>
      </SignOutButton>
    </div>
  );
}
