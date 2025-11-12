"use client"
import { useState } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Vantagens from "@/components/vantagens"
import Especialidades from "@/components/especialidades"
import ComoFunciona from "@/components/como-funciona"
import Parceiros from "@/components/parceiros"
import TermosSection from "@/components/termos-section"
import Footer from "@/components/footer"
import PlansSection from "@/components/plans-section"
import TermosPage from "@/components/termos-page"

export default function Home() {
  const [termosPageOpen, setTermosPageOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <Vantagens />
      <Especialidades />
      <ComoFunciona />
      <PlansSection />
      <Parceiros onOpenTermos={() => setTermosPageOpen(true)} />
      <TermosSection onOpenTermos={() => setTermosPageOpen(true)} />
      <Footer />
      {termosPageOpen && <TermosPage onClose={() => setTermosPageOpen(false)} />}
    </main>
  )
}
