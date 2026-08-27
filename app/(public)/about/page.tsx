import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TopBar } from "@/components/navigation/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SanskritQuote } from "@/components/typography/sanskrit-quote";
import { ArrowLeft, Sparkles, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#20201D]">
      <TopBar
        rightAction={
          <Link href="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
        }
      />

      <main>
        <Section spacing="default">
          <Container size="reading">
            <div className="space-y-6">
              <div>
                <p className="font-serif text-[13px] font-semibold uppercase tracking-wider text-[#D9822B]">
                  ध्येयं च दर्शनम्
                </p>
                <h1 className="mt-1 text-[32px] font-bold tracking-tight text-[#20201D] sm:text-[36px]">
                  About Nityasādhanā
                </h1>
                <p className="mt-2 text-[16px] text-[#66635D]">
                  A dedicated platform designed for ISKCON Pune to support Brahmacharya students and
                  their Gurus in daily spiritual practice.
                </p>
              </div>

              <SanskritQuote
                shloka="अभ्यासयोगेन ततो मामिच्छाप्तुं धनञ्जय"
                translation="My dear Arjuna, acquire the desire to attain Me through the practice of devotional yoga."
                source="Bhagavad-gītā 12.9"
                variant="card"
              />

              <Card className="space-y-4">
                <h2 className="text-[20px] font-semibold text-[#20201D]">Product Philosophy</h2>
                <blockquote className="border-l-2 border-[#2457A6] pl-4 text-[15px] italic text-[#20201D]">
                  &ldquo;Technology should reduce the administrative burden of seva, not create more
                  work.&rdquo;
                </blockquote>
                <p className="text-[15px] leading-relaxed text-[#66635D]">
                  In the traditional Gurukul system, spiritual life flourished through personal
                  guidance, regular discipline, and unbroken contemplation. Modern administrative
                  tracking often introduces distractions, heavy spreadsheets, and burnout.
                </p>
                <p className="text-[15px] leading-relaxed text-[#66635D]">
                  Nityasādhanā bridges timeless spiritual heritage with calm, minimalist technology.
                  Every interaction is designed to require minimal typing, fewest possible clicks,
                  and zero unnecessary gamification.
                </p>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2457A6]/10 text-[#2457A6]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#20201D]">Calm Editorial UX</h3>
                  <p className="mt-1.5 text-[14px] text-[#66635D]">
                    Restrained color palette inspired by Vrindavan, handmade paper, and natural
                    earth pigments.
                  </p>
                </Card>

                <Card>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9822B]/15 text-[#D9822B]">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#20201D]">Guru–Shishya Focus</h3>
                  <p className="mt-1.5 text-[14px] text-[#66635D]">
                    Strengthening the personal mentoring connection without intrusive management.
                  </p>
                </Card>
              </div>

              <div className="pt-4 text-center">
                <Link href="/student">
                  <Button variant="primary" size="default">
                    Enter Platform →
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
