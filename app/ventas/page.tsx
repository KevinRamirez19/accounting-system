"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import { api } from "@/lib/api"

interface Venta {
  id: number
  numero_factura: string
  fecha_venta: string
  subtotal: number
  iva: number
  total: number
  estado_dian: string
  cliente?: { nombre?: string }
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await api.get("/ventas", {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Soporte tanto para { data: [...] } como para { ventas: [...] }
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.ventas || []

        setVentas(data)
      } catch (error) {
        console.error("❌ Error al cargar ventas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVentas()
  }, [])

  const handleVerDetalle = (id: number) => {
    router.push(`/ventas/${id}`)
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "numero_factura", label: "N° Factura" },
    {
      key: "cliente",
      label: "Cliente",
      render: (venta: Venta) => venta.cliente?.nombre || "Sin cliente",
    },
    {
      key: "fecha_venta",
      label: "Fecha de Venta",
      render: (venta: Venta) =>
        venta.fecha_venta
          ? new Date(venta.fecha_venta).toLocaleDateString("es-CO")
          : "—",
    },
    {
      key: "subtotal",
      label: "Subtotal",
      render: (venta: Venta) =>
        `$${venta.subtotal?.toLocaleString("es-CO")}`,
    },
    {
      key: "iva",
      label: "IVA",
      render: (venta: Venta) =>
        `$${venta.iva?.toLocaleString("es-CO")}`,
    },
    {
      key: "total",
      label: "Total",
      render: (venta: Venta) =>
        `$${venta.total?.toLocaleString("es-CO")}`,
    },
    { key: "estado_dian", label: "Estado DIAN" },
    {
      key: "actions",
      label: "Acciones",
      render: (venta: Venta) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
            onClick={() => handleVerDetalle(venta.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Ventas</h1>
            <p className="text-gray-400 mt-2">Gestiona tus facturas emitidas a clientes</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => router.push("/ventas/nueva")}
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </Button>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <DataTable
            data={ventas}
            columns={columns}
            searchPlaceholder="Buscar por cliente o número de factura..."
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
