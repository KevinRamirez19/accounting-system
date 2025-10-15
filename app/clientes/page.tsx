"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { ClienteForm } from "@/app/clientes/ClienteForms"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { clientesService } from "@/lib/clientes-service"
import type { Cliente } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null)

  // --- Cargar clientes ---
  const fetchClientes = async () => {
    setLoading(true)
    try {
      const data = await clientesService.getAll()
      setClientes(data)
    } catch (error) {
      console.error("Error fetching clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  // --- Crear o Editar cliente ---
  const handleCreateOrEdit = async (data: Omit<Cliente, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingCliente) {
        await clientesService.update(editingCliente.id, data)
      } else {
        await clientesService.create(data)
      }
      await fetchClientes()
      setFormOpen(false)
      setEditingCliente(undefined)
    } catch (error) {
      console.error("Error creating/updating cliente:", error)
    }
  }

  // --- Editar cliente ---
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormOpen(true)
  }

  // --- Eliminar cliente ---
  const handleDelete = async () => {
    if (clienteToDelete) {
      try {
        await clientesService.delete(clienteToDelete)
        fetchClientes()
      } catch (error) {
        console.error("Error deleting cliente:", error)
      } finally {
        setDeleteDialogOpen(false)
        setClienteToDelete(null)
      }
    }
  }

  // --- Columnas de la tabla ---
  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "tipo_documento", label: "Tipo Documento" },
    { key: "numero_documento", label: "Número Documento" },
    { key: "direccion", label: "Dirección" },
    { key: "telefono", label: "Teléfono" },
    { key: "email", label: "Email" },
    {
      key: "actions",
      label: "Acciones",
      render: (cliente: Cliente) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(cliente)}
            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setClienteToDelete(cliente.id)
              setDeleteDialogOpen(true)
            }}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clientes</h1>
            <p className="text-gray-400 mt-2">Gestiona tu cartera de clientes</p>
          </div>
          <Button
            onClick={() => {
              setEditingCliente(undefined)
              setFormOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Tabla o Loader */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DataTable data={clientes} columns={columns} searchPlaceholder="Buscar clientes..." />
        )}

        {/* Formulario */}
        <ClienteForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditingCliente(undefined)
          }}
          onSubmit={handleCreateOrEdit}
          initialData={editingCliente}
        />

        {/* Confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-zinc-900 border-zinc-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
