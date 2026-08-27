// ============================================================
// NITYASĀDHANĀ — PWA BACKGROUND & ONLINE SYNC MANAGER
// ============================================================
// Handles online/offline lifecycle detection, connectivity recovery,
// and safe idempotent synchronization of offline Sādhanā reports.
// ============================================================

import { offlineDB } from "./indexed-db";
import { SyncState } from "@/lib/reports/offline";

type StatusListener = (isOnline: boolean) => void;

class PWASyncManager {
  private listeners: Set<StatusListener> = new Set();
  private isOnlineStatus: boolean = typeof navigator !== "undefined" ? navigator.onLine : true;

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
  }

  public isOnline(): boolean {
    return this.isOnlineStatus;
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnlineStatus);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private handleOnline = () => {
    this.isOnlineStatus = true;
    this.listeners.forEach((l) => l(true));
  };

  private handleOffline = () => {
    this.isOnlineStatus = false;
    this.listeners.forEach((l) => l(false));
  };

  /**
   * Idempotent sync wrapper: attempts server save/submit.
   * If network fails, persists draft safely in IndexedDB and marks as offline.
   */
  async executeSync<T, R>(
    userId: string,
    practiceDate: string,
    data: T,
    serverAction: (data: T) => Promise<{ success: boolean; data?: R; error?: string }>
  ): Promise<{
    success: boolean;
    state: SyncState;
    data?: R;
    error?: string;
  }> {
    // 1. If currently offline, save locally immediately
    if (!this.isOnlineStatus) {
      await offlineDB.saveDraft(userId, practiceDate, data, "draft");
      return {
        success: true,
        state: "offline",
      };
    }

    // 2. Online: Attempt server synchronization
    try {
      await offlineDB.saveDraft(userId, practiceDate, data, "pending_sync");
      const res = await serverAction(data);

      if (res.success) {
        // Mark as synced locally
        await offlineDB.saveDraft(userId, practiceDate, data, "synced");
        return {
          success: true,
          state: "synced",
          data: res.data,
        };
      } else {
        await offlineDB.saveDraft(userId, practiceDate, data, "sync_failed");
        return {
          success: false,
          state: "failed_sync",
          error: res.error || "Sync failed",
        };
      }
    } catch {
      // Network interruption during submission -> protect draft
      await offlineDB.saveDraft(userId, practiceDate, data, "draft");
      return {
        success: true,
        state: "offline",
      };
    }
  }
}

export const syncManager = new PWASyncManager();
