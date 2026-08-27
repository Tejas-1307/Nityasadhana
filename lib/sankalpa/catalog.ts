// ============================================================
// NITYASĀDHANĀ — WEEKLY SANKALPA CATALOG & SUGGESTIONS
// ============================================================
// Meaningful categories and suggested intentions based on the
// Vedic Sādhanā framework. Sincere, gradual, and non-judgmental.
// ============================================================

import { SankalpaCategory, SankalpaTargetConfig } from "@/lib/db/schema";

export interface SankalpaCategoryDefinition {
  key: SankalpaCategory;
  label: string;
  shortLabel: string;
  iconName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultTargetConfig?: SankalpaTargetConfig;
  suggestedTitles: string[];
}

export const SANKALPA_CATEGORIES: SankalpaCategoryDefinition[] = [
  {
    key: "wake_up",
    label: "Wake-up",
    shortLabel: "Wake-up",
    iconName: "Moon",
    defaultTitle: "Maintain a consistent wake-up time",
    defaultDescription: "Rise in the Brahma-muhūrta period to begin morning Sādhanā peacefully.",
    defaultTargetConfig: {
      metric: "wake_up_time",
      targetValue: "03:30",
      comparison: "at_or_before",
    },
    suggestedTitles: [
      "Maintain a consistent wake-up time",
      "Rise before 03:30 AM for morning Japa",
      "Rise consistently at 04:00 AM on weekdays",
      "Wake up early without snoozing alarm",
    ],
  },
  {
    key: "japa",
    label: "Japa Meditation",
    shortLabel: "Japa",
    iconName: "CircleDot",
    defaultTitle: "Complete my planned daily rounds",
    defaultDescription: "Chant attentive Holy Names with clear pronunciation and focus.",
    defaultTargetConfig: {
      metric: "japa_rounds",
      targetValue: 16,
      comparison: "at_least",
    },
    suggestedTitles: [
      "Complete my planned daily rounds",
      "Complete 16 attentive rounds daily",
      "Finish all rounds before 08:00 AM",
      "Focus deeply on attentive hearing of each mantra",
    ],
  },
  {
    key: "reading",
    label: "Scripture Reading",
    shortLabel: "Reading",
    iconName: "BookOpen",
    defaultTitle: "Read Bhagavad-gītā / Srimad Bhagavatam daily",
    defaultDescription: "Dedicate time to read and assimilate Srila Prabhupada's books.",
    defaultTargetConfig: {
      metric: "reading_duration",
      targetValue: 30,
      comparison: "at_least",
    },
    suggestedTitles: [
      "Read Bhagavad-gītā / Srimad Bhagavatam daily",
      "Read 30 minutes of Srimad Bhagavatam daily",
      "Read at least 15 minutes of Bhagavad-gītā every morning",
      "Note down one inspiring realization after reading",
    ],
  },
  {
    key: "hearing",
    label: "Śravaṇam (Hearing)",
    shortLabel: "Hearing",
    iconName: "Headphones",
    defaultTitle: "Maintain consistent daily Śravaṇam",
    defaultDescription: "Listen to inspiring spiritual discourses and kirtan with full attention.",
    defaultTargetConfig: {
      metric: "hearing_duration",
      targetValue: 30,
      comparison: "at_least",
    },
    suggestedTitles: [
      "Maintain consistent daily Śravaṇam",
      "Listen to 30 minutes of Bhagavatam lecture daily",
      "Absorb morning lecture with undivided attention",
      "Listen to spiritual class while preparing for the day",
    ],
  },
  {
    key: "study",
    label: "Academic / Self Study",
    shortLabel: "Study",
    iconName: "GraduationCap",
    defaultTitle: "Maintain focused study time",
    defaultDescription: "Perform academic and devotional study with discipline and focus.",
    defaultTargetConfig: {
      metric: "study_duration",
      targetValue: 120,
      comparison: "at_least",
    },
    suggestedTitles: [
      "Maintain focused study time",
      "Complete 2 hours of focused study daily",
      "Study without digital distractions",
      "Review syllabus and notes consistently each afternoon",
    ],
  },
  {
    key: "time_management",
    label: "Time Management",
    shortLabel: "Time",
    iconName: "Clock",
    defaultTitle: "Reduce unnecessary time wastage",
    defaultDescription: "Guard precious time by minimizing idle scrolling and distractions.",
    defaultTargetConfig: {
      metric: "time_wasted",
      targetValue: 30,
      comparison: "at_most",
    },
    suggestedTitles: [
      "Reduce unnecessary time wastage",
      "Keep idle screen time under 30 minutes daily",
      "Avoid social media scrolling during morning hours",
      "Plan the day's routine the previous evening",
    ],
  },
  {
    key: "sleep",
    label: "Sleep Routine",
    shortLabel: "Sleep",
    iconName: "Bed",
    defaultTitle: "Maintain a consistent sleep routine",
    defaultDescription: "Retire on time to enable peaceful early morning wake-up.",
    defaultTargetConfig: {
      metric: "wake_up_time",
      targetValue: "04:00",
      comparison: "at_or_before",
    },
    suggestedTitles: [
      "Maintain a consistent sleep routine",
      "Retire by 09:30 PM every night",
      "Turn off screens 30 minutes before sleep",
      "Ensure 6+ hours of restful night sleep",
    ],
  },
  {
    key: "other",
    label: "Custom Intention",
    shortLabel: "Custom",
    iconName: "Sparkles",
    defaultTitle: "Personal weekly intention",
    defaultDescription: "A sincere personal commitment tailored to your current stage of growth.",
    suggestedTitles: [
      "Practice offering heartfelt gratitude every evening",
      "Spend less time scrolling before bed",
      "Maintain respectful and kind speech throughout the day",
      "Offer simple prayers before beginning daily study",
    ],
  },
];

export function getCategoryDefinition(category: SankalpaCategory): SankalpaCategoryDefinition {
  const found = SANKALPA_CATEGORIES.find((c) => c.key === category);
  return found || SANKALPA_CATEGORIES[SANKALPA_CATEGORIES.length - 1];
}
