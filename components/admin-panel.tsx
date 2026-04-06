'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductManager from '@/components/product-manager'
import TestimonialManager from '@/components/testimonial-manager'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  affiliate_url: string
  category: string
  price?: number
  is_active: boolean
  display_order: number
}

interface Testimonial {
  id: string
  name: string
  location: string
  content: string
  rating: number
  avatar_url?: string
  is_active: boolean
  display_order: number
}

interface AdminPanelProps {
  initialProducts: Product[]
  initialTestimonials: Testimonial[]
}

export default function AdminPanel({ initialProducts, initialTestimonials }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="products">Produtos ({initialProducts.length})</TabsTrigger>
        <TabsTrigger value="testimonials">Testimoniais ({initialTestimonials.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-6">
        <ProductManager initialProducts={initialProducts} />
      </TabsContent>

      <TabsContent value="testimonials" className="space-y-6">
        <TestimonialManager initialTestimonials={initialTestimonials} />
      </TabsContent>
    </Tabs>
  )
}
