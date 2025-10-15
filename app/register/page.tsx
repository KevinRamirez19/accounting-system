"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { RegisterData } from "@/lib/types"

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: "",
    email: "",
    password: "",
    password_confirmation: "",
    rol: "usuario",
  })
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden")
      return
    }

    setShowPreview(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError("")

    try {
      await authService.register(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar usuario")
      setShowPreview(false)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">¡Registro Exitoso!</h2>
              <p className="text-gray-400">Las credenciales han sido enviadas a tu correo electrónico.</p>
              <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => setShowPreview(false)} className="mb-4 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Vista Previa</CardTitle>
              <CardDescription className="text-gray-400">Verifica los datos antes de confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-3 bg-zinc-800 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-400">Nombre</p>
                  <p className="text-white font-medium">{formData.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Correo Electrónico</p>
                  <p className="text-white font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rol</p>
                  <p className="text-white font-medium capitalize">{formData.rol}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                <p className="text-sm text-blue-400">
                  Las credenciales serán enviadas al correo electrónico proporcionado.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Confirmando...
                    </span>
                  ) : (
                    "Confirmar Registro"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sistema Contable</h1>
          <p className="text-gray-400">Crea tu cuenta</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Registro de Usuario</CardTitle>
            <CardDescription className="text-gray-400">Completa el formulario para crear tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreview} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-300">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-gray-300">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Continuar
              </Button>

              <div className="text-center text-sm text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-blue-500 hover:text-blue-400">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
