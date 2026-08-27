/**
 * Greeting and Date Utilities for Nityasādhanā
 * Provides time-aware spiritual greetings and user-friendly localized date formatting.
 */

export interface GreetingInfo {
  salutation: string;
  timeGreeting: string;
  fullGreeting: (name: string) => string;
}

/**
 * Returns a calm, natural time-based greeting for the devotee.
 * Morning: Before 12:00
 * Afternoon: 12:00 - 17:00
 * Evening: 17:00 onwards
 */
export function getTimeBasedGreeting(date: Date = new Date()): GreetingInfo {
  const hour = date.getHours();

  let timeGreeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon";
  } else if (hour >= 17 || hour < 4) {
    timeGreeting = "Good evening";
  }

  return {
    salutation: "Hare Krishna",
    timeGreeting,
    fullGreeting: (name: string) => `Hare Krishna, ${name}`,
  };
}

/**
 * Formats a given date into a calm, human-readable format.
 * Example: "Wednesday, 26 August 2026"
 */
export function formatDevoteeDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formats a short practice date.
 * Example: "26 August 2026"
 */
export function formatPracticeDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
