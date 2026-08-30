import { dbStore } from "@/lib/db/store";
import { DbUser, PublicInvitationDetails } from "@/lib/db/schema";
import {
  generateSecureUrlToken,
  generateReadableCode,
  hashInvitationSecret,
  maskReadableCode,
  calculateExpirationDate,
} from "./crypto";
import { INVITATION_CONFIG } from "./config";
import { getPublicEnv } from "@/lib/config/env";

export interface GeneratedInvitationResult {
  readonly invitationId: string;
  readonly rawToken: string;
  readonly rawCode: string;
  readonly rawCodeMasked: string;
  readonly inviteUrl: string;
  readonly expiresAt: string;
}

export class InvitationService {
  /**
   * Creates a cryptographically secure invitation owned by the authenticated Guru.
   */
  static async createGuruInvitation(guru: DbUser): Promise<GeneratedInvitationResult> {
    if (guru.role !== "guru") {
      throw new Error("UNAUTHORIZED: Only authenticated Gurus can generate Shishya invitations.");
    }

    // Check active pending count for rate limiting
    const existing = await dbStore.getInvitationsByGuru(guru.id);
    const activePending = existing.filter((inv) => inv.status === "pending");
    if (activePending.length >= INVITATION_CONFIG.MAX_PENDING_PER_GURU) {
      throw new Error(
        `Rate limit reached. You have ${activePending.length} active pending invitations. Revoke older ones to create more.`
      );
    }

    const rawToken = generateSecureUrlToken();
    const rawCode = generateReadableCode();
    const tokenHash = hashInvitationSecret(rawToken);
    const codeHash = hashInvitationSecret(rawCode);
    const rawCodeMasked = maskReadableCode(rawCode);
    const expiresAt = calculateExpirationDate();
    const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await dbStore.createInvitation({
      id,
      tokenHash,
      codeHash,
      rawCodeMasked,
      createdByUserId: guru.id,
      intendedRole: "shishya",
      status: "pending",
      expiresAt,
    });

    const env = getPublicEnv();
    const isLocalDevUrl = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(env.appUrl);
    const inviteUrl = isLocalDevUrl
      ? `/invite/${rawToken}`
      : `${env.appUrl.replace(/\/$/, "")}/invite/${rawToken}`;

    return {
      invitationId: id,
      rawToken,
      rawCode,
      rawCodeMasked,
      inviteUrl,
      expiresAt,
    };
  }

  /**
   * Validates an invitation secret (either 64-char URL token or NITYA-XXXX-XXXX readable code)
   * and returns sanitized public details without leaking internal database IDs.
   */
  static async validateInvitationSecret(secret: string): Promise<PublicInvitationDetails> {
    const trimmed = secret.trim();
    if (!trimmed) {
      return {
        id: "",
        guruName: "",
        expiresAt: "",
        isValid: false,
        errorReason: "Please provide an invitation code or link.",
      };
    }

    const hash = hashInvitationSecret(trimmed);
    // Attempt lookup by tokenHash or codeHash
    let invitation = await dbStore.getInvitationByTokenHash(hash);
    if (!invitation) {
      invitation = await dbStore.getInvitationByCodeHash(hash);
    }

    if (!invitation) {
      return {
        id: "",
        guruName: "",
        expiresAt: "",
        isValid: false,
        errorReason: "Invalid or unrecognized invitation.",
      };
    }

    const now = new Date();

    if (invitation.status === "revoked") {
      return {
        id: invitation.id,
        guruName: "",
        expiresAt: invitation.expiresAt,
        isValid: false,
        errorReason: "This invitation has been revoked by the Guru.",
      };
    }

    if (invitation.status === "used") {
      return {
        id: invitation.id,
        guruName: "",
        expiresAt: invitation.expiresAt,
        isValid: false,
        errorReason: "This invitation has already been accepted.",
      };
    }

    if (new Date(invitation.expiresAt) <= now) {
      return {
        id: invitation.id,
        guruName: "",
        expiresAt: invitation.expiresAt,
        isValid: false,
        errorReason: "This invitation has expired. Ask your Guru for a new invitation.",
      };
    }

    // Fetch Guru name for display
    const guru = await dbStore.getUserById(invitation.createdByUserId);
    const guruName = guru?.spiritualName || guru?.name || "Your Guru";

    return {
      id: invitation.id,
      guruName,
      expiresAt: invitation.expiresAt,
      isValid: true,
    };
  }

  /**
   * Performs atomic acceptance of an invitation by an authenticated Shishya.
   */
  static async acceptInvitation(params: {
    secret: string;
    shishya: DbUser;
  }): Promise<{ success: boolean; guruName: string; guruId?: string; error?: string }> {
    const validation = await this.validateInvitationSecret(params.secret);
    if (!validation.isValid) {
      return {
        success: false,
        guruName: "",
        error: validation.errorReason || "Invalid invitation.",
      };
    }

    const result = await dbStore.atomicAcceptInvitation({
      invitationId: validation.id,
      shishya: params.shishya,
    });

    if (!result.success) {
      return {
        success: false,
        guruName: "",
        error: result.error || "Unable to complete invitation acceptance.",
      };
    }

    return {
      success: true,
      guruName: validation.guruName,
      guruId: result.relationship?.guruId,
    };
  }

  /**
   * Revokes a pending invitation. Enforces Guru ownership check.
   */
  static async revokeGuruInvitation(invitationId: string, guruId: string): Promise<boolean> {
    return dbStore.revokeInvitation(invitationId, guruId);
  }
}
