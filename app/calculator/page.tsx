import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'
import CalculatorForm from '@/components/calculator-form'

export const metadata = {
  title: 'Calculadora | Saúde em Foco',
  description: 'Calculadora de BMI, calorias e macronutrientes para ajudar você em sua jornada de saúde.',
}

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const calculationType = params.type || 'bmi'

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <main className="flex-1 w-full py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <CalculatorForm userId={user.id} initialType={calculationType} />
        </div>
      </main>
    </div>
  )
}
