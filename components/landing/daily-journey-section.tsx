import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sun, Heart, Sparkles, BookOpen, Moon } from "lucide-react";

interface TimelineStep {
  time: string;
  sanskrit: string;
  title: string;
  description: string;
  metric: string;
  icon: React.ReactNode;
}

const steps: TimelineStep[] = [
  {
    time: "03:45 AM",
    sanskrit: "जागरणम्",
    title: "Brahmamuhurta Awakening",
    description:
      "Rising in the tranquil auspicious hours before dawn with peaceful mind and gratitude.",
    metric: "Conscious rise",
    icon: <Sun className="h-5 w-5 text-[#A9824D]" />,
  },
  {
    time: "04:30 AM",
    sanskrit: "मङ्गलाऽऽरतिः",
    title: "Maṅgala Āratī & Darśana",
    description:
      "Beginning the day before the Deities in community kirtana, prayer, and morning darshan.",
    metric: "Temple attendance",
    icon: <Sparkles className="h-5 w-5 text-[#3F9495]" />,
  },
  {
    time: "05:15 AM",
    sanskrit: "जपयज्ञः",
    title: "Japa Meditation",
    description:
      "Attentive, focused chanting of the Hare Krishna Mahamantra on sacred Tulasi beads.",
    metric: "16 sacred rounds",
    icon: <Heart className="h-5 w-5 text-[#328A7A]" />,
  },
  {
    time: "07:30 AM",
    sanskrit: "श्रवणम् स्वाध्यायः",
    title: "Śravaṇam & Svādhyāya",
    description:
      "Hearing Śrīmad-Bhāgavatam and deep study of Śrīla Prabhupāda's foundational literature.",
    metric: "45 minutes study",
    icon: <BookOpen className="h-5 w-5 text-[#56BFC0]" />,
  },
  {
    time: "09:00 PM",
    sanskrit: "नित्यसङ्कल्पः",
    title: "Daily Sādhanā Completion",
    description:
      "Closing the day with self-reflection, a brief personal realization, and readiness for rest.",
    metric: "30-second tap log",
    icon: <Moon className="h-5 w-5 text-[#547070]" />,
  },
];

export function DailyJourneySection() {
  return (
    <Section id="journey" spacing="default" className="relative bg-[#EAF7F4]">
      <Container size="default">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <Badge variant="krishna" size="default" className="mb-3">
            <span className="font-serif">नित्यक्रमः</span> • Daily Cadence
          </Badge>
          <h2 className="text-balance text-[26px] font-bold tracking-tight text-[#193B3B] sm:text-[34px]">
            The sacred rhythm of daily Sādhanā.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#547070] sm:text-[16px]">
            Every day is an intentional spiritual offering. Nityasādhanā mirrors the natural Gurukul
            routine from morning wake-up to evening rest.
          </p>
        </div>

        {/* Editorial Vertical Journey Line */}
        <div className="relative mx-auto max-w-2xl">
          {/* Vertical Connecting Sacred Cord */}
          <div
            className="absolute bottom-6 left-[23px] top-6 w-[2px] bg-gradient-to-b from-[#A9824D] via-[#3F9495] to-[#547070]/30 sm:left-[27px]"
            aria-hidden="true"
          />

          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative flex items-start gap-4 sm:gap-6">
                {/* Timeline Node */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(63,148,149,0.22)] bg-white shadow-level1 transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
                  {step.icon}
                </div>

                {/* Content Card */}
                <Card className="flex-1 border-[rgba(63,148,149,0.16)] bg-white/85 p-5 shadow-level1 transition-all hover:shadow-level2 sm:p-6">
                  <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[13px] font-semibold text-[#A9824D]">
                        {step.sanskrit}
                      </span>
                      <span className="font-mono text-[13px] text-[#547070]">{step.time}</span>
                    </div>
                    <span className="bg-[#3F9495]/10 inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-[#3F9495] sm:self-auto">
                      {step.metric}
                    </span>
                  </div>

                  <h3 className="mb-1 text-[17px] font-semibold text-[#193B3B]">{step.title}</h3>
                  <p className="text-[14px] leading-relaxed text-[#547070]">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
