// ============================================================
// NITYASĀDHANĀ — CALM NOTIFICATION CONFIGURATION & TEMPLATES
// ============================================================
// Strictly defines calm, non-judgmental, zero-urgency notification
// parameters and copy templates.
// ============================================================

export const NOTIFICATION_CONFIG = {
  // Default Quiet Hours (9:00 PM to 5:00 AM)
  QUIET_HOURS_DEFAULT_START: "21:00",
  QUIET_HOURS_DEFAULT_END: "05:00",

  // Default Timezone
  DEFAULT_TIMEZONE: "Asia/Kolkata",

  // Anti-Spam Daily Caps
  MAX_STUDENT_ROUTINE_PER_DAY: 1,
  MAX_GURU_SUMMARY_PER_DAY: 1,
  MAX_SANKALPA_REMINDERS_PER_WEEK: 2,

  // Copy Templates (Calm, Short, Respectful, Zero Urgency)
  TEMPLATES: {
    DAILY_REPORT_REMINDER: {
      title: "Daily Sādhanā Report",
      message:
        "Hare Krishna 🙏 Your daily Sādhanā report is ready whenever you have a moment.",
      actionUrl: "/student/report",
    },
    WEEKLY_REFLECTION_REMINDER: {
      title: "Weekly Reflection",
      message:
        "Hare Krishna 🙏 Your weekly reflection is ready. Take a quiet moment to look back on the week when convenient.",
      actionUrl: "/student/journey",
    },
    SANKALPA_REMINDER: (title: string) => ({
      title: "Weekly Sankalpa Focus",
      message: `Your Sankalpa for this week: ${title}. Keep going with steadiness. 🌱`,
      actionUrl: "/student/journey",
    }),
    GURU_DAILY_SUMMARY: (submitted: number, total: number, followUpsCount: number = 0) => ({
      title: "Daily Sādhanā Summary",
      message:
        followUpsCount > 0
          ? `Hare Krishna 🙏 Today's reports: ${submitted} of ${total} Shishyas reported. ${followUpsCount} follow-up scheduled.`
          : `Hare Krishna 🙏 Today's reports: ${submitted} of ${total} Shishyas reported.`,
      actionUrl: "/guru",
    }),
    GURU_FOLLOW_UP_REMINDER: (studentName: string) => ({
      title: "Scheduled Follow-up",
      message: `Hare Krishna 🙏 Your scheduled follow-up with ${studentName} is due today.`,
      actionUrl: "/guru",
    }),
  },
} as const;
