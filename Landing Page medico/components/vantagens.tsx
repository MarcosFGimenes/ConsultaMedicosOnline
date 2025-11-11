"use client"

import { Clock, Home, Car, Shield, Tag, Users } from "lucide-react"

const vantagens = [
  {
    icon: Clock,
    title: "24 horas por dia",
    description: "Consultas médicas especializadas a qualquer momento, 7 dias por semana.",
  },
  {
    icon: Home,
    title: "No conforto de casa",
    description: "Atendimento com especialistas onde você estiver.",
  },
  {
    icon: Car,
    title: "Sem deslocamentos",
    description: "Economize tempo e dinheiro sem precisar se deslocar.",
  },
  {
    icon: Shield,
    title: "Sem carência",
    description: "Use imediatamente após a contratação.",
  },
  {
    icon: Tag,
    title: "Preço acessível",
    description: "Planos que cabem no seu orçamento.",
  },
  {
    icon: Users,
    title: "Toda a família",
    description: "Cobertura para dependentes com histórico centralizado.",
  },
]

export default function Vantagens() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Vantagens do atendimento online</h2>
          <p className="mt-3 text-gray-600 text-lg">Cuidado médico especializado no conforto da sua casa</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vantagens.map((vantagem, index) => {
            const Icon = vantagem.icon
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{vantagem.title}</h3>
                <p className="mt-2 text-gray-600">{vantagem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
