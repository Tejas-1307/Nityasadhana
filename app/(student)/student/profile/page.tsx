import * as React from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireShishya, getActiveRelationshipForShishya } from "@/lib/auth";
import { formatPracticeDate } from "@/lib/utils/greeting";
import {
  HeartHandshake,
  ShieldCheck,
  LogOut,
  Sparkles,
  Calendar,
  Mail,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  // Server-authoritative role guard (enforces role === 'shishya')
  const user = await requireShishya();

  // Fetch connected Guru relationship
  const guruConnection = await getActiveRelationshipForShishya(user.id);
  const connectedGuru = guruConnection?.guru;

  const joinDate = user.createdAt
    ? formatPracticeDate(new Date(user.createdAt))
    : "Recently joined";

  return (
    <main className="py-6 sm:py-10">
      <Container size="reading">
        {/* Profile Page Header */}
        <div className="mb-6 space-y-1 sm:mb-8">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#D9822B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-serif">साधकपरिचयः</span>
          </div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#20201D] sm:text-[28px]">
            Profile
          </h1>
          <p className="text-[14px] text-[#66635D]">
            Devotee identity and mentorship connection.
          </p>
        </div>

        {/* Devotee Identity Card */}
        <Card className="mb-6 border-[rgba(32,32,29,0.08)] bg-white p-5 shadow-level1 sm:p-7">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-bold text-[#20201D] sm:text-[20px]">
                  {user.spiritualName || user.name}
                </h2>
                <Badge variant="krishna" size="sm">
                  <span className="font-serif text-[10px]">शिष्यः</span>
                </Badge>
              </div>

              {user.spiritualName && (
                <div className="text-[13px] text-[#66635D]">{user.name}</div>
              )}

              {user.email && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#66635D]">
                  <Mail className="h-3.5 w-3.5 text-[#66635D]" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Connected Guru Card */}
        <div className="mb-6 space-y-2">
          <h3 className="text-[14px] font-bold text-[#20201D]">Your Guru</h3>
          {connectedGuru ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D9822B]/10 text-[#D9822B]">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#20201D]">
                    {connectedGuru.spiritualName || connectedGuru.name}
                  </div>
                  <div className="text-[12px] font-medium text-[#3D765B]">
                    Active Spiritual Guidance
                  </div>
                </div>
              </div>
              <Badge variant="saffron" size="sm">
                <span className="font-serif text-[11px]">गुरुसंरक्षणम्</span>
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(32,32,29,0.08)] bg-white p-4 shadow-level1 sm:p-5">
              <div>
                <div className="text-[14px] font-bold text-[#20201D]">No Guru Connected Yet</div>
                <div className="text-[12px] text-[#66635D]">
                  Have an invitation link or code from your Guru?
                </div>
              </div>
              <Link href="/invite">
                <Button variant="secondary" size="sm">
                  Accept Invite
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Account Details Card */}
        <div className="mb-8 space-y-2">
          <h3 className="text-[14px] font-bold text-[#20201D]">Account Details</h3>
          <Card className="divide-y divide-[rgba(32,32,29,0.06)] border-[rgba(32,32,29,0.08)] bg-white p-0 shadow-level1">
            <div className="flex items-center justify-between p-4 text-[13px]">
              <span className="text-[#66635D]">Account Status</span>
              <span className="flex items-center gap-1.5 font-medium text-[#3D765B]">
                <ShieldCheck className="h-4 w-4" />
                <span>Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-4 text-[13px]">
              <span className="text-[#66635D]">Member Since</span>
              <span className="flex items-center gap-1.5 text-[#20201D]">
                <Calendar className="h-4 w-4 text-[#66635D]" />
                <span>{joinDate}</span>
              </span>
            </div>
          </Card>
        </div>

        {/* Sign Out Action */}
        <div className="flex justify-center pt-2">
          <SignOutButton redirectUrl="/login">
            <Button
              variant="secondary"
              size="default"
              className="w-full text-[#B33927] hover:bg-[#B33927]/10 hover:text-[#992E1E] sm:w-auto"
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Sign Out of Nityasādhanā
            </Button>
          </SignOutButton>
        </div>
      </Container>
    </main>
  );
}
