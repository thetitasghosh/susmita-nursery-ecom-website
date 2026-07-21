# Susmita Nursery — Codebase Architecture Specification

This document details the codebase structure, directory hierarchy, state-management lifecycle, styling compiler configuration, and developer guidelines for the **Susmita Nursery** e-commerce application.

---

## 1. Core Tech Stack Overview

The website is constructed using a modern, performant React framework:

- **Framework**: [Next.js 14.2.35](https://nextjs.org/) (App Router, utilizing TypeScript)
- **Runtime Environment**: Node.js with React 18
- **Styling Engine**: [Tailwind CSS v4.3.0](https://tailwindcss.com/) (using `@tailwindcss/postcss` for compilation and inline theme expansion)
- **Animation Framework**: [Framer Motion v12.38.0](https://www.framer.com/motion/) (powering slide translations, fade-ins, and interactive page transitions)
- **3D / AR Library**: [`@google/model-viewer` v4.3.1](https://modelviewer.dev/) (used to render interactive 3D plant previews with WebXR spatial placement)
- **Icons Pack**: `lucide-react` (SVG-based web standards)

---

## 2. Directory Layout & Repository Mapping

The repository organizes code separation of concerns as follows:

```
susmita-nursery-ecom-website/
├── design-system/           # Brand style files
│   └── MASTER.md            # Global brand source of truth
├── docs/                    # Architecture & Brand documentation (this folder)
├── plans/                   # Architectural expansion plans & drafts
├── public/                  # Static assets (3D GLB/USDZ models, imagery, banners)
├── src/
│   ├── app/                 # Next.js App Router root layout & page definitions
│   │   ├── about/           # About Us static content page
│   │   ├── ar-experience/   # Immersive WebXR plant placement view page
│   │   ├── cart/            # Checkout and shopping cart page
│   │   ├── categories/      # Dynamic category listings page
│   │   ├── contact/         # Contact forms & physical visit booking page
│   │   ├── fonts/           # Local font files (if applicable)
│   │   ├── globals.css      # Core css imports, custom variables & Tailwind theme
│   │   ├── layout.tsx       # Root document structure wrapping the ShopProvider
│   │   ├── page.tsx         # Main entry point (landing page section compiler)
│   │   ├── products/        # Product indexing list & dynamic subroute [id]/
│   │   └── wishlist/        # User-bookmarked plant specimens
│   ├── components/          # Reusable React components
│   │   ├── home/            # Specific modular sections on the landing page
│   │   ├── layout/          # Global layout structure (navbar.tsx, footer.tsx)
│   │   ├── products/        # Product cards, grids, and display structures
│   │   └── ui/              # Atom-level UI (button.tsx, carousel.tsx via Radix UI)
│   └── lib/                 # Core helper code and data models
│       ├── products.ts      # Product database schema (mock inventory data)
│       ├── shop-context.tsx # React Context API wrapping Cart/Wishlist state
│       └── utils.ts         # Class name joining helper (clsx + tailwind-merge)
```

---

## 3. Styling Compiler Setup (Tailwind CSS v4)

This project adopts **Tailwind CSS v4**, which removes the legacy `tailwind.config.js` in favor of CSS-first configurations:

1. **Theme Declarations**: Handled in [src/app/globals.css](file:///d:/Documents/03_Freelance_Websites/susmita-nursery-ecom-website/src/app/globals.css) inside `@theme inline { ... }`.
2. **Dynamic Tokens**: Native CSS variables are loaded inside `:root` and mapped directly inside the Tailwind compiler.
3. **Typography Variables**:
   - `--font-sans`: Mapped to `Inter` (sans-serif)
   - `--font-serif`: Mapped to `Cormorant_Garamond` (serif)
4. **Tailwind Plugins**: PostCSS compilation integrates `tw-animate-css` for pre-configured keyframe animations (fades, pulses, entries).

---

## 4. State Lifecycle & Data Flow

### Cart & Wishlist State Management
State is managed globally using standard React Context (`ShopProvider`) located in [src/lib/shop-context.tsx](file:///d:/Documents/03_Freelance_Websites/susmita-nursery-ecom-website/src/lib/shop-context.tsx):

- **Data Sync**: Automatically synchronizes state to browser client `localStorage` on mutation.
- **Hydration Safety**: Contains safety guards checking `typeof window !== 'undefined'` to avoid Next.js Server Side Rendering (SSR) hydration mismatches.
- **Consumption Hook**: Components consume state via the custom `useShop()` hook.

### Product Data Source
Product data resides locally in [src/lib/products.ts](file:///d:/Documents/03_Freelance_Websites/susmita-nursery-ecom-website/src/lib/products.ts).
- Each product item conforms to a typed typescript interface containing:
  - Identification (`id`, `name`, `scientificName`, `category`)
  - Marketing attributes (`price`, `rating`, `reviewsCount`, `isBestSeller`)
  - Media (`image`, `arModelUrl` for glTF, `usdzModelUrl` for Apple QuickLook)
  - Care variables (`soilRequirements`, `wateringFrequency`, `sunlightExposure`)
  - Informative timeline structures used by the **Brand Care System**.

---

## 5. Architectural Coding Standards

To maintain clean and standardized coding patterns across the repository:

1. **Dynamic Page Routes**:
   - Implement dynamic routes using folder names wrapped in brackets (e.g., `src/app/products/[id]/page.tsx`).
   - Use Next.js search parameters or URL slug checks to retrieve details.
2. **SEO Optimization**:
   - Every route should export a static metadata block (`export const metadata: Metadata = { ... }`) containing titles, descriptions, and sitemap canonical URLs to maximize search engine crawlers indexing.
3. **Responsive Web Design**:
   - Always develop mobile-first. Default layouts should target narrow viewports and scale up via Tailwind screens modifiers (`md:`, `lg:`, `xl:`).
4. **Lucide Icons Over Emojis**:
   - Import icons directly from `lucide-react`. Ensure consistent stroke width (`strokeWidth={2}`) and responsive dimension bounds (usually `w-4 h-4` or `w-5 h-5`).
