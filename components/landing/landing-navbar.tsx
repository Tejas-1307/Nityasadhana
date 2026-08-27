import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(32,32,29,0.06)] bg-[#F7F1E5]/90 backdrop-blur-md transition-all">
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
              className="text-[14px] font-medium text-[#66635D] transition-colors hover:text-[#20201D]"
            >
              Purpose
            </a>
            <a
              href="#journey"
              className="text-[14px] font-medium text-[#66635D] transition-colors hover:text-[#20201D]"
            >
              Daily Journey
            </a>
            <a
              href="#guru-shishya"
              className="text-[14px] font-medium text-[#66635D] transition-colors hover:text-[#20201D]"
            >
              Guru–Shishya
            </a>
            <Link
              href="/about"
              className="text-[14px] font-medium text-[#66635D] transition-colors hover:text-[#20201D]"
            >
              About
            </Link>
          </nav>

          {/* Direct Role Entry Action */}
          <div className="flex items-center gap-2.5">
            <a href="#entry">
              <Button variant="primary" size="sm" className="px-4 text-[13px] sm:text-[14px]">
                Enter
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
