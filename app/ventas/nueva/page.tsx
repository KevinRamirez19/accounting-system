"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { ArrowLeft, Plus } from "lucide-react"

interface Cliente {
  id: number
  nombre: string
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteId, setClienteId] = useState<number | "">("")
  const [detalles, setDetalles] = useState([
    { producto: "", cantidad: 1, precio_unitario: 0 },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api
      .get("/clientes")
      .then((res) => setClientes(res.data.data))
      .catch((err) => console.error("Error al obtener clientes:", err))
  }, [])

  const handleAgregarFila = () => {
    setDetalles([...detalles, { producto: "", cantidad: 1, precio_unitario: 0 }])
  }

 type DetalleField = "producto" | "cantidad" | "precio_unitario"

const handleDetalleChange = (index: number, field: DetalleField, value: any) => {
  const updated = [...detalles]
  updated[index] = { ...updated[index], [field]: value }
  setDetalles(updated)
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        cliente_id: clienteId,
        detalles,
      }
      await api.post("/ventas", payload)
      alert("Venta registrada correctamente ✅")
      router.push("/ventas")
    } catch (error) {
      console.error("Error al registrar venta:", error)
      alert("Hubo un error al guardar la venta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Nueva Venta</h1>
          <Button
            variant="outline"
            className="text-gray-200 border-gray-600 hover:bg-gray-700"
            onClick={() => router.push("/ventas")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Cliente</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Detalles de la venta</h2>
            {detalles.map((detalle, index) => (
              <div key={index} className="flex gap-3 mb-2">
                <input
                  type="text"
                  placeholder="Producto"
                  value={detalle.producto}
                  onChange={(e) => handleDetalleChange(index, "producto", e.target.value)}
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(index, "cantidad", Number(e.target.value))}
                  className="w-24 p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={detalle.precio_unitario}
                  onChange={(e) => handleDetalleChange(index, "precio_unitario", Number(e.target.value))}
                  className="w-32 p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="text-blue-500 hover:text-blue-400"
              onClick={handleAgregarFila}
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar producto
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Guardando..." : "Registrar Venta"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}
