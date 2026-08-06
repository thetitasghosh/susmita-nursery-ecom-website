-- ==========================================
-- 20260806010000_newsletter_setup.sql
-- ==========================================

-- 1. Create newsletter_campaigns table with UUID and foreign keys
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    header TEXT NOT NULL,
    body TEXT NOT NULL,
    featured_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    template_type TEXT DEFAULT 'care_guide' NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Drop old subscribers table if it exists to clean up primary keys
DROP TABLE IF EXISTS public.subscribers CASCADE;

-- 3. Re-create subscribers table with UUID keys, profile link, and metadata
CREATE TABLE public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on new subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 5. Re-create RLS Policies on new subscribers table
CREATE POLICY "Anyone can subscribe to newsletter" 
    ON public.subscribers FOR INSERT 
    WITH CHECK (TRUE);

CREATE POLICY "Users can manage their own subscription" 
    ON public.subscribers FOR ALL 
    TO authenticated 
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins have full access to subscribers" 
    ON public.subscribers FOR ALL 
    TO authenticated 
    USING (public.is_admin());

-- 6. Update handle_new_user function to auto-populate subscribers with UUID profile link
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create user profile in profiles table
  INSERT INTO public.profiles (id, full_name, email, phone, role, joined_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Nursery Client'),
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'customer'),
    NEW.created_at
  );

  -- 2. Auto-populate subscribers table linking profile_id and user metadata
  INSERT INTO public.subscribers (profile_id, email, full_name, phone, is_active, subscribed_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Nursery Client'), 
    NEW.phone, 
    TRUE, 
    NEW.created_at
  )
  ON CONFLICT (email) DO UPDATE 
  SET 
    profile_id = EXCLUDED.profile_id,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    is_active = TRUE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
