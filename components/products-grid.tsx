'use client'

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

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

interface ProductsGridProps {
  products: Product[]
}

const categoryColors = {
  supplement: 'bg-purple-50 text-purple-700 border-purple-200',
  equipment: 'bg-blue-50 text-blue-700 border-blue-200',
  nutrition: 'bg-green-50 text-green-700 border-green-200',
  fitness: 'bg-orange-50 text-orange-700 border-orange-200',
  wellness: 'bg-pink-50 text-pink-700 border-pink-200',
}

const categoryLabels = {
  supplement: 'Suplemento',
  equipment: 'Equipamento',
  nutrition: 'Nutrição',
  fitness: 'Fitness',
  wellness: 'Bem-estar',
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow h-full">
          <div className="relative w-full h-48 bg-muted overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}
          </div>

          <CardHeader className="flex-1">
            <div className="space-y-2">
              <Badge 
                variant="outline"
                className={categoryColors[product.category as keyof typeof categoryColors] || categoryColors.supplement}
              >
                {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
              </Badge>
              <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
              {product.price && (
                <p className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
              )}
            </div>
            
            {product.description && (
              <CardDescription className="line-clamp-3 mt-2">
                {product.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2">
                Ver Produto
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
