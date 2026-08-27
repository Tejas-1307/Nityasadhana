"use server";

// ============================================================
// NITYASĀDHANĀ — AUTHENTICATION & ROLE ROUTING SERVER ACTIONS
// ============================================================
// Resolves trusted, server-authoritative post-login destinations
// based strictly on the authenticated user's verified role.
// ============================================================

import { getCurrentRole } from "@/lib/auth/auth";
import { getPostAuthRedirectUrl, sanitizeRedirectUrl } from "@/lib/auth/redirects";

export async function resolvePostLoginRedirectAction(
  intendedUrl?: string | null
): Promise<{ success: boolean; redirectUrl: string }> {
  try {
    const role = await getCurrentRole();

    if (!role) {
      return {
        success: false,
        redirectUrl: "/login?error=unauthorized_role",
      };
    }

    if (intendedUrl) {
      const sanitized = sanitizeRedirectUrl(intendedUrl);
      // Ensure role cannot accidentally enter forbidden areas
      if (role === "guru" && sanitized.startsWith("/student")) {
        return { success: true, redirectUrl: "/guru" };
      }
      if (role === "shishya" && sanitized.startsWith("/guru")) {
        return { success: true, redirectUrl: "/student" };
      }
      if (
        sanitized !== "/" &&
        sanitized !== "/login" &&
        sanitized !== "/signup" &&
        sanitized.length > 1
      ) {
        return { success: true, redirectUrl: sanitized };
      }
    }

    const defaultUrl = getPostAuthRedirectUrl(role);
    return {
      success: true,
      redirectUrl: defaultUrl,
    };
  } catch (err) {
    console.error("[Auth] resolvePostLoginRedirectAction error:", err);
    return {
      success: false,
      redirectUrl: "/login?error=unauthorized_role",
    };
  }
}
