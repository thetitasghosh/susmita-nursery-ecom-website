-- 1. Drop foreign key constraints
ALTER TABLE IF EXISTS public.product_recommendations DROP CONSTRAINT IF EXISTS product_recommendations_product_id_fkey;
ALTER TABLE IF EXISTS public.product_recommendations DROP CONSTRAINT IF EXISTS product_recommendations_recommended_id_fkey;
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS public.wishlist DROP CONSTRAINT IF EXISTS wishlist_product_id_fkey;

-- 2. Add temporary UUID columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.product_recommendations ADD COLUMN IF NOT EXISTS uuid_product_id UUID;
ALTER TABLE public.product_recommendations ADD COLUMN IF NOT EXISTS uuid_recommended_id UUID;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS uuid_product_id UUID;
ALTER TABLE public.wishlist ADD COLUMN IF NOT EXISTS uuid_product_id UUID;

-- 3. Populate new UUID columns based on relationships
UPDATE public.product_recommendations pr
SET uuid_product_id = p.uuid_id
FROM public.products p
WHERE pr.product_id = p.id;

UPDATE public.product_recommendations pr
SET uuid_recommended_id = p.uuid_id
FROM public.products p
WHERE pr.recommended_id = p.id;

UPDATE public.order_items oi
SET uuid_product_id = p.uuid_id
FROM public.products p
WHERE oi.product_id = p.id;

UPDATE public.wishlist w
SET uuid_product_id = p.uuid_id
FROM public.products p
WHERE w.product_id = p.id;

-- 4. Alter products primary key
-- Drop primary key constraints (we have to drop dependent ones first)
ALTER TABLE public.product_recommendations DROP CONSTRAINT IF EXISTS product_recommendations_pkey;
ALTER TABLE public.wishlist DROP CONSTRAINT IF EXISTS wishlist_pkey;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_pkey;

-- Drop old integer ID columns
ALTER TABLE public.products DROP COLUMN id CASCADE;
ALTER TABLE public.product_recommendations DROP COLUMN product_id CASCADE;
ALTER TABLE public.product_recommendations DROP COLUMN recommended_id CASCADE;
ALTER TABLE public.order_items DROP COLUMN product_id CASCADE;
ALTER TABLE public.wishlist DROP COLUMN product_id CASCADE;

-- Rename UUID columns to standard names
ALTER TABLE public.products RENAME COLUMN uuid_id TO id;
ALTER TABLE public.product_recommendations RENAME COLUMN uuid_product_id TO product_id;
ALTER TABLE public.product_recommendations RENAME COLUMN uuid_recommended_id TO recommended_id;
ALTER TABLE public.order_items RENAME COLUMN uuid_product_id TO product_id;
ALTER TABLE public.wishlist RENAME COLUMN uuid_product_id TO product_id;

-- Set primary keys and not null constraints
ALTER TABLE public.products ADD PRIMARY KEY (id);

-- Make columns NOT NULL where required
ALTER TABLE public.product_recommendations ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE public.product_recommendations ALTER COLUMN recommended_id SET NOT NULL;
ALTER TABLE public.order_items ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE public.wishlist ALTER COLUMN product_id SET NOT NULL;

ALTER TABLE public.product_recommendations ADD PRIMARY KEY (product_id, recommended_id);
ALTER TABLE public.wishlist ADD PRIMARY KEY (profile_id, product_id);

-- 5. Re-add foreign key constraints
ALTER TABLE public.product_recommendations
  ADD CONSTRAINT product_recommendations_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.product_recommendations
  ADD CONSTRAINT product_recommendations_recommended_id_fkey FOREIGN KEY (recommended_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE public.wishlist
  ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
