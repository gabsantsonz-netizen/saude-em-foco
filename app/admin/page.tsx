import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import AdminPanel from '@/components/admin-panel'

export const metadata = {
  title: 'Admin | Saúde em Foco',
  description: 'Painel de administração para gerenciar produtos e testimoniais.',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch products and testimonials
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true })

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-1 w-full py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Painel de Admin</h1>
            <p className="text-muted-foreground">Gerencie produtos e testimoniais</p>
          </div>
          
          <AdminPanel initialProducts={products || []} initialTestimonials={testimonials || []} />
        </div>
      </main>
    </div>
  )
}
