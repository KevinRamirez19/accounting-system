"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { proveedoresService } from "@/lib/proveedores-service"
import { ProveedorForm } from "@/app/proveedores/proveedor-form"
import type { Proveedor } from "@/lib/types"

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)

  const fetchProveedores = async () => {
    try {
      const data = await proveedoresService.getAll()
      setProveedores(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  const handleOpenModal = (proveedor?: Proveedor) => {
    setSelectedProveedor(proveedor || null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProveedor(null)
  }

  const handleSubmit = async (
    data: Omit<Proveedor, "id" | "created_at" | "updated_at">,
    id?: number
  ) => {
    try {
      if (id) {
        await proveedoresService.update(id, data)
        alert("Proveedor actualizado ✅")
      } else {
        await proveedoresService.create(data)
        alert("Proveedor creado ✅")
      }
      handleCloseModal()
      fetchProveedores()
    } catch (error) {
      console.error("Error al guardar proveedor:", error)
      alert("Error al guardar proveedor ❌")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return
    try {
      await proveedoresService.delete(id)
      setProveedores((prev) => prev.filter((p) => p.id !== id))
      alert("Proveedor eliminado ✅")
    } catch (error) {
      console.error("Error al eliminar proveedor:", error)
      alert("Error al eliminar proveedor ❌")
    }
  }

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "nit", label: "NIT" }, 
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "direccion", label: "Dirección" },
    {
      key: "actions",
      label: "Acciones",
      render: (proveedor: Proveedor) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
            onClick={() => handleOpenModal(proveedor)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            onClick={() => handleDelete(proveedor.id)}
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
            <h1 className="text-3xl font-bold text-white">Proveedores</h1>
            <p className="text-gray-400 mt-2">Gestiona tus proveedores</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleOpenModal()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        <DataTable
          data={proveedores}
          columns={columns}
          searchPlaceholder="Buscar proveedores..."
        />

        {/* 🔹 Modal de Crear/Editar */}
        <ProveedorForm
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          proveedor={selectedProveedor}
        />
      </div>
    </DashboardLayout>
  )
}
