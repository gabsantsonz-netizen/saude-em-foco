'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trash2, Edit2, Plus, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[]
}

export default function TestimonialManager({ initialTestimonials }: TestimonialManagerProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    content: '',
    rating: 5,
    avatar_url: '',
    is_active: true,
    display_order: 0,
  })

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id)
      setFormData({
        name: testimonial.name,
        location: testimonial.location || '',
        content: testimonial.content,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar_url || '',
        is_active: testimonial.is_active,
        display_order: testimonial.display_order,
      })
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        location: '',
        content: '',
        rating: 5,
        avatar_url: '',
        is_active: true,
        display_order: testimonials.length,
      })
    }
    setIsOpen(true)
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (editingId) {
      setTestimonials(testimonials.map(t => t.id === editingId ? { ...formData, id: editingId } as Testimonial : t))
    } else {
      const newTestimonial: Testimonial = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Testimonial
      setTestimonials([...testimonials, newTestimonial])
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Total de testimoniais: {testimonials.length}</p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar Testimonial' : 'Adicionar Novo Testimonial'}</DialogTitle>
              <DialogDescription>
                Preencha as informações do testimonial abaixo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome da pessoa"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="location">Localização</FieldLabel>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cidade, Estado"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="content">Depoimento</FieldLabel>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="O que a pessoa disse sobre sua experiência?"
                  rows={4}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="rating">Avaliação</FieldLabel>
                <Select value={formData.rating.toString()} onValueChange={(v) => setFormData({ ...formData, rating: parseInt(v) })}>
                  <SelectTrigger id="rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Estrela</SelectItem>
                    <SelectItem value="2">2 Estrelas</SelectItem>
                    <SelectItem value="3">3 Estrelas</SelectItem>
                    <SelectItem value="4">4 Estrelas</SelectItem>
                    <SelectItem value="5">5 Estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="avatar_url">URL do Avatar</FieldLabel>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://..."
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
                  {editingId ? 'Atualizar' : 'Criar'} Testimonial
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <p className="text-center text-muted-foreground">Nenhum testimonial adicionado ainda</p>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar_url} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      {!testimonial.is_active && <Badge variant="secondary" className="ml-auto">Inativo</Badge>}
                    </div>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(testimonial)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(testimonial.id)}
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
