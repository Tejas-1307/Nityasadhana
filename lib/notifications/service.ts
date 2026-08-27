// ============================================================
// NITYASĀDHANĀ — CALM NOTIFICATION DOMAIN SERVICE
// ============================================================
// Orchestrates gentle, idempotent, timezone-aware notification
// lifecycle, smart suppression, and quiet hours enforcement.
// ============================================================

import { dbStore } from "@/lib/db/store";
import {
  DbNotification,
  DbNotificationPreferences,
} from "./types";
import { NOTIFICATION_CONFIG } from "./config";
import { isWithinQuietHours, getCurrentTimeInTimezone } from "./quiet-hours";

export class NotificationService {
  /**
   * Schedules a gentle Daily Sādhanā report reminder for a Student.
   * Enforces 1 reminder/day cap and cancels automatically if report already submitted.
   */
  static async scheduleDailyReportReminder(
    studentId: string,
    dateStr: string
  ): Promise<DbNotification | null> {
    const prefs = await dbStore.getNotificationPreferences(studentId);
    if (!prefs.dailyReportReminder) {
      return null;
    }

    // Smart Suppression Check: Check if report is already submitted
    const existingReport = await dbStore.getReportByStudentAndDate(studentId, dateStr);
    if (existingReport && existingReport.status === "submitted") {
      return null;
    }

    const eventKey = `daily_report:${dateStr}:${studentId}`;
    const existingNotif = await dbStore.getNotificationByEventKey(eventKey);
    if (existingNotif) {
      return existingNotif;
    }

    const currTime = getCurrentTimeInTimezone(prefs.timezone);
    const inQuiet = isWithinQuietHours(
      currTime,
      prefs.quietHoursStart || NOTIFICATION_CONFIG.QUIET_HOURS_DEFAULT_START,
      prefs.quietHoursEnd || NOTIFICATION_CONFIG.QUIET_HOURS_DEFAULT_END
    );

    const template = NOTIFICATION_CONFIG.TEMPLATES.DAILY_REPORT_REMINDER;
    const notif: DbNotification = {
      id: `notif_dr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: studentId,
      type: "daily_report_reminder",
      title: template.title,
      message: template.message,
      priority: "low",
      status: inQuiet ? "pending" : "sent",
      scheduledForDate: dateStr,
      eventKey,
      actionUrl: template.actionUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: inQuiet ? undefined : new Date().toISOString(),
    };

    return dbStore.createNotification(notif);
  }

  /**
   * Automatically suppresses pending daily report reminders when student submits report.
   */
  static async suppressDailyReportReminder(
    studentId: string,
    dateStr: string
  ): Promise<boolean> {
    const eventKey = `daily_report:${dateStr}:${studentId}`;
    return dbStore.suppressNotificationByEventKey(eventKey, "report_submitted");
  }

  /**
   * Schedules a gentle Weekly Reflection reminder for a Student.
   */
  static async scheduleWeeklyReflectionReminder(
    studentId: string,
    weekStartDate: string
  ): Promise<DbNotification | null> {
    const prefs = await dbStore.getNotificationPreferences(studentId);
    if (!prefs.weeklyReflectionReminder) {
      return null;
    }

    // Check if reflection is already saved for this week
    const existingRefl = await dbStore.getReflectionForWeek(studentId, weekStartDate);
    if (existingRefl) {
      return null;
    }

    const eventKey = `reflection:${weekStartDate}:${studentId}`;
    const existingNotif = await dbStore.getNotificationByEventKey(eventKey);
    if (existingNotif) {
      return existingNotif;
    }

    const template = NOTIFICATION_CONFIG.TEMPLATES.WEEKLY_REFLECTION_REMINDER;
    const notif: DbNotification = {
      id: `notif_refl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: studentId,
      type: "weekly_reflection_reminder",
      title: template.title,
      message: template.message,
      priority: "low",
      status: "sent",
      scheduledForDate: weekStartDate,
      eventKey,
      actionUrl: template.actionUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    };

    return dbStore.createNotification(notif);
  }

  /**
   * Automatically suppresses pending reflection reminders when student saves reflection.
   */
  static async suppressReflectionReminder(
    studentId: string,
    weekStartDate: string
  ): Promise<boolean> {
    const eventKey = `reflection:${weekStartDate}:${studentId}`;
    return dbStore.suppressNotificationByEventKey(eventKey, "reflection_saved");
  }

  /**
   * Schedules a gentle reminder supporting the Student's chosen Weekly Sankalpa.
   */
  static async scheduleSankalpaReminder(
    studentId: string,
    sankalpaId: string,
    sankalpaTitle: string,
    dateStr: string
  ): Promise<DbNotification | null> {
    const prefs = await dbStore.getNotificationPreferences(studentId);
    if (!prefs.sankalpaReminder) {
      return null;
    }

    const eventKey = `sankalpa:${sankalpaId}:${dateStr}:${studentId}`;
    const existingNotif = await dbStore.getNotificationByEventKey(eventKey);
    if (existingNotif) {
      return existingNotif;
    }

    const template = NOTIFICATION_CONFIG.TEMPLATES.SANKALPA_REMINDER(sankalpaTitle);
    const notif: DbNotification = {
      id: `notif_sank_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: studentId,
      type: "sankalpa_reminder",
      title: template.title,
      message: template.message,
      priority: "low",
      status: "sent",
      scheduledForDate: dateStr,
      eventKey,
      actionUrl: template.actionUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    };

    return dbStore.createNotification(notif);
  }

  /**
   * Schedules a single, aggregated Daily Sādhanā Summary for a Guru.
   */
  static async scheduleGuruDailySummary(
    guruId: string,
    dateStr: string,
    stats: { submitted: number; total: number; followUps: number }
  ): Promise<DbNotification | null> {
    const prefs = await dbStore.getNotificationPreferences(guruId);
    if (!prefs.guruDailySummary) {
      return null;
    }

    const eventKey = `guru_summary:${dateStr}:${guruId}`;
    const existingNotif = await dbStore.getNotificationByEventKey(eventKey);
    if (existingNotif) {
      return existingNotif;
    }

    const template = NOTIFICATION_CONFIG.TEMPLATES.GURU_DAILY_SUMMARY(
      stats.submitted,
      stats.total,
      stats.followUps
    );

    const notif: DbNotification = {
      id: `notif_gsum_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: guruId,
      type: "guru_daily_summary",
      title: template.title,
      message: template.message,
      priority: "normal",
      status: "sent",
      scheduledForDate: dateStr,
      eventKey,
      actionUrl: template.actionUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    };

    return dbStore.createNotification(notif);
  }

  /**
   * Schedules a Follow-up reminder for a Guru for an intentionally scheduled date.
   */
  static async scheduleGuruFollowUpReminder(
    guruId: string,
    followUpId: string,
    studentName: string,
    dateStr: string
  ): Promise<DbNotification | null> {
    const prefs = await dbStore.getNotificationPreferences(guruId);
    if (!prefs.guruFollowUpReminder) {
      return null;
    }

    const eventKey = `guru_followup:${followUpId}:${dateStr}:${guruId}`;
    const existingNotif = await dbStore.getNotificationByEventKey(eventKey);
    if (existingNotif) {
      return existingNotif;
    }

    const template = NOTIFICATION_CONFIG.TEMPLATES.GURU_FOLLOW_UP_REMINDER(studentName);
    const notif: DbNotification = {
      id: `notif_gfu_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: guruId,
      type: "guru_follow_up_reminder",
      title: template.title,
      message: template.message,
      priority: "normal",
      status: "sent",
      scheduledForDate: dateStr,
      eventKey,
      actionUrl: template.actionUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    };

    return dbStore.createNotification(notif);
  }

  /**
   * Retrieves notifications and unread count for a user.
   */
  static async getNotificationsForUser(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ notifications: DbNotification[]; total: number; unreadCount: number }> {
    return dbStore.getNotificationsByUser(userId, limit, offset);
  }

  /**
   * Returns unread notification count.
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return dbStore.getUnreadNotificationCount(userId);
  }

  /**
   * Marks a single notification as read.
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    return dbStore.markNotificationAsRead(notificationId, userId);
  }

  /**
   * Marks all notifications as read for a user.
   */
  static async markAllAsRead(userId: string): Promise<number> {
    return dbStore.markAllNotificationsAsRead(userId);
  }

  /**
   * Retrieves notification preferences for a user.
   */
  static async getPreferences(userId: string): Promise<DbNotificationPreferences> {
    return dbStore.getNotificationPreferences(userId);
  }

  /**
   * Updates notification preferences for a user.
   */
  static async updatePreferences(
    userId: string,
    updates: Partial<DbNotificationPreferences>
  ): Promise<DbNotificationPreferences> {
    const current = await dbStore.getNotificationPreferences(userId);
    const updated: DbNotificationPreferences = {
      ...current,
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };
    return dbStore.upsertNotificationPreferences(updated);
  }
}
