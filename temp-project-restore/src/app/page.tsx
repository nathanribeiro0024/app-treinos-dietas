"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Dumbbell, 
  Apple, 
  Target, 
  Clock, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  Calendar,
  Calculator,
  Heart,
  Activity,
  Flame,
  Trophy,
  CheckCircle,
  Plus,
  Minus,
  Timer,
  BarChart3,
  Utensils,
  Droplets,
  Moon,
  Sun,
  AlertCircle,
  Star,
  CreditCard,
  Shield,
  Sparkles,
  Crown,
  Zap as Lightning,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react"

interface UserProfile {
  name: string
  age: number
  weight: number
  height: number
  gender: 'masculino' | 'feminino'
  goal: 'perder_peso' | 'ganhar_massa' | 'manter_forma' | 'definir'
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso'
  experience: 'iniciante' | 'intermediario' | 'avancado'
  bodyFat?: number
  injuries?: string[]
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: number
  muscle: string
  difficulty: 'fácil' | 'médio' | 'difícil'
  equipment: string
  instructions: string[]
  tips: string[]
  calories: number
  completed?: boolean
}

interface WorkoutPlan {
  name: string
  description: string
  duration: string
  frequency: string
  exercises: Exercise[]
  totalCalories: number
}

interface Meal {
  name: string
  time: string
  foods: Array<{
    name: string
    quantity: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

interface DietPlan {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  meals: Meal[]
  supplements?: string[]
}

interface WorkoutSession {
  date: string
  exercises: Array<{
    exerciseId: string
    completedSets: number
    weight?: number
    notes?: string
  }>
  duration: number
  caloriesBurned: number
}

interface ProgressData {
  weight: Array<{ date: string; value: number }>
  bodyFat: Array<{ date: string; value: number }>
  measurements: Array<{ date: string; chest: number; waist: number; arms: number; thighs: number }>
  workouts: WorkoutSession[]
}

export default function FitnessApp() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [activeTab, setActiveTab] = useState("pricing")
  const [currentExercise, setCurrentExercise] = useState<number>(0)
  const [restTimer, setRestTimer] = useState<number>(0)
  const [isResting, setIsResting] = useState<boolean>(false)
  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false)
  const [progress, setProgress] = useState<ProgressData>({
    weight: [],
    bodyFat: [],
    measurements: [],
    workouts: []
  })
  const [bmi, setBmi] = useState<number>(0)
  const [bmr, setBmr] = useState<number>(0)
  const [waterIntake, setWaterIntake] = useState<number>(0)
  const [dailyCalories, setDailyCalories] = useState<number>(0)
  const [isPremium, setIsPremium] = useState<boolean>(false)
  const [shareLink, setShareLink] = useState<string>("")
  const [showShareModal, setShowShareModal] = useState<boolean>(false)

  // Timer para descanso entre exercícios
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => prev - 1)
      }, 1000)
    } else if (restTimer === 0 && isResting) {
      setIsResting(false)
      // Notificação sonora (opcional) - com verificação de suporte
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Descanso terminado!', {
            body: 'Hora do próximo exercício!',
            icon: '/icon.svg'
          })
        } catch (error) {
          console.log('Notificação não suportada:', error)
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isResting, restTimer])

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  const calculateBMR = (profile: UserProfile) => {
    if (profile.gender === 'masculino') {
      return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
    } else {
      return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age)
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' }
    return { category: 'Obesidade', color: 'text-red-600' }
  }

  const handlePremiumPurchase = () => {
    setIsPremium(true)
    setActiveTab("profile")
    // Aqui você integraria com um sistema de pagamento real
    alert("🎉 Parabéns! Você agora tem acesso completo ao FitPlan Pro!")
  }

  const generateShareLink = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin
      const shareUrl = `${currentUrl}?ref=fitplan&utm_source=share&utm_medium=social&utm_campaign=fitness_transformation`
      setShareLink(shareUrl)
      setShowShareModal(true)
    }
  }

  const copyShareLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink)
        alert("✅ Link copiado! Compartilhe com seus amigos e familiares!")
      } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea')
        textArea.value = shareLink
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert("✅ Link copiado! Compartilhe com seus amigos e familiares!")
      }
    } catch (err) {
      console.error('Erro ao copiar:', err)
      alert("❌ Erro ao copiar link. Tente novamente.")
    }
  }

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(`🔥 Descobri o FitPlan Pro! Um app incrível para transformar o corpo com treinos e dietas personalizadas por apenas R$ 50! 💪

Mais de 1 milhão de pessoas já transformaram suas vidas!

Confira: ${shareLink}`)
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  const shareOnTelegram = () => {
    const message = encodeURIComponent(`🔥 FitPlan Pro - Transforme seu corpo por apenas R$ 50!

💪 Treinos personalizados
🍎 Dietas sob medida
📊 Acompanhamento completo

+1M pessoas já transformaram suas vidas!

${shareLink}`)
    window.open(`https://t.me/share/url?url=${shareLink}&text=${message}`, '_blank')
  }

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newProfile: UserProfile = {
      name: formData.get('name') as string,
      age: parseInt(formData.get('age') as string),
      weight: parseFloat(formData.get('weight') as string),
      height: parseInt(formData.get('height') as string),
      gender: formData.get('gender') as 'masculino' | 'feminino',
      goal: formData.get('goal') as UserProfile['goal'],
      activityLevel: formData.get('activityLevel') as UserProfile['activityLevel'],
      experience: formData.get('experience') as UserProfile['experience'],
      bodyFat: formData.get('bodyFat') ? parseFloat(formData.get('bodyFat') as string) : undefined
    }
    
    setProfile(newProfile)
    
    const calculatedBMI = calculateBMI(newProfile.weight, newProfile.height)
    const calculatedBMR = calculateBMR(newProfile)
    
    setBmi(calculatedBMI)
    setBmr(calculatedBMR)
    
    generateAdvancedWorkoutPlan(newProfile)
    generateAdvancedDietPlan(newProfile, calculatedBMR)
    setActiveTab("dashboard")
  }

  const generateAdvancedWorkoutPlan = (userProfile: UserProfile) => {
    const exerciseDatabase = {
      iniciante: {
        perder_peso: [
          {
            id: "1",
            name: "Caminhada Inclinada",
            sets: 1,
            reps: "25-30 min",
            rest: 120,
            muscle: "Cardio",
            difficulty: "fácil" as const,
            equipment: "Esteira",
            instructions: [
              "Ajuste a inclinação para 5-8%",
              "Mantenha velocidade confortável (5-6 km/h)",
              "Mantenha postura ereta",
              "Respire de forma controlada"
            ],
            tips: [
              "Comece com 20 min e aumente gradualmente",
              "Use tênis adequado para caminhada",
              "Hidrate-se durante o exercício"
            ],
            calories: 250
          },
          {
            id: "2",
            name: "Agachamento Livre",
            sets: 3,
            reps: "12-15",
            rest: 60,
            muscle: "Pernas",
            difficulty: "fácil" as const,
            equipment: "Peso corporal",
            instructions: [
              "Pés na largura dos ombros",
              "Desça até coxas paralelas ao chão",
              "Mantenha joelhos alinhados com os pés",
              "Suba controladamente"
            ],
            tips: [
              "Não deixe joelhos passarem da ponta dos pés",
              "Mantenha core contraído",
              "Olhe para frente durante o movimento"
            ],
            calories: 80
          },
          {
            id: "3",
            name: "Flexão de Braço (Joelhos)",
            sets: 3,
            reps: "8-12",
            rest: 60,
            muscle: "Peito",
            difficulty: "fácil" as const,
            equipment: "Peso corporal",
            instructions: [
              "Apoie joelhos no chão",
              "Mãos na largura dos ombros",
              "Desça até peito quase tocar o chão",
              "Suba controladamente"
            ],
            tips: [
              "Mantenha corpo alinhado",
              "Não arqueie as costas",
              "Controle a descida"
            ],
            calories: 60
          },
          {
            id: "4",
            name: "Prancha",
            sets: 3,
            reps: "30-45s",
            rest: 60,
            muscle: "Core",
            difficulty: "médio" as const,
            equipment: "Peso corporal",
            instructions: [
              "Apoie antebraços e pontas dos pés",
              "Mantenha corpo reto",
              "Contraia abdômen",
              "Respire normalmente"
            ],
            tips: [
              "Não deixe quadril subir ou descer",
              "Olhe para o chão",
              "Comece com 20s se necessário"
            ],
            calories: 40
          },
          {
            id: "5",
            name: "Mountain Climbers",
            sets: 3,
            reps: "20-30",
            rest: 60,
            muscle: "Full Body",
            difficulty: "médio" as const,
            equipment: "Peso corporal",
            instructions: [
              "Posição de prancha alta",
              "Alterne joelhos ao peito rapidamente",
              "Mantenha quadril estável",
              "Respire de forma controlada"
            ],
            tips: [
              "Mantenha core contraído",
              "Não balance o quadril",
              "Comece devagar e acelere gradualmente"
            ],
            calories: 100
          }
        ],
        ganhar_massa: [
          {
            id: "6",
            name: "Agachamento com Peso",
            sets: 4,
            reps: "8-12",
            rest: 90,
            muscle: "Pernas",
            difficulty: "médio" as const,
            equipment: "Halteres",
            instructions: [
              "Segure halteres nas mãos",
              "Pés na largura dos ombros",
              "Desça controladamente",
              "Suba explosivamente"
            ],
            tips: [
              "Comece com peso leve",
              "Aumente carga progressivamente",
              "Mantenha técnica perfeita"
            ],
            calories: 120
          },
          {
            id: "7",
            name: "Supino com Halteres",
            sets: 4,
            reps: "8-12",
            rest: 90,
            muscle: "Peito",
            difficulty: "médio" as const,
            equipment: "Halteres + Banco",
            instructions: [
              "Deite no banco com halteres",
              "Braços perpendiculares ao corpo",
              "Desça controladamente",
              "Suba contraindo o peito"
            ],
            tips: [
              "Não trave os cotovelos",
              "Mantenha escápulas retraídas",
              "Controle o peso na descida"
            ],
            calories: 100
          }
        ]
      },
      intermediario: {
        perder_peso: [
          {
            id: "8",
            name: "HIIT na Bicicleta",
            sets: 1,
            reps: "20 min",
            rest: 120,
            muscle: "Cardio",
            difficulty: "difícil" as const,
            equipment: "Bicicleta ergométrica",
            instructions: [
              "Aquecimento: 3 min moderado",
              "30s alta intensidade + 90s recuperação",
              "Repita por 15 min",
              "Desaquecimento: 2 min leve"
            ],
            tips: [
              "Alta intensidade = 85-90% FC máx",
              "Recuperação = 60-70% FC máx",
              "Mantenha hidratação"
            ],
            calories: 350
          }
        ]
      }
    }

    const level = userProfile.experience
    const goal = userProfile.goal === 'definir' ? 'perder_peso' : userProfile.goal
    const exercises = exerciseDatabase[level]?.[goal] || exerciseDatabase.iniciante.ganhar_massa

    const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0)

    setWorkoutPlan({
      name: `Treino ${level.charAt(0).toUpperCase() + level.slice(1)} - ${goal.replace('_', ' ').toUpperCase()}`,
      description: `Plano desenvolvido por nossa equipe de especialistas baseado no seu perfil e objetivos`,
      duration: "45-60 min",
      frequency: "3-4x por semana",
      exercises,
      totalCalories
    })
  }

  const generateAdvancedDietPlan = (userProfile: UserProfile, bmr: number) => {
    const activityFactors = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      muito_intenso: 1.9
    }

    let calories = bmr * activityFactors[userProfile.activityLevel]

    switch (userProfile.goal) {
      case 'perder_peso':
      case 'definir':
        calories *= 0.85
        break
      case 'ganhar_massa':
        calories *= 1.15
        break
    }

    const protein = userProfile.weight * 2.2
    const fat = calories * 0.25 / 9
    const carbs = (calories - (protein * 4) - (fat * 9)) / 4
    const water = userProfile.weight * 35 // ml por kg

    const meals: Meal[] = [
      {
        name: "Café da Manhã",
        time: "07:00",
        foods: [
          { name: "Ovos mexidos", quantity: "2 unidades", calories: 140, protein: 12, carbs: 1, fat: 10 },
          { name: "Pão integral", quantity: "2 fatias", calories: 160, protein: 6, carbs: 30, fat: 2 },
          { name: "Abacate", quantity: "1/2 unidade", calories: 120, protein: 2, carbs: 6, fat: 11 },
          { name: "Café com leite", quantity: "1 xícara", calories: 80, protein: 4, carbs: 6, fat: 4 }
        ],
        totalCalories: 500,
        totalProtein: 24,
        totalCarbs: 43,
        totalFat: 27
      },
      {
        name: "Lanche da Manhã",
        time: "10:00",
        foods: [
          { name: "Iogurte grego", quantity: "150g", calories: 100, protein: 15, carbs: 6, fat: 0 },
          { name: "Granola", quantity: "2 colheres", calories: 120, protein: 3, carbs: 20, fat: 4 },
          { name: "Frutas vermelhas", quantity: "1/2 xícara", calories: 40, protein: 1, carbs: 10, fat: 0 }
        ],
        totalCalories: 260,
        totalProtein: 19,
        totalCarbs: 36,
        totalFat: 4
      },
      {
        name: "Almoço",
        time: "12:30",
        foods: [
          { name: "Peito de frango", quantity: "150g", calories: 250, protein: 46, carbs: 0, fat: 6 },
          { name: "Arroz integral", quantity: "1 xícara", calories: 220, protein: 5, carbs: 45, fat: 2 },
          { name: "Brócolis refogado", quantity: "1 xícara", calories: 55, protein: 4, carbs: 10, fat: 1 },
          { name: "Azeite extra virgem", quantity: "1 colher", calories: 120, protein: 0, carbs: 0, fat: 14 }
        ],
        totalCalories: 645,
        totalProtein: 55,
        totalCarbs: 55,
        totalFat: 23
      },
      {
        name: "Lanche Pré-Treino",
        time: "15:30",
        foods: [
          { name: "Banana", quantity: "1 unidade", calories: 90, protein: 1, carbs: 23, fat: 0 },
          { name: "Pasta de amendoim", quantity: "1 colher", calories: 95, protein: 4, carbs: 3, fat: 8 }
        ],
        totalCalories: 185,
        totalProtein: 5,
        totalCarbs: 26,
        totalFat: 8
      },
      {
        name: "Lanche Pós-Treino",
        time: "17:00",
        foods: [
          { name: "Whey protein", quantity: "1 scoop", calories: 120, protein: 25, carbs: 2, fat: 1 },
          { name: "Água de coco", quantity: "200ml", calories: 45, protein: 1, carbs: 11, fat: 0 }
        ],
        totalCalories: 165,
        totalProtein: 26,
        totalCarbs: 13,
        totalFat: 1
      },
      {
        name: "Jantar",
        time: "19:30",
        foods: [
          { name: "Salmão grelhado", quantity: "150g", calories: 280, protein: 42, carbs: 0, fat: 12 },
          { name: "Batata doce", quantity: "1 média", calories: 160, protein: 4, carbs: 37, fat: 0 },
          { name: "Aspargos", quantity: "1 xícara", calories: 40, protein: 4, carbs: 8, fat: 0 },
          { name: "Azeite", quantity: "1 colher", calories: 120, protein: 0, carbs: 0, fat: 14 }
        ],
        totalCalories: 600,
        totalProtein: 50,
        totalCarbs: 45,
        totalFat: 26
      }
    ]

    setDietPlan({
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      water: Math.round(water),
      meals,
      supplements: ["Whey Protein", "Creatina", "Ômega 3", "Multivitamínico"]
    })
  }

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds)
    setIsResting(true)
  }

  const completeExercise = (exerciseId: string) => {
    if (workoutPlan) {
      const updatedExercises = workoutPlan.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      )
      setWorkoutPlan({ ...workoutPlan, exercises: updatedExercises })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addWaterIntake = (amount: number) => {
    setWaterIntake(prev => prev + amount)
  }

  const addCalories = (amount: number) => {
    setDailyCalories(prev => prev + amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FitPlan Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">Seu Personal Trainer & Nutricionista Digital</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>+1M</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-orange-500" />
              <span>Resultados Comprovados</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Acesso Premium</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2" disabled={!isPremium}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2" disabled={!profile || !isPremium}>
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2" disabled={!profile || !isPremium}>
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Treino</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2" disabled={!profile || !isPremium}>
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Dieta</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2" disabled={!profile || !isPremium}>
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba Pricing */}
          <TabsContent value="pricing">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Section com Imagem */}
              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl overflow-hidden">
                <div className="relative">
                  {/* Imagem de fundo */}
                  <div className="absolute inset-0 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop&crop=center" 
                      alt="Pessoas fitness treinando" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="text-center py-12 relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Crown className="w-12 h-12 text-yellow-300" />
                      <CardTitle className="text-4xl font-bold">
                        Transforme Seu Corpo Hoje!
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xl text-blue-100 max-w-2xl mx-auto">
                      Acesso completo ao sistema mais avançado de fitness desenvolvido por especialistas, 
                      treinos profissionais e dietas sob medida para seus objetivos.
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>

              {/* Seção de Motivação com Imagens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop&crop=center" 
                      alt="Mulher forte fazendo exercício" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">💪 Força & Definição</h3>
                      <p className="text-sm">Treinos que transformam</p>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center" 
                      alt="Alimentos saudáveis coloridos" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">🥗 Nutrição Inteligente</h3>
                      <p className="text-sm">Dietas personalizadas</p>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center" 
                      alt="Homem atlético treinando" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">🏆 Resultados Reais</h3>
                      <p className="text-sm">Transformação garantida</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Pricing Card */}
              <div className="flex justify-center">
                <Card className="w-full max-w-md shadow-2xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50 relative overflow-hidden">
                  {/* Badge de Oferta */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    🔥 OFERTA LIMITADA
                  </div>
                  
                  <CardHeader className="text-center pt-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Lightning className="w-8 h-8 text-yellow-500" />
                      <CardTitle className="text-3xl font-bold text-gray-800">
                        FitPlan Pro
                      </CardTitle>
                    </div>
                    
                    {/* Preço */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl text-gray-400 line-through">R$ 197</span>
                        <Badge className="bg-red-500 text-white">-75% OFF</Badge>
                      </div>
                      <div className="text-6xl font-bold text-green-600">
                        R$ 50
                      </div>
                      <p className="text-gray-600">Acesso vitalício</p>
                      <p className="text-sm text-green-600 font-semibold">
                        💳 Parcelamos em até 12x no cartão sem juros
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Benefícios */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 text-center">✨ Tudo que você precisa:</h3>
                      <div className="space-y-3">
                        {[
                          { icon: "🎯", text: "Sistema personalizado para seus objetivos" },
                          { icon: "💪", text: "Treinos profissionais detalhados" },
                          { icon: "🍎", text: "Dietas personalizadas com macros" },
                          { icon: "📊", text: "Dashboard completo de progresso" },
                          { icon: "⏰", text: "Timer inteligente de descanso" },
                          { icon: "📱", text: "Acesso em qualquer dispositivo" },
                          { icon: "🏆", text: "Suporte técnico premium" },
                          { icon: "🔄", text: "Atualizações gratuitas para sempre" }
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-xl">{benefit.icon}</span>
                            <span className="text-gray-700">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Garantia */}
                    <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">Garantia de 30 dias</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Se não ficar satisfeito, devolvemos 100% do seu dinheiro!
                      </p>
                    </div>

                    {/* Botão de Compra */}
                    <Button 
                      onClick={handlePremiumPurchase}
                      className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <CreditCard className="w-6 h-6 mr-3" />
                      GARANTIR MINHA TRANSFORMAÇÃO
                    </Button>

                    {/* Botão de Compartilhar */}
                    <Button 
                      onClick={generateShareLink}
                      variant="outline"
                      className="w-full h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      COMPARTILHAR COM AMIGOS
                    </Button>

                    {/* Informações de Pagamento */}
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">
                        💳 Pagamento 100% seguro via PIX, cartão ou boleto
                      </p>
                      <p className="text-xs text-gray-400">
                        Acesso liberado imediatamente após confirmação
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Modal de Compartilhamento */}
              {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-md bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Compartilhe o FitPlan Pro
                      </CardTitle>
                      <CardDescription>
                        Ajude seus amigos a transformarem o corpo também!
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Link para copiar */}
                      <div className="space-y-2">
                        <Label>Link para compartilhar:</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={shareLink} 
                            readOnly 
                            className="text-sm"
                          />
                          <Button 
                            onClick={copyShareLink}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Botões de redes sociais */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Compartilhar em:</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            onClick={shareOnWhatsApp}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            📱 WhatsApp
                          </Button>
                          <Button 
                            onClick={shareOnTelegram}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            ✈️ Telegram
                          </Button>
                        </div>
                      </div>

                      {/* Botão fechar */}
                      <Button 
                        onClick={() => setShowShareModal(false)}
                        variant="outline"
                        className="w-full"
                      >
                        Fechar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Depoimentos com Imagens */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-purple-800">
                    ⭐ O que nossos usuários dizem:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Maria Silva",
                        text: "Perdi 12kg em 3 meses! O app é incrível e super fácil de usar.",
                        rating: "⭐⭐⭐⭐⭐",
                        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                      },
                      {
                        name: "João Santos",
                        text: "Ganhei massa muscular seguindo os treinos. Recomendo demais!",
                        rating: "⭐⭐⭐⭐⭐",
                        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                      },
                      {
                        name: "Ana Costa",
                        text: "Melhor investimento que já fiz na minha saúde. Vale cada centavo!",
                        rating: "⭐⭐⭐⭐⭐",
                        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                      }
                    ].map((testimonial, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-semibold text-gray-800 block">{testimonial.name}</span>
                            <span className="text-sm">{testimonial.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">"{testimonial.text}"</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Galeria de Transformações */}
              <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-orange-800">
                    🔥 Transformações Reais dos Nossos Usuários
                  </CardTitle>
                  <CardDescription className="text-center text-orange-600">
                    Veja os resultados incríveis que você também pode alcançar!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center",
                      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300&h=300&fit=crop&crop=center",
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop&crop=center",
                      "https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=300&h=300&fit=crop&crop=center"
                    ].map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <img 
                          src={image} 
                          alt={`Transformação ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
                          Resultado Real
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">❓ Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        q: "Como funciona o pagamento?",
                        a: "Pagamento único de R$ 50 via PIX, cartão ou boleto. Acesso liberado imediatamente."
                      },
                      {
                        q: "Posso usar em qualquer dispositivo?",
                        a: "Sim! Funciona perfeitamente no celular, tablet e computador."
                      },
                      {
                        q: "E se eu não gostar?",
                        a: "Oferecemos garantia de 30 dias. Se não ficar satisfeito, devolvemos seu dinheiro."
                      },
                      {
                        q: "Preciso de equipamentos caros?",
                        a: "Não! Temos treinos para todos os níveis, incluindo exercícios apenas com peso corporal."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b pb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{faq.q}</h4>
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Perfil */}
          <TabsContent value="profile">
            <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              {/* Header com imagem de fundo */}
              <div className="relative">
                <div className="absolute inset-0 opacity-30">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=200&fit=crop&crop=center" 
                    alt="Fitness background" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white rounded-t-lg relative z-10">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <User className="w-6 h-6" />
                    Crie seu Perfil Personalizado
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Preencha seus dados para receber treinos e dietas 100% personalizadas
                  </CardDescription>
                </CardHeader>
              </div>
              
              <CardContent className="p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-8">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Básicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                        <Input id="name" name="name" placeholder="Ex: João Silva" required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-sm font-medium">Idade</Label>
                        <Input id="age" name="age" type="number" placeholder="25" min="16" max="80" required className="h-12" />
                      </div>
                    </div>
                  </div>

                  {/* Medidas Corporais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Medidas Corporais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-sm font-medium">Peso (kg)</Label>
                        <Input id="weight" name="weight" type="number" placeholder="70.5" min="40" max="200" step="0.1" required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-sm font-medium">Altura (cm)</Label>
                        <Input id="height" name="height" type="number" placeholder="175" min="140" max="220" required className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">Sexo</Label>
                        <Select name="gender" required>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bodyFat" className="text-sm font-medium">% Gordura (opcional)</Label>
                        <Input id="bodyFat" name="bodyFat" type="number" placeholder="15" min="5" max="50" step="0.1" className="h-12" />
                      </div>
                    </div>
                  </div>

                  {/* Objetivos e Nível */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Objetivos e Experiência
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="goal" className="text-sm font-medium">Objetivo Principal</Label>
                        <Select name="goal" required>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Qual seu objetivo?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="perder_peso">🔥 Perder Peso e Queimar Gordura</SelectItem>
                            <SelectItem value="ganhar_massa">💪 Ganhar Massa Muscular</SelectItem>
                            <SelectItem value="manter_forma">⚖️ Manter Forma Física</SelectItem>
                            <SelectItem value="definir">✨ Definir e Tonificar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium">Experiência com Exercícios</Label>
                        <Select name="experience" required>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Qual seu nível?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iniciante">🌱 Iniciante (0-1 ano)</SelectItem>
                            <SelectItem value="intermediario">🏃 Intermediário (1-3 anos)</SelectItem>
                            <SelectItem value="avancado">🏆 Avançado (3+ anos)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Nível de Atividade */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Nível de Atividade Atual
                    </h3>
                    <div className="space-y-2">
                      <Select name="activityLevel" required>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Quão ativo você é no dia a dia?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentario">😴 Sedentário (trabalho de escritório, pouco exercício)</SelectItem>
                          <SelectItem value="leve">🚶 Leve (exercício 1-3 dias/semana)</SelectItem>
                          <SelectItem value="moderado">🏃 Moderado (exercício 3-5 dias/semana)</SelectItem>
                          <SelectItem value="intenso">💪 Intenso (exercício 6-7 dias/semana)</SelectItem>
                          <SelectItem value="muito_intenso">🔥 Muito Intenso (2x por dia ou trabalho físico)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg">
                    <Target className="w-5 h-5 mr-2" />
                    Gerar Meu Plano Personalizado
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Dashboard */}
          <TabsContent value="dashboard">
            {profile && (
              <div className="space-y-6">
                {/* Banner motivacional com imagem */}
                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 opacity-20">
                      <img 
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=300&fit=crop&crop=center" 
                        alt="Motivação fitness" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-8 relative z-10">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">💪 Vamos Treinar, {profile.name}!</h2>
                        <p className="text-green-100 text-lg">Sua jornada de transformação começa agora!</p>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        IMC (Índice de Massa Corporal)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
                      <p className={`text-sm ${getBMICategory(bmi).color.replace('text-', 'text-blue-')}`}>
                        {getBMICategory(bmi).category}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        TMB (Taxa Metabólica Basal)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{Math.round(bmr)}</div>
                      <p className="text-sm text-green-100">kcal/dia em repouso</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Água Hoje
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{waterIntake}ml</div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="secondary" onClick={() => addWaterIntake(250)} className="text-xs">
                          +250ml
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => addWaterIntake(500)} className="text-xs">
                          +500ml
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        Calorias Hoje
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dailyCalories}</div>
                      <p className="text-sm text-orange-100">
                        Meta: {dietPlan?.calories || 0} kcal
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Resumo do Perfil */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Olá, {profile.name}! 👋
                    </CardTitle>
                    <CardDescription>
                      Aqui está um resumo do seu perfil e recomendações personalizadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Seus Dados</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>📏 Altura: {profile.height}cm</p>
                          <p>⚖️ Peso: {profile.weight}kg</p>
                          <p>🎂 Idade: {profile.age} anos</p>
                          <p>⚧ Sexo: {profile.gender === 'masculino' ? 'Masculino' : 'Feminino'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Seu Objetivo</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>🎯 {profile.goal.replace('_', ' ').toUpperCase()}</p>
                          <p>💪 Nível: {profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)}</p>
                          <p>🏃 Atividade: {profile.activityLevel.charAt(0).toUpperCase() + profile.activityLevel.slice(1)}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Recomendações</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>🔥 {workoutPlan?.totalCalories || 0} kcal por treino</p>
                          <p>🍽️ {dietPlan?.calories || 0} kcal por dia</p>
                          <p>💧 {dietPlan?.water || 0}ml de água/dia</p>
                          <p>🏋️ {workoutPlan?.frequency || '3-4x'} por semana</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Aba Workout */}
          <TabsContent value="workout">
            {workoutPlan && (
              <div className="space-y-6">
                {/* Header do Treino com imagem */}
                <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-xl overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 opacity-30">
                      <img 
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop&crop=center" 
                        alt="Treino intenso" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Dumbbell className="w-6 h-6" />
                        {workoutPlan.name}
                      </CardTitle>
                      <CardDescription className="text-orange-100 text-lg">
                        {workoutPlan.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <Badge className="bg-white/20 text-white border-white/30">
                          ⏱️ {workoutPlan.duration}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30">
                          📅 {workoutPlan.frequency}
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30">
                          🔥 {workoutPlan.totalCalories} kcal
                        </Badge>
                      </div>
                    </CardHeader>
                  </div>
                </Card>

                {/* Timer de Descanso */}
                {isResting && (
                  <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Timer className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">Tempo de Descanso</h3>
                      </div>
                      <div className="text-6xl font-bold mb-4">{formatTime(restTimer)}</div>
                      <Button 
                        onClick={() => setIsResting(false)}
                        className="bg-white text-orange-600 hover:bg-gray-100"
                      >
                        Pular Descanso
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de Exercícios */}
                <div className="space-y-4">
                  {workoutPlan.exercises.map((exercise, index) => (
                    <Card key={exercise.id} className={`shadow-lg border-0 ${exercise.completed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              exercise.completed ? 'bg-green-500' : 'bg-blue-500'
                            }`}>
                              {exercise.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                            </div>
                            {exercise.name}
                            <Badge variant={exercise.difficulty === 'fácil' ? 'default' : exercise.difficulty === 'médio' ? 'secondary' : 'destructive'}>
                              {exercise.difficulty}
                            </Badge>
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">{exercise.muscle}</Badge>
                            <Badge variant="outline">🔥 {exercise.calories} kcal</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Informações do Exercício */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{exercise.sets}</div>
                            <div className="text-sm text-gray-600">Séries</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{exercise.reps}</div>
                            <div className="text-sm text-gray-600">Repetições</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{exercise.rest}s</div>
                            <div className="text-sm text-gray-600">Descanso</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{exercise.equipment}</div>
                            <div className="text-sm text-gray-600">Equipamento</div>
                          </div>
                        </div>

                        {/* Instruções */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Como Executar:
                          </h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            {exercise.instructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Dicas */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Dicas Importantes:
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {exercise.tips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-3 pt-4">
                          {!exercise.completed ? (
                            <>
                              <Button 
                                onClick={() => completeExercise(exercise.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar como Concluído
                              </Button>
                              <Button 
                                onClick={() => startRestTimer(exercise.rest)}
                                variant="outline"
                                className="flex-1"
                              >
                                <Timer className="w-4 h-4 mr-2" />
                                Iniciar Descanso ({exercise.rest}s)
                              </Button>
                            </>
                          ) : (
                            <Button disabled className="flex-1 bg-green-600">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Exercício Concluído!
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Aba Diet */}
          <TabsContent value="diet">
            {dietPlan && (
              <div className="space-y-6">
                {/* Header da Dieta com imagem */}
                <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 opacity-30">
                      <img 
                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=300&fit=crop&crop=center" 
                        alt="Alimentos saudáveis" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="relative z-10">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <Apple className="w-6 h-6" />
                        Seu Plano Nutricional Personalizado
                      </CardTitle>
                      <CardDescription className="text-green-100 text-lg">
                        Dieta balanceada baseada nos seus objetivos e necessidades
                      </CardDescription>
                    </CardHeader>
                  </div>
                </Card>

                {/* Resumo Nutricional */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <Flame className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{dietPlan.calories}</div>
                      <div className="text-sm text-blue-100">kcal/dia</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{dietPlan.protein}g</div>
                      <div className="text-sm text-red-100">Proteína</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{dietPlan.carbs}g</div>
                      <div className="text-sm text-yellow-100">Carboidratos</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{dietPlan.fat}g</div>
                      <div className="text-sm text-purple-100">Gorduras</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
                    <CardContent className="p-4 text-center">
                      <Droplets className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{dietPlan.water}</div>
                      <div className="text-sm text-cyan-100">ml água</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Refeições */}
                <div className="space-y-6">
                  {dietPlan.meals.map((meal, index) => (
                    <Card key={index} className="shadow-lg border-0 bg-white">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            {meal.name}
                            <Badge variant="outline">{meal.time}</Badge>
                          </CardTitle>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{meal.totalCalories} kcal</div>
                            <div className="text-sm text-gray-500">
                              P: {meal.totalProtein}g | C: {meal.totalCarbs}g | G: {meal.totalFat}g
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} className="p-4 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                  <Utensils className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">{food.name}</h4>
                                  <p className="text-sm text-gray-600">{food.quantity}</p>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Calorias:</span>
                                  <span className="font-semibold">{food.calories} kcal</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Proteína:</span>
                                  <span className="font-semibold">{food.protein}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Carboidratos:</span>
                                  <span className="font-semibold">{food.carbs}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Gordura:</span>
                                  <span className="font-semibold">{food.fat}g</span>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="w-full mt-3 bg-green-600 hover:bg-green-700"
                                onClick={() => addCalories(food.calories)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Consumido
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Suplementos */}
                {dietPlan.supplements && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-800">
                        <Sparkles className="w-5 h-5" />
                        Suplementos Recomendados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dietPlan.supplements.map((supplement, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-purple-100">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-semibold text-gray-800">{supplement}</h4>
                              <p className="text-sm text-gray-600 mt-1">Conforme orientação</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Aba Progress */}
          <TabsContent value="progress">
            <div className="space-y-6">
              {/* Header do Progresso */}
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <TrendingUp className="w-6 h-6" />
                    Acompanhe Seu Progresso
                  </CardTitle>
                  <CardDescription className="text-indigo-100 text-lg">
                    Registre suas medidas e veja sua evolução ao longo do tempo
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Formulário de Registro */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Registrar Medidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label>Peso (kg)</Label>
                      <Input type="number" placeholder="70.5" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label>% Gordura</Label>
                      <Input type="number" placeholder="15.0" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Peito (cm)</Label>
                      <Input type="number" placeholder="95" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cintura (cm)</Label>
                      <Input type="number" placeholder="80" />
                    </div>
                    <div className="space-y-2">
                      <Label>Braço (cm)</Label>
                      <Input type="number" placeholder="35" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Salvar Medidas
                  </Button>
                </CardContent>
              </Card>

              {/* Cards de Progresso */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Evolução do Peso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">-2.5 kg</div>
                    <p className="text-green-100">Últimos 30 dias</p>
                    <div className="mt-4 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">Gráfico em breve</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Treinos Realizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">12</div>
                    <p className="text-blue-100">Este mês</p>
                    <div className="mt-4 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">Gráfico em breve</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Meta do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">80%</div>
                    <p className="text-purple-100">Concluído</p>
                    <div className="mt-4 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">Progresso visual</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Histórico de Treinos */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Histórico de Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "Hoje", workout: "Treino de Pernas", duration: "45 min", calories: 320 },
                      { date: "Ontem", workout: "Treino de Peito", duration: "50 min", calories: 380 },
                      { date: "2 dias atrás", workout: "Cardio HIIT", duration: "30 min", calories: 250 }
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">{session.workout}</h4>
                          <p className="text-sm text-gray-600">{session.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">{session.duration}</div>
                          <div className="text-sm text-gray-600">{session.calories} kcal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}