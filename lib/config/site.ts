export const siteConfig = {
  name: "Nityasādhanā",
  nameSanskrit: "नित्यसाधना",
  description:
    "A calm digital companion for daily Sadhana, spiritual discipline, and the sacred Guru–Shishya journey at ISKCON Pune.",
  tagline: "Daily spiritual practice.",
  taglineSanskrit: "नित्यं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://nityasadhana.org",
  ogImage: "/brand/og-image.png",
  creator: "ISKCON Pune Sevaks",
  keywords: [
    "Nityasādhanā",
    "Sadhana",
    "ISKCON",
    "ISKCON Pune",
    "Brahmacharya",
    "Guru Shishya",
    "Spiritual Discipline",
    "Japa",
    "Bhakti Yoga",
    "Daily Routine",
  ],
  themeColor: "#F7F1E5",
  backgroundColor: "#F7F1E5",
  accentColor: "#2457A6",
};

export type SiteConfig = typeof siteConfig;
