import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Users, Eye } from "lucide-react";

export function GuruShishyaSection() {
  return (
    <Section
      id="guru-shishya"
      spacing="default"
      className="border-t border-[rgba(63,148,149,0.14)] bg-white/50"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="saffron" size="default" className="mb-3">
            <span className="font-serif">गुरुशिष्यपरम्परा</span> • Sacred Relationship
          </Badge>
          <h2 className="text-balance text-[26px] font-bold tracking-tight text-[#193B3B] sm:text-[34px]">
            Technology should support guidance, not replace it.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#547070] sm:text-[16px]">
            The heart of spiritual growth lies in personal guidance and care. Nityasādhanā acts as a
            quiet bridge of transparency and dedication.
          </p>
        </div>

        {/* The Two Sides of Guidance Diagram */}
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
            {/* Shishya Role Side */}
            <Card className="border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/70 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D8F1EE] text-[#3F9495]">
                <Users className="h-6 w-6" />
              </div>
              <span className="font-serif text-[13px] font-semibold text-[#A9824D]">शिष्यः</span>
              <h3 className="mb-2 mt-0.5 text-[18px] font-bold text-[#193B3B]">The Shishya</h3>
              <p className="text-[13px] leading-relaxed text-[#547070]">
                Practices daily discipline, logs rounds and study with honesty, and reflects on
                personal spiritual growth.
              </p>
            </Card>

            {/* Sacred Connecting Bridge */}
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#3F9495] text-white shadow-level2">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <span className="mt-2 font-serif text-[12px] font-medium text-[#A9824D]">
                साधनासेतुः
              </span>
              <span className="text-[13px] font-semibold text-[#193B3B]">Shared Sādhanā Path</span>
              <p className="mt-1 text-[11px] text-[#547070]">
                Transparency • Consistency • Spiritual Care
              </p>
            </div>

            {/* Guru Role Side */}
            <Card className="border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/70 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#A9824D]/15 text-[#A9824D]">
                <Eye className="h-6 w-6" />
              </div>
              <span className="font-serif text-[13px] font-semibold text-[#A9824D]">गुरुः</span>
              <h3 className="mb-2 mt-0.5 text-[18px] font-bold text-[#193B3B]">The Guru</h3>
              <p className="text-[13px] leading-relaxed text-[#547070]">
                Observes spiritual consistency without spreadsheets, provides timely encouragement,
                and guides with deep context.
              </p>
            </Card>
          </div>

          {/* Guiding Philosophy Callout */}
          <div className="mt-8 rounded-2xl border border-[rgba(63,148,149,0.14)] bg-white p-6 text-center shadow-level1 sm:p-7">
            <p className="mx-auto max-w-xl font-serif text-[15px] italic text-[#193B3B] sm:text-[16px]">
              &ldquo;Don&apos;t make devotees spend their seva managing software. Make the software
              reduce the work required to perform their seva.&rdquo;
            </p>
            <p className="mt-2 text-[12px] font-medium uppercase tracking-wider text-[#A9824D]">
              Nityasādhanā Seva Philosophy
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
