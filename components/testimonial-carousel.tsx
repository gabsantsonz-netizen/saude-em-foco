'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  location: string
  content: string
  rating: number
  avatar_url?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Silva',
    location: 'São Paulo, SP',
    content: 'As calculadoras do Saúde em Foco me ajudaram a entender melhor meu corpo. Perdi 12kg em 4 meses seguindo as recomendações!',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'João Santos',
    location: 'Rio de Janeiro, RJ',
    content: 'Excelente ferramenta! O histórico de cálculos facilita muito o acompanhamento do meu progresso na academia.',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Ana Costa',
    location: 'Belo Horizonte, MG',
    content: 'Uso a calculadora de macros diariamente. Muito precisa e fácil de usar. Recomendo para qualquer pessoa que quer cuidar da saúde!',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  }
]

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, testimonials.length])

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <div className="relative w-full">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>

              <p className="text-lg text-foreground italic leading-relaxed">
                &quot;{current.content}&quot;
              </p>

              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={current.avatar_url} alt={current.name} />
                  <AvatarFallback>{current.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{current.name}</p>
                  <p className="text-sm text-muted-foreground">{current.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          aria-label="Testemunho anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-primary w-8' : 'bg-muted w-2'
              }`}
              onClick={() => {
                setIsAutoPlay(false)
                setCurrentIndex(i)
              }}
              aria-label={`Ir para testemunho ${i + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          aria-label="Próximo testemunho"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
