import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/branding/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { GuruNavTabs } from "@/components/navigation/guru-nav-tabs";
import { GuruBottomNav } from "@/components/navigation/guru-bottom-nav";
import { requireGuru } from "@/lib/auth/guards";
import { formatDuration } from "@/lib/reports/calculations";
import { ArrowLeft, BookOpen, Calendar, CircleDot, GraduationCap, Moon, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; reportId: string }>;
}

type Report = {
  id: string;
  practiceDate: string;
  status: string;
  sleepTime: string;
  wakeUpTime: string;
  sleepDurationMinutes: number;
  japaRounds: number;
  extraRounds: number;
  totalRounds: number;
  japaCompletedAt?: string | null;
  readingDurationMinutes: number;
  readingNote?: string | null;
  hearingDurationMinutes: number;
  hearingNote?: string | null;
  collegeStudyDurationMinutes: number;
  selfStudyDurationMinutes: number;
  totalStudyDurationMinutes: number;
  dayRestDurationMinutes: number;
  timeWastedDurationMinutes: number;
  notes?: string | null;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reportId } = await params;
  return { title: `Sādhanā Record ${reportId} | Nityasādhanā` };
}

export default async function GuruSadhanaReportPage({ params }: PageProps) {
  const { id, reportId } = await params;
  const guru = await requireGuru();
  if (!id || !reportId) notFound();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(
    `${apiUrl}/api/guru/shishyas/${encodeURIComponent(id)}/reports/${encodeURIComponent(reportId)}`,
    { headers: { Cookie: cookieHeader }, cache: "no-store" },
  );

  if (response.status === 404) {
    return <ReportErrorState title="Sadhana record not found" detail="This record may have been removed or does not belong to this Shishya." backHref={`/guru/shishyas/${encodeURIComponent(id)}`} />;
  }
  if (response.status === 401 || response.status === 403) {
    return <ReportErrorState title="Access denied" detail="You are not authorized to inspect this Sadhana record." backHref="/guru" />;
  }
  if (!response.ok) {
    return <ReportErrorState title="Unable to load Sadhana record" detail="Please return to the Guru dashboard and try again." backHref="/guru" />;
  }

  const body = await response.json() as { report: Report };
  const report = body.report;

  return (
    <div className="flex min-h-screen flex-col bg-[#EAF7F4] pb-20 md:pb-10">
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(63,148,149,0.16)] bg-white/90 backdrop-blur-md">
        <Container size="default">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Logo size="default" href="/" />
            <UserMenu role="guru" userName={guru.name} userEmail={guru.email} />
          </div>
        </Container>
      </header>
      <div className="hidden md:block"><GuruNavTabs /></div>
      <main className="flex-1 py-6 sm:py-10">
        <Container size="reading">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#547070]">Read-only Guru inspection</span>
              <h1 className="mt-1 text-[24px] font-bold text-[#193B3B]">Sādhanā for {report.practiceDate}</h1>
            </div>
            <Badge variant={report.status === "submitted" ? "feather" : "saffron"}>{report.status === "submitted" ? "Received" : "Draft"}</Badge>
          </div>
          <div className="space-y-4">
            <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1"><div className="flex items-center justify-between text-[13px] font-bold text-[#193B3B]"><span className="flex items-center gap-1.5"><Moon className="h-4 w-4 text-[#3F9495]" /> Sleep &amp; Wake</span><span>{formatDuration(report.sleepDurationMinutes || 0)}</span></div><div className="mt-2 text-[12px] text-[#547070]">Slept: {report.sleepTime || "Not recorded"} · Woke: {report.wakeUpTime || "Not recorded"}</div></Card>
            <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1"><div className="flex items-center justify-between text-[13px] font-bold text-[#193B3B]"><span className="flex items-center gap-1.5"><CircleDot className="h-4 w-4 text-[#A9824D]" /> Japa Meditation</span><span>{report.totalRounds || report.japaRounds} rounds</span></div><div className="mt-2 text-[12px] text-[#547070]">Standard: {report.japaRounds}{report.extraRounds ? ` · Extra: +${report.extraRounds}` : ""}{report.japaCompletedAt ? ` · Completed: ${report.japaCompletedAt}` : ""}</div></Card>
            <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1"><div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]"><BookOpen className="h-4 w-4 text-[#328A7A]" /> Hearing &amp; Reading</div><div className="mt-2 space-y-1 text-[12px] text-[#547070]"><div>Reading: {formatDuration(report.readingDurationMinutes || 0)} {report.readingNote && `(${report.readingNote})`}</div><div>Hearing: {formatDuration(report.hearingDurationMinutes || 0)} {report.hearingNote && `(${report.hearingNote})`}</div></div></Card>
            <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1"><div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]"><GraduationCap className="h-4 w-4 text-[#547070]" /> Study &amp; Time</div><div className="mt-2 space-y-1 text-[12px] text-[#547070]"><div>College Study: {formatDuration(report.collegeStudyDurationMinutes || 0)}</div><div>Self Study: {formatDuration(report.selfStudyDurationMinutes || 0)}</div><div>Total Study: {formatDuration(report.totalStudyDurationMinutes || 0)}</div><div>Day Rest: {formatDuration(report.dayRestDurationMinutes || 0)}</div><div>Unused Time: {formatDuration(report.timeWastedDurationMinutes || 0)}</div></div></Card>
            {report.notes && <Card className="border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1"><div className="flex items-center gap-1.5 text-[13px] font-bold text-[#193B3B]"><Sparkles className="h-4 w-4 text-[#A9824D]" /> Student Reflection</div><blockquote className="mt-2 text-[13px] italic text-[#193B3B]">&ldquo;{report.notes}&rdquo;</blockquote></Card>}
          </div>
          <div className="mt-6"><Link href={`/guru/shishyas/${encodeURIComponent(id)}`}><Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to Shishya Profile</Button></Link></div>
        </Container>
      </main>
      <GuruBottomNav />
    </div>
  );
}

function ReportErrorState({ title, detail, backHref }: { title: string; detail: string; backHref: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#EAF7F4] p-6"><Card className="w-full max-w-lg border-[rgba(63,148,149,0.16)] bg-white p-8 text-center shadow-level1"><Calendar className="mx-auto h-8 w-8 text-[#A9824D]" /><h1 className="mt-4 text-[20px] font-bold text-[#193B3B]">{title}</h1><p className="mt-2 text-[14px] text-[#547070]">{detail}</p><Link href={backHref}><Button className="mt-6" variant="secondary">Back to Guru Dashboard</Button></Link></Card></div>;
}
