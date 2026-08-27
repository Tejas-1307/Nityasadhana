"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/branding/logo";
import { Container } from "@/components/layout/container";
import { UserMenu } from "@/components/auth/user-menu";
import { STUDENT_NAV_ITEMS } from "@/lib/constants/nav";
import { Home, Compass, ClipboardCheck, User } from "lucide-react";

export interface StudentTopNavProps {
  userName?: string;
  userEmail?: string;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  Compass,
  ClipboardCheck,
  User,
};

export function StudentTopNav({ userName, userEmail, className }: StudentTopNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/95 backdrop-blur-md",
        className
      )}
    >
      <Container size="default">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo size="default" href="/student" />

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Student Main Navigation"
              className="hidden items-center gap-1 md:flex"
            >
              {STUDENT_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = ICON_MAP[item.iconName] || Home;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex h-10 items-center gap-2 rounded-xl px-3.5 text-[14px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457A6]",
                      isActive
                        ? "bg-[#2457A6]/10 font-semibold text-[#2457A6]"
                        : "text-[#66635D] hover:bg-[#E8D9BF]/30 hover:text-[#20201D]"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-4 w-4 transition-transform group-active:scale-95",
                        isActive ? "text-[#2457A6] stroke-[2.25px]" : "text-[#66635D] stroke-[1.75px]"
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Menu & Sign Out */}
          <UserMenu role="shishya" userName={userName} userEmail={userEmail} />
        </div>
      </Container>
    </header>
  );
}
