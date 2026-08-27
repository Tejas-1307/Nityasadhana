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
      className="border-t border-[rgba(32,32,29,0.06)] bg-white/50"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="saffron" size="default" className="mb-3">
            <span className="font-serif">गुरुशिष्यपरम्परा</span> • Sacred Relationship
          </Badge>
          <h2 className="text-balance text-[26px] font-bold tracking-tight text-[#20201D] sm:text-[34px]">
            Technology should support guidance, not replace it.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#66635D] sm:text-[16px]">
            The heart of spiritual growth lies in personal guidance and care. Nityasādhanā acts as a
            quiet bridge of transparency and dedication.
          </p>
        </div>

        {/* The Two Sides of Guidance Diagram */}
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
            {/* Shishya Role Side */}
            <Card className="border-[rgba(32,32,29,0.1)] bg-[#F7F1E5]/60 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D9BF]/80 text-[#2457A6]">
                <Users className="h-6 w-6" />
              </div>
              <span className="font-serif text-[13px] font-semibold text-[#D9822B]">शिष्यः</span>
              <h3 className="mb-2 mt-0.5 text-[18px] font-bold text-[#20201D]">The Shishya</h3>
              <p className="text-[13px] leading-relaxed text-[#66635D]">
                Practices daily discipline, logs rounds and study with honesty, and reflects on
                personal spiritual growth.
              </p>
            </Card>

            {/* Sacred Connecting Bridge */}
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#2457A6] text-white shadow-level2">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <span className="mt-2 font-serif text-[12px] font-medium text-[#D9822B]">
                साधनासेतुः
              </span>
              <span className="text-[13px] font-semibold text-[#20201D]">Shared Sādhanā Path</span>
              <p className="mt-1 text-[11px] text-[#66635D]">
                Transparency • Consistency • Spiritual Care
              </p>
            </div>

            {/* Guru Role Side */}
            <Card className="border-[rgba(32,32,29,0.1)] bg-[#F7F1E5]/60 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9822B]/20 text-[#D9822B]">
                <Eye className="h-6 w-6" />
              </div>
              <span className="font-serif text-[13px] font-semibold text-[#D9822B]">गुरुः</span>
              <h3 className="mb-2 mt-0.5 text-[18px] font-bold text-[#20201D]">The Guru</h3>
              <p className="text-[13px] leading-relaxed text-[#66635D]">
                Observes spiritual consistency without spreadsheets, provides timely encouragement,
                and guides with deep context.
              </p>
            </Card>
          </div>

          {/* Guiding Philosophy Callout */}
          <div className="mt-8 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-6 text-center shadow-level1 sm:p-7">
            <p className="mx-auto max-w-xl font-serif text-[15px] italic text-[#20201D] sm:text-[16px]">
              &ldquo;Don&apos;t make devotees spend their seva managing software. Make the software
              reduce the work required to perform their seva.&rdquo;
            </p>
            <p className="mt-2 text-[12px] font-medium uppercase tracking-wider text-[#D9822B]">
              Nityasādhanā Seva Philosophy
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
