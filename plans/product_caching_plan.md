# Plan: Product Caching System for Fast Loading and Persistence

This plan outlines the design and implementation of a client-side caching system for the Featured Products section, the Product Catalog page, and the Product Detail dynamic page.

## 1. Analysis of Current Implementation

All three pages query the database asynchronously in a client-side `useEffect` hook using the server action `getProductsAction()` from `@/server/product.ts`.
- **Featured Products Component (`src/components/home/featured-products.tsx`):**
  - Fetches all products, filters by `featured` flag, slices first 5, and updates state.
  - Shows 5 skeleton loaders (`animate-pulse`) while fetching.
- **Product Catalog Page (`src/app/products/page.tsx`):**
  - Fetches all products, handles filtering/sorting client-side.
  - Shows 6 skeleton loaders while loading.
- **Product Detail Dynamic Page (`src/app/products/[id]/page.tsx`):**
  - Fetches all products, finds the product by `id` or `slug`, and sets it as the active product.
  - Shows a centered loading spinner (`animate-spin`) while fetching.

## 2. Proposed Caching Strategy: Client-Side SWR (Stale-While-Revalidate)

We will introduce a client-side caching utility in `src/utils/product-cache.ts` using `localStorage` for persistence:
- **Instant Render (Stale):** On component mount, the component checks `localStorage`. If cache exists, it renders the products immediately, bypassing the loading skeleton/spinner.
- **Background Update (Revalidate):** Simultaneously, the component fetches fresh data from `getProductsAction()`. Once fetched, it updates the state (if data has changed) and writes the new data back to `localStorage`.
- **Offline Persistence:** If the network is down or slow, the user still sees the persisted catalog from the last successful load.

## 3. Detailed Changes

### A. New Cache Utility: `src/utils/product-cache.ts`
Introduce helper functions:
- `getCachedProducts()`: Reads, validates, and parses cached products from `localStorage`.
- `setCachedProducts(products)`: Saves products to `localStorage` with a timestamp.
- `fetchProductsWithCache(onSuccess, onFinal)`: Implements the SWR flow by checking cache first, then executing the background fetch.

### B. Featured Products: `src/components/home/featured-products.tsx`
- Use the cache helper to retrieve cached products.
- If cache exists, set `loading` to `false` and populate state.
- In the background, load fresh products and update state/cache.

### C. Product Catalog: `src/app/products/page.tsx`
- Check cache on mount, if cache exists, disable loading screen immediately and render products.
- Revalidate in background.

### D. Product Detail Page: `src/app/products/[id]/page.tsx`
- Search `localStorage` cache for the product with matching `id` or `slug`.
- If found, set `loading` to `false` and render the detail page immediately.
- Revalidate the product list in the background to ensure details are up-to-date.
