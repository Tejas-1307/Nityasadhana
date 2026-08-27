/**
 * Nityasādhanā Design System Tokens
 *
 * Core Design Language: Ancient Gurukul × Vrindavan × Krishna × Modern Editorial
 *
 * Color Balance Target:
 * - 65% Warm Ivory (#F7F1E5) / Soft Sand (#E8D9BF)
 * - 18% Deep Charcoal (#20201D) / Muted Charcoal (#66635D)
 * - 10% Krishna Blue (#2457A6)
 * - 5% Gurukul Saffron (#D9822B) / Deep Saffron (#A95620)
 * - 2% Peacock Blue (#167D8D) / Feather Green (#3D765B)
 */

export const COLORS = {
  background: {
    primary: "#F7F1E5", // Warm Ivory (Handmade natural paper feel)
    secondary: "#E8D9BF", // Soft Sand (Secondary surface / containers)
    surface: "#FFFFFF", // Elevated Surface (Cards / Modals)
  },
  foreground: {
    primary: "#20201D", // Deep Charcoal (High contrast, softer than pure black)
    secondary: "#66635D", // Muted Charcoal (Subtle labels & captions)
  },
  accent: {
    krishnaBlue: "#2457A6", // Primary action, links, active navigation
    krishnaBlueHover: "#1D4685",
    krishnaBlueSubtle: "rgba(36, 87, 166, 0.08)",
    peacockBlue: "#167D8D", // Secondary highlights, selective data accents
    peacockBlueSubtle: "rgba(22, 125, 141, 0.08)",
    gurukulSaffron: "#D9822B", // Spiritual highlights, secondary badges
    deepSaffron: "#A95620", // Darker saffron text/states
    saffronSubtle: "rgba(217, 130, 43, 0.10)",
    featherGreen: "#3D765B", // Minimal sacred flora / success accents
    featherGreenSubtle: "rgba(61, 118, 91, 0.10)",
  },
  border: {
    subtle: "rgba(32, 32, 29, 0.08)",
    medium: "rgba(32, 32, 29, 0.15)",
    krishna: "#2457A6",
    saffron: "#D9822B",
  },
  status: {
    destructive: "#B33927", // Muted red
    destructiveSubtle: "rgba(179, 57, 39, 0.08)",
    success: "#3D765B",
    successSubtle: "rgba(61, 118, 91, 0.10)",
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
