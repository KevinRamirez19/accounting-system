"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react"
import type { CompraDetalle, Proveedor } from "@/lib/types"

interface CompraFormProps {
  proveedores: Proveedor[]
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function CompraForm({ proveedores, onSubmit, onCancel }: CompraFormProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    proveedor_id: "",
    fecha: new Date().toISOString().split("T")[0],
  })
  const [detalles, setDetalles] = useState<CompraDetalle[]>([
    { producto: "", cantidad: 1, precio_unitario: 0, subtotal: 0 },
  ])

  const addDetalle = () => {
    setDetalles([...detalles, { producto: "", cantidad: 1, precio_unitario: 0, subtotal: 0 }])
  }

  const removeDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const updateDetalle = (index: number, field: keyof CompraDetalle, value: any) => {
    const newDetalles = [...detalles]
    newDetalles[index] = { ...newDetalles[index], [field]: value }

    if (field === "cantidad" || field === "precio_unitario") {
      newDetalles[index].subtotal = newDetalles[index].cantidad * newDetalles[index].precio_unitario
    }

    setDetalles(newDetalles)
  }

  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0)

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault()
    setShowPreview(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        proveedor_id: Number.parseInt(formData.proveedor_id),
        detalles,
        total,
      })
    } catch (error) {
      console.error("Error submitting compra:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedProveedor = proveedores.find((p) => p.id === Number.parseInt(formData.proveedor_id))

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Vista Previa de Compra</CardTitle>
            <CardDescription className="text-gray-400">Verifica los datos antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Proveedor</p>
                <p className="text-white font-medium">{selectedProveedor?.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fecha</p>
                <p className="text-white font-medium">{formData.fecha}</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Detalles de Compra</h3>
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Producto</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Cantidad</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Precio Unit.</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-white">{detalle.producto}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-right">{detalle.cantidad}</td>
                        <td className="px-4 py-3 text-sm text-gray-300 text-right">
                          ${detalle.precio_unitario.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-white text-right font-medium">
                          ${detalle.subtotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-zinc-800">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-white">
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right text-lg font-bold text-green-500">
                        ${total.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
                    Confirmar Compra
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
          <CardTitle className="text-white">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proveedor" className="text-gray-300">
                Proveedor
              </Label>
              <select
                id="proveedor"
                value={formData.proveedor_id}
                onChange={(e) => setFormData({ ...formData, proveedor_id: e.target.value })}
                required
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

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
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Detalles de Compra</CardTitle>
            <Button type="button" onClick={addDetalle} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {detalles.map((detalle, index) => (
            <div key={index} className="flex gap-3 items-end p-4 bg-zinc-800 rounded-lg">
              <div className="flex-1 space-y-2">
                <Label className="text-gray-300">Producto</Label>
                <Input
                  value={detalle.producto}
                  onChange={(e) => updateDetalle(index, "producto", e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="w-24 space-y-2">
                <Label className="text-gray-300">Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) => updateDetalle(index, "cantidad", Number.parseInt(e.target.value))}
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="w-32 space-y-2">
                <Label className="text-gray-300">Precio Unit.</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={detalle.precio_unitario}
                  onChange={(e) => updateDetalle(index, "precio_unitario", Number.parseFloat(e.target.value))}
                  required
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              <div className="w-32 space-y-2">
                <Label className="text-gray-300">Subtotal</Label>
                <Input
                  value={`$${detalle.subtotal.toLocaleString()}`}
                  disabled
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
              </div>

              {detalles.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDetalle(index)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-zinc-800">
            <span className="text-lg font-semibold text-gray-300">Total:</span>
            <span className="text-2xl font-bold text-green-500">${total.toLocaleString()}</span>
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
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Continuar
        </Button>
      </div>
    </form>
  )
}
