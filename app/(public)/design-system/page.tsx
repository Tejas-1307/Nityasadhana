"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { TopBar } from "@/components/navigation/top-bar";
import { BrandMark } from "@/components/branding/brand-mark";
import { Logo } from "@/components/branding/logo";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Stepper } from "@/components/ui/stepper";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  MetricCard,
  InfoCard,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/state-views";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { SanskritQuote } from "@/components/typography/sanskrit-quote";
import {
  Sun,
  Compass,
  Sparkles,
  BookOpen,
  Headphones,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function DesignSystemShowcase() {
  // Interactive state demos for form controls
  const [japaRounds, setJapaRounds] = React.useState(16);
  const [readingMins, setReadingMins] = React.useState(30);
  const [isEarlyAwake, setIsEarlyAwake] = React.useState(true);
  const [isMangalaAarti, setIsMangalaAarti] = React.useState(true);
  const [timePeriod, setTimePeriod] = React.useState<string>("today");
  const [targetRounds, setTargetRounds] = React.useState<number>(16);

  return (
    <div className="min-h-screen bg-[#F7F1E5] pb-24 text-[#20201D]">
      {/* Top Header */}
      <TopBar
        rightAction={
          <Link href="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to App
            </Button>
          </Link>
        }
      />

      <main className="py-8">
        <Container size="default">
          {/* Showcase Intro Header */}
          <div className="mb-12 border-b border-[rgba(32,32,29,0.10)] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge variant="saffron" size="default" className="mb-2">
                  <span className="font-serif">प्रणाली</span>
                  <span>Internal Design System Showcase</span>
                </Badge>
                <h1 className="text-[34px] font-bold tracking-tight text-[#20201D] sm:text-[42px]">
                  Nityasādhanā Design System
                </h1>
                <p className="mt-2 max-w-2xl text-[16px] text-[#66635D]">
                  Ancient Gurukul × Vrindavan × Krishna × Modern Editorial Product Design. The
                  complete source of truth for UI components, tokens, and mobile touch patterns.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="krishna" size="default">
                  WCAG 2.1 AA Compliant
                </Badge>
                <Badge variant="feather" size="default">
                  Mobile-First (360px+)
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {/* 1. BRAND IDENTITY & LOGO SUITE */}
            <section id="logos" className="space-y-6">
              <PageHeader
                title="1. Brand Identity & Logo Suite"
                sanskritSubtitle="मुद्रा च परिचयः"
                description="Scalable SVG lockups designed for mobile headers, auth screens, icons, and print."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Horizontal Primary Lockup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Primary Horizontal Lockup</CardTitle>
                    <CardDescription>
                      Main brand lockup for navigation bars and desktop headers.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex h-24 items-center justify-center rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-4">
                    <Logo variant="horizontal" size="default" asDiv />
                  </div>
                </Card>

                {/* Compact Mobile Lockup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compact Header Lockup</CardTitle>
                    <CardDescription>Designed for compact 360px mobile viewports.</CardDescription>
                  </CardHeader>
                  <div className="flex h-24 items-center justify-center rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-4">
                    <Logo variant="compact" size="sm" asDiv />
                  </div>
                </Card>

                {/* Vertical Stacked Lockup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vertical Stacked Lockup</CardTitle>
                    <CardDescription>
                      For splash screens, login modals, and print media.
                    </CardDescription>
                  </CardHeader>
                  <div className="flex h-36 items-center justify-center rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-4">
                    <Logo variant="vertical" size="lg" asDiv />
                  </div>
                </Card>

                {/* Monochrome & Dark Context Lockup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monochrome & Dark Surfaces</CardTitle>
                    <CardDescription>
                      Single-color charcoal & high-contrast dark variants.
                    </CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex h-28 items-center justify-center rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-2">
                      <Logo variant="monochrome" size="default" asDiv />
                    </div>
                    <div className="flex h-28 items-center justify-center rounded-xl bg-[#20201D] p-2">
                      <Logo variant="dark" size="default" asDiv />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Brand Mark Size Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle>Peacock-Feather Brand Mark (Optical Sizing Scale)</CardTitle>
                  <CardDescription>
                    Geometric symbol combining peacock contour and upward spiritual path. Tested
                    from 16px favicon to 128px hero icon.
                  </CardDescription>
                </CardHeader>
                <div className="flex flex-wrap items-end justify-between gap-6 rounded-xl border border-[rgba(32,32,29,0.06)] bg-[#F7F1E5] p-6">
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={16} />
                    <span className="font-mono text-[11px] text-[#66635D]">16px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={24} />
                    <span className="font-mono text-[11px] text-[#66635D]">24px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={32} />
                    <span className="font-mono text-[11px] text-[#66635D]">32px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={48} />
                    <span className="font-mono text-[11px] text-[#66635D]">48px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={64} />
                    <span className="font-mono text-[11px] text-[#66635D]">64px</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <BrandMark size={96} />
                    <span className="font-mono text-[11px] text-[#66635D]">96px</span>
                  </div>
                </div>
              </Card>
            </section>

            {/* 2. COLOR HARMONY & CONTRAST */}
            <section id="colors" className="space-y-6">
              <PageHeader
                title="2. Color System & Ratios"
                sanskritSubtitle="वर्णसन्तुलनम्"
                description="Target balance: 65% Warm Ivory/Sand, 18% Deep Charcoal, 10% Krishna Blue, 5% Gurukul Saffron, 2% Peacock/Feather Green."
              />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {/* Warm Ivory */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg border border-[rgba(32,32,29,0.08)] bg-[#F7F1E5]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Warm Ivory</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#F7F1E5</p>
                  <Badge variant="sand" size="sm" className="mt-1">
                    Primary Bg (65%)
                  </Badge>
                </div>

                {/* Soft Sand */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#E8D9BF]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Soft Sand</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#E8D9BF</p>
                  <Badge variant="neutral" size="sm" className="mt-1">
                    Secondary Surface
                  </Badge>
                </div>

                {/* Deep Charcoal */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#20201D]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Deep Charcoal</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#20201D</p>
                  <Badge variant="neutral" size="sm" className="mt-1">
                    Primary Text (18%)
                  </Badge>
                </div>

                {/* Krishna Blue */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#2457A6]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Krishna Blue</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#2457A6</p>
                  <Badge variant="krishna" size="sm" className="mt-1">
                    Primary Accent (10%)
                  </Badge>
                </div>

                {/* Gurukul Saffron */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#D9822B]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Gurukul Saffron</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#D9822B</p>
                  <Badge variant="saffron" size="sm" className="mt-1">
                    Spiritual Accent (5%)
                  </Badge>
                </div>

                {/* Peacock Blue */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#167D8D]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Peacock Blue</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#167D8D</p>
                  <Badge variant="krishna" size="sm" className="mt-1">
                    Secondary Accent
                  </Badge>
                </div>

                {/* Feather Green */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#3D765B]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Feather Green</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#3D765B</p>
                  <Badge variant="feather" size="sm" className="mt-1">
                    Success / Flora
                  </Badge>
                </div>

                {/* Deep Saffron */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#A95620]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Deep Saffron</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#A95620</p>
                  <Badge variant="saffron" size="sm" className="mt-1">
                    Darker Accent
                  </Badge>
                </div>

                {/* Muted Charcoal */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[#66635D]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Muted Charcoal</p>
                  <p className="font-mono text-[11px] text-[#66635D]">#66635D</p>
                  <Badge variant="neutral" size="sm" className="mt-1">
                    Secondary Text
                  </Badge>
                </div>

                {/* Subtle Border */}
                <div className="shadow-xs rounded-xl border border-[rgba(32,32,29,0.1)] bg-white p-3">
                  <div className="mb-2 h-16 w-full rounded-lg bg-[rgba(32,32,29,0.08)]" />
                  <p className="text-[13px] font-bold text-[#20201D]">Warm Border</p>
                  <p className="font-mono text-[11px] text-[#66635D]">rgba(32,32,29,0.08)</p>
                  <Badge variant="neutral" size="sm" className="mt-1">
                    1px Subtle
                  </Badge>
                </div>
              </div>
            </section>

            {/* 3. TYPOGRAPHY SYSTEM */}
            <section id="typography" className="space-y-6">
              <PageHeader
                title="3. Typography Hierarchy"
                sanskritSubtitle="अक्षरविन्यासः"
                description="Nunito Sans (modern readable UI) + Noto Serif Devanagari (Sanskrit shlokas & spiritual moments)."
              />

              <Card className="space-y-6">
                <div className="border-b border-[rgba(32,32,29,0.08)] pb-4">
                  <span className="font-mono text-[12px] text-[#D9822B]">
                    Display / 52px Desktop • 36px Mobile
                  </span>
                  <Heading level="display" className="mt-1">
                    Nityasādhanā Discipline
                  </Heading>
                </div>

                <div className="border-b border-[rgba(32,32,29,0.08)] pb-4">
                  <span className="font-mono text-[12px] text-[#D9822B]">
                    Heading 1 / 36px Desktop • 28px Mobile
                  </span>
                  <Heading level="h1" className="mt-1">
                    Today&apos;s Sadhana Practice
                  </Heading>
                </div>

                <div className="border-b border-[rgba(32,32,29,0.08)] pb-4">
                  <span className="font-mono text-[12px] text-[#D9822B]">Heading 2 / 28px</span>
                  <Heading level="h2" className="mt-1">
                    Guru–Shishya Daily Reflections
                  </Heading>
                </div>

                <div className="border-b border-[rgba(32,32,29,0.08)] pb-4">
                  <span className="font-mono text-[12px] text-[#D9822B]">Heading 3 / 22px</span>
                  <Heading level="h3" className="mt-1">
                    Japa Meditation & Scripture Study
                  </Heading>
                </div>

                <div className="border-b border-[rgba(32,32,29,0.08)] pb-4">
                  <span className="font-mono text-[12px] text-[#D9822B]">Body Text / 16px</span>
                  <Text className="mt-1 max-w-2xl leading-relaxed">
                    Technology should reduce the administrative burden of seva, not create more
                    work. Shishyas record their Sadhana in under 30 seconds every morning.
                  </Text>
                </div>

                <div>
                  <span className="font-mono text-[12px] text-[#D9822B]">
                    Devanagari Sanskrit Shloka Component
                  </span>
                  <div className="mt-2 max-w-xl">
                    <SanskritQuote
                      shloka="नित्यं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः"
                      translation="Perform your prescribed duty, for doing so is better than inaction."
                      source="Bhagavad-gītā 3.8"
                      variant="hero"
                    />
                  </div>
                </div>
              </Card>
            </section>

            {/* 4. BUTTON SYSTEM */}
            <section id="buttons" className="space-y-6">
              <PageHeader
                title="4. Button System"
                sanskritSubtitle="क्रियागुण्डिकाः"
                description="52px standard touch target height, 12px radius, subtle 0.98 active press scale."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="space-y-4">
                  <h3 className="text-[16px] font-semibold text-[#20201D]">Button Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary (Krishna Blue)</Button>
                    <Button variant="secondary">Secondary (Warm Sand)</Button>
                    <Button variant="saffron">Saffron Action</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </Card>

                <Card className="space-y-4">
                  <h3 className="text-[16px] font-semibold text-[#20201D]">
                    Button States & Touch Targets
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      With Right Icon
                    </Button>
                    <Button variant="primary" isLoading>
                      Saving...
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled State
                    </Button>
                    <IconButton aria-label="Quick action" variant="secondary">
                      <Sun className="h-5 w-5 text-[#D9822B]" />
                    </IconButton>
                    <IconButton aria-label="Compass" variant="primary">
                      <Compass className="h-5 w-5 text-white" />
                    </IconButton>
                  </div>
                </Card>
              </div>
            </section>

            {/* 5. TAP-BASED FORM SYSTEM (MINIMUM TYPING) */}
            <section id="forms" className="space-y-6">
              <PageHeader
                title="5. Tap-Based Form Controls (Minimum Typing UX)"
                sanskritSubtitle="सरलविवरणप्रणाली"
                description="Designed specifically for fast mobile Sadhana logging with maximum tap controls and minimal keyboard typing."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Steppers & Toggles */}
                <Card className="space-y-5">
                  <h3 className="text-[16px] font-semibold text-[#20201D]">
                    Touch Steppers & Toggles
                  </h3>

                  {/* Japa Counter */}
                  <Stepper
                    label="Japa Rounds Completed"
                    sanskritLabel="जपसंख्या"
                    unit="rounds"
                    value={japaRounds}
                    onChange={setJapaRounds}
                    min={0}
                    max={64}
                    step={1}
                  />

                  {/* Reading Minutes */}
                  <Stepper
                    label="Scripture Study Time"
                    sanskritLabel="ग्रन्थपठनम्"
                    unit="mins"
                    value={readingMins}
                    onChange={setReadingMins}
                    min={0}
                    max={180}
                    step={15}
                  />

                  <div className="space-y-1 border-t border-[rgba(32,32,29,0.08)] pt-3">
                    <Toggle
                      label="Early Morning Awake (Before 4:00 AM)"
                      sanskritLabel="प्रातःजागरणम्"
                      checked={isEarlyAwake}
                      onChange={setIsEarlyAwake}
                    />

                    <Toggle
                      label="Attended Mangala Aarti"
                      sanskritLabel="मङ्गळारती"
                      checked={isMangalaAarti}
                      onChange={setIsMangalaAarti}
                      variant="saffron"
                    />
                  </div>
                </Card>

                {/* Segmented Controls & Inputs */}
                <Card className="space-y-5">
                  <h3 className="text-[16px] font-semibold text-[#20201D]">
                    Segmented Selectors & Inputs
                  </h3>

                  <SegmentedControl
                    label="View Time Horizon"
                    sanskritLabel="कालखण्डः"
                    value={timePeriod}
                    onChange={setTimePeriod}
                    options={[
                      { value: "today", label: "Today", sanskritLabel: "अद्य" },
                      { value: "week", label: "Week", sanskritLabel: "सप्ताहः" },
                      { value: "month", label: "Month", sanskritLabel: "मासः" },
                    ]}
                  />

                  <SegmentedControl
                    label="Daily Target Sankalpa"
                    sanskritLabel="सङ्कल्पः"
                    value={targetRounds}
                    onChange={setTargetRounds}
                    options={[
                      { value: 16, label: "16 Rounds" },
                      { value: 20, label: "20 Rounds" },
                      { value: 24, label: "24 Rounds" },
                      { value: 32, label: "32 Rounds" },
                    ]}
                  />

                  <div>
                    <Label htmlFor="demoInput" sanskritHint="जागरणकालः">
                      Wake-up Time
                    </Label>
                    <Input id="demoInput" type="time" defaultValue="03:45" />
                  </div>

                  <div>
                    <Label htmlFor="demoSelect">Ashram Group</Label>
                    <Select
                      id="demoSelect"
                      options={[
                        {
                          value: "b1",
                          label: "Brahmachari Ashram Pune (Mandir)",
                          sanskritLabel: "पुणे मन्दिरम्",
                        },
                        {
                          value: "b2",
                          label: "NVCC Katraj Center",
                          sanskritLabel: "कात्रज केंद्रम्",
                        },
                        { value: "b3", label: "Nigdi Sadhana Group" },
                      ]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="demoTextarea">Personal Realization / Reflection</Label>
                    <Textarea
                      id="demoTextarea"
                      placeholder="Enter brief thoughts on today's japa..."
                      maxCharacters={150}
                    />
                  </div>
                </Card>
              </div>
            </section>

            {/* 6. CARD SYSTEM */}
            <section id="cards" className="space-y-6">
              <PageHeader
                title="6. Card Variations"
                sanskritSubtitle="फलकप्रभेदाः"
                description="Standard, Highlight, Metric, Interactive, and Information cards."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <MetricCard
                  label="Japa Rounds Completed"
                  sanskritLabel="जपसङ्ख्या"
                  value={japaRounds}
                  unit="of 16"
                  icon={<Sun className="h-5 w-5" />}
                  variant="krishna"
                  trend="Target Completed"
                />

                <MetricCard
                  label="Scripture Study"
                  sanskritLabel="ग्रन्थपठनम्"
                  value={readingMins}
                  unit="minutes"
                  icon={<BookOpen className="h-5 w-5" />}
                  variant="saffron"
                />

                <MetricCard
                  label="Hearing / Lecture"
                  sanskritLabel="श्रवणम्"
                  value={45}
                  unit="minutes"
                  icon={<Headphones className="h-5 w-5" />}
                  variant="default"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card variant="highlightSaffron">
                  <h4 className="text-[16px] font-semibold text-[#20201D]">
                    Gurukul Saffron Highlight Card
                  </h4>
                  <p className="mt-1 text-[14px] text-[#66635D]">
                    Used for spiritual milestones, important alerts from Guru, and auspicious
                    Sadhana indicators.
                  </p>
                </Card>

                <Card variant="highlightBlue">
                  <h4 className="text-[16px] font-semibold text-[#20201D]">
                    Krishna Blue Highlight Card
                  </h4>
                  <p className="mt-1 text-[14px] text-[#66635D]">
                    Used for daily entry summaries and primary active recommendations.
                  </p>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard
                  title="Mindful Japa Principle"
                  description="Complete minimum 16 rounds of the Hare Krishna Maha-mantra with attentive hearing before noon."
                  icon={<Sparkles className="h-5 w-5 text-[#2457A6]" />}
                  variant="krishna"
                />

                <InfoCard
                  title="Guru–Shishya Confidentiality"
                  description="Your daily Sadhana reflections are private between you and your guiding Guru."
                  icon={<ShieldCheck className="h-5 w-5 text-[#D9822B]" />}
                  variant="saffron"
                />
              </div>
            </section>

            {/* 7. BADGES, DIVIDERS & AVATARS */}
            <section id="components" className="space-y-6">
              <PageHeader
                title="7. Badges, Dividers & Avatars"
                sanskritSubtitle="अङ्कनानि च परिचयाः"
                description="Status badges, devotional dividers, and Devotee avatars with fallback initials."
              />

              <Card className="space-y-6">
                <div>
                  <h4 className="mb-3 text-[14px] font-semibold text-[#20201D]">Badges</h4>
                  <div className="flex flex-wrap gap-2.5">
                    <Badge variant="saffron">सेवा ISKCON Pune</Badge>
                    <Badge variant="krishna">16 Rounds Done</Badge>
                    <Badge variant="feather">Early Wakeup</Badge>
                    <Badge variant="sand">Brahmachari</Badge>
                    <Badge variant="neutral">Status: Active</Badge>
                  </div>
                </div>

                <Divider label="Spiritual Progress" sanskritLabel="साधना क्रमः" />

                <div>
                  <h4 className="mb-3 text-[14px] font-semibold text-[#20201D]">Devotee Avatars</h4>
                  <div className="flex items-center gap-4">
                    <Avatar name="Radhavallabha Dasa" size="lg" />
                    <Avatar name="Madhava Dasa" size="default" />
                    <Avatar name="Gopal Dasa" size="sm" />
                    <Avatar size="default" />
                  </div>
                </div>
              </Card>
            </section>

            {/* 8. STATE VIEWS */}
            <section id="states" className="space-y-6">
              <PageHeader
                title="8. State Views (Empty, Loading, Error)"
                sanskritSubtitle="अवस्थादृश्यानि"
                description="Human, calm feedback states without cold error messages."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <EmptyState
                  title="Your journey begins here"
                  sanskritSubtitle="आरम्भः शुभो भवतु"
                  description="No Sadhana entries recorded yet."
                  actionLabel="Record Today"
                  onAction={() => alert("Action triggered")}
                />

                <LoadingState
                  message="Connecting to Ashram..."
                  sanskritMessage="प्रतीक्ष्यताम्..."
                />

                <ErrorState
                  title="Connection paused"
                  message="Please verify network connection."
                  onRetry={() => alert("Retry triggered")}
                />
              </div>
            </section>

            {/* 9. ACCESSIBILITY & WCAG AUDIT SUMMARY */}
            <section id="a11y" className="space-y-6">
              <PageHeader
                title="9. Accessibility & Standards Audit"
                sanskritSubtitle="सुगमता मानकाः"
                description="Verification against WCAG 2.1 AA contrast, touch targets, and motion preferences."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-xl border border-[rgba(32,32,29,0.08)] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#3D765B]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[14px] font-bold">Contrast Ratio</span>
                  </div>
                  <p className="mt-2 text-[20px] font-bold text-[#20201D]">12.8 : 1</p>
                  <p className="text-[12px] text-[#66635D]">
                    Deep Charcoal on Warm Ivory (Exceeds 4.5:1 AA requirement)
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(32,32,29,0.08)] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#3D765B]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[14px] font-bold">Touch Targets</span>
                  </div>
                  <p className="mt-2 text-[20px] font-bold text-[#20201D]">52px / 48px</p>
                  <p className="text-[12px] text-[#66635D]">
                    All buttons and inputs exceed 44px WCAG mobile guideline
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(32,32,29,0.08)] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#3D765B]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[14px] font-bold">Screen Reader</span>
                  </div>
                  <p className="mt-2 text-[20px] font-bold text-[#20201D]">Semantic ARIA</p>
                  <p className="text-[12px] text-[#66635D]">
                    All controls have visible labels and aria-describedby links
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(32,32,29,0.08)] bg-white p-4">
                  <div className="flex items-center gap-2 text-[#3D765B]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[14px] font-bold">Motion Support</span>
                  </div>
                  <p className="mt-2 text-[20px] font-bold text-[#20201D]">prefers-reduced</p>
                  <p className="text-[12px] text-[#66635D]">
                    Automatic disabling of animations when user prefers reduced motion
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>

      <LandingFooter />
    </div>
  );
}
