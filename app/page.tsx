import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, Zap, Users } from 'lucide-react'
import Header from '@/components/header'
import TestimonialCarousel from '@/components/testimonial-carousel'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="flex-1 w-full bg-gradient-to-br from-background via-background to-muted py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Saúde em Foco
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Ferramentas profissionais para calcular seu BMI, calorias, macronutrientes e gerenciar seu progresso em saúde, nutrição e fitness.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user ? (
              <>
                <Link href="/calculator" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Usar Calculadora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Meu Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Ferramentas Poderosas
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Calculadora Completa</CardTitle>
                <CardDescription>BMI, Calorias e Macros</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calcula seu Índice de Massa Corporal, necessidade calórica diária e distribuição de macronutrientes usando fórmulas científicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Histórico Detalhado</CardTitle>
                <CardDescription>Acompanhe seu Progresso</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mantenha um histórico completo de todas as suas calculadoras para acompanhar mudanças e evolução ao longo do tempo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Comunidade</CardTitle>
                <CardDescription>Dicas e Recomendações</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acesse produtos e suplementos recomendados pela nossa comunidade de profissionais de saúde.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Calculator Preview */}
      <section className="w-full py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Experimente Agora
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href={user ? "/calculator?type=bmi" : "/auth/sign-up"}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Calculadora de BMI</CardTitle>
                  <CardDescription>Índice de Massa Corporal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Descubra seu IMC em segundos com base em peso e altura.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href={user ? "/calculator?type=calories" : "/auth/sign-up"}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Calculadora de Calorias</CardTitle>
                  <CardDescription>Gasto Calórico Diário</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calcule quantas calorias você precisa consumir diariamente.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href={user ? "/calculator?type=macros" : "/auth/sign-up"}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Calculadora de Macros</CardTitle>
                  <CardDescription>Distribuição de Nutrientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Descubra a distribuição ideal de proteína, carboidrato e gordura.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 px-4 bg-card">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Histórias de Sucesso
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Saúde em Foco</h3>
              <p className="text-sm text-muted-foreground">
                Ferramentas para sua jornada de saúde e fitness.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                {user && (
                  <>
                    <li><Link href="/calculator" className="text-muted-foreground hover:text-foreground">Calculadora</Link></li>
                    <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                  </>
                )}
                {!user && (
                  <li><Link href="/auth/sign-up" className="text-muted-foreground hover:text-foreground">Começar</Link></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Sobre</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Saúde em Foco. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
