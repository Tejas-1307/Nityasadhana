"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Users, Sparkles } from "lucide-react";
import { InviteModal } from "@/components/invitations/invite-modal";

export function GuruBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/guru",
      icon: LayoutDashboard,
      isActive: pathname === "/guru",
    },
    {
      name: "Digest",
      href: "/guru/digest",
      icon: Sparkles,
      isActive: pathname.startsWith("/guru/digest"),
    },
    {
      name: "Shishyas",
      href: "/guru/shishyas",
      icon: Users,
      isActive: pathname.startsWith("/guru/shishyas"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(32,32,29,0.08)] bg-white/95 px-3 py-2 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 transition-all",
                item.isActive
                  ? "text-[#D9822B] font-bold"
                  : "text-[#66635D] hover:text-[#20201D]"
              )}
            >
              <Icon className={cn("h-5 w-5", item.isActive && "stroke-[2.5px]")} />
              <span className="text-[11px]">{item.name}</span>
            </Link>
          );
        })}

        {/* Quick Invite Button */}
        <div className="flex flex-col items-center">
          <InviteModal triggerVariant="ghost" triggerSize="sm" />
        </div>
      </div>
    </div>
  );
}
