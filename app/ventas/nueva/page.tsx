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

interface Vehiculo {
  id: number
  marca: string
  modelo: string
  año: number
  color: string
  precio_venta: number
  stock: number
}

interface DetalleVenta {
  vehiculo_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [clienteId, setClienteId] = useState<number | "">("")
  const [detalles, setDetalles] = useState<DetalleVenta[]>([
    { vehiculo_id: "", cantidad: 1, precio_unitario: 0, subtotal: 0 },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, vehiculosRes] = await Promise.all([
          api.get("/clientes"),
          api.get("/vehiculos"),
        ])
        setClientes(clientesRes.data.data)
        setVehiculos(vehiculosRes.data.data)
      } catch (err) {
        console.error("Error al obtener datos:", err)
      }
    }
    fetchData()
  }, [])

  const handleAgregarFila = () => {
    setDetalles([
      ...detalles,
      { vehiculo_id: "", cantidad: 1, precio_unitario: 0, subtotal: 0 },
    ])
  }

  const handleDetalleChange = (
    index: number,
    field: keyof DetalleVenta,
    value: any
  ) => {
    const updated = [...detalles]
    const detalleActual = updated[index]

    if (field === "vehiculo_id") {
      const vehiculo = vehiculos.find((v) => v.id === Number(value))
      if (vehiculo) {
        updated[index] = {
          ...detalleActual,
          vehiculo_id: value,
          precio_unitario: vehiculo.precio_venta,
          subtotal: vehiculo.precio_venta * detalleActual.cantidad,
        }
      }
    } else if (field === "cantidad") {
      updated[index] = {
        ...detalleActual,
        cantidad: Number(value),
        subtotal: detalleActual.precio_unitario * Number(value),
      }
    } else if (field === "precio_unitario") {
      const nuevoPrecio = Number(value)
      updated[index] = {
        ...detalleActual,
        precio_unitario: nuevoPrecio,
        subtotal: nuevoPrecio * detalleActual.cantidad,
      }
    }

    setDetalles(updated)
  }

  const calcularTotales = () => {
    const subtotal = detalles.reduce((sum, d) => sum + d.subtotal, 0)
    const iva = subtotal * 0.19
    const total = subtotal + iva
    return { subtotal, iva, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { subtotal, iva, total } = calcularTotales()

      const payload = {
        cliente_id: clienteId,
        numero_factura: "FAC-" + Date.now(),
        fecha_venta: new Date().toISOString().split("T")[0],
        subtotal,
        iva,
        total,
        estado_dian: "Pendiente",
        detalles: detalles.map((d) => ({
          vehiculo_id: Number(d.vehiculo_id),
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
          subtotal: d.subtotal,
        })),
      }

      // 🔹 Guardar la venta
      const response = await api.post("/ventas", payload)
      const ventaId = response.data?.data?.id

      // ✅ Abrir factura PDF con token JWT
      if (ventaId) {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Usuario no autenticado")

        const facturaUrl = `${process.env.NEXT_PUBLIC_API_URL}/ventas/${ventaId}/factura-pdf?token=${token}`
        window.open(facturaUrl, "_blank")
      }

      alert("✅ Venta registrada correctamente")
      router.push("/ventas")
    } catch (error: any) {
      console.error("Error al registrar venta:", error)
      alert(`❌ Error al guardar la venta: ${error.message || error}`)
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
            <h2 className="text-xl font-semibold mb-3">
              Detalles de la venta
            </h2>
            {detalles.map((detalle, index) => (
              <div key={index} className="flex gap-3 mb-2">
                <select
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                  value={detalle.vehiculo_id}
                  onChange={(e) =>
                    handleDetalleChange(index, "vehiculo_id", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione un vehículo</option>
                  {vehiculos
                    .filter((v) => v.stock > 0)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.marca} {v.modelo} {v.año} - {v.color} (${v.precio_venta})
                      </option>
                    ))}
                </select>

                <input
                  type="number"
                  placeholder="Cantidad"
                  min={1}
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleDetalleChange(index, "cantidad", e.target.value)
                  }
                  className="w-24 p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Precio venta"
                  min={0}
                  value={detalle.precio_unitario}
                  onChange={(e) =>
                    handleDetalleChange(index, "precio_unitario", e.target.value)
                  }
                  className="w-36 p-2 bg-gray-800 border border-gray-700 rounded text-right"
                  required
                />

                <input
                  type="text"
                  value={`$${detalle.subtotal.toLocaleString()}`}
                  readOnly
                  className="w-36 p-2 bg-gray-700 border border-gray-600 rounded text-right"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              className="text-blue-500 hover:text-blue-400"
              onClick={handleAgregarFila}
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar vehículo
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
