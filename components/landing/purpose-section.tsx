import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileSpreadsheet, Sparkles, Check } from "lucide-react";

export function PurposeSection() {
  return (
    <Section
      id="purpose"
      spacing="default"
      className="border-t border-[rgba(63,148,149,0.14)] bg-white/40"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="saffron" size="default" className="mb-3">
            <span className="font-serif">प्रयोजनम्</span> • Purpose
          </Badge>
          <h2 className="text-balance text-[26px] font-bold tracking-tight text-[#193B3B] sm:text-[34px]">
            Built for the discipline of daily Sādhanā.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#547070] sm:text-[16px]">
            Technology should reduce the administrative burden of seva, not create more work.
            Nityasādhanā simplifies routine recording so devotees can focus on spiritual practice.
          </p>
        </div>

        {/* Respectful Comparison: The Traditional Care vs. The Nityasādhanā Flow */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Traditional Manual Effort Card */}
          <Card className="flex flex-col justify-between border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-6 sm:p-7">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#547070]">
                  Current Practice
                </span>
                <span className="font-serif text-[12px] text-[#547070]">पारंपरिक व्यवस्था</span>
              </div>
              <h3 className="mb-3 text-[18px] font-semibold text-[#193B3B]">
                Scattered across messages & sheets
              </h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#547070]">
                Students send daily text updates on WhatsApp, while Gurus manually transcribe logs
                into spreadsheets, consuming valuable time that could be spent in study and
                spiritual guidance.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="space-y-2.5 border-t border-[rgba(63,148,149,0.12)] pt-4">
              <div className="flex items-center gap-3 text-[13px] text-[#547070]">
                <MessageSquare className="h-4 w-4 shrink-0 text-[#547070]" />
                <span>Late night WhatsApp messages</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#547070]">
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-[#547070]" />
                <span>Manual Excel entries & tracking</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#8A6635]">
                <span className="ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8A6635]" />
                <span className="ml-1">Valuable time spent on data management</span>
              </div>
            </div>
          </Card>

          {/* The Nityasādhanā Flow Card */}
          <Card className="relative flex flex-col justify-between overflow-hidden border-[#3F9495]/35 bg-white p-6 shadow-level2 sm:p-7">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle,rgba(63,148,149,0.12)_0%,transparent_70%)]" />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#3F9495]">
                  With Nityasādhanā
                </span>
                <Badge variant="krishna" size="sm">
                  सुगम व्यवस्था
                </Badge>
              </div>
              <h3 className="mb-3 text-[18px] font-semibold text-[#193B3B]">
                One quiet 30-second daily entry
              </h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#547070]">
                Students record their morning and evening disciplines with simple taps. Gurus
                receive instant, organized visibility without managing single spreadsheets.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="space-y-2.5 border-t border-[#3F9495]/20 pt-4">
              <div className="flex items-center gap-3 text-[13px] font-medium text-[#193B3B]">
                <Check className="h-4 w-4 shrink-0 text-[#328A7A]" />
                <span>Tap-based 30-second daily log</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-medium text-[#193B3B]">
                <Check className="h-4 w-4 shrink-0 text-[#328A7A]" />
                <span>Automatic ashram-wide overview for Gurus</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-semibold text-[#3F9495]">
                <Sparkles className="h-4 w-4 shrink-0 text-[#A9824D]" />
                <span>More sacred time for guidance, japa & seva</span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
