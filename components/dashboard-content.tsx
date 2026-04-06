'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Trash2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Calculation {
  id: string
  calculation_type: 'bmi' | 'calories' | 'macros'
  input_data: Record<string, number | string>
  result_data: Record<string, number | string>
  created_at: string
}

interface DashboardContentProps {
  userId: string
  initialCalculations: Calculation[]
}

export default function DashboardContent({ userId, initialCalculations }: DashboardContentProps) {
  const [calculations, setCalculations] = useState<Calculation[]>(initialCalculations)
  const [selectedTab, setSelectedTab] = useState('overview')

  const bmiCalculations = calculations
    .filter(c => c.calculation_type === 'bmi')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const calorieCalculations = calculations
    .filter(c => c.calculation_type === 'calories')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  const bmiChartData = bmiCalculations.map((calc, idx) => ({
    date: new Date(calc.created_at).toLocaleDateString('pt-BR'),
    bmi: calc.result_data.bmi,
    weight: calc.input_data.weight,
  }))

  const calorieChartData = calorieCalculations.map((calc, idx) => ({
    date: new Date(calc.created_at).toLocaleDateString('pt-BR'),
    bmr: calc.result_data.bmr,
    tdee: calc.result_data.tdee,
  }))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryBadge = (type: string) => {
    const badges = {
      bmi: <Badge variant="outline" className="bg-blue-50 text-blue-700">BMI</Badge>,
      calories: <Badge variant="outline" className="bg-green-50 text-green-700">Calorias</Badge>,
      macros: <Badge variant="outline" className="bg-orange-50 text-orange-700">Macros</Badge>
    }
    return badges[type as keyof typeof badges] || badges.bmi
  }

  const stats = {
    totalCalculations: calculations.length,
    bmiTracked: bmiCalculations.length,
    caloriesTracked: calorieCalculations.length,
    latestBmi: bmiCalculations[bmiCalculations.length - 1]?.result_data.bmi || null,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Seu Dashboard</h1>
        <p className="text-muted-foreground">Acompanhe seu histórico de cálculos e progresso</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cálculos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stats.totalCalculations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cálculos de BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.bmiTracked}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cálculos de Calorias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.caloriesTracked}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">BMI Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats.latestBmi ? stats.latestBmi.toFixed(1) : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de BMI</CardTitle>
              <CardDescription>Evolução do seu Índice de Massa Corporal</CardDescription>
            </CardHeader>
            <CardContent>
              {bmiChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bmiChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bmi" stroke="#3b82f6" name="BMI" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Nenhum cálculo de BMI ainda. <Link href="/calculator?type=bmi" className="text-primary hover:underline">Calcule agora</Link>.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendência de Calorias</CardTitle>
              <CardDescription>Evolução do seu Gasto Calórico</CardDescription>
            </CardHeader>
            <CardContent>
              {calorieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={calorieChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bmr" stroke="#10b981" name="BMR (Repouso)" />
                    <Line type="monotone" dataKey="tdee" stroke="#f59e0b" name="TDEE (Total)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Nenhum cálculo de calorias ainda. <Link href="/calculator?type=calories" className="text-primary hover:underline">Calcule agora</Link>.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {calculations.length > 0 ? (
            <div className="space-y-3">
              {calculations.map((calc) => (
                <Card key={calc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(calc.calculation_type)}
                          <p className="text-sm text-muted-foreground">{formatDate(calc.created_at)}</p>
                        </div>

                        {calc.calculation_type === 'bmi' && (
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">{calc.result_data.bmi?.toFixed(1)}</span>
                            {' '}
                            <span className="text-muted-foreground">({calc.result_data.category})</span>
                          </p>
                        )}

                        {calc.calculation_type === 'calories' && (
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">BMR: {calc.result_data.bmr}</span>
                            {' / '}
                            <span className="font-semibold text-foreground">TDEE: {calc.result_data.tdee}</span>
                            <span className="text-muted-foreground"> kcal</span>
                          </p>
                        )}

                        {calc.calculation_type === 'macros' && (
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">P: {calc.result_data.protein?.toFixed(0)}g</span>
                            {' / '}
                            <span className="font-semibold text-foreground">C: {calc.result_data.carbs?.toFixed(0)}g</span>
                            {' / '}
                            <span className="font-semibold text-foreground">G: {calc.result_data.fat?.toFixed(0)}g</span>
                          </p>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-4">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Nenhum cálculo realizado ainda</p>
                  <Link href="/calculator">
                    <Button>Fazer Primeiro Cálculo</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
              <CardDescription>Com base em seus cálculos recentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.latestBmi ? (
                <>
                  <div className="p-4 rounded-lg bg-muted space-y-2">
                    <p className="font-semibold text-sm text-foreground">Sobre seu BMI</p>
                    <p className="text-sm text-muted-foreground">
                      {stats.latestBmi < 18.5 && 'Seu BMI está abaixo do normal. Consulte um profissional de saúde para orientações nutricionais.'}
                      {stats.latestBmi >= 18.5 && stats.latestBmi < 25 && 'Parabéns! Seu BMI está dentro da faixa normal. Mantenha seus hábitos saudáveis.'}
                      {stats.latestBmi >= 25 && stats.latestBmi < 30 && 'Seu BMI está na faixa de sobrepeso. Considere aumentar a atividade física e revisar sua alimentação.'}
                      {stats.latestBmi >= 30 && 'Seu BMI está na faixa de obesidade. Procure orientação profissional para um plano personalizado.'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Realize cálculos para obter recomendações personalizadas.</p>
              )}

              <div className="p-4 rounded-lg bg-muted space-y-2">
                <p className="font-semibold text-sm text-foreground">Próximos Passos</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Use a calculadora regularmente para acompanhar sua evolução</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Combine a calculadora de calorias com a de macros para melhor planejamento</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Consulte produtos e suplementos recomendados na página inicial</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
