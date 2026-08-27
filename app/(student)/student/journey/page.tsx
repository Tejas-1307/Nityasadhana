import * as React from "react";
import { Container } from "@/components/layout/container";
import { requireShishya } from "@/lib/auth";
import { reportService } from "@/lib/reports/service";
import { SankalpaService } from "@/lib/sankalpa";
import { ReflectionService } from "@/lib/reflection";
import { getSankalpaWeekBoundaries } from "@/lib/sankalpa/date-utils";
import { JourneyView } from "@/components/journey/journey-view";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentJourneyPage() {
  // 1. Server-authoritative role guard (enforces role === 'shishya')
  const user = await requireShishya();
  const week = getSankalpaWeekBoundaries();

  // 2. Fetch Journey Analytics, Sankalpa, and Weekly Reflection data in parallel
  const [
    initialAnalytics,
    activeSankalpa,
    { sankalpas: sankalpaHistory, total: totalSankalpaHistory },
    currentReflection,
    { reflections: reflectionHistory, total: totalReflectionHistory },
  ] = await Promise.all([
    reportService.getStudentJourney({
      studentId: user.id,
      rangeDays: 7,
    }),
    SankalpaService.getActiveSankalpa(user.id),
    SankalpaService.getSankalpaHistory(user.id, 10, 0),
    ReflectionService.getReflectionForWeek(user.id, week.startDate),
    ReflectionService.getReflectionHistory(user.id, 10, 0),
  ]);

  return (
    <main className="py-6 sm:py-10">
      <Container size="reading">
        {/* Calm Editorial Header */}
        <div className="mb-6 space-y-1 sm:mb-8">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#D9822B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-serif">अभ्यासयोगः • यात्रा</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#20201D] sm:text-[28px]">
            Your Journey
          </h1>
          <p className="text-[14px] text-[#66635D]">
            A quiet reflection of your daily Sādhanā patterns, weekly intentions, and personal progress.
          </p>
        </div>

        {/* Interactive Journey Component with Sankalpa & Reflection Integration */}
        <JourneyView
          initialAnalytics={initialAnalytics}
          initialActiveSankalpa={activeSankalpa}
          initialSankalpaHistory={sankalpaHistory}
          totalSankalpaHistory={totalSankalpaHistory}
          initialCurrentReflection={currentReflection}
          initialReflectionHistory={reflectionHistory}
          totalReflectionHistory={totalReflectionHistory}
        />
      </Container>
    </main>
  );
}
