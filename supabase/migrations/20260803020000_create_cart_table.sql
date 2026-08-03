-- Create Cart Table
CREATE TABLE IF NOT EXISTS public.cart (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  selected_size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (profile_id, product_id, selected_size)
);

-- Enable RLS
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Cart Policies
CREATE POLICY "Users can manage own cart" ON public.cart FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins have full access to cart" ON public.cart FOR ALL TO authenticated USING (public.is_admin());

-- Apply Timestamp Update Trigger
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
