import { cookies } from "next/headers";
import { UserRole, AccountStatus, AuthenticatedUser } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function normalizeRoleValue(value: unknown): UserRole | null {
  if (typeof value !== "string") return null;
  const role = value.trim().toLowerCase();
  return role === "guru" ? "guru" : role === "shishya" || role === "student" ? "shishya" : null;
}

export async function getCurrentAuthUser(): Promise<AuthenticatedUser | null> {
  const token = (await cookies()).get("nityasadhana_session")?.value;
  if (!token) return null;
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: `nityasadhana_session=${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json() as { id: number; name: string; email: string; role: UserRole; status: "active" | "inactive" | "suspended"; created_at: string };
    return { id: String(user.id), authProviderId: String(user.id), name: user.name, email: user.email, role: user.role, status: user.status as AccountStatus, createdAt: user.created_at, updatedAt: user.created_at };
  } catch {
    return null;
  }
}

export async function getCurrentRole(): Promise<UserRole | null> {
  return (await getCurrentAuthUser())?.role || null;
}

export async function isUserAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentAuthUser());
}
