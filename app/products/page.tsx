import { createClient } from '@/lib/supabase/server'
import Header from '@/components/header'
import ProductsGrid from '@/components/products-grid'

export const metadata = {
  title: 'Produtos Recomendados | Saúde em Foco',
  description: 'Produtos, suplementos e equipamentos recomendados para sua jornada de saúde e fitness.',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-1 w-full py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Produtos Recomendados</h1>
            <p className="text-muted-foreground">Suplementos, equipamentos e produtos selecionados para apoiar sua jornada de saúde</p>
          </div>
          
          <ProductsGrid products={products || []} />
        </div>
      </main>
    </div>
  )
}
