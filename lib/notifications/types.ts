// ============================================================
// NITYASĀDHANĀ — CALM NOTIFICATION SYSTEM TYPES
// ============================================================

import {
  DbNotification,
  DbNotificationPreferences,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
} from "@/lib/db/schema";

export type {
  DbNotification,
  DbNotificationPreferences,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
};

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduledForDate: string;
  eventKey: string;
  actionUrl?: string;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface UserNotificationCenterData {
  notifications: DbNotification[];
  total: number;
  unreadCount: number;
  preferences: DbNotificationPreferences;
}

export interface ScheduleNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  scheduledForDate: string; // YYYY-MM-DD
  eventKey: string;
  actionUrl?: string;
}
