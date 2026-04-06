'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

interface ProductManagerProps {
  initialProducts: Product[]
}

const categoryLabels = {
  supplement: 'Suplemento',
  equipment: 'Equipamento',
  nutrition: 'Nutrição',
  fitness: 'Fitness',
  wellness: 'Bem-estar',
}

export default function ProductManager({ initialProducts }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    affiliate_url: '',
    category: 'supplement' as keyof typeof categoryLabels,
    price: '',
    is_active: true,
    display_order: 0,
  })

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name,
        description: product.description || '',
        image_url: product.image_url || '',
        affiliate_url: product.affiliate_url,
        category: product.category as keyof typeof categoryLabels,
        price: product.price?.toString() || '',
        is_active: product.is_active,
        display_order: product.display_order,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        image_url: '',
        affiliate_url: '',
        category: 'supplement',
        price: '',
        is_active: true,
        display_order: products.length,
      })
    }
    setIsOpen(true)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    // In a real app, this would save to Supabase
    // For now, we'll just update local state
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...formData, id: editingId } as Product : p))
    } else {
      const newProduct: Product = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        price: formData.price ? parseFloat(formData.price) : undefined,
      } as Product
      setProducts([...products, newProduct])
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Total de produtos: {products.length}</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
              <DialogDescription>
                Preencha as informações do produto abaixo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do produto"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Categoria</FieldLabel>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as keyof typeof categoryLabels })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplement">Suplemento</SelectItem>
                    <SelectItem value="equipment">Equipamento</SelectItem>
                    <SelectItem value="nutrition">Nutrição</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="wellness">Bem-estar</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="price">Preço (R$)</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image_url">URL da Imagem</FieldLabel>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="affiliate_url">URL de Afiliado</FieldLabel>
                <Input
                  id="affiliate_url"
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="display_order">Ordem de Exibição</FieldLabel>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </Field>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                  Ativo
                </label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <p className="text-center text-muted-foreground">Nenhum produto adicionado ainda</p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <Badge variant="outline">{categoryLabels[product.category as keyof typeof categoryLabels]}</Badge>
                      {!product.is_active && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    {product.price && (
                      <p className="text-sm font-semibold text-primary">R$ {product.price.toFixed(2)}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
