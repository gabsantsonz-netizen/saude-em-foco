import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import DashboardContent from '@/components/dashboard-content'

export const metadata = {
  title: 'Dashboard | Saúde em Foco',
  description: 'Acompanhe seu histórico de cálculos e progresso em saúde.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user calculations history
  const { data: calculations } = await supabase
    .from('calculations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-1 w-full py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <DashboardContent userId={user.id} initialCalculations={calculations || []} />
        </div>
      </main>
    </div>
  )
}
