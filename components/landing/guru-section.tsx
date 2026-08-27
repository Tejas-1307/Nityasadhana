import * as React from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, HeartHandshake, ShieldCheck, Compass } from "lucide-react";

export function GuruSection() {
  const benefits = [
    {
      title: "Ashram-Wide Clarity",
      sanskrit: "समग्रदृष्टिः",
      description:
        "Instantly see daily Sadhana status across your Brahmachari students without chasing individual messages.",
      icon: <Eye className="h-5 w-5 text-[#D9822B]" />,
    },
    {
      title: "Proactive Spiritual Care",
      sanskrit: "वात्सल्यम्",
      description:
        "Quickly notice when a student is struggling with morning waking or rounds so you can offer timely encouragement.",
      icon: <HeartHandshake className="h-5 w-5 text-[#2457A6]" />,
    },
    {
      title: "Zero Spreadsheets",
      sanskrit: "प्रशासनमुक्तिः",
      description:
        "Spend your seva in study, japa, and direct devotional counseling rather than manual data entry.",
      icon: <ShieldCheck className="h-5 w-5 text-[#3D765B]" />,
    },
    {
      title: "Deepened Spiritual Mentorship",
      sanskrit: "मार्गदर्शनम्",
      description:
        "Read your Shishyas' daily realizations and understand their devotional journey with authentic context.",
      icon: <Compass className="h-5 w-5 text-[#167D8D]" />,
    },
  ];

  return (
    <Section spacing="default" className="border-t border-[rgba(32,32,29,0.06)] bg-white/60">
      <Container size="default">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Benefits Grid */}
          <div className="order-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-1 lg:col-span-7">
            {benefits.map((b, i) => (
              <Card
                key={i}
                className="border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]/40 p-5 shadow-level1"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#20201D] shadow-sm">
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

          {/* Right Column Narrative */}
          <div className="order-1 space-y-4 lg:order-2 lg:col-span-5">
            <Badge variant="saffron" size="default">
              <span className="font-serif">गुरुमार्गः</span> • For Gurus
            </Badge>
            <h2 className="text-balance text-[26px] font-bold leading-tight tracking-tight text-[#20201D] sm:text-[34px]">
              Less administration. More guidance.
            </h2>
            <p className="text-[15px] leading-relaxed text-[#66635D] sm:text-[16px]">
              Nityasādhanā eliminates administrative friction so spiritual teachers can focus their
              energy on what truly matters: caring for their students&apos; spiritual well-being.
            </p>
            <div className="pt-2">
              <span className="font-serif text-[14px] italic text-[#2457A6]">
                &ldquo;Guidance is most effective when grounded in consistent understanding.&rdquo;
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
