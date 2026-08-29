import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "var(--color-bg-primary)", // #EAF7F4 Aqua Background
          secondary: "var(--color-bg-secondary)", // #D8F1EE Aqua Mist
          surface: "var(--color-bg-surface)", // #FFFFFF Elevated Surface
          ivory: "var(--color-bg-ivory)", // #F7F5EF Warm Ivory Surface
          ivoryWarm: "var(--color-bg-ivory-warm)", // #F3EFE5 Deep Warm Ivory
        },
        foreground: {
          primary: "var(--color-text-primary)", // #193B3B Deep Blue-Green / Charcoal
          secondary: "var(--color-text-secondary)", // #547070 Muted Teal-Gray
          muted: "var(--color-text-muted)", // #789090 Soft Gray-Teal
        },
        aqua: {
          DEFAULT: "var(--color-aqua-primary)", // #56BFC0
          deep: "var(--color-aqua-deep)", // #3F9495
          deepHover: "var(--color-aqua-deep-hover)", // #337B7C
          deepActive: "var(--color-aqua-deep-active)", // #286364
          soft: "var(--color-aqua-soft)", // #8ED9D5
          mist: "var(--color-aqua-mist)", // #D8F1EE
          bg: "var(--color-bg-primary)", // #EAF7F4
          subtle: "var(--color-aqua-primary-subtle)",
        },
        gold: {
          DEFAULT: "var(--color-gold-muted)", // #A9824D
          deep: "var(--color-gold-deep)", // #8A6635
          subtle: "var(--color-gold-subtle)", // rgba(169, 130, 77, 0.12)
          champagne: "var(--color-champagne)", // #D0B27A
          sand: "var(--color-sand)", // #C8A86D
        },
        ivory: {
          DEFAULT: "var(--color-bg-ivory)", // #F7F5EF
          warm: "var(--color-bg-ivory-warm)", // #F3EFE5
        },
        krishna: {
          DEFAULT: "var(--color-krishna-blue)", // #3F9495
          hover: "var(--color-krishna-blue-hover)", // #337B7C
          subtle: "var(--color-krishna-blue-subtle)", // rgba(63, 148, 149, 0.08)
        },
        peacock: {
          DEFAULT: "var(--color-peacock-blue)", // #56BFC0
          subtle: "var(--color-peacock-blue-subtle)", // rgba(86, 191, 192, 0.12)
        },
        saffron: {
          DEFAULT: "var(--color-gurukul-saffron)", // #A9824D
          deep: "var(--color-deep-saffron)", // #8A6635
          subtle: "var(--color-saffron-subtle)", // rgba(169, 130, 77, 0.12)
        },
        feather: {
          DEFAULT: "var(--color-feather-green)", // #328A7A
          subtle: "var(--color-feather-green-subtle)", // rgba(50, 138, 122, 0.10)
        },
        border: {
          subtle: "var(--color-border-subtle)", // rgba(63, 148, 149, 0.16)
          medium: "var(--color-border-medium)", // rgba(63, 148, 149, 0.28)
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // #B33927 (Muted Red)
          subtle: "var(--color-destructive-subtle)", // rgba(179, 57, 39, 0.08)
        },
        success: {
          DEFAULT: "var(--color-success)", // #328A7A
          subtle: "var(--color-success-subtle)", // rgba(50, 138, 122, 0.10)
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-noto-serif-devanagari)", "Georgia", "serif"],
        devanagari: ["var(--font-noto-serif-devanagari)", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)", // 8px
        md: "var(--radius-md)", // 12px
        lg: "var(--radius-lg)", // 16px
        hero: "var(--radius-hero)", // 20px
        pill: "var(--radius-pill)", // 9999px
      },
      boxShadow: {
        level0: "none",
        level1: "var(--shadow-level1)", // 0 2px 8px rgba(32,32,29,0.04)
        level2: "var(--shadow-level2)", // 0 4px 20px rgba(32,32,29,0.06)
        level3: "var(--shadow-level3)", // 0 8px 32px rgba(32,32,29,0.08)
        soft: "var(--shadow-level2)",
        elevated: "var(--shadow-level3)",
      },
      maxWidth: {
        mobile: "430px",
        form: "560px",
        reading: "760px",
        content: "1200px",
      },
      minHeight: {
        touch: "48px",
        btn: "52px",
      },
      minWidth: {
        touch: "48px",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "220ms",
        medium: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
