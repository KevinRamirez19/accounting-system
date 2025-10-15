"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { vehiculosService } from "@/lib/vehiculos-service"
import type { Vehiculo } from "@/lib/types"
import { VehiculoForm } from "@/app/vehiculos/vehiculo-form" // ✅ import corregido

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)
  const [showForm, setShowForm] = useState(false)

  // 🧭 Obtener todos los vehículos
  const fetchVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll()
      setVehiculos(data)
    } catch (error) {
      console.error("Error al obtener vehículos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  // 🗑️ Eliminar vehículo
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return
    try {
      await vehiculosService.delete(id)
      setVehiculos((prev) => prev.filter((v) => v.id !== id))
      alert("Vehículo eliminado ✅")
    } catch (error) {
      console.error("Error al eliminar vehículo:", error)
      alert("Error al eliminar vehículo ❌")
    }
  }

  // ✏️ Editar vehículo
  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo)
    setShowForm(true)
  }

  // ➕ Crear vehículo nuevo
  const handleNew = () => {
    setSelectedVehiculo(null)
    setShowForm(true)
  }

  // 🔄 Actualizar lista después de guardar
  const handleFormSubmit = async () => {
    setShowForm(false)
    await fetchVehiculos()
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "año", label: "Año" },
    { key: "color", label: "Color" },
    { key: "placa", label: "Placa" },
    { key: "vin", label: "VIN" },
    {
      key: "precio_compra",
      label: "Precio Compra",
      render: (v: Vehiculo) => `$${v.precio_compra.toLocaleString()}`,
    },
    {
      key: "precio_venta",
      label: "Precio Venta",
      render: (v: Vehiculo) => `$${v.precio_venta.toLocaleString()}`,
    },
    { key: "estado", label: "Estado" },
    { key: "stock", label: "Stock" },
    {
      key: "actions",
      label: "Acciones",
      render: (v: Vehiculo) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-500 hover:bg-blue-500/10"
            onClick={() => handleEdit(v)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-500/10"
            onClick={() => handleDelete(v.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Vehículos</h1>
            <p className="text-gray-400 mt-2">Gestiona tu inventario de vehículos</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Vehículo
          </Button>
        </div>

        <DataTable data={vehiculos} columns={columns} searchPlaceholder="Buscar vehículos..." />

        {/* 🧾 Formulario modal (crear / editar) */}
        {showForm && (
          <VehiculoForm
            vehiculo={selectedVehiculo}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
