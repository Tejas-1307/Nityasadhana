"use server";

// ============================================================
// NITYASĀDHANĀ — NOTIFICATION SYSTEM SERVER ACTIONS
// ============================================================

import { requireAuth } from "@/lib/auth/guards";
import { NotificationService } from "@/lib/notifications/service";
import {
  DbNotificationPreferences,
  UserNotificationCenterData,
} from "@/lib/notifications/types";

export async function getNotificationsAction(
  limit: number = 20,
  offset: number = 0
): Promise<{
  success: boolean;
  data?: UserNotificationCenterData;
  error?: string;
}> {
  try {
    const user = await requireAuth();
    const { notifications, total, unreadCount } =
      await NotificationService.getNotificationsForUser(user.id, limit, offset);
    const preferences = await NotificationService.getPreferences(user.id);

    return {
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        preferences,
      },
    };
  } catch (err: unknown) {
    console.error("[NotificationAction] Failed to load notifications:", err);
    return {
      success: false,
      error: "Unable to load notifications.",
    };
  }
}

export async function markNotificationReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth();
    const ok = await NotificationService.markAsRead(notificationId, user.id);
    return { success: ok };
  } catch (err: unknown) {
    console.error("[NotificationAction] Failed to mark read:", err);
    return { success: false, error: "Failed to update notification." };
  }
}

export async function markAllNotificationsReadAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const user = await requireAuth();
    const count = await NotificationService.markAllAsRead(user.id);
    return { success: true, count };
  } catch (err: unknown) {
    console.error("[NotificationAction] Failed to mark all read:", err);
    return { success: false, error: "Failed to mark all notifications as read." };
  }
}

export async function getNotificationPreferencesAction(): Promise<{
  success: boolean;
  data?: DbNotificationPreferences;
  error?: string;
}> {
  try {
    const user = await requireAuth();
    const preferences = await NotificationService.getPreferences(user.id);
    return { success: true, data: preferences };
  } catch (err: unknown) {
    console.error("[NotificationAction] Failed to load preferences:", err);
    return { success: false, error: "Unable to load notification preferences." };
  }
}

export async function updateNotificationPreferencesAction(
  updates: Partial<DbNotificationPreferences>
): Promise<{
  success: boolean;
  data?: DbNotificationPreferences;
  error?: string;
}> {
  try {
    const user = await requireAuth();
    const updated = await NotificationService.updatePreferences(user.id, updates);
    return { success: true, data: updated };
  } catch (err: unknown) {
    console.error("[NotificationAction] Failed to update preferences:", err);
    return { success: false, error: "Unable to save notification preferences." };
  }
}
