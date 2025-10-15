"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react"
import type { PartidaContable, Cuenta } from "@/lib/types"

interface AsientoFormProps {
  cuentas: Cuenta[]
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function AsientoForm({ cuentas, onSubmit, onCancel }: AsientoFormProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    descripcion: "",
  })
  const [partidas, setPartidas] = useState<PartidaContable[]>([
    { cuenta_id: 0, tipo: "debe", monto: 0 },
    { cuenta_id: 0, tipo: "haber", monto: 0 },
  ])

  const addPartida = (tipo: "debe" | "haber") => {
    setPartidas([...partidas, { cuenta_id: 0, tipo, monto: 0 }])
  }

  const removePartida = (index: number) => {
    setPartidas(partidas.filter((_, i) => i !== index))
  }

  const updatePartida = (index: number, field: keyof PartidaContable, value: any) => {
    const newPartidas = [...partidas]
    newPartidas[index] = { ...newPartidas[index], [field]: value }
    setPartidas(newPartidas)
  }

  const totalDebe = partidas.filter((p) => p.tipo === "debe").reduce((sum, p) => sum + p.monto, 0)
  const totalHaber = partidas.filter((p) => p.tipo === "haber").reduce((sum, p) => sum + p.monto, 0)
  const isBalanced = totalDebe === totalHaber && totalDebe > 0

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBalanced) {
      alert("El asiento debe estar balanceado (Debe = Haber)")
      return
    }
    setShowPreview(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        partidas,
        total: totalDebe,
      })
    } catch (error) {
      console.error("Error submitting asiento:", error)
    } finally {
      setLoading(false)
    }
  }

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Vista Previa del Asiento</CardTitle>
            <CardDescription className="text-gray-400">Verifica los datos antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Fecha</p>
                <p className="text-white font-medium">{formData.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Descripción</p>
                <p className="text-white font-medium">{formData.descripcion}</p>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Debe</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Haber</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {partidas.map((partida, index) => {
                    const cuenta = cuentas.find((c) => c.id === partida.cuenta_id)
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-white">{cuenta?.nombre}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-right">
                          {partida.tipo === "debe" ? `$${partida.monto.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-right">
                          {partida.tipo === "haber" ? `$${partida.monto.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-zinc-800">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-white">Totales:</td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-blue-500">
                      ${totalDebe.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-blue-500">
                      ${totalHaber.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Asiento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handlePreview} className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Información del Asiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-gray-300">
                Fecha
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-gray-300">
                Descripción
              </Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del asiento"
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Partidas Contables</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => addPartida("debe")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Debe
              </Button>
              <Button
                type="button"
                onClick={() => addPartida("haber")}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Haber
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {partidas.map((partida, index) => (
            <div key={index} className="flex gap-3 items-end p-4 bg-zinc-800 rounded-lg">
              <div className="flex-1 space-y-2">
                <Label className="text-gray-300">Cuenta</Label>
                <select
                  value={partida.cuenta_id}
                  onChange={(e) => updatePartida(index, "cuenta_id", Number.parseInt(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white"
                >
                  <option value={0}>Seleccionar cuenta</option>
                  {cuentas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigo} - {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-32 space-y-2">
                <Label className="text-gray-300">Tipo</Label>
                <select
                  value={partida.tipo}
                  onChange={(e) => updatePartida(index, "tipo", e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white"
                >
                  <option value="debe">Debe</option>
                  <option value="haber">Haber</option>
                </select>
              </div>

              <div className="w-40 space-y-2">
                <Label className="text-gray-300">Monto</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={partida.monto}
                  onChange={(e) => updatePartida(index, "monto", Number.parseFloat(e.target.value))}
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              {partidas.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePartida(index)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <div className="flex gap-8">
              <div>
                <span className="text-sm text-gray-400">Total Debe:</span>
                <span className="ml-2 text-lg font-semibold text-blue-500">${totalDebe.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-gray-400">Total Haber:</span>
                <span className="ml-2 text-lg font-semibold text-green-500">${totalHaber.toLocaleString()}</span>
              </div>
            </div>
            <div>
              {isBalanced ? (
                <span className="text-sm text-green-500 font-medium">✓ Balanceado</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">✗ No balanceado</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!isBalanced} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Continuar
        </Button>
      </div>
    </form>
  )
}
