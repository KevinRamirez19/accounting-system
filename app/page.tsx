"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Estado para manejar el tema actual
  const themes = [
    { name: "Claro", bg: "#ffffff", color: "#000000" },
    { name: "Oscuro", bg: "#000000", color: "#ffffff" },
    { name: "Durazno", bg: "#FFDAB9", color: "#5a3e2b" },
  ]

  const [currentTheme, setCurrentTheme] = useState(0)

  // Aplica el tema seleccionado
  const applyTheme = (theme: { bg: string; color: string }) => {
    document.body.style.backgroundColor = theme.bg
    document.body.style.color = theme.color
  }

  // Cargar tema guardado
  useEffect(() => {
    const saved = localStorage.getItem("themeIndex")
    if (saved !== null) {
      const index = parseInt(saved)
      setCurrentTheme(index)
      applyTheme(themes[index])
    } else {
      applyTheme(themes[0]) // por defecto claro
    }
  }, [])

  // Cambio de tema al hacer clic
  const handleThemeChange = () => {
    const next = (currentTheme + 1) % themes.length
    setCurrentTheme(next)
    localStorage.setItem("themeIndex", next.toString())
    applyTheme(themes[next])
  }

  // Redirección según autenticación
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen transition-colors duration-500">
      {/* Botón de cambio de tema */}
      <button
        onClick={handleThemeChange}
        style={{
          position: "fixed",
          top: "15px",
          right: "15px",
          background: "#333",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 12px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Cambiar tema ({themes[currentTheme].name})
      </button>

      {/* Loader de inicio */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Cargando...</p>
      </div>
    </div>
  )
}
