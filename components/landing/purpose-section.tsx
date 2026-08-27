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
      className="border-t border-[rgba(32,32,29,0.06)] bg-white/40"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="saffron" size="default" className="mb-3">
            <span className="font-serif">प्रयोजनम्</span> • Purpose
          </Badge>
          <h2 className="text-balance text-[26px] font-bold tracking-tight text-[#20201D] sm:text-[34px]">
            Built for the discipline of daily Sādhanā.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#66635D] sm:text-[16px]">
            Technology should reduce the administrative burden of seva, not create more work.
            Nityasādhanā simplifies routine recording so devotees can focus on spiritual practice.
          </p>
        </div>

        {/* Respectful Comparison: The Traditional Care vs. The Nityasādhanā Flow */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Traditional Manual Effort Card */}
          <Card className="flex flex-col justify-between border-[rgba(32,32,29,0.1)] bg-[#F7F1E5]/40 p-6 sm:p-7">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#66635D]">
                  Current Practice
                </span>
                <span className="font-serif text-[12px] text-[#66635D]">पारंपरिक व्यवस्था</span>
              </div>
              <h3 className="mb-3 text-[18px] font-semibold text-[#20201D]">
                Scattered across messages & sheets
              </h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#66635D]">
                Students send daily text updates on WhatsApp, while Gurus manually transcribe logs
                into spreadsheets, consuming valuable time that could be spent in study and
                spiritual guidance.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="space-y-2.5 border-t border-[rgba(32,32,29,0.08)] pt-4">
              <div className="flex items-center gap-3 text-[13px] text-[#66635D]">
                <MessageSquare className="h-4 w-4 shrink-0 text-[#66635D]" />
                <span>Late night WhatsApp messages</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#66635D]">
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-[#66635D]" />
                <span>Manual Excel entries & tracking</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#A95620]">
                <span className="ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A95620]" />
                <span className="ml-1">Valuable time spent on data management</span>
              </div>
            </div>
          </Card>

          {/* The Nityasādhanā Flow Card */}
          <Card className="relative flex flex-col justify-between overflow-hidden border-[#2457A6]/30 bg-white p-6 shadow-level2 sm:p-7">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle,rgba(36,87,166,0.08)_0%,transparent_70%)]" />

            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#2457A6]">
                  With Nityasādhanā
                </span>
                <Badge variant="krishna" size="sm">
                  सुगम व्यवस्था
                </Badge>
              </div>
              <h3 className="mb-3 text-[18px] font-semibold text-[#20201D]">
                One quiet 30-second daily entry
              </h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#66635D]">
                Students record their morning and evening disciplines with simple taps. Gurus
                receive instant, organized visibility without managing single spreadsheets.
              </p>
            </div>

            {/* Workflow steps */}
            <div className="space-y-2.5 border-t border-[#2457A6]/15 pt-4">
              <div className="flex items-center gap-3 text-[13px] font-medium text-[#20201D]">
                <Check className="h-4 w-4 shrink-0 text-[#3D765B]" />
                <span>Tap-based 30-second daily log</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-medium text-[#20201D]">
                <Check className="h-4 w-4 shrink-0 text-[#3D765B]" />
                <span>Automatic ashram-wide overview for Gurus</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-semibold text-[#2457A6]">
                <Sparkles className="h-4 w-4 shrink-0 text-[#D9822B]" />
                <span>More sacred time for guidance, japa & seva</span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
