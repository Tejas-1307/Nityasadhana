import { offlineDB } from "@/lib/pwa/indexed-db";

export type SyncState =
  | "saved"
  | "saving"
  | "offline"
  | "pending_sync"
  | "synced"
  | "failed_sync";

const DRAFT_PREFIX = "nityasadhana_report_draft_";

export function getLocalDraft<T>(practiceDate: string, userId?: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const key = userId ? `${DRAFT_PREFIX}${userId}_${practiceDate}` : `${DRAFT_PREFIX}${practiceDate}`;
    const raw = localStorage.getItem(key) || localStorage.getItem(`${DRAFT_PREFIX}${practiceDate}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error("[Offline] Failed to parse local draft:", err);
    return null;
  }
}

export function saveLocalDraft<T>(practiceDate: string, data: T, userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${DRAFT_PREFIX}${userId}_${practiceDate}` : `${DRAFT_PREFIX}${practiceDate}`;
    const payload = { ...data, _savedLocallyAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));

    // Also persist to IndexedDB asynchronously
    if (userId) {
      offlineDB.saveDraft(userId, practiceDate, data, "draft").catch(() => {});
    }
  } catch (err) {
    console.error("[Offline] Failed to save local draft:", err);
  }
}

export function clearLocalDraft(practiceDate: string, userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${DRAFT_PREFIX}${userId}_${practiceDate}` : `${DRAFT_PREFIX}${practiceDate}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`${DRAFT_PREFIX}${practiceDate}`);

    if (userId) {
      offlineDB.deleteDraft(userId, practiceDate).catch(() => {});
    }
  } catch (err) {
    console.error("[Offline] Failed to clear local draft:", err);
  }
}

export async function getAsyncLocalDraft<T>(userId: string, practiceDate: string): Promise<T | null> {
  const dbRecord = await offlineDB.getDraft<T>(userId, practiceDate);
  if (dbRecord) return dbRecord.data;
  return getLocalDraft<T>(practiceDate, userId);
}

/**
 * Returns human-readable status configuration
 */
export function getSyncStatusMeta(state: SyncState): {
  label: string;
  variant: "sand" | "krishna" | "saffron" | "feather" | "neutral";
  colorClass: string;
} {
  switch (state) {
    case "saving":
      return { label: "Saving...", variant: "saffron", colorClass: "text-[#D9822B] bg-[#D9822B]/10" };
    case "saved":
      return { label: "Saved on this device", variant: "feather", colorClass: "text-[#3D765B] bg-[#3D765B]/10" };
    case "offline":
      return { label: "Offline (Draft safe)", variant: "neutral", colorClass: "text-[#66635D] bg-[#66635D]/10" };
    case "pending_sync":
      return { label: "Pending sync", variant: "saffron", colorClass: "text-[#D9822B] bg-[#D9822B]/10" };
    case "synced":
      return { label: "Synced to server", variant: "feather", colorClass: "text-[#3D765B] bg-[#3D765B]/10" };
    case "failed_sync":
      return { label: "Sync failed (Saved locally)", variant: "sand", colorClass: "text-[#A83232] bg-[#A83232]/10" };
  }
}

