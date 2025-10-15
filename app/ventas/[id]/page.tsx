"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

interface DetalleVenta {
  id: number
  numero_factura: string
  fecha_venta: string
  subtotal: number
  iva: number
  total: number
  estado_dian: string
  cliente?: {
    nombre?: string
    identificacion?: string
  }
  detalles?: {
    producto?: string
    cantidad?: number
    precio_unitario?: number
    subtotal?: number
  }[]
}

export default function DetalleVentaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [venta, setVenta] = useState<DetalleVenta | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await api.get(`/ventas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setVenta(response.data.data || response.data)
      } catch (error) {
        console.error("Error al cargar detalle de venta:", error)
        setVenta(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVenta()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!venta) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-white">
          <p>No se encontró la venta solicitada.</p>
          <Button onClick={() => router.push("/ventas")} className="mt-4">
            Volver
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Factura {venta.numero_factura}
            </h1>
            <p className="text-gray-400 mt-2">
              Estado DIAN:{" "}
              <span
                className={`font-semibold ${
                  venta.estado_dian === "APROBADA"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {venta.estado_dian}
              </span>
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/ventas")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-md space-y-4">
          <p><strong>Cliente:</strong> {venta.cliente?.nombre || "Sin cliente"}</p>
          <p><strong>Identificación:</strong> {venta.cliente?.identificacion || "N/A"}</p>
          <p><strong>Fecha de venta:</strong> {new Date(venta.fecha_venta).toLocaleDateString("es-CO")}</p>
          <p><strong>Subtotal:</strong> ${venta.subtotal.toLocaleString("es-CO")}</p>
          <p><strong>IVA:</strong> ${venta.iva.toLocaleString("es-CO")}</p>
          <p><strong>Total:</strong> ${venta.total.toLocaleString("es-CO")}</p>
        </div>

        {venta.detalles && venta.detalles.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Productos</h2>
            <table className="w-full text-gray-300">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2">Producto</th>
                  <th className="py-2">Cantidad</th>
                  <th className="py-2">Precio Unitario</th>
                  <th className="py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalles.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-2">{item.producto}</td>
                    <td className="py-2">{item.cantidad}</td>
                    <td className="py-2">
                      ${item.precio_unitario?.toLocaleString("es-CO")}
                    </td>
                    <td className="py-2">
                      ${item.subtotal?.toLocaleString("es-CO") || ((item.cantidad || 0) * (item.precio_unitario || 0)).toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
