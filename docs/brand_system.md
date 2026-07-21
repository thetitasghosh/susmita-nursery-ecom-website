# Susmita Nursery — Brand & Design System Guidelines

This document details the core design token specifications, visual guidelines, typography layouts, and interactive components that govern the user interface for **Susmita Nursery**.

---

## 1. Color Palette & Semantic Tokens

All color mappings must be applied via Tailwind CSS class names rather than raw hex values. The system utilizes custom theme properties mapped inside [src/app/globals.css](file:///d:/Documents/03_Freelance_Websites/susmita-nursery-ecom-website/src/app/globals.css) for both light and dark modes.

| Token | Hex (Light) | Hex (Dark) | Description / Recommended Use Case |
| :--- | :--- | :--- | :--- |
| `primary` | `#007A4D` | `#009960` | Deep Forest: Main brand buttons, headings, and primary UI highlights |
| `primary-emerald` | `#015F3C` | `#01784c` | Classic Emerald: Dense foliage background grids, premium tag indicators, footers |
| `secondary` | `#6CB52D` | `#7cc83d` | Leaf Green: Healthy growth indicators, badges, active icons, borders |
| `accent` | `#F3BE19` | `#f4c42d` | Warm Ochre/Gold: Callouts, rating stars, highlighting promo banners |
| `accent-earth` | `#755B39` | `#8c7049` | Soil/Amber: Earth-related parameters (soil dryness, moisture, bark specs) |
| `background` | `#FAF8F2` | `#0b1913` | Default backdrop: Warm White paper tone (Light) / Dark Forest (Dark) |
| `foreground` | `#1A1A1A` | `#faf8f2` | High contrast slate for titles, body descriptions, and inputs |
| `muted` | `#EAE8E0` | `#1a2f25` | Border dividers, subtle card background shapes, inactive icons |
| `neutral-dark` | `#0b1913` | `#0b1913` | Deep Charcoal/Green: Solid dark backdrop overlays and shadows |

---

## 2. Typography System

The project uses Next.js Font Optimization to load custom web fonts dynamically. These fonts represent the premium, natural character of Susmita Nursery:

### Display Serif: `Cormorant Garamond`
- **Tailwind class**: `font-serif`
- **Tonal Vibe**: Heritage, luxury, botany, horticultural expertise.
- **Usage**:
  - Main Page Headers (`h1`, `h2`, `h3`)
  - Large numeric figures (pricing, metric parameters)
  - Styled quotes, testimonials, and italicized callouts.

### Body Sans: `Inter` / `Manrope`
- **Tailwind class**: `font-sans`
- **Tonal Vibe**: Modern clarity, readability, neat spacing.
- **Usage**:
  - Descriptive paragraph blocks
  - Buttons, form text inputs, and select options
  - Technical badges, tags, and footer copyright links.

---

## 3. Spacing Rhythm & Layout Grid

To enforce consistency, all structural elements must adhere to the **8dp incremental spacing system**:

- **`p-2` / `m-2` (8px)**: Internal item padding (e.g., inside compact list items).
- **`p-4` / `m-4` (16px)**: Standard spacing for grid components, tables, and product cards.
- **`p-6` / `m-6` (24px)**: Standard container margin (e.g., margins on cards, padding on screens).
- **`py-16` / `py-20` (64px / 80px)**: Massive vertical sections layout divider spacing.

---

## 4. UI Contours & Borders

To mirror natural plant shapes, the design system explicitly forbids sharp, clinical corners:

1. **Large Containers & Cards**: Use `rounded-3xl` (24px) or `rounded-[36px]` (36px).
2. **Buttons, Input fields, and Badges**: Use `rounded-full` (capsule style) or `rounded-2xl` (12px).
3. **Border Styling**: Keep borders thin and translucent, e.g., `border border-border/40` or `border border-muted/50`. Avoid solid, stark blacks or heavy greys.

---

## 5. Signature Interactive Systems

Every feature built under the brand must seek to implement one of the two core visual pillars:

### A. Brand Care System Lifecycle Navigator
A stage-by-stage guide for customers to track plant growth, check soil dryness levels, and observe growth milestones.
* **Style**: Circular/orbital indicators, clean timelines, soft leaf icons.
* **Colors**: Combines `secondary` green with `accent-earth` brown.

### B. Immersive AR Projection Simulator
Provides direct web-based augmented reality framing to see 3D plant models overlaying real space.
* **Style**: Translucent glass overlay panels (`backdrop-blur-md bg-white/20`), circular control actions (`rounded-full`), and thin scanner rings.

---

## 6. UX Quality Controls & Anti-Patterns to Avoid

- **NO Emojis in Structural Elements**: Emojis (🌱, 🌿, 🛒, 📦) must never be used inside buttons, headers, or navbar links. Always use SVG vector elements from the `lucide-react` library.
- **NO Hardcoded Hex Colors**: Avoid coding inline styles or classes like `text-[#0d592f]` or `bg-[#023512]`. Always use semantic color classes (e.g., `text-primary`, `bg-primary-emerald`).
- **Accessible Color contrast**: Ensure all readable text elements maintain a minimum of `4.5:1` contrast ratio relative to their background (using `text-foreground`, `text-muted-foreground`, etc.).
- **Touch Target Padding**: Keep buttons, links, and switches at a minimum click area of `44x44px` to ensure responsive touch tracking on mobile screens.
