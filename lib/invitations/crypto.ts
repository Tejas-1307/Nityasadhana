import crypto from "crypto";
import { INVITATION_CONFIG } from "./config";

// Unambiguous Base32 charset (omits 0, O, 1, I, L to prevent human transcription errors)
const UNAMBIGUOUS_CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Generates a 256-bit cryptographically secure random URL token (64 hex chars).
 */
export function generateSecureUrlToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a human-readable, unambiguous invitation code (e.g. NITYA-7K4P-X9QM).
 */
export function generateReadableCode(): string {
  const bytes = crypto.randomBytes(8);
  let part1 = "";
  let part2 = "";

  for (let i = 0; i < 4; i++) {
    part1 += UNAMBIGUOUS_CHARSET[bytes[i] % UNAMBIGUOUS_CHARSET.length];
  }
  for (let i = 4; i < 8; i++) {
    part2 += UNAMBIGUOUS_CHARSET[bytes[i] % UNAMBIGUOUS_CHARSET.length];
  }

  return `${INVITATION_CONFIG.CODE_PREFIX}-${part1}-${part2}`;
}

/**
 * Computes a deterministic SHA-256 hash of a raw token or code.
 * Normalizes input (trimmed, uppercase for codes).
 */
export function hashInvitationSecret(secret: string): string {
  const normalized = secret.trim().toUpperCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Masks a readable code for safe display in pending lists (e.g. NITYA-••••-X9QM).
 */
export function maskReadableCode(code: string): string {
  const parts = code.split("-");
  if (parts.length === 3) {
    return `${parts[0]}-••••-${parts[2]}`;
  }
  return `${code.slice(0, 5)}••••${code.slice(-4)}`;
}

/**
 * Computes the UTC expiration date based on configured expiry days.
 */
export function calculateExpirationDate(days: number = INVITATION_CONFIG.EXPIRY_DAYS): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
