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
          primary: "var(--color-bg-primary)", // #F7F1E5 Warm Ivory
          secondary: "var(--color-bg-secondary)", // #E8D9BF Soft Sand
          surface: "var(--color-bg-surface)", // #FFFFFF Elevated Surface
        },
        foreground: {
          primary: "var(--color-text-primary)", // #20201D Deep Charcoal
          secondary: "var(--color-text-secondary)", // #66635D Muted Charcoal
        },
        krishna: {
          DEFAULT: "var(--color-krishna-blue)", // #2457A6
          hover: "var(--color-krishna-blue-hover)", // #1D4685
          subtle: "var(--color-krishna-blue-subtle)", // rgba(36, 87, 166, 0.08)
        },
        peacock: {
          DEFAULT: "var(--color-peacock-blue)", // #167D8D
          subtle: "var(--color-peacock-blue-subtle)", // rgba(22, 125, 141, 0.08)
        },
        saffron: {
          DEFAULT: "var(--color-gurukul-saffron)", // #D9822B
          deep: "var(--color-deep-saffron)", // #A95620
          subtle: "var(--color-saffron-subtle)", // rgba(217, 130, 43, 0.10)
        },
        feather: {
          DEFAULT: "var(--color-feather-green)", // #3D765B
          subtle: "var(--color-feather-green-subtle)", // rgba(61, 118, 91, 0.10)
        },
        border: {
          subtle: "var(--color-border-subtle)", // rgba(32, 32, 29, 0.08)
          medium: "var(--color-border-medium)", // rgba(32, 32, 29, 0.15)
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // #B33927 (Muted Red)
          subtle: "var(--color-destructive-subtle)", // rgba(179, 57, 39, 0.08)
        },
        success: {
          DEFAULT: "var(--color-success)", // #3D765B
          subtle: "var(--color-success-subtle)", // rgba(61, 118, 91, 0.10)
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
