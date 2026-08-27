import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/branding/brand-mark";

export function LandingFooter() {
  return (
    <footer className="border-t border-[rgba(32,32,29,0.08)] bg-[#F7F1E5] py-12">
      <Container size="default">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand & Purpose */}
          <div className="flex flex-col items-center space-y-1.5 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2.5">
              <BrandMark size={24} />
              <span className="text-[16px] font-bold tracking-tight text-[#20201D]">
                Nityasādhanā
              </span>
              <span className="font-serif text-[14px] text-[#D9822B]">• नित्यसाधना</span>
            </div>
            <p className="text-[13px] text-[#66635D]">
              Built with devotion for{" "}
              <span className="font-semibold text-[#20201D]">ISKCON Pune</span>.
            </p>
          </div>

          {/* Minimal Navigation & Links */}
          <div className="flex items-center gap-6 text-[13px] text-[#66635D]">
            <Link href="/about" className="transition-colors hover:text-[#20201D]">
              About
            </Link>
            <Link href="/design-system" className="transition-colors hover:text-[#20201D]">
              Design System
            </Link>
            <a href="#purpose" className="transition-colors hover:text-[#20201D]">
              Philosophy
            </a>
          </div>
        </div>

        {/* Bottom Seva Philosophy Note */}
        <div className="mt-8 border-t border-[rgba(32,32,29,0.06)] pt-6 text-center text-[12px] text-[#66635D]/80">
          &ldquo;Don&apos;t make devotees spend their seva managing software. Make the software
          reduce the work required to perform their seva.&rdquo;
        </div>
      </Container>
    </footer>
  );
}
