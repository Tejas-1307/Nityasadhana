import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { UserRole, AuthenticatedUser } from "@/types/auth";
import { isValidRole } from "./roles";
import { dbStore } from "@/lib/db/store";
import { DbUser } from "@/lib/db/schema";

export function normalizeRoleValue(value: unknown): UserRole | null {
  if (!value || typeof value !== "string") return null;

  const role = value.trim().toLowerCase();
  if (role === "guru") return "guru";
  if (role === "shishya" || role === "student") return "shishya";
  return null;
}

function isDynamicServerError(err: unknown): boolean {
  if (typeof err === "object" && err !== null && "digest" in err) {
    return (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";
  }
  return false;
}

/**
 * Safely synchronizes the authoritative role to Clerk publicMetadata.
 * Non-blocking if Clerk Admin API is unreachable.
 */
async function syncClerkRoleMetadata(userId: string, role: UserRole): Promise<void> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
      },
    });
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.warn(`[Auth] Clerk publicMetadata sync skipped for user ${userId}`);
  }
}

/**
 * Extracts the authenticated user's server-authoritative role.
 * Resolves from Clerk publicMetadata first, then application database record,
 * and falls back to signup roleIntent for new accounts.
 * Fails closed (returns null) if no authenticated session exists.
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
    const metadataRole = normalizeRoleValue(user.publicMetadata?.role);
    const metadataLinkedGuruId = (user.publicMetadata?.linkedGuruId as string | undefined) || undefined;
    if (metadataRole) {
      const dbUser = await dbStore.getUserById(user.id);
      if (!dbUser) {
        await dbStore.upsertUser({
          id: user.id,
          authProviderId: user.id,
          role: metadataRole,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            (metadataRole === "guru" ? "Guru" : "Devotee"),
          spiritualName: (user.publicMetadata?.spiritualName as string) || undefined,
          email,
          linkedGuruId: metadataLinkedGuruId,
          status: "active",
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        });
      }
      return metadataRole;
    }

    const dbUser =
      (await dbStore.getUserById(user.id)) ||
      (email ? await dbStore.getUserByEmail(email) : null);

    if (dbUser && isValidRole(dbUser.role)) {
      await syncClerkRoleMetadata(user.id, dbUser.role);
      return dbUser.role;
    }

    const roleIntent = normalizeRoleValue(
      (user.unsafeMetadata?.roleIntent as string) ||
        (user.unsafeMetadata?.role as string) ||
        (user.publicMetadata?.role as string) ||
        (user.publicMetadata?.roleIntent as string)
    );
    if (roleIntent) {
      const assignedRole: UserRole = roleIntent;
      const newUser: DbUser = {
        id: user.id,
        authProviderId: user.id,
        role: assignedRole,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          (assignedRole === "guru" ? "Guru" : "Devotee"),
        spiritualName: undefined,
        email,
        status: "active",
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
      };

      await dbStore.upsertUser(newUser);
      await syncClerkRoleMetadata(user.id, assignedRole);
      return assignedRole;
    }

    const devGuruEmails = (process.env.DEV_GURU_EMAILS || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
    if (devGuruEmails.includes(email)) {
      const guruRole: UserRole = "guru";
      await dbStore.upsertUser({
        id: user.id,
        authProviderId: user.id,
        role: guruRole,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Guru",
        spiritualName: undefined,
        email,
        status: "active",
        createdAt: new Date(user.createdAt).toISOString(),
        updatedAt: new Date(user.updatedAt).toISOString(),
      });
      await syncClerkRoleMetadata(user.id, guruRole);
      return guruRole;
    }

    return null;
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error("[Auth] Error reading user role:", error);
    return null;
  }
}

/**
 * Returns the normalized Nityasādhanā application user from the server session.
 * Resolves verified role from Clerk publicMetadata or database without seeding mock data.
 */
export async function getCurrentAuthUser(): Promise<AuthenticatedUser | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
    const role = await getCurrentRole();

    if (!role) {
      return null;
    }

    let dbUser = await dbStore.getUserById(user.id);
    if (!dbUser && email) {
      dbUser = await dbStore.getUserByEmail(email);
    }

    const spiritualName =
      (user.publicMetadata?.spiritualName as string) ||
      dbUser?.spiritualName ||
      undefined;

    const ashramId =
      (user.publicMetadata?.ashramId as string) ||
      dbUser?.ashramId ||
      undefined;

    const linkedGuruId =
      (user.publicMetadata?.linkedGuruId as string | undefined) ||
      dbUser?.linkedGuruId ||
      undefined;

    const status = dbUser?.status || "active";

    return {
      id: dbUser?.id || user.id,
      authProviderId: user.id,
      email,
      role,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        dbUser?.name ||
        "Devotee",
      spiritualName,
      ashramId,
      linkedGuruId,
      status,
      createdAt: dbUser?.createdAt || new Date(user.createdAt).toISOString(),
      updatedAt: dbUser?.updatedAt || new Date(user.updatedAt).toISOString(),
    };
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    console.error("[Auth] Error fetching current user:", error);
    return null;
  }
}

/**
 * Helper to check if a user is currently authenticated on the server.
 */
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const session = await auth();
    return Boolean(session?.userId);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }
    return false;
  }
}
