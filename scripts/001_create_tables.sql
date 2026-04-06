-- Health Platform Database Schema - Tables and RLS
-- Creates all necessary tables for the health, nutrition, and fitness platform

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Calculation history table
CREATE TABLE IF NOT EXISTS public.calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('bmi', 'calories', 'macros')),
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- Products table (for affiliate products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('supplement', 'equipment', 'nutrition', 'fitness', 'wellness')),
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON public.calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calculations_type ON public.calculations(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON public.calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON public.products(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON public.testimonials(display_order);
