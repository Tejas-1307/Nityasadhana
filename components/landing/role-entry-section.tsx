import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, ArrowRight } from "lucide-react";

export function RoleEntrySection() {
  return (
    <Section
      id="entry"
      spacing="default"
      className="border-t border-[rgba(63,148,149,0.14)] bg-white/70"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="krishna" size="default" className="mb-3">
            <span className="font-serif">प्रवेशद्वारम्</span> • Gateway
          </Badge>
          <h2 className="text-balance text-[28px] font-bold tracking-tight text-[#193B3B] sm:text-[36px]">
            Begin your daily journey.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#547070] sm:text-[16px]">
            Nityasādhanā is built to make recording simple, so the practice itself can remain the
            sacred focus. Choose your entry pathway below.
          </p>
        </div>

        {/* Dual Role Entry Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Shishya Entry Card */}
          <Card className="flex flex-col justify-between border-[#3F9495]/35 bg-[#F7F5EF]/80 p-7 transition-all hover:shadow-level2 sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#3F9495] shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant="krishna" size="sm">
                  <span className="font-serif">शिष्यः</span>
                </Badge>
              </div>

              <h3 className="mb-2 text-[20px] font-bold text-[#193B3B]">Shishya Entry</h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#547070]">
                Log today&apos;s Japa rounds, temple morning programs, and evening reflections in 30
                seconds.
              </p>
            </div>

            <Link href="/login?role=student" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Enter as Shishya
              </Button>
            </Link>
          </Card>

          {/* Guru Entry Card */}
          <Card className="flex flex-col justify-between border-[#A9824D]/35 bg-[#F7F5EF]/80 p-7 transition-all hover:shadow-level2 sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#A9824D] shadow-sm">
                  <Eye className="h-6 w-6" />
                </div>
                <Badge variant="saffron" size="sm">
                  <span className="font-serif">गुरुः</span>
                </Badge>
              </div>

              <h3 className="mb-2 text-[20px] font-bold text-[#193B3B]">Guru Entry</h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#547070]">
                Review your students&apos; daily consistency, understand routine patterns, and guide
                with spiritual care.
              </p>
            </div>

            <Link href="/login?role=guru" className="w-full">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-[rgba(63,148,149,0.22)] bg-white hover:bg-[#D8F1EE]/50"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Enter as Guru
              </Button>
            </Link>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
