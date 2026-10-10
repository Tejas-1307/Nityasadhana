import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "./auth";
import { AuthenticatedUser } from "@/types/auth";

/**
 * Server-side guard requiring an authenticated session.
 * Redirects to /login if no valid session is present.
 */
export async function requireAuth(redirectTo: string = "/login"): Promise<AuthenticatedUser> {
  const user = await getCurrentAuthUser();
  if (!user) {
    redirect(redirectTo);
  }
  if (user.status !== "active") {
    redirect("/login?error=account_suspended");
  }
  return user;
}

/**
 * Server-side guard requiring the authenticated user to possess the trusted 'guru' role.
 *
 * CRITICAL SECURITY PRINCIPLE:
 * Fails closed if the role is missing, corrupt, or equal to 'shishya'.
 */
export async function requireGuru(): Promise<AuthenticatedUser> {
  const user = await requireAuth("/login?role=guru");

  if (user.role !== "guru") {
    // If a Shishya/Counselee attempts to enter /guru, redirect them safely to their own area
    if (user.role === "shishya") {
      redirect("/student");
    }
    // Unknown or missing role: fail closed and redirect to login
    redirect("/login?error=unauthorized_role");
  }

  return user;
}

/**
 * Server-side guard requiring the authenticated user to possess the trusted 'shishya' role.
 *
 * CRITICAL SECURITY PRINCIPLE:
 * Fails closed if the role is missing, corrupt, or equal to 'guru'.
 */
export async function requireShishya(): Promise<AuthenticatedUser> {
  const user = await requireAuth("/login?role=student");

  if (user.role !== "shishya") {
    // If a Guru/Counsellor attempts to enter /student, redirect them safely to their own area
    if (user.role === "guru") {
      redirect("/guru");
    }
    // Unknown or missing role: fail closed and redirect to login
    redirect("/login?error=unauthorized_role");
  }

  return user;
}
