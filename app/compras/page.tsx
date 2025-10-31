"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { CompraForm } from "@/app/compras/compra-form"
import { Button } from "@/components/ui/button"
import { Plus, Eye, X } from "lucide-react"
import type { Compra, Proveedor, VehiculoCompra } from "@/lib/types"

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [facturaModal, setFacturaModal] = useState<Compra | null>(null)

  // ✅ Obtener token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ✅ Axios configurado con token
  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  })

  // ✅ Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasRes, proveedoresRes] = await Promise.all([
          api.get("/compras"),
          api.get("/proveedores"),
        ])
        setCompras(Array.isArray(comprasRes.data) ? comprasRes.data : comprasRes.data.data || [])
        setProveedores(
          Array.isArray(proveedoresRes.data)
            ? proveedoresRes.data
            : proveedoresRes.data.data || []
        )
      } catch (error: any) {
        console.error("❌ Error al cargar datos:", error.response?.data || error.message)
        if (error.response?.status === 401) {
          alert("⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.")
          localStorage.removeItem("token")
          window.location.href = "/login"
        } else {
          alert("Error al cargar los datos. Revisa la consola.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ✅ Guardar compra
  const handleSubmit = async (data: any) => {
    try {
      const subtotal = data.vehiculos.reduce(
        (sum: number, v: any) => sum + v.precio_unitario * v.cantidad,
        0
      )
      const iva = subtotal * 0.19
      const total = subtotal + iva

      const compraData = {
        ...data,
        numero_factura: "FAC-" + Date.now(),
        subtotal,
        iva,
        total,
        estado: "Completada",
        fecha_compra: data.fecha_compra || new Date().toISOString().slice(0, 10),
      }

      await api.post("/compras", compraData)

      const res = await api.get("/compras")
      setCompras(Array.isArray(res.data) ? res.data : res.data.data || [])
      setShowForm(false)
    } catch (error: any) {
      console.error("❌ Error al registrar la compra:", error.response?.data || error.message)
      alert("Error al registrar la compra.")
    }
  }

  // ✅ Columnas de la tabla
  const columns = [
    { key: "id", label: "ID" },
    {
      key: "proveedor",
      label: "Proveedor",
      render: (compra: Compra) => compra.proveedor?.nombre ?? "N/A",
    },
    {
      key: "fecha_compra",
      label: "Fecha",
      render: (compra: Compra) =>
        new Date(compra.fecha_compra ?? "").toISOString().slice(0, 10),
    },
    {
      key: "total",
      label: "Total",
      render: (compra: Compra) => `$${Number(compra.total ?? 0).toLocaleString()}`,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (compra: Compra) => (
        <Button
          size="sm"
          variant="ghost"
          className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
          onClick={() => setFacturaModal(compra)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  // ⏳ Pantalla de carga
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
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Compra
              </Button>
            </div>

            <DataTable data={compras} columns={columns} searchPlaceholder="Buscar compras..." />
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6">Nueva Compra</h1>
            <CompraForm
              proveedores={proveedores}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

       {/* 🔹 Modal para visualizar factura */}
{facturaModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-gray-900 text-white rounded-lg w-11/12 max-w-3xl p-6 relative shadow-2xl">
      {/* Botón cerrar */}
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        onClick={() => setFacturaModal(null)}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Encabezado */}
      <h2 className="text-2xl font-bold mb-4 text-blue-400">
        Factura {facturaModal.numero_factura ?? "N/A"}
      </h2>
      <div className="mb-4 space-y-1">
        <p>
          <strong>Proveedor:</strong> {facturaModal.proveedor?.nombre ?? "N/A"}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(facturaModal.fecha_compra ?? "").toLocaleDateString()}
        </p>
      </div>

      {/* Tabla de vehículos */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto border border-gray-700 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="border px-3 py-2">Vehículo</th>
              <th className="border px-3 py-2">Cantidad</th>
              <th className="border px-3 py-2">Precio Unitario</th>
              <th className="border px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {facturaModal.vehiculos?.map((v: VehiculoCompra, i: number) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
              >
                <td className="border px-3 py-1">{v.vehiculo?.marca} {v.vehiculo?.modelo}</td>
                <td className="border px-3 py-1">{v.cantidad ?? 0}</td>
                <td className="border px-3 py-1">${v.precio_unitario ?? 0}</td>
                <td className="border px-3 py-1">${(v.precio_unitario ?? 0) * (v.cantidad ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="text-right space-y-1 text-lg font-semibold">
        <p>Subtotal: ${facturaModal.subtotal ?? 0}</p>
        <p>IVA: ${facturaModal.iva ?? 0}</p>
        <p className="text-blue-400 text-xl">Total: ${facturaModal.total ?? 0}</p>
      </div>
    </div>
  </div>
)}
      </div>
    </DashboardLayout>
  )
}
