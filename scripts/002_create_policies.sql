-- Row Level Security Policies

-- Profiles RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Calculations RLS Policies
CREATE POLICY "calculations_select_own" ON public.calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calculations_insert_own" ON public.calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calculations_delete_own" ON public.calculations FOR DELETE USING (auth.uid() = user_id);

-- Products RLS Policies (public read, admin write)
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Testimonials RLS Policies (public read, admin write)
CREATE POLICY "testimonials_select_all" ON public.testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
