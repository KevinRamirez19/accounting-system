"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Proveedor } from "@/lib/types"

interface ProveedorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Proveedor, "id" | "created_at" | "updated_at">, id?: number) => void
  proveedor?: Proveedor | null
}

export function ProveedorForm({ open, onClose, onSubmit, proveedor }: ProveedorFormProps) {
  const [nombre, setNombre] = useState("")
  const [nit, setNit] = useState("") // ✅ nuevo campo
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre || "")
      setNit(proveedor.nit || "")
      setEmail(proveedor.email || "")
      setTelefono(proveedor.telefono || "")
      setDireccion(proveedor.direccion || "")
    } else {
      setNombre("")
      setNit("")
      setEmail("")
      setTelefono("")
      setDireccion("")
    }
  }, [proveedor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(
      {
        nombre,
        nit, // ✅ incluir el NIT al enviar
        email,
        telefono,
        direccion,
      },
      proveedor?.id
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e1e2f] text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle>{proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Toyota Colombia S.A."
              className="bg-[#2a2a3b] text-white border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">NIT</label>
            <Input
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              placeholder="Ej: 900123456-1"
              className="bg-[#2a2a3b] text-white border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ventas@ejemplo.com"
              className="bg-[#2a2a3b] text-white border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <Input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+57 1 3456789"
              className="bg-[#2a2a3b] text-white border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Dirección</label>
            <Input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle 123 #45-67, Bogotá"
              className="bg-[#2a2a3b] text-white border-gray-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {proveedor ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
