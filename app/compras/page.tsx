"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { CompraForm } from "@/components/compras/compra-form"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import type { Compra, Proveedor } from "@/lib/types"

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    // Mock data
    const mockProveedores: Proveedor[] = [
      {
        id: 1,
        nombre: "Distribuidora XYZ",
        email: "contacto@xyz.com",
        telefono: "555-1000",
        direccion: "Zona Industrial 789",
      },
      {
        id: 2,
        nombre: "Importadora ABC",
        email: "ventas@abc.com",
        telefono: "555-2000",
        direccion: "Parque Industrial 321",
      },
    ]

    const mockCompras: Compra[] = [
      {
        id: 1,
        proveedor_id: 1,
        proveedor: mockProveedores[0],
        fecha: "2025-01-15",
        total: 45000,
        detalles: [
          { producto: "Producto A", cantidad: 10, precio_unitario: 2500, subtotal: 25000 },
          { producto: "Producto B", cantidad: 20, precio_unitario: 1000, subtotal: 20000 },
        ],
      },
    ]

    setProveedores(mockProveedores)
    setCompras(mockCompras)
    setLoading(false)
  }, [])

  const handleSubmit = async (data: any) => {
    console.log("Compra data:", data)
    setShowForm(false)
    // Refresh data
  }

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "proveedor",
      label: "Proveedor",
      render: (compra: Compra) => compra.proveedor?.nombre || "N/A",
    },
    { key: "fecha", label: "Fecha" },
    {
      key: "total",
      label: "Total",
      render: (compra: Compra) => `$${compra.total.toLocaleString()}`,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (compra: Compra) => (
        <Button size="sm" variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {!showForm ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Compras</h1>
                <p className="text-gray-400 mt-2">Gestiona tus compras a proveedores</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Compra
              </Button>
            </div>

            <DataTable data={compras} columns={columns} searchPlaceholder="Buscar compras..." />
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">Nueva Compra</h1>
            <CompraForm proveedores={proveedores} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
