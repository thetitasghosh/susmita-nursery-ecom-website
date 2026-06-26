# Susmita Nursery — Design System MASTER Specification

Global Source of Truth for visual guidelines, colors, typography, layout structures, and UX principles.

## 1. Color System

Every color must be mapped directly to semantic Tailwind utility classes rather than hardcoded hex codes.

*   `--primary`: `#007A4D` (Deep Forest) — Used for primary brand elements, headers, and primary buttons.
*   `--primary-emerald`: `#015F3C` (Classic Emerald) — Used for dense green backgrounds, premium indicators, and footers.
*   `--secondary`: `#6CB52D` (Leaf Green) — Used for healthy leaf indicators, tag backgrounds, and subtle secondary borders.
*   `--accent`: `#F3BE19` (Warm Ochre/Gold) — Used for highlights, active tabs, directions indicators, and contrast callouts.
*   `--accent-earth`: `#755B39` (Soil/Muted Amber) — Used for text accents on gold and soil-related data parameters.
*   `--background`: `#FAF8F2` (Warm White background tint) — The default viewport backdrop, creating a warm paper texture look.
*   `--foreground`: `#1A1A1A` (Charcoal Slate text) — The default text color for maximum readability and high contrast.
*   `--muted`: `#EAE8E0` (Warm Grey) — Used for borders, divider lines, and card containers.

## 2. Typography

*   **Display Font**: `Cormorant Garamond` (font-serif) — Conveying heritage, luxury, and premium horticulture roots. Always used for displaying headings (H1, H2, H3), large numbers, and italicized callouts.
*   **Body Font**: `Inter` / `Manrope` (font-sans) — Conveying clarity and high readability. Used for descriptive body text, input labels, buttons, and utility captions.

## 3. Spacing & Spacing Rhythm

*   Align everything to an **8dp Incremental Spacing System**:
    *   `p-2` / `m-2` (8px) — Minor spacing
    *   `p-4` / `m-4` (16px) — Standard spacing
    *   `p-6` / `m-6` (24px) — Large elements margin
    *   `py-16` / `py-20` (64px / 80px) — Section vertical gaps

## 4. UI Elements & Radius

*   Cards & Viewports: `rounded-3xl` (1.5rem / 24px) or `rounded-[36px]` (36px).
*   Buttons & Inputs: `rounded-full` (capsule style) or `rounded-2xl` (12px).
*   No standard straight borders. Always use smooth border radii resembling plant contours and seedling leaves.

## 5. Signature Elements

1.  **Brand Care System lifecycle navigator**: A stage-by-stage guide for users to review soil, watering, and observe plant growth.
2.  **Immersive AR projection simulator frame**: Projection overlays matching webcam/templates.

## 6. UX Quality Controls & Anti-Patterns to Avoid

*   **NO emojis in structural elements**: Do not use emojis (🌱, 🌿, 🛒) as buttons or labels. Always use vector-based Lucide icons.
*   **NO hardcoded hex colors in components**: Avoid using raw values like `text-[#0d592f]` or `bg-[#023512]` in component files. Use semantic tokens like `text-primary` or `bg-primary-emerald`.
*   **Accessible Contrasts**: Primary body text on background surfaces must keep a `4.5:1` minimum ratio.
*   **Touch Targets**: Keep interactive targets at a minimum of `44x44px` area with proper padding.
