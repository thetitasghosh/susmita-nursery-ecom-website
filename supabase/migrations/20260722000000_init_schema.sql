-- ==========================================
-- Susmita Nursery Database Migration
-- Target: Supabase PostgreSQL
-- ==========================================

-- Enable extensions if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. DROP EXISTING CONSTRAINTS / TABLES (For clean replay)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_banners_updated_at ON public.banners;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_order_items_insert ON public.order_items;
DROP TRIGGER IF EXISTS trg_order_items_delete ON public.order_items;
DROP TRIGGER IF EXISTS trg_orders_status_change ON public.orders;
DROP FUNCTION IF EXISTS public.handle_order_item_insert();
DROP FUNCTION IF EXISTS public.handle_order_item_delete();
DROP FUNCTION IF EXISTS public.handle_order_status_change();

DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.subscribers CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.product_recommendations CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==========================================
-- 2. CREATE SCHEMAS & TABLES
-- ==========================================

-- A. Profiles (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  preferred_category TEXT,
  role TEXT DEFAULT 'customer' NOT NULL CHECK (role IN ('customer', 'admin')),
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- B. Products (Unified details and catalog data)
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL CHECK (rating >= 0 AND rating <= 5.00),
  reviews INTEGER DEFAULT 0 NOT NULL CHECK (reviews >= 0),
  image TEXT NOT NULL,
  supporting_images JSONB DEFAULT '[]'::jsonb NOT NULL,
  details JSONB DEFAULT '{}'::jsonb NOT NULL, -- {light, water, humidity, temperature, soil}
  sizes JSONB DEFAULT '[]'::jsonb NOT NULL, -- array of sizes e.g. ["Medium"]
  care_instructions JSONB DEFAULT '[]'::jsonb NOT NULL, -- array of strings
  scientific_name TEXT,
  height TEXT,
  difficulty TEXT,
  pet_friendly TEXT,
  air_purifying TEXT,
  stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 NOT NULL CHECK (reserved_quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- C. Product Recommendations (nestedItemIds mapping)
CREATE TABLE public.product_recommendations (
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, recommended_id)
);

-- D. Orders (In-Store Reservations and Logs)
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY, -- Custom code like 'SN-RES-84920' or 'OR-4092'
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'processing' NOT NULL CHECK (order_status IN ('processing', 'ready_for_pickup', 'fulfilled', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- E. Order Items
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  size TEXT NOT NULL
);

-- F. Addresses (Saved customer addresses)
CREATE TABLE public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL, -- e.g., 'Home', 'Work'
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  full_name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'West Bengal' NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- G. Banners (Promo sliders)
CREATE TABLE public.banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  link TEXT NOT NULL,
  button_text TEXT DEFAULT 'Shop Now' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  priority INTEGER DEFAULT 1 NOT NULL CHECK (priority >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- H. Subscribers (Newsletter Leads)
CREATE TABLE public.subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- I. Wishlist
CREATE TABLE public.wishlist (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (profile_id, product_id)
);

-- ==========================================
-- 3. TRIGGERS & UTILITY FUNCTIONS
-- ==========================================

-- A. Automatically Update Timestamp Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Timestamp Update Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- B. Automatically create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role, joined_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Nursery Client'),
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'customer'),
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- C. Inventory Reservation & Stock Automation Triggers
-- Logic: Handles adjustments to products.stock_quantity and products.reserved_quantity based on order events.

-- Trigger 1: Order Item Insertion
CREATE OR REPLACE FUNCTION public.handle_order_item_insert()
RETURNS TRIGGER AS $$
DECLARE
  parent_status TEXT;
BEGIN
  -- Retrieve parent order's status
  SELECT order_status INTO parent_status
  FROM public.orders
  WHERE id = NEW.order_id;

  IF parent_status IN ('processing', 'ready_for_pickup') THEN
    -- Increment reserved count
    UPDATE public.products
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE id = NEW.product_id;
  ELSIF parent_status = 'fulfilled' THEN
    -- Direct sale: decrement base stock immediately
    UPDATE public.products
    SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
    WHERE id = NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_order_items_insert
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_item_insert();

-- Trigger 2: Order Item Deletion
CREATE OR REPLACE FUNCTION public.handle_order_item_delete()
RETURNS TRIGGER AS $$
DECLARE
  parent_status TEXT;
BEGIN
  SELECT order_status INTO parent_status
  FROM public.orders
  WHERE id = OLD.order_id;

  IF parent_status IN ('processing', 'ready_for_pickup') THEN
    -- Release reservation count
    UPDATE public.products
    SET reserved_quantity = GREATEST(0, reserved_quantity - OLD.quantity)
    WHERE id = OLD.product_id;
  ELSIF parent_status = 'fulfilled' THEN
    -- Refill back to stock since it was deleted
    UPDATE public.products
    SET stock_quantity = stock_quantity + OLD.quantity
    WHERE id = OLD.product_id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_order_items_delete
  AFTER DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_item_delete();

-- Trigger 3: Order Status Change State Machine
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
  is_old_reserving BOOLEAN;
  is_new_reserving BOOLEAN;
  is_old_completed BOOLEAN;
  is_new_completed BOOLEAN;
  is_old_cancelled BOOLEAN;
  is_new_cancelled BOOLEAN;
BEGIN
  is_old_reserving := OLD.order_status IN ('processing', 'ready_for_pickup');
  is_new_reserving := NEW.order_status IN ('processing', 'ready_for_pickup');
  is_old_completed := OLD.order_status = 'fulfilled';
  is_new_completed := NEW.order_status = 'fulfilled';
  is_old_cancelled := OLD.order_status = 'cancelled';
  is_new_cancelled := NEW.order_status = 'cancelled';

  IF OLD.order_status <> NEW.order_status THEN
    FOR item IN 
      SELECT product_id, quantity 
      FROM public.order_items 
      WHERE order_id = NEW.id
    LOOP
      
      -- Case 1: From Reserving to Completed (Marked as Picked Up / Fulfilled)
      IF is_old_reserving AND is_new_completed THEN
        UPDATE public.products
        SET 
          reserved_quantity = GREATEST(0, reserved_quantity - item.quantity),
          stock_quantity = GREATEST(0, stock_quantity - item.quantity)
        WHERE id = item.product_id;
        
      -- Case 2: From Reserving to Cancelled (Marked as Cancelled)
      ELSIF is_old_reserving AND is_new_cancelled THEN
        UPDATE public.products
        SET reserved_quantity = GREATEST(0, reserved_quantity - item.quantity)
        WHERE id = item.product_id;
        
      -- Case 3: From Cancelled to Reserving (Restored back to active status)
      ELSIF is_old_cancelled AND is_new_reserving THEN
        UPDATE public.products
        SET reserved_quantity = reserved_quantity + item.quantity
        WHERE id = item.product_id;
        
      -- Case 4: From Completed to Reserving (Undoing checkout status)
      ELSIF is_old_completed AND is_new_reserving THEN
        UPDATE public.products
        SET 
          reserved_quantity = reserved_quantity + item.quantity,
          stock_quantity = stock_quantity + item.quantity
        WHERE id = item.product_id;
        
      -- Case 5: From Completed to Cancelled (Refunding completed order)
      ELSIF is_old_completed AND is_new_cancelled THEN
        UPDATE public.products
        SET stock_quantity = stock_quantity + item.quantity
        WHERE id = item.product_id;
        
      -- Case 6: From Cancelled to Completed
      ELSIF is_old_cancelled AND is_new_completed THEN
        UPDATE public.products
        SET stock_quantity = GREATEST(0, stock_quantity - item.quantity)
        WHERE id = item.product_id;
        
      END IF;
      
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_orders_status_change
  AFTER UPDATE OF order_status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_change();

-- ==========================================
-- 4. OPTIMIZED SCHEMAS INDEXES (For fast lookups)
-- ==========================================
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_phone ON public.orders(phone);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_addresses_profile_id ON public.addresses(profile_id);
CREATE INDEX idx_wishlist_profile_id ON public.wishlist(profile_id);
CREATE INDEX idx_banners_priority ON public.banners(priority) WHERE is_active = TRUE;

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ==========================================

-- Enable RLS across all schema entities
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Helper security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(role = 'admin', FALSE)
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- A. Profiles Policies
CREATE POLICY "Public Profiles are viewable by anyone" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

-- B. Products Policies
CREATE POLICY "Products are viewable by anyone" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL TO authenticated USING (public.is_admin());

-- C. Product Recommendations Policies
CREATE POLICY "Product recommendations are viewable by anyone" ON public.product_recommendations FOR SELECT USING (TRUE);
CREATE POLICY "Admins have full access to product recommendations" ON public.product_recommendations FOR ALL TO authenticated USING (public.is_admin());

-- D. Orders Policies
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id OR auth.uid() IS NULL); -- Allow guest orders as offline reservation logs
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL TO authenticated USING (public.is_admin());

-- E. Order Items Policies
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
  )
);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id = auth.uid()
  )
);
CREATE POLICY "Admins have full access to order items" ON public.order_items FOR ALL TO authenticated USING (public.is_admin());

-- F. Addresses Policies
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins have full access to addresses" ON public.addresses FOR ALL TO authenticated USING (public.is_admin());

-- G. Banners Policies
CREATE POLICY "Active banners are viewable by anyone" ON public.banners FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins have full access to banners" ON public.banners FOR ALL TO authenticated USING (public.is_admin());

-- H. Subscribers Policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins have full access to subscribers" ON public.subscribers FOR ALL TO authenticated USING (public.is_admin());

-- I. Wishlist Policies
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins have full access to wishlist" ON public.wishlist FOR ALL TO authenticated USING (public.is_admin());
