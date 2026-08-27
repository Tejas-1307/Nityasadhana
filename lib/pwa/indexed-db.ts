// ============================================================
// NITYASĀDHANĀ — OFFLINE INDEXED-DB DRAFT STORAGE ENGINE
// ============================================================
// Provides fast, durable, user-scoped offline persistence for
// daily Sādhanā reports with localStorage fallback.
// ============================================================

export interface OfflineReportDraft<T = unknown> {
  id: string; // Composite key: `${userId}:${practiceDate}`
  userId: string;
  practiceDate: string; // YYYY-MM-DD
  data: T;
  syncState: "draft" | "pending_sync" | "synced" | "sync_failed";
  clientReportId: string; // Unique client-generated UUID for server idempotency
  createdAt: string;
  updatedAt: string;
}

const DB_NAME = "nityasadhana_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "report_drafts";

class OfflineDB {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryFallback: Map<string, OfflineReportDraft<unknown>> = new Map();

  private isIndexedDBAvailable(): boolean {
    return typeof window !== "undefined" && "indexedDB" in window;
  }

  private getDB(): Promise<IDBDatabase> {
    if (!this.isIndexedDBAvailable()) {
      return Promise.reject(new Error("IndexedDB unavailable"));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
            store.createIndex("userId", "userId", { unique: false });
            store.createIndex("practiceDate", "practiceDate", { unique: false });
            store.createIndex("user_date", ["userId", "practiceDate"], { unique: true });
          }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }

    return this.dbPromise;
  }

  /**
   * Saves or updates an offline report draft in IndexedDB (scoped to userId).
   */
  async saveDraft<T>(
    userId: string,
    practiceDate: string,
    data: T,
    syncState: "draft" | "pending_sync" | "synced" | "sync_failed" = "draft"
  ): Promise<OfflineReportDraft<T>> {
    const id = `${userId}:${practiceDate}`;
    const now = new Date().toISOString();

    const existing = await this.getDraft<T>(userId, practiceDate);
    const clientReportId = existing?.clientReportId || `cli_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const draftRecord: OfflineReportDraft<T> = {
      id,
      userId,
      practiceDate,
      data,
      syncState,
      clientReportId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    // Store in memory map fallback
    this.memoryFallback.set(id, draftRecord as OfflineReportDraft<unknown>);

    if (this.isIndexedDBAvailable()) {
      try {
        const db = await this.getDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(draftRecord);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
        return draftRecord;
      } catch (err) {
        console.warn("[IndexedDB] Failed to save, falling back to localStorage", err);
      }
    }

    // Fallback: localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`nitya_draft_${id}`, JSON.stringify(draftRecord));
      } catch {
        // Ignored
      }
    }

    return draftRecord;
  }

  /**
   * Retrieves an offline report draft for a specific user and practice date.
   */
  async getDraft<T>(userId: string, practiceDate: string): Promise<OfflineReportDraft<T> | null> {
    const id = `${userId}:${practiceDate}`;

    if (this.isIndexedDBAvailable()) {
      try {
        const db = await this.getDB();
        return await new Promise<OfflineReportDraft<T> | null>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("[IndexedDB] Failed to get, falling back to localStorage", err);
      }
    }

    // Fallback: localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`nitya_draft_${id}`);
        if (raw) return JSON.parse(raw) as OfflineReportDraft<T>;
      } catch {
        // Ignored
      }
    }

    // Fallback: in-memory map
    const inMem = this.memoryFallback.get(id);
    if (inMem) return { ...(inMem as OfflineReportDraft<T>) };

    return null;
  }

  /**
   * Clears a single draft.
   */
  async deleteDraft(userId: string, practiceDate: string): Promise<void> {
    const id = `${userId}:${practiceDate}`;
    this.memoryFallback.delete(id);

    if (this.isIndexedDBAvailable()) {
      try {
        const db = await this.getDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("[IndexedDB] Failed to delete", err);
      }
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`nitya_draft_${id}`);
      } catch {
        // Ignored
      }
    }
  }

  /**
   * Retrieves all drafts for a given user (for multi-account isolation).
   */
  async getUserDrafts(userId: string): Promise<OfflineReportDraft[]> {
    if (this.isIndexedDBAvailable()) {
      try {
        const db = await this.getDB();
        return await new Promise<OfflineReportDraft[]>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const index = store.index("userId");
          const req = index.getAll(userId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      } catch (err) {
        console.warn("[IndexedDB] Failed to get user drafts", err);
      }
    }

    // Fallback: memoryFallback
    const results: OfflineReportDraft[] = [];
    for (const draft of this.memoryFallback.values()) {
      if (draft.userId === userId) {
        results.push({ ...draft });
      }
    }
    return results;
  }

  /**
   * Clears all local drafts for a user (called on logout for privacy).
   */
  async clearUserDrafts(userId: string): Promise<void> {
    const drafts = await this.getUserDrafts(userId);
    for (const draft of drafts) {
      await this.deleteDraft(userId, draft.practiceDate);
    }
    // Also clean up any lingering memory records
    for (const [key, draft] of this.memoryFallback.entries()) {
      if (draft.userId === userId) {
        this.memoryFallback.delete(key);
      }
    }
  }
}

export const offlineDB = new OfflineDB();
