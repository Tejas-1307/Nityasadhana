// ============================================================
// NITYASĀDHANĀ — AUDIT LOG SERVICE
// ============================================================

import { dbStore } from "@/lib/db/store";
import { DbAuditLog, AuditAction } from "@/lib/db/schema";

export class AuditService {
  /**
   * Records a security or administrative lifecycle audit event
   */
  static async record(params: {
    actorId: string;
    action: AuditAction;
    entityType: DbAuditLog["entityType"];
    entityId: string;
    metadata?: Record<string, unknown>;
  }): Promise<DbAuditLog> {
    return dbStore.createAuditLog(params);
  }

  /**
   * Retrieves chronological audit history for a specific actor
   */
  static async getActorHistory(actorId: string): Promise<DbAuditLog[]> {
    return dbStore.getAuditLogsByActor(actorId);
  }

  /**
   * Retrieves chronological audit history for a specific entity
   */
  static async getEntityHistory(
    entityType: DbAuditLog["entityType"],
    entityId: string
  ): Promise<DbAuditLog[]> {
    return dbStore.getAuditLogsByEntity(entityType, entityId);
  }

  /**
   * Retrieves global audit records (admin / system integrity)
   */
  static async getAllLogs(): Promise<DbAuditLog[]> {
    return dbStore.getAllAuditLogs();
  }
}
