import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Smartphone, Sparkles } from "lucide-react";

export function ShishyaSection() {
  const benefits = [
    {
      title: "Tap-Optimized Entry",
      sanskrit: "शीघ्रसाधना",
      description:
        "Log waking, 16 rounds of Japa, and Aarti attendance in 30 seconds with zero unnecessary typing.",
      icon: <Smartphone className="h-5 w-5 text-[#2457A6]" />,
    },
    {
      title: "Natural Consistency",
      sanskrit: "नित्यभावः",
      description:
        "See your daily and weekly rhythm with peaceful visual continuity rather than aggressive gamification.",
      icon: <Clock className="h-5 w-5 text-[#D9822B]" />,
    },
    {
      title: "Evening Realizations",
      sanskrit: "आत्मनिरीक्षणम्",
      description:
        "Record brief personal insights, spiritual gratitude, or difficulties for your Guru to review.",
      icon: <Sparkles className="h-5 w-5 text-[#3D765B]" />,
    },
    {
      title: "Focused Spiritual Growth",
      sanskrit: "परिशुद्धिः",
      description:
        "Build steady devotion with quiet clarity and the loving accountability of your spiritual mentor.",
      icon: <CheckCircle2 className="h-5 w-5 text-[#167D8D]" />,
    },
  ];

  return (
    <Section spacing="default" className="bg-[#F7F1E5]">
      <Container size="default">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Narrative */}
          <div className="space-y-4 lg:col-span-5">
            <Badge variant="krishna" size="default">
              <span className="font-serif">शिष्यमार्गः</span> • For Shishyas
            </Badge>
            <h2 className="text-balance text-[26px] font-bold leading-tight tracking-tight text-[#20201D] sm:text-[34px]">
              Your practice. Your rhythm. Your journey.
            </h2>
            <p className="text-[15px] leading-relaxed text-[#66635D] sm:text-[16px]">
              Designed from the ground up for mobile convenience. Recording your Sādhanā takes only
              a few mindful taps at the end of the day.
            </p>
            <div className="pt-2">
              <span className="font-serif text-[14px] italic text-[#D9822B]">
                &ldquo;Discipline is the foundation of devotional peace.&rdquo;
              </span>
            </div>
          </div>

          {/* Right Column Benefits Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b, i) => (
              <Card key={i} className="border-[rgba(32,32,29,0.08)] bg-white/90 p-5 shadow-level1">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F1E5] text-[#20201D]">
                  {b.icon}
                </div>
                <span className="font-serif text-[12px] font-medium text-[#D9822B]">
                  {b.sanskrit}
                </span>
                <h3 className="mb-1.5 mt-0.5 text-[16px] font-semibold text-[#20201D]">
                  {b.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#66635D]">{b.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
