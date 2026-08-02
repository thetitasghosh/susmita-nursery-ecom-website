# Dashboard → Supabase Integration Plan

**Scope:** Map every dashboard page, table, sheet, and action from static demo data to live Supabase reads, writes, updates, and deletes.

---

## Architecture Overview

The dashboard lives at `src/app/(dashboard)/dashboard/`. It is a client-side admin interface behind authentication. All data access happens through **Server Actions** (`src/server/*.ts`) which internally call the Supabase JS client with `createClient(cookieStore)`.

**Current State Summary:**
- **Overview page** — partially connected (calls `getProductsAction`, `getOrdersAction`, `getUsersAction`) but stats/chart are static fallback data.
- **Products page** — fully connected for CRUD; Supabase calls exist but product *table listing* still falls back to `allProducts` static array when DB is empty.
- **Orders page** — partially connected (`getOrdersAction`, `updateOrderStatusAction`); uses `initialOrders` hardcoded fallback.
- **Customers page** — partially connected (`getUsersAction`); uses `initialCustomers` hardcoded fallback.
- **Inventory page** — partially connected (`getProductsAction`, `updateProductAction`); uses `allProducts` hardcoded fallback.
- **Banners page** — NOT connected; fully reads/writes `localStorage` only.
- **Newsletter page** — NOT connected; reads `localStorage` for subscribers; product list also from `localStorage`.
- **Layout global search** — NOT connected; searches against hardcoded `searchDatabase` array.

---

## Supabase Tables (from migration schema)

| Table | Key Columns |
|---|---|
| `products` | id, name, slug, category, price, rating, reviews, image, supporting_images, details (JSONB), sizes (JSONB), care_instructions (JSONB), scientific_name, height, difficulty, pet_friendly, air_purifying, stock_quantity, reserved_quantity |
| `product_recommendations` | product_id, recommended_id |
| `orders` | id, customer_id, customer_name, email, phone, address, amount, payment_status, order_status, notes, created_at |
| `order_items` | id, order_id, product_id, quantity, price, size |
| `profiles` | id, full_name, email, phone, role, joined_date |
| `banners` | id, title, subtitle, image, link, button_text, is_active, priority |
| `subscribers` | id, email, is_active, subscribed_at |
| `addresses` | id, profile_id, label, is_default, full_name, street, city, state, pincode, phone |
| `wishlist` | profile_id, product_id |

---

## 1. Dashboard Layout — `src/app/(dashboard)/dashboard/layout.tsx`

### 1a. Admin Auth Check

**Current State:**
- Calls `getAccountAction()` from `src/server/auth.ts` to check if user is authenticated.
- Redirects unauthenticated users to `/dashboard/login`.
- This part is ALREADY connected via Supabase Auth. ✅

### 1b. Global Search (`searchDatabase`)

**Current State:**
- `searchDatabase` object hardcoded at the top of `layout.tsx` with 5 demo products, 5 demo orders, 5 demo customers.
- Search results are derived from this static object — no DB calls.

**Target State:** Replace with live Supabase search.

#### Changes Required

**A. New Server Action — `src/server/search.ts` [NEW FILE]**

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function globalSearchAction(query: string) {
  const supabase = createClient(await cookies())
  const q = `%${query}%`

  const [products, orders, customers] = await Promise.all([
    supabase.from('products')
      .select('id, name, category, price, image')
      .ilike('name', q)
      .limit(5),
    supabase.from('orders')
      .select('id, customer_name, amount, created_at')
      .or(`id.ilike.${q},customer_name.ilike.${q}`)
      .limit(5),
    supabase.from('profiles')
      .select('id, full_name, email')
      .or(`full_name.ilike.${q},email.ilike.${q}`)
      .limit(5),
  ])

  return {
    products: products.data || [],
    orders: orders.data || [],
    customers: customers.data || [],
  }
}
```

**B. Update Layout Search Handler**
- Replace hardcoded `searchDatabase` filtering with a debounced call to `globalSearchAction(query)`.
- Show loading spinner while fetching.

**DB Mapping:**

| Static Field | DB Column |
|---|---|
| `products[].name` | `products.name` |
| `products[].category` | `products.category` |
| `products[].price` | `products.price` (format as ₹) |
| `products[].image` | `products.image` |
| `orders[].id` | `orders.id` |
| `orders[].name` | `orders.customer_name` |
| `orders[].amount` | `orders.amount` (format as ₹) |
| `orders[].date` | `orders.created_at` (format locale) |
| `customers[].name` | `profiles.full_name` |
| `customers[].email` | `profiles.email` |

---

## 2. Overview Page — `src/app/(dashboard)/dashboard/page.tsx`

### 2a. Stats Cards (Total Revenue, Active Orders, Low Stock Items, Subscribers)

**Current State:**
- `initialStats` hardcoded with demo values (₹48,250, 18 Orders, 4 Products, 1,428 Subscribers).
- `useEffect` calls `getProductsAction()`, `getOrdersAction()`, `getUsersAction()` and tries to update stats.
- **Revenue** and **Subscribers** calculations work but are incomplete.
- **Revenue** sums `orders.amount` — correct but only from existing DB orders.
- **Low Stock** filters products where `stock_quantity <= 5` — correct.
- **Subscribers** uses `userRes.data.length` (counts profiles, not subscribers table) — incorrect.

**Target State:** Fix all four stats cards to pull from correct DB sources.

#### Changes Required

**A. Fix "Subscribers" stat**
- Currently uses `getUsersAction()` (reads `profiles` table).
- Should use a new `getSubscribersAction()` to count rows from `subscribers` table.

**B. Add `getSubscribersAction()` to `src/server/newsletter.ts` [NEW FILE]**

```ts
export async function getSubscribersAction() {
  const supabase = createClient(await cookies())
  const { count, error } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  if (error) return { success: false }
  return { success: true, count: count || 0 }
}
```

**C. Fix "Total Revenue" calculation**
- Currently only sums from existing `orders` in DB.
- The `initialStats` shows ₹48,250. This should be replaced with actual DB sum.
- Add a monthly/period filter (current month) to the revenue query.

**DB Mapping:**

| Stat Card | DB Source | Query |
|---|---|---|
| Total Revenue | `orders.amount` | `SUM(amount)` where `payment_status = 'paid'` |
| Active Orders | `orders.order_status` | `COUNT(*)` where `order_status IN ('processing', 'ready_for_pickup')` |
| Low Stock Items | `products.stock_quantity` | `COUNT(*)` where `stock_quantity <= 5` |
| Subscribers | `subscribers` table | `COUNT(*)` where `is_active = true` |

### 2b. Revenue & Sales Performance Chart

**Current State:**
- `monthlyChartData` and `weeklyChartData` arrays are 100% hardcoded SVG coordinate data.
- Chart shows "Plants" and "Tools/Care" lines — fictional values.

**Target State:** Derive real monthly/weekly revenue breakdown from orders.

#### Changes Required

**A. New Server Action — `getRevenueChartAction()` in `src/server/order.ts` [MODIFY]**

```ts
export async function getRevenueChartAction(period: 'monthly' | 'weekly') {
  const supabase = createClient(await cookies())
  // Fetch orders from the last 7 months or 7 weeks grouped by period
  const { data, error } = await supabase
    .from('orders')
    .select('amount, created_at, order_items(product_id, price, quantity, products(category))')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: true })
  if (error || !data) return { success: false }
  // Group by month/week, split into plants vs tools revenue
  // Return normalized chart data points
  return { success: true, data: groupByPeriod(data, period) }
}
```

**B. Update Overview page chart rendering**
- Load chart data via `getRevenueChartAction('monthly')` and `getRevenueChartAction('weekly')`.
- Normalize actual revenue values to SVG coordinate space.
- Keep static data as fallback if DB returns insufficient data.

### 2c. Recent Orders Table (last 4 orders)

**Current State:**
- `initialRecentOrders` hardcoded with 4 demo orders (Ananya Mitra, Rohit Sharma, etc.).
- `useEffect` calls `getOrdersAction()` and takes `orders.slice(0, 4)` — this is ALREADY connected ✅.
- The only issue: If DB has no orders, shows the hardcoded fallback demo orders.

**Target State:** Remove hardcoded `initialRecentOrders`, keep empty state gracefully.

#### Changes Required
- Keep the existing `getOrdersAction()` call.
- If `ordRes.data` is empty → show an empty-state message ("No recent orders") instead of demo data.
- Remove `initialRecentOrders` constant entirely.

**DB Mapping:**

| Static Field | DB Column |
|---|---|
| `order.id` | `orders.id` (last 4 chars for display) |
| `order.name` | `orders.customer_name` |
| `order.date` | `orders.created_at` (formatted) |
| `order.amount` | `orders.amount` |
| `order.status` | `orders.payment_status` (paid/pending/failed) |

### 2d. Low Stock Items Panel

**Current State:**
- `initialLowStockItems` hardcoded with 4 demo products.
- `useEffect` calls `getProductsAction()` and filters by `stock_quantity <= 5` — ALREADY connected ✅.
- If DB has no products → shows demo fallback.

**Target State:** Remove hardcoded `initialLowStockItems`, show empty state if DB is empty.

---

## 3. Products Page — `src/app/(dashboard)/dashboard/products/page.tsx`

### 3a. Product Table (List All Products)

**Current State:**
- `loadProducts()` calls `getProductsAction()` — ALREADY connected ✅.
- Falls back to `localStorage` → then `allProducts` static array.

**Target State:** Remove localStorage and static fallbacks. DB is authoritative.

#### Changes Required
- In `loadProducts()`, if `getProductsAction()` returns empty (DB has 0 products), show empty state instead of falling back to static data.
- Remove the two `localStorage` fallback layers.
- Keep only `allProducts` as a last-resort dev fallback (guarded by `NODE_ENV === 'development'`).

**DB Mapping:**

| Table Column | Product Table Column |
|---|---|
| `products.id` | ID |
| `products.name` | Product Name |
| `products.category` | Category |
| `products.price` | Price (₹) |
| `products.stock_quantity` | Stock |
| `products.rating` | Rating |
| `products.image` | Cover Image (thumbnail) |

### 3b. Category Filter Dropdown

**Current State:**
- Categories dropdown hardcoded as a static array inside the filter `<select>` element.

**Target State:** Derive dynamically from `products.category` DISTINCT values in DB.

#### Changes Required
- After `loadProducts()`, extract unique categories from the returned product list.
- Build the filter dropdown from that live list.

### 3c. Product Sheet — Add New Product

**Current State:**
- Form state uses `useState` hooks for all fields.
- On save → calls `createProductAction(payload)` — ALREADY connected ✅.
- Image upload uses Supabase Storage (`products` bucket) — ALREADY connected ✅.

**Target State:** Already connected — verify and clean up.

**Missing field mappings to verify:**

| Form Field | DB Column |
|---|---|
| `formName` | `products.name` |
| `formSlug` (auto-generated) | `products.slug` |
| `formCategory` | `products.category` |
| `formPrice` | `products.price` |
| `formScientificName` | `products.scientific_name` |
| `formDescription` | `products.description` (NOTE: `description` column does NOT exist in the current schema — needs to be added) |
| `coverFile` → uploaded URL | `products.image` |
| `supportingFiles` → uploaded URLs | `products.supporting_images` (JSONB) |
| `formLight/Water/Humidity/Temperature/Soil` | `products.details` (JSONB) |
| `formSizes[]` | `products.sizes` (JSONB) |
| `formCareInstructions[]` | `products.care_instructions` (JSONB) |
| `nestedTools + nestedMedicines` | `product_recommendations` table |

> ⚠️ **Schema Gap:** The `products` table in the migration does NOT have a `description` column. Need to add via a new migration: `ALTER TABLE products ADD COLUMN description TEXT;`

### 3d. Product Sheet — Edit Product

**Current State:**
- On save → calls `updateProductAction(id, payload)` — ALREADY connected ✅.
- Handles image re-upload, recommendation sync.

**Target State:** Already connected ✅. Clean up localStorage sync after save.

#### Changes Required
- Remove `localStorage.setItem('nursery_products', ...)` calls after create/update/delete.

### 3e. Product Delete

**Current State:**
- Calls `deleteProductAction(id)` — ALREADY connected ✅.
- Also removes from localStorage (to be removed).

---

## 4. Inventory Page — `src/app/(dashboard)/dashboard/inventory/page.tsx`

### 4a. Inventory Table (All Products with Stock)

**Current State:**
- `loadInventory()` calls `getProductsAction()` — ALREADY connected ✅.
- Falls back to `localStorage` → then hardcoded fallback with demo stock values.

**Target State:** DB is authoritative. Remove fallback tiers.

#### Changes Required
- Remove `localStorage` fallback block.
- Remove hardcoded demo stock values (`p.id === 1 ? 2 : p.id === 2 ? 4 ...`).
- Show empty state if DB has no products.

### 4b. Stock Adjustment (+/- buttons)

**Current State:**
- `handleUpdateStock(id, field, delta)` calls `updateProductAction(id, { stock_quantity })` — ALREADY connected ✅.

**Target State:** Already connected ✅.

**DB Mapping:**

| UI Action | DB Write |
|---|---|
| `+` button on `stock_quantity` | `UPDATE products SET stock_quantity = stock_quantity + 1 WHERE id = $1` |
| `-` button on `stock_quantity` | `UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - 1) WHERE id = $1` |
| `+` button on `reserved_quantity` | `UPDATE products SET reserved_quantity = reserved_quantity + 1 WHERE id = $1` |
| `-` button on `reserved_quantity` | `UPDATE products SET reserved_quantity = GREATEST(0, reserved_quantity - 1) WHERE id = $1` |

### 4c. Stock Status Badges

**Current State:**
- Status derived from `stock_quantity` in real time — no DB change needed.

| Stock Qty | Badge |
|---|---|
| 0 | `Out of Stock` (red) |
| 1–2 | `Critical` (red-orange) |
| 3–5 | `Warning` (amber) |
| 6+ | `In Stock` (green) |

---

## 5. Orders Page — `src/app/(dashboard)/dashboard/orders/page.tsx`

### 5a. Order Table (All Orders)

**Current State:**
- `loadOrders()` calls `getOrdersAction()` — ALREADY connected ✅ (fetches with `order_items` join).
- Uses `initialOrders` hardcoded array as fallback.

**Target State:** Remove `initialOrders` fallback. Show empty state if DB is empty.

**DB Mapping:**

| Table Column | DB Column |
|---|---|
| Order ID | `orders.id` |
| Customer Name | `orders.customer_name` |
| Date | `orders.created_at` (formatted) |
| Amount | `orders.amount` |
| Payment Status | `orders.payment_status` |
| Order Status | `orders.order_status` |

### 5b. Order Table — Search & Filter

**Current State:**
- Search/filter applies in-memory to loaded orders.

**Target State:** Keep in-memory filtering (acceptable for moderate data sets). For large scale, add server-side filter param to `getOrdersAction()`.

### 5c. Order Sheet — View Order Details

**Current State:**
- Sheet opens with order detail: customer info, items list, status, address.
- Data already comes from `getOrdersAction()` with `order_items(products(name, image))` join.

**DB Mapping:**

| Sheet Field | DB Source |
|---|---|
| Order ID | `orders.id` |
| Customer Name | `orders.customer_name` |
| Email | `orders.email` |
| Phone | `orders.phone` |
| Address | `orders.address` |
| Notes | `orders.notes` |
| Payment Status | `orders.payment_status` |
| Order Status | `orders.order_status` |
| Items → Name | `order_items.products.name` (join) |
| Items → Image | `order_items.products.image` (join) |
| Items → Price | `order_items.price` |
| Items → Qty | `order_items.quantity` |
| Items → Size | `order_items.size` |

### 5d. Update Order Status (Status Dropdown)

**Current State:**
- Calls `updateOrderStatusAction(orderId, newStatus)` — ALREADY connected ✅.
- The Supabase trigger `trg_orders_status_change` automatically updates `products.stock_quantity` and `products.reserved_quantity` when status changes.

**Status State Machine (enforced by DB trigger):**

```
processing → ready_for_pickup  (no stock change)
processing → fulfilled         (reserves → stock deducted)
processing → cancelled         (reserves released)
ready_for_pickup → fulfilled   (reserves → stock deducted)
ready_for_pickup → cancelled   (reserves released)
fulfilled → cancelled          (stock restored)
```

### 5e. Payment Status Update

**Current State:**
- Payment status update (`payment_status`: pending/paid/failed/refunded) not yet wired to a server action.

**Target State:** Add `updatePaymentStatusAction()` to `src/server/order.ts`.

```ts
export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', orderId)
    .select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
```

---

## 6. Customers Page — `src/app/(dashboard)/dashboard/customers/page.tsx`

### 6a. Customer Table (All Customers)

**Current State:**
- `loadCustomers()` calls `getUsersAction()` (reads `profiles` table) — ALREADY connected ✅.
- Maps DB rows via `formatDbProfile()` into the `Customer` interface.
- Falls back to `initialCustomers` if DB is empty.

**Target State:** Remove `initialCustomers` fallback. Show empty state if DB has no profiles.

**DB Mapping:**

| Table Column | DB Column |
|---|---|
| Name | `profiles.full_name` |
| Email | `profiles.email` |
| Phone | `profiles.phone` |
| Joined Date | `profiles.joined_date` (formatted) |
| Total Orders | `profiles.total_orders` (computed — see below) |
| Total Spent | `profiles.total_spent` (computed — see below) |

> ⚠️ **Schema Gap:** `profiles` table does NOT have `total_orders` or `total_spent` columns. These are calculated from `orders` table.

**Fix:** Enhance `getUsersAction()` to join with orders for aggregates:

```ts
// In src/server/user.ts — modify getUsersAction()
const { data: profiles } = await supabase
  .from('profiles')
  .select(`
    *,
    orders(amount, order_status)
  `)
  .order('joined_date', { ascending: false })

// Then compute per profile:
const enriched = profiles.map(p => ({
  ...p,
  total_orders: p.orders?.length || 0,
  total_spent: p.orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0,
}))
```

### 6b. Customer Search

**Current State:**
- Search filters in-memory on loaded customer list — no DB change needed.

### 6c. Customer Sheet — Customer Details

**Current State:**
- Sheet shows customer info, order history.
- `orderHistory` in the `Customer` interface comes from hardcoded defaults in `formatDbProfile()`.

**Target State:** Load actual order history from `orders` table filtered by `customer_id` or matching `email`/`phone`.

#### Changes Required

**A. Add `getCustomerOrdersAction(profileId)` to `src/server/order.ts` [MODIFY]**

```ts
export async function getCustomerOrdersAction(profileId: string) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, amount, order_status, payment_status')
    .eq('customer_id', profileId)
    .order('created_at', { ascending: false })
  if (error) return { success: false }
  return { success: true, data }
}
```

**B. Update Customer Sheet**
- On sheet open → call `getCustomerOrdersAction(customer.id)`.
- Replace hardcoded `orderHistory` fallback with live DB data.

**DB Mapping:**

| Sheet Field | DB Source |
|---|---|
| Order ID | `orders.id` |
| Order Date | `orders.created_at` (formatted) |
| Amount | `orders.amount` |
| Status | `orders.order_status` |

### 6d. Delete Customer

**Current State:**
- No delete button in the current UI — but `deleteUserAction(profileId)` exists in `src/server/user.ts`.

**Target State:** Wire up a delete confirmation button in the Customer Sheet that calls `deleteUserAction(profileId)`.

---

## 7. Banners Page — `src/app/(dashboard)/dashboard/banners/page.tsx`

### 7a. Banner List (All Banners)

**Current State:**
- `useEffect` reads from `localStorage.getItem('nursery_banners')`.
- Falls back to `initialBanners` hardcoded array (3 demo banners).
- **COMPLETELY DISCONNECTED from Supabase.** ❌

**Target State:** Read banners from `banners` table.

#### Changes Required

**A. New Server Actions — `src/server/banner.ts` [NEW FILE]**

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getBannersAction() {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('banners').select('*').order('priority', { ascending: true })
  if (error) return { success: false }
  return { success: true, data }
}

export async function createBannerAction(input: {
  title: string; subtitle?: string; image: string;
  link: string; button_text: string; is_active: boolean; priority: number
}) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase.from('banners').insert([input]).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function updateBannerAction(id: number, updates: Partial<{
  title: string; subtitle: string; image: string;
  link: string; button_text: string; is_active: boolean; priority: number
}>) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase.from('banners').update(updates).eq('id', id).select().single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function deleteBannerAction(id: number) {
  const supabase = createClient(await cookies())
  const { error } = await supabase.from('banners').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
```

**B. Update `BannersPage`**
- Replace `localStorage` read with `getBannersAction()` on mount.
- Remove `initialBanners` constant entirely.
- Replace all `localStorage.setItem('nursery_banners', ...)` with actual server action calls.

**DB Mapping:**

| Form Field | DB Column |
|---|---|
| `formTitle` | `banners.title` |
| `formSubtitle` | `banners.subtitle` |
| `formImage` | `banners.image` |
| `formLink` | `banners.link` |
| `formButtonText` | `banners.button_text` |
| `formIsActive` | `banners.is_active` |
| `formPriority` | `banners.priority` |

### 7b. Toggle Banner Active State

**Current State:**
- Toggling `isActive` updates localStorage only.

**Target State:** Call `updateBannerAction(id, { is_active: newValue })`.

### 7c. Add / Edit / Delete Banner

**Target State:** Wire to `createBannerAction`, `updateBannerAction`, `deleteBannerAction` respectively.

---

## 8. Newsletter Page — `src/app/(dashboard)/dashboard/newsletter/page.tsx`

### 8a. Subscriber Table (All Subscribers)

**Current State:**
- Reads from `localStorage.getItem('nursery_subs')`.
- Falls back to `initialSubscribers` hardcoded array (5 demo emails).
- **COMPLETELY DISCONNECTED from Supabase.** ❌

**Target State:** Read subscribers from `subscribers` table.

#### Changes Required

**A. Add to `src/server/newsletter.ts` [NEW FILE]**

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function getSubscribersAction() {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('subscribers').select('*').order('subscribed_at', { ascending: false })
  if (error) return { success: false }
  return { success: true, data }
}

export async function toggleSubscriberAction(id: number, isActive: boolean) {
  const supabase = createClient(await cookies())
  const { error } = await supabase
    .from('subscribers').update({ is_active: isActive }).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteSubscriberAction(id: number) {
  const supabase = createClient(await cookies())
  const { error } = await supabase.from('subscribers').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function subscribeAction(email: string) {
  const supabase = createClient(await cookies())
  const { error } = await supabase
    .from('subscribers')
    .upsert([{ email, is_active: true }], { onConflict: 'email' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
```

**B. Update `NewsletterPage`**
- Replace `localStorage` read with `getSubscribersAction()` on mount.
- Remove `initialSubscribers` constant.
- Wire toggle button to `toggleSubscriberAction()`.

**DB Mapping:**

| Table Column | DB Column |
|---|---|
| Email | `subscribers.email` |
| Status (Active/Inactive) | `subscribers.is_active` |
| Subscribed Date | `subscribers.subscribed_at` (formatted) |

### 8b. Compose Campaign — Featured Product Dropdown

**Current State:**
- `productList` loaded from `localStorage.getItem('nursery_products')`.

**Target State:** Load from `getProductsAction()`.

#### Changes Required
- Replace localStorage read with `getProductsAction()` call.
- Use the returned product list to populate the featured product dropdown in the compose form.

### 8c. Send Campaign Action

**Current State:**
- `handleSendCampaign()` just sets `sendSuccess = true` — it's a demo UI action with no real email sending.

**Target State:** For now, keep as a UI-only preview action. In a future phase, integrate with an email provider (e.g., Resend, Brevo) to actually send to `subscribers` where `is_active = true`.

> **Note:** The `subscribers` table schema supports this use case. The admin can preview the campaign in the Sheet and mark it as sent.

---

## 9. Dashboard Login Page — `src/app/(dashboard)/dashboard/login/page.tsx`

**Current State:**
- Login form exists and is connected to Supabase Auth via `src/server/auth.ts`.
- Uses email/password sign-in.

**Target State:** Already connected ✅. No changes needed.

---

## Summary: Connection Status by Page

| Page | Status | Remaining Work |
|---|---|---|
| `layout.tsx` — Auth | ✅ Connected | — |
| `layout.tsx` — Global Search | ❌ Static data | Create `globalSearchAction`, wire to search input |
| `page.tsx` — Stats Cards | ⚠️ Partial | Fix Subscribers stat (wrong table), add revenue period filter |
| `page.tsx` — Chart | ❌ Static data | Create `getRevenueChartAction`, normalize to SVG coords |
| `page.tsx` — Recent Orders | ✅ Connected | Remove hardcoded fallback, add empty state |
| `page.tsx` — Low Stock | ✅ Connected | Remove hardcoded fallback |
| `products/page.tsx` — Table | ✅ Connected | Remove localStorage fallback |
| `products/page.tsx` — Category Filter | ❌ Hardcoded | Derive from DB product list |
| `products/page.tsx` — Add Product | ✅ Connected | Add `description` column to schema |
| `products/page.tsx` — Edit Product | ✅ Connected | Remove localStorage sync |
| `products/page.tsx` — Delete | ✅ Connected | Remove localStorage sync |
| `inventory/page.tsx` — Table | ✅ Connected | Remove localStorage & demo fallback |
| `inventory/page.tsx` — Stock Update | ✅ Connected | — |
| `orders/page.tsx` — Table | ✅ Connected | Remove hardcoded fallback |
| `orders/page.tsx` — Order Sheet | ✅ Connected | — |
| `orders/page.tsx` — Status Update | ✅ Connected | — |
| `orders/page.tsx` — Payment Status | ❌ Not wired | Create `updatePaymentStatusAction` |
| `customers/page.tsx` — Table | ✅ Connected | Remove hardcoded fallback |
| `customers/page.tsx` — Order History | ❌ Hardcoded | Create `getCustomerOrdersAction`, load on sheet open |
| `customers/page.tsx` — Aggregates | ⚠️ Partial | Add orders join to `getUsersAction` for totals |
| `banners/page.tsx` — All CRUD | ❌ localStorage only | Create `src/server/banner.ts`, wire all 4 actions |
| `newsletter/page.tsx` — Subscriber Table | ❌ localStorage only | Create `src/server/newsletter.ts`, wire read/toggle/delete |
| `newsletter/page.tsx` — Product Dropdown | ❌ localStorage only | Use `getProductsAction()` instead |
| `login/page.tsx` | ✅ Connected | — |

---

## New Files to Create

| File | Purpose |
|---|---|
| `src/server/banner.ts` | `getBannersAction`, `createBannerAction`, `updateBannerAction`, `deleteBannerAction` |
| `src/server/newsletter.ts` | `getSubscribersAction`, `subscribeAction`, `toggleSubscriberAction`, `deleteSubscriberAction` |
| `src/server/search.ts` | `globalSearchAction` — live product/order/customer search |

## Files to Modify

| File | Change |
|---|---|
| `src/server/order.ts` | Add `updatePaymentStatusAction`, `getRevenueChartAction`, `getCustomerOrdersAction` |
| `src/server/user.ts` | Modify `getUsersAction` to join orders for total_orders + total_spent aggregates |
| `src/app/(dashboard)/dashboard/layout.tsx` | Replace hardcoded `searchDatabase` with live `globalSearchAction` |
| `src/app/(dashboard)/dashboard/page.tsx` | Fix Subscribers stat, wire revenue chart, remove hardcoded fallbacks |
| `src/app/(dashboard)/dashboard/products/page.tsx` | Remove localStorage fallbacks, dynamic category filter |
| `src/app/(dashboard)/dashboard/inventory/page.tsx` | Remove localStorage + demo fallback |
| `src/app/(dashboard)/dashboard/orders/page.tsx` | Remove hardcoded fallback, add payment status update |
| `src/app/(dashboard)/dashboard/customers/page.tsx` | Remove hardcoded fallback, load real order history |
| `src/app/(dashboard)/dashboard/banners/page.tsx` | Replace localStorage with Supabase CRUD |
| `src/app/(dashboard)/dashboard/newsletter/page.tsx` | Replace localStorage with Supabase reads/writes |

## Schema Migrations Needed

| Migration | SQL |
|---|---|
| Add `description` to products | `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;` |

---

## Implementation Priority Order

| Priority | Task | Effort |
|---|---|---|
| 🔴 P1 | Banners page — full CRUD to DB | Medium |
| 🔴 P1 | Newsletter page — subscriber table from DB | Medium |
| 🟠 P2 | Overview page — fix Subscribers stat | Low |
| 🟠 P2 | Overview page — remove hardcoded fallbacks | Low |
| 🟠 P2 | Products page — remove localStorage fallbacks | Low |
| 🟠 P2 | Products page — dynamic category filter | Low |
| 🟠 P2 | Orders page — payment status update action | Low |
| 🟠 P2 | Customers page — real order history in sheet | Medium |
| 🟡 P3 | Customers page — total_orders/total_spent aggregates | Medium |
| 🟡 P3 | Layout global search — live DB search | Medium |
| 🟡 P3 | Inventory page — remove fallback data | Low |
| 🟢 P4 | Overview chart — real revenue data | High |
| 🟢 P4 | Add `description` column migration | Low |
| 🟢 P5 | Newsletter — campaign send integration (Resend/Brevo) | High |

