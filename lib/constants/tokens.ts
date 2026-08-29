/**
 * Nityasādhanā Design System Tokens
 *
 * Core Design Language: Aqua × Turquoise × Warm Ivory × Muted Antique Gold
 *
 * Visual Balance Target:
 * - 55-65% Aqua Family (#EAF7F4, #D8F1EE, #8ED9D5, #56BFC0, #3F9495)
 * - 20-30% Warm Ivory (#F7F5EF, #F3EFE5, #FFFFFF)
 * - 5-10% Muted Antique Gold / Champagne (#A9824D, #D0B27A, #C8A86D)
 * - 5-10% Deep Blue-Green Charcoal (#193B3B, #547070)
 */

export const COLORS = {
  background: {
    primary: "#EAF7F4", // Serene Aqua Background
    secondary: "#D8F1EE", // Aqua Mist
    surface: "#FFFFFF", // Elevated Surface
    ivory: "#F7F5EF", // Warm Ivory
    ivoryWarm: "#F3EFE5", // Deep Warm Ivory
  },
  foreground: {
    primary: "#193B3B", // Deep Blue-Green
    secondary: "#547070", // Muted Teal-Gray
    muted: "#789090", // Soft Gray-Teal
  },
  aqua: {
    deep: "#3F9495", // Primary button, active states
    deepHover: "#337B7C",
    deepActive: "#286364",
    primary: "#56BFC0", // Medium Aqua / Turquoise
    soft: "#8ED9D5", // Soft Light Aqua
    mist: "#D8F1EE", // Aqua Mist
    bg: "#EAF7F4", // Serene Aqua Background
  },
  gold: {
    muted: "#A9824D", // Muted Antique Gold
    deep: "#8A6635",
    champagne: "#D0B27A",
    sand: "#C8A86D",
    subtle: "rgba(169, 130, 77, 0.12)",
  },
  accent: {
    krishnaBlue: "#3F9495", // Mapped to Deep Aqua
    krishnaBlueHover: "#337B7C",
    krishnaBlueSubtle: "rgba(63, 148, 149, 0.08)",
    peacockBlue: "#56BFC0", // Mapped to Medium Aqua
    peacockBlueSubtle: "rgba(86, 191, 192, 0.12)",
    gurukulSaffron: "#A9824D", // Mapped to Muted Antique Gold
    deepSaffron: "#8A6635",
    saffronSubtle: "rgba(169, 130, 77, 0.12)",
    featherGreen: "#328A7A", // Mapped to Teal Green
    featherGreenSubtle: "rgba(50, 138, 122, 0.10)",
  },
  border: {
    subtle: "rgba(63, 148, 149, 0.16)",
    medium: "rgba(63, 148, 149, 0.28)",
    krishna: "#3F9495",
    saffron: "#A9824D",
  },
  status: {
    destructive: "#B33927", // Muted red
    destructiveSubtle: "rgba(179, 57, 39, 0.08)",
    success: "#328A7A",
    successSubtle: "rgba(50, 138, 122, 0.10)",
  },
} as const;

export const TYPOGRAPHY = {
  fonts: {
    sans: "Nunito Sans, system-ui, -apple-system, sans-serif",
    serif: "Noto Serif Devanagari, Georgia, serif",
    devanagari: "Noto Serif Devanagari, sans-serif",
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  scale: {
    display: {
      desktop: "52px",
      mobile: "36px",
      lineHeight: "1.15",
    },
    h1: {
      desktop: "36px",
      mobile: "28px",
      lineHeight: "1.2",
    },
    h2: {
      desktop: "28px",
      mobile: "24px",
      lineHeight: "1.25",
    },
    h3: {
      desktop: "22px",
      mobile: "20px",
      lineHeight: "1.3",
    },
    body: {
      size: "16px",
      lineHeight: "1.5",
    },
    small: {
      size: "14px",
      lineHeight: "1.4",
    },
    caption: {
      size: "12px",
      lineHeight: "1.35",
    },
  },
} as const;

export const SPACING = {
  base: 4,
  scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  mobilePadding: 16,
  tabletPadding: 24,
  desktopPadding: 32,
  maxWidths: {
    mobile: 430,
    form: 560,
    reading: 760,
    content: 1200,
  },
} as const;

export const TOUCH_TARGETS = {
  minSize: 44,
  preferredSize: 48,
  buttonHeight: 52,
  inputHeight: 52,
  tapHeight: 48,
} as const;

export const RADIUS = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  hero: "20px",
  pill: "9999px",
} as const;

export const ELEVATION = {
  level0: "none",
  level1: "0 2px 8px rgba(32, 32, 29, 0.04)",
  level2: "0 4px 20px rgba(32, 32, 29, 0.06)",
  level3: "0 8px 32px rgba(32, 32, 29, 0.08)",
} as const;

export const MOTION = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "220ms cubic-bezier(0.4, 0, 0.2, 1)",
  medium: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "450ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
