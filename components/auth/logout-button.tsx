"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/client";

export function LogoutButton({ children, className, leftIcon }: { children: React.ReactNode; className?: string; leftIcon?: React.ReactNode }) {
  const router = useRouter();
  return <Button variant="secondary" size="default" className={className} leftIcon={leftIcon} onClick={async () => { await logout(); router.replace("/login"); }}>{children}</Button>;
}
