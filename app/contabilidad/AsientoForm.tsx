"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Cuenta } from "@/lib/types"

interface AsientoFormProps {
  cuentas: Cuenta[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AsientoForm({ cuentas, onSubmit, onCancel }: AsientoFormProps) {
  const [codigo, setCodigo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fecha, setFecha] = useState("")
  const [partidas, setPartidas] = useState([
    { cuenta_id: "", debe: 0, haber: 0, descripcion: "" },
  ])
  const [totalDebe, setTotalDebe] = useState(0)
  const [totalHaber, setTotalHaber] = useState(0)

  // Recalcular totales cada vez que cambian las partidas
  useEffect(() => {
    const debe = partidas.reduce((sum, p) => sum + Number(p.debe || 0), 0)
    const haber = partidas.reduce((sum, p) => sum + Number(p.haber || 0), 0)
    setTotalDebe(debe)
    setTotalHaber(haber)
  }, [partidas])

  const handleAddPartida = () => {
    setPartidas([...partidas, { cuenta_id: "", debe: 0, haber: 0, descripcion: "" }])
  }

  const handleRemovePartida = (index: number) => {
    setPartidas(partidas.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: string, value: any) => {
    const newPartidas = [...partidas]
    // Convertimos a número puro, ignorando símbolos
    if (field === "debe" || field === "haber") {
      value = Number(value)
      if (isNaN(value)) value = 0
    }
    newPartidas[index] = { ...newPartidas[index], [field]: value }
    setPartidas(newPartidas)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!codigo.trim() || !descripcion.trim() || !fecha) {
      alert("Por favor completa todos los campos del asiento.")
      return
    }

    if (partidas.length === 0) {
      alert("Debes agregar al menos una partida contable.")
      return
    }

    if (totalDebe !== totalHaber) {
      alert("El Debe y el Haber no están balanceados.")
      return
    }

    onSubmit({
      codigo,
      descripcion,
      fecha,
      partidas: partidas.map((p) => ({
        cuenta_id: Number(p.cuenta_id),
        debe: Number(p.debe),
        haber: Number(p.haber),
        descripcion: p.descripcion || null,
      })),
    })
  }

  const balanceMessage = () => {
    if (totalDebe === totalHaber) return "✅ Balance correcto"
    if (totalDebe > totalHaber) return "⚠️ Hay más en Debe"
    return "⚠️ Hay más en Haber"
  }

  // Función para mostrar números como moneda
  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-zinc-900 border border-zinc-800 text-white">
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: AS-001"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Compra de equipos"
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Partidas Contables</h3>
        {partidas.map((partida, index) => (
          <Card key={index} className="bg-zinc-900 border border-zinc-800 text-white relative">
            <CardContent className="grid grid-cols-5 gap-3 pt-6">
              <div className="col-span-2">
                <Label>Cuenta</Label>
                <select
                  value={partida.cuenta_id}
                  onChange={(e) => handleChange(index, "cuenta_id", e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 text-white rounded-md p-2"
                >
                  <option value="">Seleccionar cuenta</option>
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigo} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Debe</Label>
                <Input
                  type="number"
                  min="0"
                  value={partida.debe}
                  onChange={(e) => handleChange(index, "debe", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label>Haber</Label>
                <Input
                  type="number"
                  min="0"
                  value={partida.haber}
                  onChange={(e) => handleChange(index, "haber", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemovePartida(index)}
                  className="border-zinc-600 text-gray-300 hover:bg-zinc-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="col-span-5">
                <Label>Descripción (opcional)</Label>
                <Input
                  value={partida.descripcion}
                  onChange={(e) => handleChange(index, "descripcion", e.target.value)}
                  placeholder="Detalle adicional"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            onClick={handleAddPartida}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Partida
          </Button>
          <span className="text-white font-semibold">
            {balanceMessage()} | Total Debe: {formatCurrency(totalDebe)} | Total Haber: {formatCurrency(totalHaber)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-zinc-600 text-gray-300 hover:bg-zinc-800"
        >
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Guardar Asiento
        </Button>
      </div>
    </form>
  )
}
