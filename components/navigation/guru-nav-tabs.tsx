"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Users, Sparkles } from "lucide-react";

export function GuruNavTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Overview",
      sanskrit: "सिंहावलोकनम्",
      href: "/guru",
      icon: LayoutDashboard,
      isActive: pathname === "/guru",
    },
    {
      name: "Weekly Digest",
      sanskrit: "साप्ताहिकम्",
      href: "/guru/digest",
      icon: Sparkles,
      isActive: pathname.startsWith("/guru/digest"),
    },
    {
      name: "My Shishyas",
      sanskrit: "मम शिष्याः",
      href: "/guru/shishyas",
      icon: Users,
      isActive: pathname.startsWith("/guru/shishyas"),
    },
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-[rgba(63,148,149,0.14)] bg-white px-3 sm:gap-2 sm:px-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-3 text-[13px] font-semibold transition-all sm:px-4 sm:text-[14px]",
              tab.isActive
                ? "border-[#3F9495] text-[#3F9495]"
                : "border-transparent text-[#547070] hover:border-[rgba(63,148,149,0.25)] hover:text-[#193B3B]"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.name}</span>
            <span className="hidden font-serif text-[11px] font-normal opacity-75 md:inline">
              ({tab.sanskrit})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
