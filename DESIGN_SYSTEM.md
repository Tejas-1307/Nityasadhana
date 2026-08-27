# Nityasādhanā Design System

> **"Technology should reduce the administrative burden of seva, not create more work."**
>
> **Design Language:** _Ancient Gurukul × Vrindavan × Krishna × Modern Editorial Product Design_

---

## 1. Brand Philosophy & Personality

Nityasādhanā (नित्यसाधना — _"Daily spiritual practice"_) is a mobile-first digital platform created as **seva** for **ISKCON Pune**. It serves Brahmacharya students (Shishyas) in tracking daily Sadhana and helps Gurus guide them with minimum administrative overhead.

### Atmospheric Qualities

- **Calm & Disciplined**: Appropriate for use at 3:30 AM, 5:00 AM, or late evening without visual glare.
- **Natural Tactility**: Feels like warm handmade paper rather than cold corporate SaaS.
- **Subtle Spiritual Resonance**: Communicated through color, typography, generous whitespace, and restrained geometric symbolism.
- **Clarity Over Decoration**: Zero religious posters, zero flashy neon gradients, zero gamification noise.

---

## 2. Logo System & Clear Space

### Lockups

1. **Primary Horizontal**: `BrandMark` + `Nityasādhanā` (Nunito Sans Bold) + `नित्यसाधना` (Noto Serif Devanagari Medium). Used on desktop navigation and wide headers.
2. **Compact Mobile**: Scaled for $360\text{px}$ viewports.
3. **Vertical Stacked**: Centered mark and typography for login screens, splash, and print.
4. **Symbol Only**: For app icons, favicons, and minimal avatar slots.
5. **Monochrome**: Single Deep Charcoal (`#20201D`) for low-contrast print or document receipts.
6. **Dark Context**: Light elements on dark containers.

### Clear Space & Minimum Sizes

- **Clear Space**: Minimum $X/2$ margin on all sides, where $X$ is the height of the brand mark.
- **Minimum Digital Size**:
  - Horizontal Logo: $140\text{px} \times 28\text{px}$
  - Symbol Mark: $16\text{px} \times 16\text{px}$ (favicon), $48\text{px} \times 48\text{px}$ (app icon)

---

## 3. Peacock-Feather Brand Mark Geometry

The brand mark is a clean geometric vector combining:

1. **Outer Feather Contour** (`#167D8D` Peacock Blue at $15\%$ fill opacity): Vrindavan & Kadamba aura.
2. **Ascending Path / Flame** (`#E8D9BF` Soft Sand with `#2457A6` Krishna Blue stroke): Spiritual discipline and upward progress.
3. **Core Eye** (`#2457A6` Krishna Blue): Unwavering consciousness.
4. **Spiritual Bindu** (`#D9822B` Gurukul Saffron): Center of devotion.
5. **Central Axis**: Sadhana discipline stem.

---

## 4. Color System & Proportions

### Target Balance

```
┌───────────────────────────────────────────────────────────┐
│ Warm Ivory / Soft Sand (65%)                              │
│ ┌───────────────────────┐ ┌─────────────┐ ┌───┐ ┌─┐       │
│ │ Deep Charcoal (18%)   │ │ Blue (10%)  │ │Sfr│ │G│       │
│ └───────────────────────┘ └─────────────┘ └───┘ └─┘       │
└───────────────────────────────────────────────────────────┘
```

| Token Name              | Hex Code              | Purpose                            | Target Ratio |
| :---------------------- | :-------------------- | :--------------------------------- | :----------- |
| `background.primary`    | `#F7F1E5`             | Warm Ivory main canvas             | ~60%         |
| `background.secondary`  | `#E8D9BF`             | Soft Sand secondary surfaces       | ~5%          |
| `background.surface`    | `#FFFFFF`             | Elevated cards / dialogs           | Contextual   |
| `foreground.primary`    | `#20201D`             | Deep Charcoal main text            | ~15%         |
| `foreground.secondary`  | `#66635D`             | Muted Charcoal labels/captions     | ~3%          |
| `accent.krishnaBlue`    | `#2457A6`             | Primary CTAs, active states, links | ~10%         |
| `accent.gurukulSaffron` | `#D9822B`             | Spiritual highlights, badges       | ~5%          |
| `accent.peacockBlue`    | `#167D8D`             | Secondary data visualization       | ~1%          |
| `accent.featherGreen`   | `#3D765B`             | Success, nature indicators         | ~1%          |
| `border.subtle`         | `rgba(32,32,29,0.08)` | Subtle warm borders                | Structure    |

---

## 5. Typography

### Primary UI Font: **Nunito Sans**

Used for navigation, buttons, forms, numbers, labels, body copy, and UI controls.

- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold).

### Editorial & Sanskrit Font: **Noto Serif Devanagari**

Used for Sanskrit shlokas, brand titles (`नित्यसाधना`), section kicker hints, and editorial quotations.

### Scale

| Level       | Desktop Size  | Mobile Size   | Line Height | Weight    |
| :---------- | :------------ | :------------ | :---------- | :-------- |
| **Display** | $52\text{px}$ | $36\text{px}$ | $1.15$      | 700       |
| **H1**      | $36\text{px}$ | $28\text{px}$ | $1.2$       | 700       |
| **H2**      | $28\text{px}$ | $24\text{px}$ | $1.25$      | 600       |
| **H3**      | $22\text{px}$ | $20\text{px}$ | $1.3$       | 600       |
| **Body**    | $16\text{px}$ | $15\text{px}$ | $1.5$       | 400 / 500 |
| **Small**   | $14\text{px}$ | $14\text{px}$ | $1.4$       | 500       |
| **Caption** | $12\text{px}$ | $12\text{px}$ | $1.35$      | 500       |

---

## 6. Spacing System & Layout Bounds

- **Base Grid Unit**: $4\text{px}$ (Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px`).
- **Mobile Page Padding**: $16\text{px}$ ($24\text{px}$ on tablet, $32\text{px}$ on desktop).
- **Max Width Bounds**:
  - Full Content: $1200\text{px}$
  - Reading / Editorial: $760\text{px}$
  - Forms / Login: $560\text{px}$
  - Mobile Container: $430\text{px}$

---

## 7. Border Radius

- `sm`: $8\text{px}$ (Tags, badges, small buttons)
- `md`: $12\text{px}$ (Inputs, standard buttons, steppers)
- `lg`: $16\text{px}$ (Cards, containers)
- `hero`: $20\text{px}$ (Hero lockup cards)
- `pill`: $9999\text{px}$ (Badges and filters only)

---

## 8. Shadows & Elevation

The interface feels mostly flat with subtle, warm elevation:

- **Level 0**: `none`
- **Level 1**: `0 2px 8px rgba(32, 32, 29, 0.04)` (Cards & inputs)
- **Level 2**: `0 4px 20px rgba(32, 32, 29, 0.06)` (Dropdowns, active cards)
- **Level 3**: `0 8px 32px rgba(32, 32, 29, 0.08)` (Modals, elevated sheets)

---

## 9. Icon System

- **Library**: `lucide-react`
- **Stroke Width**: $1.75\text{px}$ – $2.0\text{px}$
- **Standard Sizes**: Small ($16\text{px}$), Default ($20\text{px}$), Large ($24\text{px}$), Feature ($28\text{px} – 32\text{px}$).

---

## 10. Button System

- **Standard Height**: $52\text{px}$ (min touch target: $48\text{px}$).
- **Press Animation**: `active:scale-[0.98]` with $150\text{ms} – 220\text{ms}$ ease.
- **Variants**:
  - `Primary`: Krishna Blue (`#2457A6`), white text.
  - `Secondary`: Warm Sand/Ivory, 1px border, Charcoal text.
  - `Saffron`: Gurukul Saffron (`#D9822B`) for spiritual highlights.
  - `Ghost`: Transparent background for subtle links.
  - `Destructive`: Restrained muted red (`#B33927`).

---

## 11. Form System & Tap-Based UX

Optimized for **Maximum Tap Interaction** and **Minimum Typing**:

- **Inputs & Textareas**: $52\text{px}$ height, $12\text{px}$ radius, visible labels with optional Sanskrit sub-labels.
- **Steppers (`Stepper`)**: One-touch $+/-$ increment buttons for Japa rounds and study minutes.
- **Toggles (`Toggle`)**: Fast binary switches for early wakeup and temple program attendance.
- **Segmented Controls (`SegmentedControl`)**: Instant filter switching without keyboard entry.

---

## 12. Card Variations

- **Standard Card**: Clean white surface with subtle 1px border.
- **Highlight Card**: Subtle Saffron (`border-l-[#D9822B]`) or Krishna Blue (`border-l-[#2457A6]`) accent.
- **Metric Card**: Displays large bold counts (e.g. 16 Rounds) with labels and trend badges.
- **Info Card**: Subtle tinted container for devotional quotes and guidance tips.
- **Empty State Card**: Peaceful call-to-action (_"Your journey begins here"_).

---

## 13. Navigation Primitives

- **TopBar**: $56\text{px} – 64\text{px}$ sticky top bar with logo lockup and action slot.
- **BottomNavigation**: Mobile-first fixed bottom bar with $48\text{px}$ touch targets, active Krishna Blue indicator, and clean Lucide icons.

---

## 14. Motion & Animation

- **Durations**: Fast ($150\text{ms}$), Normal ($220\text{ms}$), Medium ($300\text{ms}$).
- **Easing**: Natural cubic-bezier (`0.4, 0, 0.2, 1`).
- **Reduced Motion**: All animations disabled when `prefers-reduced-motion: reduce` is detected.

---

## 15. Responsive Breakpoints

- Mobile: $360\text{px}$, $375\text{px}$, $390\text{px}$, $414\text{px}$, $430\text{px}$
- Tablet: $640\text{px}$ (`sm`), $768\text{px}` (`md`)
- Desktop: $1024\text{px}$ (`lg`), $1280\text{px}` (`xl`)

---

## 16. Accessibility Standards (WCAG 2.1 AA)

- **Contrast**: Deep Charcoal on Warm Ivory achieves $12.8:1$ contrast (exceeds $4.5:1$ AA standard).
- **Touch Targets**: All interactive targets are $\ge 48\text{px} \times 48\text{px}$.
- **Labels & ARIA**: Visible `<label>` tags linked via `id`/`htmlFor`, `aria-describedby` for error text, `role="switch"` and `role="radiogroup"` for custom tap controls.

---

## 17. Do / Don't Guidelines

| DO                                                                   | DON'T                                                                   |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **DO** prioritize generous whitespace and calm typography.           | **DON'T** flood the interface with bright religious imagery or posters. |
| **DO** use Krishna Blue for primary CTAs and active states.          | **DON'T** make every button saffron or flood screens with orange.       |
| **DO** provide tap steppers and toggles for Sadhana logging.         | **DON'T** force devotees to type numbers manually on mobile keyboards.  |
| **DO** keep borders at subtle `rgba(32, 32, 29, 0.08)`.              | **DON'T** use heavy dark borders or aggressive glassmorphism.           |
| **DO** preserve the exact brand name: **Nityasādhanā** (नित्यसाधना). | **DON'T** misspell as "Nityasadhana" or "Nitya Sadhana".                |
