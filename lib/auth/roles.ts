import { UserRole } from "@/types/auth";

export const VALID_ROLES: readonly UserRole[] = ["guru", "shishya"] as const;

/**
 * Type guard verifying if an unknown value is a valid UserRole.
 */
export function isValidRole(value: unknown): value is UserRole {
  return typeof value === "string" && (VALID_ROLES as readonly string[]).includes(value);
}

/**
 * Returns human-readable English display name for a role.
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "guru":
      return "Guru (Teacher & Guide)";
    case "shishya":
      return "Shishya (Student & Devotee)";
    default:
      return "Devotee";
  }
}

/**
 * Returns authentic Sanskrit representation for a role.
 */
export function getRoleSanskritName(role: UserRole): string {
  switch (role) {
    case "guru":
      return "गुरुः";
    case "shishya":
      return "शिष्यः";
    default:
      return "भक्तः";
  }
}
