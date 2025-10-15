"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Cliente } from "@/lib/types"

interface ClienteFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Cliente, "id" | "created_at" | "updated_at">) => void
  initialData?: Cliente
}

export function ClienteForm({ open, onClose, onSubmit, initialData }: ClienteFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    tipo_documento: "",
    numero_documento: "",
    email: "",
    telefono: "",
    direccion: "",
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        tipo_documento: initialData.tipo_documento || "",
        numero_documento: initialData.numero_documento || "",
        email: initialData.email || "",
        telefono: initialData.telefono || "",
        direccion: initialData.direccion || "",
      })
    } else {
      setForm({
        nombre: "",
        tipo_documento: "",
        numero_documento: "",
        email: "",
        telefono: "",
        direccion: "",
      })
    }
  }, [initialData])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Completa el formulario para agregar un cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo Documento */}
          <div className="space-y-2">
            <Label htmlFor="tipo_documento">Tipo de Documento</Label>
            <Select
              value={form.tipo_documento}
              onValueChange={(value) => handleChange("tipo_documento", value)}
            >
              <SelectTrigger id="tipo_documento" className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                <SelectItem value="NIT">NIT</SelectItem>
                <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Número Documento */}
          <div className="space-y-2">
            <Label htmlFor="numero_documento">Número de Documento</Label>
            <Input
              id="numero_documento"
              type="text"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={form.numero_documento}
              onChange={(e) => handleChange("numero_documento", e.target.value)}
              required
            />
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              type="text"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="text"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={form.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              type="text"
              className="bg-zinc-800 border-zinc-700 text-white"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="bg-zinc-800 border-zinc-700">
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
