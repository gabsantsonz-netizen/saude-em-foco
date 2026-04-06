'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CalculatorResults from '@/components/calculator-results'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CalculationResult {
  type: 'bmi' | 'calories' | 'macros'
  input_data: Record<string, number | string>
  result_data: Record<string, number | string>
}

interface CalculatorFormProps {
  userId: string
  initialType?: string
}

export default function CalculatorForm({ userId, initialType = 'bmi' }: CalculatorFormProps) {
  const [activeTab, setActiveTab] = useState<'bmi' | 'calories' | 'macros'>(
    (initialType as 'bmi' | 'calories' | 'macros') || 'bmi'
  )
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  // BMI Form State
  const [bmiWeight, setBmiWeight] = useState('')
  const [bmiHeight, setBmiHeight] = useState('')
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric')

  // Calories Form State
  const [calWeight, setCalWeight] = useState('')
  const [calHeight, setCalHeight] = useState('')
  const [calAge, setCalAge] = useState('')
  const [calGender, setCalGender] = useState<'male' | 'female'>('male')
  const [calActivity, setCalActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryactive'>('moderate')
  const [calUnit, setCalUnit] = useState<'metric' | 'imperial'>('metric')

  // Macros Form State
  const [macroCalories, setMacroCalories] = useState('')
  const [macroDiet, setMacroDiet] = useState<'balanced' | 'lowcarb' | 'highprotein' | 'keto'>('balanced')

  const calculateBMI = () => {
    if (!bmiWeight || !bmiHeight) {
      alert('Por favor, preencha todos os campos')
      return
    }

    let weight = parseFloat(bmiWeight)
    let height = parseFloat(bmiHeight)

    if (bmiUnit === 'imperial') {
      weight = weight * 0.453592 // lbs to kg
      height = height * 0.0254 // inches to meters
    } else {
      height = height / 100 // cm to meters
    }

    const bmi = weight / (height * height)
    const category =
      bmi < 18.5 ? 'Abaixo do peso' :
      bmi < 25 ? 'Peso normal' :
      bmi < 30 ? 'Sobrepeso' :
      'Obeso'

    setResult({
      type: 'bmi',
      input_data: { weight: parseFloat(bmiWeight), height: parseFloat(bmiHeight), unit: bmiUnit },
      result_data: { bmi: parseFloat(bmi.toFixed(1)), category }
    })
  }

  const calculateCalories = () => {
    if (!calWeight || !calHeight || !calAge) {
      alert('Por favor, preencha todos os campos')
      return
    }

    let weight = parseFloat(calWeight)
    let height = parseFloat(calHeight)

    if (calUnit === 'imperial') {
      weight = weight * 0.453592
      height = height * 2.54
    }

    const age = parseFloat(calAge)

    // Mifflin-St Jeor Formula
    let bmr = 0
    if (calGender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryactive: 1.9
    }

    const tdee = bmr * activityMultipliers[calActivity]

    setResult({
      type: 'calories',
      input_data: { weight: parseFloat(calWeight), height: parseFloat(calHeight), age, gender: calGender, activity: calActivity },
      result_data: { bmr: parseFloat(bmr.toFixed(0)), tdee: parseFloat(tdee.toFixed(0)) }
    })
  }

  const calculateMacros = () => {
    if (!macroCalories) {
      alert('Por favor, preencha o campo de calorias')
      return
    }

    const calories = parseFloat(macroCalories)
    let protein, carbs, fat

    switch (macroDiet) {
      case 'lowcarb':
        protein = (calories * 0.35) / 4
        carbs = (calories * 0.25) / 4
        fat = (calories * 0.40) / 9
        break
      case 'highprotein':
        protein = (calories * 0.40) / 4
        carbs = (calories * 0.40) / 4
        fat = (calories * 0.20) / 9
        break
      case 'keto':
        protein = (calories * 0.25) / 4
        carbs = (calories * 0.05) / 4
        fat = (calories * 0.70) / 9
        break
      case 'balanced':
      default:
        protein = (calories * 0.30) / 4
        carbs = (calories * 0.45) / 4
        fat = (calories * 0.25) / 9
    }

    setResult({
      type: 'macros',
      input_data: { calories, diet: macroDiet },
      result_data: { protein: parseFloat(protein.toFixed(1)), carbs: parseFloat(carbs.toFixed(1)), fat: parseFloat(fat.toFixed(1)) }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Calculadoras</h1>
        <p className="text-muted-foreground">Calcule seu BMI, necessidade calórica e distribuição de macronutrientes</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'bmi' | 'calories' | 'macros')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bmi">BMI</TabsTrigger>
          <TabsTrigger value="calories">Calorias</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
        </TabsList>

        {/* BMI Calculator */}
        <TabsContent value="bmi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de BMI</CardTitle>
              <CardDescription>Calcule seu Índice de Massa Corporal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Field>
                      <FieldLabel htmlFor="bmi-unit">Unidade</FieldLabel>
                      <Select value={bmiUnit} onValueChange={(v) => setBmiUnit(v as 'metric' | 'imperial')}>
                        <SelectTrigger id="bmi-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metric">Métrico (kg, cm)</SelectItem>
                          <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <Field>
                  <FieldLabel htmlFor="bmi-weight">Peso ({bmiUnit === 'metric' ? 'kg' : 'lbs'})</FieldLabel>
                  <Input
                    id="bmi-weight"
                    type="number"
                    placeholder="70"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="bmi-height">Altura ({bmiUnit === 'metric' ? 'cm' : 'in'})</FieldLabel>
                  <Input
                    id="bmi-height"
                    type="number"
                    placeholder={bmiUnit === 'metric' ? '170' : '67'}
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
                  />
                </Field>

                <Button onClick={calculateBMI} className="w-full">
                  Calcular BMI
                </Button>
              </div>
            </CardContent>
          </Card>

          {result?.type === 'bmi' && <CalculatorResults result={result} />}
        </TabsContent>

        {/* Calories Calculator */}
        <TabsContent value="calories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Calorias</CardTitle>
              <CardDescription>Calcule sua necessidade calórica diária (TDEE)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Usa a fórmula Mifflin-St Jeor para calcular o gasto calórico basal e total.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="cal-unit">Unidade</FieldLabel>
                    <Select value={calUnit} onValueChange={(v) => setCalUnit(v as 'metric' | 'imperial')}>
                      <SelectTrigger id="cal-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Métrico</SelectItem>
                        <SelectItem value="imperial">Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="cal-gender">Gênero</FieldLabel>
                    <Select value={calGender} onValueChange={(v) => setCalGender(v as 'male' | 'female')}>
                      <SelectTrigger id="cal-gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="cal-weight">Peso ({calUnit === 'metric' ? 'kg' : 'lbs'})</FieldLabel>
                  <Input
                    id="cal-weight"
                    type="number"
                    placeholder="70"
                    value={calWeight}
                    onChange={(e) => setCalWeight(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cal-height">Altura ({calUnit === 'metric' ? 'cm' : 'in'})</FieldLabel>
                  <Input
                    id="cal-height"
                    type="number"
                    placeholder={calUnit === 'metric' ? '170' : '67'}
                    value={calHeight}
                    onChange={(e) => setCalHeight(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cal-age">Idade (anos)</FieldLabel>
                  <Input
                    id="cal-age"
                    type="number"
                    placeholder="25"
                    value={calAge}
                    onChange={(e) => setCalAge(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cal-activity">Nível de Atividade</FieldLabel>
                  <Select value={calActivity} onValueChange={(v) => setCalActivity(v as 'sedentary' | 'light' | 'moderate' | 'active' | 'veryactive')}>
                    <SelectTrigger id="cal-activity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                      <SelectItem value="light">Leve (exercício 1-3 dias/semana)</SelectItem>
                      <SelectItem value="moderate">Moderado (exercício 3-5 dias/semana)</SelectItem>
                      <SelectItem value="active">Ativo (exercício 6-7 dias/semana)</SelectItem>
                      <SelectItem value="veryactive">Muito Ativo (exercício 2x por dia)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button onClick={calculateCalories} className="w-full">
                  Calcular Calorias
                </Button>
              </div>
            </CardContent>
          </Card>

          {result?.type === 'calories' && <CalculatorResults result={result} />}
        </TabsContent>

        {/* Macros Calculator */}
        <TabsContent value="macros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Macronutrientes</CardTitle>
              <CardDescription>Distribua seu consumo calórico entre proteína, carboidrato e gordura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="macro-calories">Calorias Diárias</FieldLabel>
                  <Input
                    id="macro-calories"
                    type="number"
                    placeholder="2000"
                    value={macroCalories}
                    onChange={(e) => setMacroCalories(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="macro-diet">Tipo de Dieta</FieldLabel>
                  <Select value={macroDiet} onValueChange={(v) => setMacroDiet(v as 'balanced' | 'lowcarb' | 'highprotein' | 'keto')}>
                    <SelectTrigger id="macro-diet">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanceada (30P / 45C / 25G)</SelectItem>
                      <SelectItem value="lowcarb">Baixa em Carboidratos (35P / 25C / 40G)</SelectItem>
                      <SelectItem value="highprotein">Alta em Proteína (40P / 40C / 20G)</SelectItem>
                      <SelectItem value="keto">Cetogênica (25P / 5C / 70G)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Button onClick={calculateMacros} className="w-full">
                  Calcular Macros
                </Button>
              </div>
            </CardContent>
          </Card>

          {result?.type === 'macros' && <CalculatorResults result={result} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
