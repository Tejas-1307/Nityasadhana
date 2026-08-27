/**
 * Invitation System Configuration
 */

export const INVITATION_CONFIG = {
  /**
   * Default validity duration in days for generated Guru invitations.
   */
  EXPIRY_DAYS: 7,

  /**
   * Prefix for human-readable invitation codes.
   */
  CODE_PREFIX: "NITYA",

  /**
   * Maximum active pending invitations per Guru for rate limiting.
   */
  MAX_PENDING_PER_GURU: 50,
} as const;
