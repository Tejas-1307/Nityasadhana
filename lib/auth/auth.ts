import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole, AuthenticatedUser } from "@/types/auth";
import { isValidRole } from "./roles";
import { dbStore } from "@/lib/db/store";
import { ensureDevGuruProvisioned } from "@/lib/db/dev-seeder";

function isDynamicServerError(err: unknown): boolean {
  if (typeof err === "object" && err !== null && "digest" in err) {
    return (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";
  }
  return false;
}

/**
 * Checks if the user should be designated as a Development Guru account.
 * In development environment, all authenticated accounts (such as crohitpote17@gmail.com)
 * are provisioned with Guru test access.
 * Strictly active ONLY in non-production environments.
 */
function isDevGuruDesignated(_email?: string): boolean {
  const isDev =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_APP_ENV !== "production";

  if (!isDev) return false;

  return true;
}

/**
 * Extracts the authenticated user's server-authoritative role.
 * Resolves from Clerk publicMetadata first, then application database record.
 * In development environment, automatically provisions dev Guru accounts.
 * Fails closed (returns null) if no valid role is found.
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();

    // 1. Check Clerk publicMetadata first
    const metadataRole = user.publicMetadata?.role;
    if (isValidRole(metadataRole)) {
      if (metadataRole === "guru") {
        await ensureDevGuruProvisioned({
          id: user.id,
          email: email || `${user.id}@nityasadhana.org`,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "His Grace Radheshyam Das",
          spiritualName: (user.publicMetadata?.spiritualName as string) || "Radheshyam Das",
        });
      }
      return metadataRole;
    }

    // 2. Check application database by user id or primary email
    let dbUser =
      (await dbStore.getUserById(user.id)) ||
      (email ? await dbStore.getUserByEmail(email) : null);

    // 3. Development-only Guru provision
    if (!dbUser && isDevGuruDesignated(email)) {
      dbUser = await ensureDevGuruProvisioned({
        id: user.id,
        email: email || `${user.id}@nityasadhana.org`,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "His Grace Radheshyam Das",
        spiritualName: "Radheshyam Das",
      });
    }

    if (dbUser && isValidRole(dbUser.role)) {
      return dbUser.role;
    }

    // Fails closed if role cannot be determined from metadata or database
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
 * Resolves verified role from Clerk publicMetadata or database.
 */
export async function getCurrentAuthUser(): Promise<AuthenticatedUser | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";

    // Resolve role from metadata or database
    let role: UserRole | null = null;
    const metadataRole = user.publicMetadata?.role;
    if (isValidRole(metadataRole)) {
      role = metadataRole;
      if (role === "guru") {
        await ensureDevGuruProvisioned({
          id: user.id,
          email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "His Grace Radheshyam Das",
          spiritualName: (user.publicMetadata?.spiritualName as string) || "Radheshyam Das",
        });
      }
    }

    let dbUser =
      (await dbStore.getUserById(user.id)) ||
      (email ? await dbStore.getUserByEmail(email) : null);

    if (!dbUser && isDevGuruDesignated(email)) {
      dbUser = await ensureDevGuruProvisioned({
        id: user.id,
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "His Grace Radheshyam Das",
        spiritualName: "Radheshyam Das",
      });
    }

    if (!role && dbUser && isValidRole(dbUser.role)) {
      role = dbUser.role;
    }

    if (!role) {
      return null;
    }

    const spiritualName =
      (user.publicMetadata?.spiritualName as string) ||
      dbUser?.spiritualName ||
      undefined;

    const ashramId =
      (user.publicMetadata?.ashramId as string) ||
      dbUser?.ashramId ||
      undefined;

    const status = dbUser?.status || "active";

    return {
      id: dbUser?.id || user.id,
      authProviderId: user.id,
      email,
      role,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || dbUser?.name || "Devotee",
      spiritualName,
      ashramId,
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
