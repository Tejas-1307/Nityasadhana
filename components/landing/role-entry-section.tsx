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
      className="border-t border-[rgba(32,32,29,0.06)] bg-white/70"
    >
      <Container size="default">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="krishna" size="default" className="mb-3">
            <span className="font-serif">प्रवेशद्वारम्</span> • Gateway
          </Badge>
          <h2 className="text-balance text-[28px] font-bold tracking-tight text-[#20201D] sm:text-[36px]">
            Begin your daily journey.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#66635D] sm:text-[16px]">
            Nityasādhanā is built to make recording simple, so the practice itself can remain the
            sacred focus. Choose your entry pathway below.
          </p>
        </div>

        {/* Dual Role Entry Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* Shishya Entry Card */}
          <Card className="flex flex-col justify-between border-[#2457A6]/30 bg-[#F7F1E5]/60 p-7 transition-all hover:shadow-level2 sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2457A6] shadow-sm">
                  <Users className="h-6 w-6" />
                </div>
                <Badge variant="krishna" size="sm">
                  <span className="font-serif">शिष्यः</span>
                </Badge>
              </div>

              <h3 className="mb-2 text-[20px] font-bold text-[#20201D]">Shishya Entry</h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#66635D]">
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
          <Card className="flex flex-col justify-between border-[#D9822B]/30 bg-[#F7F1E5]/60 p-7 transition-all hover:shadow-level2 sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#D9822B] shadow-sm">
                  <Eye className="h-6 w-6" />
                </div>
                <Badge variant="saffron" size="sm">
                  <span className="font-serif">गुरुः</span>
                </Badge>
              </div>

              <h3 className="mb-2 text-[20px] font-bold text-[#20201D]">Guru Entry</h3>
              <p className="mb-6 text-[14px] leading-relaxed text-[#66635D]">
                Review your students&apos; daily consistency, understand routine patterns, and guide
                with spiritual care.
              </p>
            </div>

            <Link href="/login?role=guru" className="w-full">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-[rgba(32,32,29,0.15)] bg-white hover:bg-[#E8D9BF]/40"
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
