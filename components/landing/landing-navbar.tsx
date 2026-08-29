import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.14)] bg-[#EAF7F4]/90 backdrop-blur-md transition-all">
      <Container size="default">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo size="default" href="/" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main Navigation">
            <a
              href="#purpose"
              className="text-[14px] font-medium text-[#547070] transition-colors hover:text-[#193B3B]"
            >
              Purpose
            </a>
            <a
              href="#journey"
              className="text-[14px] font-medium text-[#547070] transition-colors hover:text-[#193B3B]"
            >
              Daily Journey
            </a>
            <a
              href="#guru-shishya"
              className="text-[14px] font-medium text-[#547070] transition-colors hover:text-[#193B3B]"
            >
              Guru–Shishya
            </a>
            <Link
              href="/about"
              className="text-[14px] font-medium text-[#547070] transition-colors hover:text-[#193B3B]"
            >
              About
            </Link>
          </nav>

          {/* Direct Role Entry Action */}
          <div className="flex items-center gap-2.5">
            <a
              href="#entry"
              className="group inline-flex rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F9495] focus-visible:ring-offset-2"
            >
              <Button
                variant="primary"
                size="sm"
                className="px-4 text-[13px] transition-all duration-200 active:scale-[0.97] sm:px-5 sm:text-[14px]"
                rightIcon={
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                }
              >
                <span className="inline sm:hidden">Begin</span>
                <span className="hidden sm:inline">Begin Journey</span>
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
