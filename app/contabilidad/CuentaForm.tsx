"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface CuentaFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> // Promesa para poder usar await
}

export function CuentaForm({ open, onClose, onSubmit }: CuentaFormProps) {
  const [codigo, setCodigo] = useState("")
  const [nombre, setNombre] = useState("")
  const [tipo, setTipo] = useState("ACTIVO")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!codigo.trim() || !nombre.trim() || !tipo.trim()) {
      toast({
        title: "⚠️ Campos incompletos",
        description: "Por favor completa todos los campos antes de continuar.",
        className: "bg-yellow-600 text-white font-medium",
      })
      return
    }

    try {
      setLoading(true)
      await onSubmit({ codigo, nombre, tipo: tipo.toUpperCase() })

      toast({
        title: "✅ Cuenta creada con éxito",
        description: `La cuenta "${nombre}" se ha registrado correctamente.`,
        className: "bg-green-600 text-white font-medium",
      })

      setCodigo("")
      setNombre("")
      setTipo("ACTIVO")
      onClose() // Cierra el modal
    } catch (error) {
      console.error("Error al crear la cuenta:", error)
      toast({
        title: "❌ Error al guardar",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Nueva Cuenta Contable</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: 110505"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Caja General"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-2"
            >
              <option value="ACTIVO">Activo</option>
              <option value="PASIVO">Pasivo</option>
              <option value="PATRIMONIO">Patrimonio</option>
              <option value="INGRESO">Ingreso</option>
              <option value="GASTO">Gasto</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-gray-300 hover:bg-zinc-800"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
