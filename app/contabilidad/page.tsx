"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { CuentaForm } from "@/app/contabilidad/CuentaForm"
import { AsientoForm } from "@/app/contabilidad/AsientoForm"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, FileText } from "lucide-react"
import type { Cuenta, AsientoContable, PartidaContable } from "@/lib/types"
import axios from "axios"

export default function ContabilidadPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [asientos, setAsientos] = useState<AsientoContable[]>([])
  const [loading, setLoading] = useState(true)
  const [cuentaFormOpen, setCuentaFormOpen] = useState(false)
  const [showAsientoForm, setShowAsientoForm] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        alert("No se encontró token. Debes iniciar sesión.")
        setLoading(false)
        return
      }

      try {
        const [cuentasRes, asientosRes] = await Promise.all([
          api.get("/cuentas"),
          api.get("/asientos"),
        ])
        setCuentas(cuentasRes.data.data || [])
        setAsientos(asientosRes.data.data || [])

        console.log("📊 Asientos recibidos:", asientosRes.data.data)
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        alert("Error al cargar datos, revisa la consola")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleCreateCuenta = async (data: any) => {
    if (!token) return alert("No autorizado. Debes iniciar sesión.")

    try {
      await api.post("/cuentas", data)
      const res = await api.get("/cuentas")
      setCuentas(res.data.data || [])
      setCuentaFormOpen(false)
    } catch (err: any) {
      console.error("Error al crear cuenta:", err)
      alert("Error al crear cuenta")
    }
  }

  const handleCreateAsiento = async (data: any) => {
    if (!token) return alert("No autorizado. Debes iniciar sesión.")

    try {
      const payload = {
        codigo: data.codigo,
        descripcion: data.descripcion,
        fecha: data.fecha.split("T")[0],
        compra_id: data.compra_id || null,
        venta_id: data.venta_id || null,
        partidas: data.partidas.map((p: any) => ({
          cuenta_id: p.cuenta_id,
          debe: Number(p.debe) || 0,
          haber: Number(p.haber) || 0,
          descripcion: p.descripcion || "",
        })),
      }

      console.log("🧾 Payload enviado:", payload)

      await api.post("/asientos", payload)
      const res = await api.get("/asientos")
      setAsientos(res.data.data || [])

      setShowAsientoForm(false)
    } catch (err: any) {
      console.error("Error al crear asiento:", err)
      alert("Error al crear asiento contable. Revisa la consola.")
    }
  }

  const cuentasColumns = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    {
      key: "tipo",
      label: "Tipo",
      render: (cuenta: Cuenta) => <span className="capitalize">{cuenta.tipo}</span>,
    },
  ]

  const asientosColumns = [
    { key: "id", label: "ID" },
    {
      key: "fecha",
      label: "Fecha",
      render: (asiento: AsientoContable) => asiento.fecha?.split("T")[0] ?? "",
    },
    { key: "descripcion", label: "Descripción" },
    {
      key: "total",
      label: "Total Debe",
      render: (asiento: AsientoContable) => {
        const totalDebe =
          asiento.partidas?.reduce((sum: number, p: PartidaContable) => sum + Number(p.debe || 0), 0) || 0

        return `$${totalDebe.toLocaleString("es-CO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      },
    },
    {
      key: "totalHaber",
      label: "Total Haber",
      render: (asiento: AsientoContable) => {
        const totalHaber =
          asiento.partidas?.reduce((sum: number, p: PartidaContable) => sum + Number(p.haber || 0), 0) || 0

        return `$${totalHaber.toLocaleString("es-CO", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      },
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
        <div>
          <h1 className="text-3xl font-bold text-white">Contabilidad</h1>
          <p className="text-gray-400 mt-2">Gestiona cuentas y asientos contables</p>
        </div>

        {!showAsientoForm ? (
          <Tabs defaultValue="cuentas" className="space-y-6">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="cuentas" className="data-[state=active]:bg-zinc-800">
                <BookOpen className="w-4 h-4 mr-2" />
                Catálogo de Cuentas
              </TabsTrigger>
              <TabsTrigger value="asientos" className="data-[state=active]:bg-zinc-800">
                <FileText className="w-4 h-4 mr-2" />
                Asientos Contables
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cuentas" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setCuentaFormOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cuenta
                </Button>
              </div>
              <DataTable data={cuentas} columns={cuentasColumns} searchPlaceholder="Buscar cuentas..." />
            </TabsContent>

            <TabsContent value="asientos" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowAsientoForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Asiento
                </Button>
              </div>
              <DataTable data={asientos} columns={asientosColumns} searchPlaceholder="Buscar asientos..." />
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Asiento Contable</h2>
            <AsientoForm cuentas={cuentas} onSubmit={handleCreateAsiento} onCancel={() => setShowAsientoForm(false)} />
          </div>
        )}

        <CuentaForm open={cuentaFormOpen} onClose={() => setCuentaFormOpen(false)} onSubmit={handleCreateCuenta} />
      </div>
    </DashboardLayout>
  )
}
