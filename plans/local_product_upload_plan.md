# Plan: Upload Local Products and Images to Supabase

This plan outlines a programmatic method to upload all 30 local products defined in the codebase, along with their image assets from the local filesystem, to Supabase Storage and the PostgreSQL database.

## 1. Objectives
* **Storage Upload**: Read local images from the `public/images/plants/` folder on disk and upload them to the `products` Supabase Storage bucket.
* **Database Sync**: Populate the `products` table in PostgreSQL with complete specs, categories, sizes, and pricing, utilizing the new public URLs of the uploaded images.
* **Recommendation Links**: Seed the `product_recommendations` table with initial pairings (e.g., linking specific plants to tools like shears and organic fertilizers).

---

## 2. Technical Strategy

### A. Environment Variables
The script will require credentials with write permissions to storage and tables. We will use the following environment variables (which can be read from `.env.local`):
* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
* `SUPABASE_SERVICE_ROLE_KEY`: Service role secret key (required to bypass RLS for seeding, or write directly to tables).

### B. Seeding Script: `scripts/upload-local-products.ts`
We will create a Node.js script that:
1. Initializes a Supabase client using the service role key.
2. Iterates through the list of products in [products.ts](file:///d:/Documents/03_Freelance_Websites/susmita-nursery-ecom-website/src/lib/products.ts).
3. For each product:
   * **Cover Image**: Resolves the local file path (e.g., `public/images/plants/money-plant/money-plant-yellow-cover.png`). Reads the file buffer and uploads it to the `products` bucket.
   * **Gallery Images**: Loops through the `images` array, uploads each image file, and collects their public URLs.
   * **Database Insert**: Upserts the product data (name, category, price, details, sizes, careInstructions, etc.) into the `products` table.
4. **Link Recommendations**:
   * Auto-associates Gardening Tools (e.g. ID 30 - Precision Botanical Shears) and Organic Fertilizers (e.g. ID 29 - Vermicompost) with each plant category inside the `product_recommendations` join table.

---

## 3. Implementation Checklist

### [ ] Step 1: Install script execution helpers
If `ts-node` or `mime-types` (to detect JPEG/PNG content-types for Storage uploads) are not installed, we will run:
```bash
npm install -D ts-node @types/node mime-types @types/mime-types
```

### [ ] Step 2: Create Seeding Script
We will create the script file at `scripts/upload-local-products.ts` which imports `allProducts` from `src/lib/products.ts`, reads files using the standard Node `fs` module, and uses the Supabase client.

### [ ] Step 3: Run Seeding Script
Execute the script locally:
```bash
npx ts-node -O '{"module": "commonjs"}' scripts/upload-local-products.ts
```

---

## 4. Verification Plan

### Database & Storage Verification
* **Supabase Console**: Check that the `products` storage bucket contains an `uploads/` folder with the new files.
* **SQL Editor / Table Editor**: Verify that the `products` table has 30 rows populated with public Supabase URLs.
* **Product Manager**: Open the admin dashboard to verify that all images and recommendations load correctly.
