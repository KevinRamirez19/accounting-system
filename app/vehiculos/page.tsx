"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { vehiculosService } from "@/lib/vehiculos-service"
import type { Vehiculo } from "@/lib/types"
import { VehiculoForm, VehiculoData } from "./vehiculo-form"

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null)
  const [showForm, setShowForm] = useState(false)

  // 🔄 Obtener todos los vehículos
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

  // 💾 Guardar vehículo (crear o actualizar)
  const handleFormSubmit = async (data: VehiculoData) => {
    try {
      const payload = {
        ...data,
        proveedor_id: Number(data.proveedor_id),
        año: Number(data.año),
        precio_compra: Number(data.precio_compra),
        precio_venta: Number(data.precio_venta),
        stock: Number(data.stock),
      }

      if (data.id) {
        await vehiculosService.update(data.id, payload)
      } else {
        await vehiculosService.create(payload)
      }
      await fetchVehiculos()
    } catch (error) {
      console.error("Error al guardar vehículo:", error)
    } finally {
      setShowForm(false)
    }
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
      <div className="p-8 space-y-6 bg-[#0B0F19] min-h-screen text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vehículos</h1>
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
            open={showForm}
            onClose={() => setShowForm(false)}
            initialData={
              selectedVehiculo
                ? {
                    id: selectedVehiculo.id,
                    proveedor_id: selectedVehiculo.proveedor_id.toString(),
                    marca: selectedVehiculo.marca,
                    modelo: selectedVehiculo.modelo,
                    año: selectedVehiculo.año.toString(),
                    color: selectedVehiculo.color,
                    placa: selectedVehiculo.placa,
                    vin: selectedVehiculo.vin,
                    precio_compra: selectedVehiculo.precio_compra.toString(),
                    precio_venta: selectedVehiculo.precio_venta.toString(),
                    estado: selectedVehiculo.estado,
                    stock: selectedVehiculo.stock.toString(),
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
