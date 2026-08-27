import { UserRole } from "@/types/auth";

/**
 * Resolves the destination route following successful authentication.
 * Returns /guru for Gurus, /student for Shishyas, or /login?error=unauthorized_role if unassigned.
 */
export function getPostAuthRedirectUrl(role?: UserRole | null): string {
  if (role === "guru") {
    return "/guru";
  }
  if (role === "shishya") {
    return "/student";
  }
  // Unknown or missing role: fail closed
  return "/login?error=unauthorized_role";
}

/**
 * Validates a redirect URL to prevent open redirect vulnerabilities.
 * Only relative internal paths (starting with /) are permitted.
 */
export function sanitizeRedirectUrl(url?: string | null, defaultUrl: string = "/"): string {
  if (!url) return defaultUrl;

  // Enforce relative path starting with / and not starting with //
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  return defaultUrl;
}
