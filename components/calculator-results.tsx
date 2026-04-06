'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CalculationResult {
  type: 'bmi' | 'calories' | 'macros'
  input_data: Record<string, number | string>
  result_data: Record<string, number | string>
}

interface CalculatorResultsProps {
  result: CalculationResult
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

export default function CalculatorResults({ result }: CalculatorResultsProps) {
  if (result.type === 'bmi') {
    const bmi = result.result_data.bmi as number
    const category = result.result_data.category as string
    
    const categoryColor = 
      category === 'Abaixo do peso' ? '#ef4444' :
      category === 'Peso normal' ? '#10b981' :
      category === 'Sobrepeso' ? '#f59e0b' :
      '#dc2626'

    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Resultado de BMI</CardTitle>
          <CardDescription>Análise do Índice de Massa Corporal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Seu BMI</p>
                <p className="text-4xl font-bold text-foreground">{bmi.toFixed(1)}</p>
              </div>
              
              <div className="p-6 rounded-lg" style={{ backgroundColor: `${categoryColor}20`, borderLeft: `4px solid ${categoryColor}` }}>
                <p className="text-sm text-muted-foreground mb-2">Classificação</p>
                <p className="text-xl font-semibold" style={{ color: categoryColor }}>{category}</p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-muted space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Informações Inseridas</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm"><span className="font-semibold">Peso:</span> {result.input_data.weight} {result.input_data.unit === 'metric' ? 'kg' : 'lbs'}</p>
                  <p className="text-sm"><span className="font-semibold">Altura:</span> {result.input_data.height} {result.input_data.unit === 'metric' ? 'cm' : 'in'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Referências de BMI:</p>
                <div className="space-y-1 text-xs">
                  <p><span className="font-semibold text-red-500">Abaixo do peso:</span> &lt; 18.5</p>
                  <p><span className="font-semibold text-green-500">Peso normal:</span> 18.5 - 24.9</p>
                  <p><span className="font-semibold text-yellow-500">Sobrepeso:</span> 25 - 29.9</p>
                  <p><span className="font-semibold text-red-600">Obeso:</span> ≥ 30</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (result.type === 'calories') {
    const bmr = result.result_data.bmr as number
    const tdee = result.result_data.tdee as number

    const data = [
      { name: 'Gasto Basal (BMR)', value: bmr },
      { name: 'Gasto Total (TDEE)', value: tdee }
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Resultado de Calorias</CardTitle>
          <CardDescription>Análise do Gasto Calórico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-2">Gasto Basal (BMR)</p>
                <p className="text-4xl font-bold text-foreground">{Math.round(bmr)}</p>
                <p className="text-xs text-muted-foreground mt-2">kcal/dia (em repouso)</p>
              </div>
              
              <div className="p-6 rounded-lg bg-primary/10 border-l-4 border-primary">
                <p className="text-sm text-muted-foreground mb-2">Gasto Total (TDEE)</p>
                <p className="text-4xl font-bold text-primary">{Math.round(tdee)}</p>
                <p className="text-xs text-muted-foreground mt-2">kcal/dia (com atividade)</p>
              </div>
            </div>

            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-2">Para Perder Peso</p>
              <p className="text-lg font-semibold text-foreground">{Math.round(tdee - 500)}</p>
              <p className="text-xs text-muted-foreground mt-1">kcal/dia (-500)</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-2">Manutenção</p>
              <p className="text-lg font-semibold text-foreground">{Math.round(tdee)}</p>
              <p className="text-xs text-muted-foreground mt-1">kcal/dia</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-2">Para Ganhar Peso</p>
              <p className="text-lg font-semibold text-foreground">{Math.round(tdee + 500)}</p>
              <p className="text-xs text-muted-foreground mt-1">kcal/dia (+500)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (result.type === 'macros') {
    const protein = result.result_data.protein as number
    const carbs = result.result_data.carbs as number
    const fat = result.result_data.fat as number

    const data = [
      { name: 'Proteína', value: protein, percentage: ((protein * 4) / (result.input_data.calories as number) * 100).toFixed(1) },
      { name: 'Carboidratos', value: carbs, percentage: ((carbs * 4) / (result.input_data.calories as number) * 100).toFixed(1) },
      { name: 'Gordura', value: fat, percentage: ((fat * 9) / (result.input_data.calories as number) * 100).toFixed(1) }
    ]

    const pieData = [
      { name: 'Proteína', value: parseFloat(data[0].percentage) },
      { name: 'Carboidratos', value: parseFloat(data[1].percentage) },
      { name: 'Gordura', value: parseFloat(data[2].percentage) }
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu Resultado de Macronutrientes</CardTitle>
          <CardDescription>Análise da Distribuição de Macros para {result.input_data.calories} kcal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm text-muted-foreground">Proteína</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{protein.toFixed(1)}g</p>
                <p className="text-xs text-muted-foreground mt-1">{data[0].percentage}% das calorias</p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{carbs.toFixed(1)}g</p>
                <p className="text-xs text-muted-foreground mt-1">{data[1].percentage}% das calorias</p>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                <p className="text-sm text-muted-foreground">Gordura</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{fat.toFixed(1)}g</p>
                <p className="text-xs text-muted-foreground mt-1">{data[2].percentage}% das calorias</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value.toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold mb-4">Tipo de Dieta: {
              result.input_data.diet === 'balanced' ? 'Balanceada' :
              result.input_data.diet === 'lowcarb' ? 'Baixa em Carboidratos' :
              result.input_data.diet === 'highprotein' ? 'Alta em Proteína' :
              'Cetogênica'
            }</p>
            <p className="text-xs text-muted-foreground">
              Nota: Estes são valores recomendados e podem precisar de ajustes conforme sua resposta individual. Consulte um nutricionista para orientações personalizadas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
