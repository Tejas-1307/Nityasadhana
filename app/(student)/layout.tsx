import * as React from "react";
import { requireShishya } from "@/lib/auth";
import { StudentTopNav } from "@/components/navigation/student-top-nav";
import { BottomNavigation } from "@/components/navigation/bottom-nav";
import { STUDENT_NAV_ITEMS } from "@/lib/constants/nav";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-authoritative role guard (fails closed if role !== 'shishya' or account suspended)
  const user = await requireShishya();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F1E5]">
      {/* Top Navigation Bar (Mobile Header + Desktop Navigation) */}
      <StudentTopNav userName={user.name} userEmail={user.email} />

      {/* Main Page Content with bottom padding to prevent bottom-nav overlap */}
      <div className="flex-1 pb-24 sm:pb-12">{children}</div>

      {/* Mobile Fixed Bottom Navigation (4 Primary Destinations) */}
      <BottomNavigation items={STUDENT_NAV_ITEMS} />
    </div>
  );
}
