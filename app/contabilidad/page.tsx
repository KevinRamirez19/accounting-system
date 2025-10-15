"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { CuentaForm } from "@/components/contabilidad/cuenta-form"
import { AsientoForm } from "@/components/contabilidad/asiento-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen, FileText } from "lucide-react"
import type { Cuenta, AsientoContable } from "@/lib/types"

export default function ContabilidadPage() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [asientos, setAsientos] = useState<AsientoContable[]>([])
  const [loading, setLoading] = useState(true)
  const [cuentaFormOpen, setCuentaFormOpen] = useState(false)
  const [showAsientoForm, setShowAsientoForm] = useState(false)

  useEffect(() => {
    // Mock data
    const mockCuentas: Cuenta[] = [
      { id: 1, codigo: "1001", nombre: "Caja", tipo: "activo", saldo: 50000 },
      { id: 2, codigo: "1002", nombre: "Bancos", tipo: "activo", saldo: 150000 },
      { id: 3, codigo: "2001", nombre: "Proveedores", tipo: "pasivo", saldo: 30000 },
      { id: 4, codigo: "4001", nombre: "Ventas", tipo: "ingreso", saldo: 200000 },
      { id: 5, codigo: "5001", nombre: "Gastos Operativos", tipo: "egreso", saldo: 45000 },
    ]

    const mockAsientos: AsientoContable[] = [
      {
        id: 1,
        fecha: "2025-01-15",
        descripcion: "Venta de mercancía",
        total: 10000,
        partidas: [
          { cuenta_id: 1, tipo: "debe", monto: 10000 },
          { cuenta_id: 4, tipo: "haber", monto: 10000 },
        ],
      },
    ]

    setCuentas(mockCuentas)
    setAsientos(mockAsientos)
    setLoading(false)
  }, [])

  const handleCreateCuenta = async (data: any) => {
    console.log("Nueva cuenta:", data)
    setCuentaFormOpen(false)
  }

  const handleCreateAsiento = async (data: any) => {
    console.log("Nuevo asiento:", data)
    setShowAsientoForm(false)
  }

  const cuentasColumns = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    {
      key: "tipo",
      label: "Tipo",
      render: (cuenta: Cuenta) => <span className="capitalize">{cuenta.tipo}</span>,
    },
    {
      key: "saldo",
      label: "Saldo",
      render: (cuenta: Cuenta) => `$${cuenta.saldo.toLocaleString()}`,
    },
  ]

  const asientosColumns = [
    { key: "id", label: "ID" },
    { key: "fecha", label: "Fecha" },
    { key: "descripcion", label: "Descripción" },
    {
      key: "total",
      label: "Total",
      render: (asiento: AsientoContable) => `$${asiento.total.toLocaleString()}`,
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
                <Button onClick={() => setCuentaFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cuenta
                </Button>
              </div>
              <DataTable data={cuentas} columns={cuentasColumns} searchPlaceholder="Buscar cuentas..." />
            </TabsContent>

            <TabsContent value="asientos" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowAsientoForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
