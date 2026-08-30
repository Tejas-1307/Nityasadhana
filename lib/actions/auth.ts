"use server";

// ============================================================
// NITYASĀDHANĀ — AUTHENTICATION & ROLE ROUTING SERVER ACTIONS
// ============================================================
// Resolves trusted, server-authoritative post-login destinations
// based strictly on the authenticated user's verified role.
// ============================================================

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { getCurrentRole, normalizeRoleValue } from "@/lib/auth/auth";
import { getPostAuthRedirectUrl, sanitizeRedirectUrl } from "@/lib/auth/redirects";
import { dbStore } from "@/lib/db/store";
import { UserRole } from "@/types/auth";

export async function syncAuthenticatedRoleAction(
  preferredRole?: string | null
): Promise<{ success: boolean; role: UserRole | null }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, role: null };
    }

    const normalizedPreferredRole = normalizeRoleValue(preferredRole);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";

    const existingUser = email ? await dbStore.getUserByEmail(email) : null;
    const currentRole = existingUser?.role || (await getCurrentRole());
    const assignedRole: UserRole =
      normalizedPreferredRole ||
      (currentRole === "guru" || currentRole === "shishya" ? currentRole : "shishya");

    const linkedGuruId =
      existingUser?.linkedGuruId ||
      ((user.publicMetadata?.linkedGuruId as string | undefined) ?? undefined);

    const nextUser = {
      id: user.id,
      authProviderId: user.id,
      role: assignedRole,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        existingUser?.name ||
        (assignedRole === "guru" ? "Guru" : "Devotee"),
      spiritualName: existingUser?.spiritualName || undefined,
      email,
      ashramId: existingUser?.ashramId,
      linkedGuruId,
      status: existingUser?.status || "active",
      createdAt: existingUser?.createdAt || new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
    };

    await dbStore.upsertUser(nextUser);

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: assignedRole,
        linkedGuruId: linkedGuruId ?? undefined,
      },
      unsafeMetadata: {
        roleIntent: assignedRole,
        linkedGuruId: linkedGuruId ?? undefined,
      },
    });

    return { success: true, role: assignedRole };
  } catch (err) {
    console.error("[Auth] syncAuthenticatedRoleAction error:", err);
    return { success: false, role: null };
  }
}

export async function resolvePostLoginRedirectAction(
  intendedUrl?: string | null,
  preferredRole?: UserRole | null
): Promise<{ success: boolean; redirectUrl: string }> {
  try {
    const role = preferredRole || (await getCurrentRole());

    if (!role) {
      return {
        success: false,
        redirectUrl: "/login?error=unauthorized_role",
      };
    }

    if (intendedUrl) {
      const sanitized = sanitizeRedirectUrl(intendedUrl);
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
