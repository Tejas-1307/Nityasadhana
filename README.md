# Nityasādhanā (नित्यसाधना)

> **"Technology should reduce the administrative burden of seva, not create more work."**
>
> _Don't make devotees spend their seva managing software. Make the software reduce the work required to perform their seva._

---

## 1. Project Status

> [!NOTE]
> **Current Milestone**: **Phase 2: Technical Foundation (10–15% Milestone)**
> This repository contains the complete production-grade technical foundation, design tokens, tap-optimized UI primitives, PWA configuration, and error architecture. **No business logic, mock data, or premature database/auth modules are implemented.**

---

## 2. Overview & Philosophy

**Nityasādhanā** is a mobile-first digital platform created as pure **seva** for **ISKCON Pune** to support Brahmacharya students (Shishyas) in maintaining their daily Sadhana and enable Gurus to guide them with minimal administrative overhead.

### Visual & Architectural Language

> **Ancient Gurukul × Vrindavan × Krishna × Modern Editorial Product Design**

- **Warm & Tactile**: Natural paper and earth tones over stark white or dark UI.
- **Calm & Editorial**: Elegant typography (Nunito Sans + Noto Serif Devanagari), generous whitespace, no aggressive gamification, no loud gradients.
- **Subtle Spiritual Resonance**: Restrained accents of Krishna Blue (`#2457A6`), Gurukul Saffron (`#D9822B`), Peacock Blue (`#167D8D`), and Feather Green (`#3D765B`).
- **Minimum Typing, Maximum Tap UX**: One-touch steppers, toggles, and segmented controls for rapid 30-second mobile logging.

---

## 3. Technology Stack

- **Framework**: [Next.js 15.1.7](https://nextjs.org/) (App Router, Server Components by default)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode enabled)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) with centralized CSS custom properties
- **Iconography**: [Lucide React](https://lucide.dev/) (Thin 1.75–2px stroke)
- **Typography**:
  - `Nunito Sans` — Primary UI, navigation, buttons, forms, numbers, labels
  - `Noto Serif Devanagari` — Sanskrit shlokas, spiritual quotes, editorial moments
- **Architecture**: PWA-ready (`manifest.ts`, standalone display, mobile safe-area insets)
- **Code Quality**: ESLint + Prettier

---

## 4. Design System & Proportions

The interface maintains a strict visual balance:

- **65% Warm Ivory / Soft Sand**: `#F7F1E5` (Primary Bg), `#E8D9BF` (Secondary Surface)
- **18% Deep Charcoal**: `#20201D` (Primary Text), `#66635D` (Muted Text)
- **10% Krishna Blue**: `#2457A6` (Primary CTAs, Active States, Links)
- **5% Gurukul Saffron**: `#D9822B` (Spiritual Accents, Badges, `#A95620` Deep Saffron)
- **2% Peacock Blue / Green**: `#167D8D` (Peacock Blue), `#3D765B` (Feather Green)

---

## 5. Project Structure

```
nityasadhana/
├── app/
│   ├── (auth)/             # Authentication route group (stubs)
│   ├── (guru)/             # Guru guidance route group (stubs)
│   ├── (public)/           # Public routes (landing, about, design-system)
│   ├── (student)/          # Student sadhana route group (stubs)
│   ├── error.tsx           # Client error boundary
│   ├── global-error.tsx    # Global root fallback boundary
│   ├── globals.css         # CSS custom properties, resets, safe-area insets
│   ├── layout.tsx          # Root layout with fonts, PWA viewport & SEO metadata
│   ├── loading.tsx         # Root suspense loading fallback
│   ├── manifest.ts         # PWA Web App Manifest
│   └── not-found.tsx       # 404 handler ("Looks like this path has wandered")
├── components/
│   ├── branding/           # BrandMark, Logo, VrindavanAtmosphere
│   ├── feedback/           # EmptyState, LoadingState, ErrorState
│   ├── layout/             # Container, Section, PageHeader
│   ├── navigation/         # TopBar, BottomNavigation
│   ├── typography/         # Heading, Text, SanskritQuote
│   └── ui/                 # Button, IconButton, Input, Textarea, Select, Stepper, Toggle, SegmentedControl, Card, Badge, Divider, Avatar
├── lib/
│   ├── config/             # Site configuration, environment accessors (env.ts)
│   ├── constants/          # Design tokens (tokens.ts), navigation items (nav.ts)
│   ├── utils/              # Class merging utilities (cn.ts)
│   └── validations/        # Validation helpers
├── public/                 # Static brand assets, PWA icons, favicon.ico
├── types/                  # Strict TypeScript domain definitions (common, user, navigation)
├── ARCHITECTURE.md         # Full technical architecture specification
├── DESIGN_SYSTEM.md        # Comprehensive visual design system guide
├── package.json            # Dependencies and npm scripts
├── tailwind.config.ts      # Semantic design token mappings
└── tsconfig.json           # Strict TypeScript configuration
```

---

## 6. Development Setup & Scripts

### Prerequisites

- Node.js 18.18+ or 20+
- npm 9+ or pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/nityasadhana.git
cd nityasadhana

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Available Scripts

```bash
# Start development server
npm run dev

# Run TypeScript strict type-check
npm run typecheck

# Run ESLint validation
npm run lint

# Format codebase with Prettier
npm run format

# Verify formatting without modifying files
npm run format:check

# Create production build
npm run build

# Start production server
npm start
```

---

## 7. Environment Variables

See `.env.example` for details. **Never commit real secrets or database credentials.**

```env
# Public client variables (Safe to expose in browser)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nityasādhanā
NEXT_PUBLIC_APP_ENV=development

# Server-only variables (Future modules — NEVER use NEXT_PUBLIC_ prefix)
# DATABASE_URL=
# AUTH_SECRET=
```

---

## 8. Development Principles

1. **Keep It Calm**: Never introduce flashy animations, neon colors, or distracting elements.
2. **Server Components First**: Use React Server Components by default; add `"use client"` only for interactive state.
3. **No Premature Complexity**: Build modules iteratively without speculative abstractions.
4. **Mobile First**: Test at `360px`, `375px`, `390px`, `414px`, and `430px` before testing desktop.
5. **Preserve Spelling**: Always preserve **Nityasādhanā** (नित्यसाधना).

---

## 9. Seva & License

Developed with devotion as seva for **ISKCON Pune**.
All rights reserved © 2026.
