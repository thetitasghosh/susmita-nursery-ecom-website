# Landing Page → Supabase Integration Plan

**Scope:** Replace all static / local-data demo content in the marketing site with live Supabase reads.

---

## Overview of Current State

The landing page (`src/app/page.tsx`) renders seven sections, each pulling content from either:
- A **hardcoded local array** inside the component file itself.
- The **`src/lib/products.ts`** static `allProducts` array (37 KB, 25+ local entries).

No section currently calls a server action or the Supabase client at page-level. All data is "demo-first" with no live DB connection.

---

## Supabase Tables Available (from migration schema)

| Table | Key Columns | Used By |
|---|---|---|
| `products` | id, name, slug, category, price, rating, reviews, image, supporting_images, stock_quantity | FeaturedProducts, CategoriesSection, ProductsPage |
| `banners` | id, title, subtitle, image, link, button_text, is_active, priority | HeroSection |
| `subscribers` | id, email, is_active, subscribed_at | Footer newsletter form |
| `profiles` | id, full_name, email, phone, role | Auth context |
| `wishlist` | profile_id, product_id | WishlistPage, ProductCard |

---

## Section-by-Section Integration Plan

---

### 1. HeroSection — `src/components/home/hero-section.tsx`

**Current State:**
- `slides` array is 100% hardcoded inside the component (3 slides with eyebrow, title, subtitle, CTA, image, badgeText).
- No DB connection at all.

**Target State:** Read active banners from `banners` table.

#### Changes Required

**A. New Server Action — `src/server/banner.ts` [NEW FILE]**

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getBannersAction() {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true })
  if (error || !data || data.length === 0) return { success: false }
  return { success: true, data }
}
```

**B. Convert `HeroSection` to async Server Component**
- Remove `'use client'` directive.
- Call `getBannersAction()` at the top of the component.
- Map `banners` table rows → `slides` shape.
- Keep static fallback `slides` array if DB returns empty/error.
- The Carousel client interactivity (`CarouselApi`, `useState`, `useEffect`) must be extracted into a `HeroCarousel` child client component since the parent becomes a server component.

**DB Mapping:**

| DB Column | Slide Field |
|---|---|
| `banners.title` | `slide.title` |
| `banners.subtitle` | `slide.subtitle` |
| `banners.image` | `slide.image` |
| `banners.link` | `slide.ctaLink` |
| `banners.button_text` | `slide.ctaText` |
| `banners.priority` | sort order |
| `banners.is_active` | filter (only active = true) |

**Fallback:** If `banners` table is empty → use the existing hardcoded `slides` array.

---

### 2. CategoriesSection — `src/components/home/categories-section.tsx`

**Current State:**
- `categories` array hardcoded with 12 category names, images, and `/products?category=...` hrefs.
- Product count per category not shown.

**Target State:** Derive categories dynamically from `products` table.

#### Changes Required

**A. Add `getCategoriesAction()` to `src/server/product.ts` [MODIFY]**

```ts
export async function getCategoriesAction() {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('products')
    .select('category, image')
    .order('category')
  if (error || !data) return { success: false }
  // Deduplicate: pick first image per category
  const map = new Map<string, string>()
  data.forEach(row => { if (!map.has(row.category)) map.set(row.category, row.image) })
  return {
    success: true,
    data: Array.from(map.entries()).map(([name, image]) => ({ name, image }))
  }
}
```

**B. Convert `CategoriesSection` to async Server Component**
- Remove `'use client'` directive.
- Call `getCategoriesAction()` to get live category list.
- The scroll/arrow behavior (refs, `scroll()` function) must be extracted to a `CategoryScroller` child client component.
- Fallback: If DB empty → use existing hardcoded `categories` array.

**DB Mapping:**

| DB Column | Category Field |
|---|---|
| `products.category` (DISTINCT) | category name |
| `products.image` (first per category) | category image |
| auto-generated | `href = /products?category=${encodeURIComponent(name)}` |

---

### 3. FeaturedProducts — `src/components/home/featured-products.tsx`

**Current State:**
- `featuredIds = [1, 2, 3, 4, 5]` hardcoded.
- Uses `allProducts.find(p => p.id === id)` from static file.
- Products 1–5 are the Susmita-specific plants (Money Plant Yellow Slabs, Green Good Luck Plant, Philodendron Birkin, Shingonium Yammy Red, Lipstick Plant).

**Target State:** Fetch top 5 products ordered by rating from Supabase.

#### Changes Required

**A. Add `getFeaturedProductsAction()` to `src/server/product.ts` [MODIFY]**

```ts
export async function getFeaturedProductsAction(limit = 5) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, category, price, rating, reviews, image, stock_quantity')
    .order('rating', { ascending: false })
    .limit(limit)
  if (error || !data || data.length === 0) return { success: false }
  return { success: true, data }
}
```

**B. Convert `FeaturedProducts` to async Server Component**
- Remove `'use client'` and `allProducts` import.
- Call `getFeaturedProductsAction()`.
- Map DB rows → `Product` shape (same fields as `getProductsAction`).
- Fallback: If DB empty → filter `allProducts` by `featuredIds = [1,2,3,4,5]` (current behavior).

**DB Mapping:**

| DB Column | Product Field |
|---|---|
| `products.id` | `product.id` |
| `products.name` | `product.name` |
| `products.category` | `product.category` |
| `products.price` | `product.price` |
| `products.rating` | sort key (DESC) |
| `products.reviews` | `product.reviews` |
| `products.image` | `product.image` |
| `products.slug` | `product.slug` (for routing) |
| `products.stock_quantity` | show "Out of Stock" badge if 0 |

---

### 4. ValueProposition — `src/components/home/value-proposition.tsx`

**Current State:** Fully static marketing copy (4 value proposition cards).

**Target State:** ✅ **No Supabase integration needed.** Static brand copy — keep as-is.

---

### 5. GallerySection — `src/components/home/gallery-section.tsx`

**Current State:**
- `editorialPanels` array hardcoded with 3 panels (Indoor Jungle, Terrace Gardens, Landscape Projects).
- Images are static room photos from `/images/rooms/`.

**Target State:** ✅ **No Supabase integration needed immediately.**
Editorial/lifestyle imagery is curated content, not product catalog.

> **Optional Enhancement (Phase 2):** Add `type` column to `banners` table (`'hero'` | `'gallery'`). Gallery panels would then be fetched from `banners` filtered by `type='gallery'`. Admin can update images via the Banners dashboard page.

---

### 6. NurseryBanner — `src/components/home/nursery-banner.tsx`

**Current State:** Fully static content (address, opening hours, phone, Google Maps link).

**Target State:** ✅ **No Supabase integration needed.** Static business info content. Consider a future `site_settings` table if this needs admin editing.

---

### 7. Footer Newsletter Subscribe Form

**Current State:**
- Newsletter email subscription writes to `localStorage` (`nursery_subs` key).
- The `subscribers` table exists in Supabase but is NOT wired to the public-facing form.

**Target State:** Footer subscribe form inserts into `subscribers` table.

#### Changes Required

**A. New Server Action — `src/server/newsletter.ts` [NEW FILE]**

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function subscribeAction(email: string) {
  const supabase = createClient(await cookies())
  const { error } = await supabase
    .from('subscribers')
    .upsert([{ email, is_active: true }], { onConflict: 'email' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
```

**B. Update Footer Component**
- Convert the email input + subscribe button into a small `'use client'` form component.
- On submit → call `subscribeAction(email)`.
- Show a toast / inline success message.

**DB Mapping:**

| Input | DB Column |
|---|---|
| Email input value | `subscribers.email` |
| Always `true` | `subscribers.is_active` |
| DB default | `subscribers.subscribed_at` (NOW()) |

> RLS policy already allows public insert: `"Anyone can subscribe to newsletter"`.

---

### 8. `/products` Page — `src/app/products/page.tsx`

**Current State:**
- `filteredProducts` derived from `allProducts` (static import from `@/lib/products`).
- Category filter tabs hardcoded in `categories` array (12 items).
- Sort (`price-low`, `price-high`, `rating`) applied to static data in-memory.

**Target State:** Load products from Supabase with live category filters.

#### Changes Required

**A. Load products via `getProductsAction()` on mount**
- Replace `const filteredProducts = allProducts.filter(...)` with DB data via `getProductsAction()`.
- The page remains `'use client'` since it uses `useSearchParams()`.
- Add `useEffect` to call `getProductsAction()` and store result in state.
- Generate `categories` list dynamically from unique `products.category` values from DB response.
- Fallback: If DB empty → use `allProducts` from static file.

**B. Category filter tabs**
- Derive from DB products. No more hardcoded `categories` array.

**C. Sort**
- Keep client-side sort (already works on the `Product` interface).

**DB Mapping:**

| DB Column | UI Element |
|---|---|
| `products.*` | Same mapping as `getProductsAction()` output |
| `products.category` (DISTINCT) | Filter tab list |
| `products.stock_quantity <= 5` | Show "Low Stock" badge |
| `products.stock_quantity === 0` | Show "Out of Stock" badge |

---

### 9. `/products/[id]` Product Detail Page — `src/app/products/[id]/page.tsx`

**Current State:**
- `product = allProducts.find(p => p.id === productId)` — purely static.
- `PlantCareSuggestions` component references `nestedItemIds` for related tools/medicines.
- WhatsApp enquiry message uses static product data.

**Target State:** Fetch single product from Supabase by ID.

#### Changes Required

**A. Add `getProductByIdAction(id)` to `src/server/product.ts` [MODIFY]**

```ts
export async function getProductByIdAction(id: number) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_recommendations!product_recommendations_product_id_fkey(recommended_id)
    `)
    .eq('id', id)
    .single()
  if (error || !data) return { success: false }
  return { success: true, data }
}
```

**B. Update `ProductDetailPage`**
- Keep as `'use client'` (uses `useShop`, `useState`, `AnimatePresence`).
- Add `useEffect` on mount to call `getProductByIdAction(productId)`.
- Show loading skeleton while fetching.
- Map `product_recommendations` join → `nestedItemIds` array for `PlantCareSuggestions`.
- Fallback: If DB miss → `allProducts.find(p => p.id === productId)`.

**DB Mapping:**

| DB Column | Product Field |
|---|---|
| `products.id` | params.id lookup |
| `products.name` | `product.name` |
| `products.scientific_name` | `product.scientificName` |
| `products.details` (JSONB) | `product.details` {light, water, humidity, temperature, soil} |
| `products.sizes` (JSONB) | `product.sizes[]` |
| `products.care_instructions` | `product.careInstructions[]` |
| `products.image` | `product.image` |
| `products.supporting_images` | `product.images[]` |
| `product_recommendations.recommended_id` | `product.nestedItemIds[]` |

---

### 10. `/categories` Page — `src/app/categories/page.tsx`

**Current State:**
- `categories` array fully hardcoded with id, name, description, icon, color, count, image (213 lines).
- `count` values are hardcoded numbers (e.g., Indoor Plants: 7, Lucky Bamboo: 1).

**Target State:** Derive live product counts from Supabase, merge with static metadata.

#### Changes Required

**A. Add `getCategoryStatsAction()` to `src/server/product.ts` [MODIFY]**

```ts
export async function getCategoryStatsAction() {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('products')
    .select('category, image')
  if (error || !data) return { success: false }
  const stats = new Map<string, { count: number; image: string }>()
  data.forEach(row => {
    if (!stats.has(row.category)) stats.set(row.category, { count: 0, image: row.image })
    stats.get(row.category)!.count++
  })
  return { success: true, data: Object.fromEntries(stats) }
}
```

**B. Update `/categories` page**
- Call `getCategoryStatsAction()` on mount.
- Merge live counts into the hardcoded categories array (keep icons/colors hardcoded, only override `count` and `image`).
- Fallback: Keep hardcoded counts if DB fails.

---

## Implementation Priority Order

| Priority | Section | Effort | Impact |
|---|---|---|---|
| 🔴 P1 | `/products` page — live product list | Medium | Customers see real catalog |
| 🔴 P1 | `/products/[id]` — live product detail | Medium | Product detail accuracy |
| 🟠 P2 | `FeaturedProducts` — top-rated from DB | Low | Homepage reflects real inventory |
| 🟠 P2 | `CategoriesSection` — DB-derived categories | Low | Homepage category scroll is live |
| 🟡 P3 | `HeroSection` — banners from DB | Medium | Admin can update hero slides |
| 🟡 P3 | Footer subscribe → `subscribers` table | Low | Newsletter capture goes to DB |
| 🟢 P4 | `/categories` page — live counts | Low | Category counts are accurate |
| 🟢 P5 | `GallerySection` — optional gallery banners | High | Requires schema change |

---

## New Files to Create

| File | Purpose |
|---|---|
| `src/server/banner.ts` | `getBannersAction()` — fetch active hero banners |
| `src/server/newsletter.ts` | `subscribeAction()` — write email to `subscribers` table |

## Files to Modify

| File | Change |
|---|---|
| `src/server/product.ts` | Add `getFeaturedProductsAction()`, `getCategoriesAction()`, `getCategoryStatsAction()`, `getProductByIdAction()` |
| `src/components/home/hero-section.tsx` | Convert to server component, read from `banners` table |
| `src/components/home/featured-products.tsx` | Convert to server component, read from `products` table |
| `src/components/home/categories-section.tsx` | Convert to server component, derive categories from DB |
| `src/app/products/page.tsx` | Load from `getProductsAction()`, dynamic category tabs |
| `src/app/products/[id]/page.tsx` | Load from `getProductByIdAction()` |
| `src/app/categories/page.tsx` | Merge live counts from `getCategoryStatsAction()` |

## Files That Stay Static (No Change Needed)

| File | Reason |
|---|---|
| `src/components/home/value-proposition.tsx` | Static brand copy |
| `src/components/home/nursery-banner.tsx` | Static business info |
| `src/components/home/gallery-section.tsx` | Static editorial imagery |
| `src/lib/products.ts` | Kept as fallback data source |

---

## Notes on Server vs Client Component Split

When converting sections from `'use client'` to async server components, interactive pieces must be extracted:

| Component | Interactive Piece to Extract | New Client Component Name |
|---|---|---|
| `HeroSection` | Carousel navigation, auto-scroll timer | `HeroCarousel` |
| `CategoriesSection` | Horizontal scroll arrows + ref | `CategoryScroller` |
| `FeaturedProducts` | No interactivity — can be full server component | — |

---

## SQL Queries Reference

```sql
-- FeaturedProducts (top 5 by rating)
SELECT id, name, slug, category, price, rating, reviews, image, stock_quantity
FROM products ORDER BY rating DESC LIMIT 5;

-- CategoriesSection (unique categories with representative image)
SELECT DISTINCT ON (category) category, image FROM products ORDER BY category;

-- HeroSection Banners
SELECT * FROM banners WHERE is_active = true ORDER BY priority ASC;

-- Newsletter Subscribe
INSERT INTO subscribers (email) VALUES ($1)
ON CONFLICT (email) DO UPDATE SET is_active = true;

-- Product Listing Page (with optional category filter)
SELECT * FROM products WHERE ($1::text IS NULL OR category = $1)
ORDER BY rating DESC;

-- Product Detail Page (with nested recommendations)
SELECT p.*, array_agg(pr.recommended_id) AS nested_item_ids
FROM products p
LEFT JOIN product_recommendations pr ON pr.product_id = p.id
WHERE p.id = $1 GROUP BY p.id;

-- Categories Page (live counts)
SELECT category, COUNT(*) as count, MIN(image) as image
FROM products GROUP BY category ORDER BY category;
```

