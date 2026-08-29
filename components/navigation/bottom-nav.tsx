"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NavItem } from "@/lib/constants/nav";
import {
  Home,
  Compass,
  ClipboardCheck,
  User,
  UserRound,
  Sun,
  LineChart,
  LayoutDashboard,
  Users,
  BookOpen,
} from "lucide-react";

export interface BottomNavigationProps {
  items: NavItem[];
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  Compass,
  ClipboardCheck,
  User,
  UserRound,
  Sun,
  LineChart,
  LayoutDashboard,
  Users,
  BookOpen,
};

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 block border-t border-[rgba(63,148,149,0.14)] bg-[#EAF7F4]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-mobile items-center justify-around px-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = ICON_MAP[item.iconName] || Sun;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex h-14 min-h-[48px] w-16 min-w-[48px] flex-col items-center justify-center rounded-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495]",
                isActive ? "text-[#3F9495]" : "text-[#547070] hover:text-[#193B3B]"
              )}
            >
              {isActive && (
                <span
                  className="absolute top-1 h-1 w-5 rounded-full bg-[#3F9495]"
                  aria-hidden="true"
                />
              )}
              <IconComponent
                className={cn(
                  "h-5 w-5 transition-transform group-active:scale-95",
                  isActive ? "stroke-[2.25px]" : "stroke-[1.75px]"
                )}
              />
              <span
                className={cn(
                  "mt-1 text-[11px] font-medium tracking-tight",
                  isActive ? "font-semibold text-[#3F9495]" : "text-[#547070]"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
