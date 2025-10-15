"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BalanceGeneralReport } from "@/components/reportes/balance-general"
import { EstadoResultadosReport } from "@/components/reportes/estado-resultados"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, TrendingUp, Calendar, Download } from "lucide-react"
import type { BalanceGeneral, EstadoResultados } from "@/lib/types"

export default function ReportesPage() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    inicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    fin: new Date().toISOString().split("T")[0],
  })

  const [balanceGeneral, setBalanceGeneral] = useState<BalanceGeneral>({
    activos: [
      { cuenta: "Caja", monto: 50000 },
      { cuenta: "Bancos", monto: 150000 },
      { cuenta: "Cuentas por Cobrar", monto: 80000 },
      { cuenta: "Inventario", monto: 120000 },
    ],
    pasivos: [
      { cuenta: "Proveedores", monto: 30000 },
      { cuenta: "Cuentas por Pagar", monto: 45000 },
      { cuenta: "Préstamos Bancarios", monto: 100000 },
    ],
    capital: [
      { cuenta: "Capital Social", monto: 200000 },
      { cuenta: "Utilidades Retenidas", monto: 25000 },
    ],
    total_activos: 400000,
    total_pasivos: 175000,
    total_capital: 225000,
  })

  const [estadoResultados, setEstadoResultados] = useState<EstadoResultados>({
    ingresos: [
      { cuenta: "Ventas", monto: 500000 },
      { cuenta: "Servicios", monto: 150000 },
      { cuenta: "Otros Ingresos", monto: 25000 },
    ],
    egresos: [
      { cuenta: "Costo de Ventas", monto: 300000 },
      { cuenta: "Gastos Operativos", monto: 120000 },
      { cuenta: "Gastos Administrativos", monto: 80000 },
      { cuenta: "Gastos Financieros", monto: 15000 },
    ],
    total_ingresos: 675000,
    total_egresos: 515000,
    utilidad_neta: 160000,
  })

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleGenerateReport = () => {
    console.log("Generando reporte para:", dateRange)
    // Fetch data from API based on date range
  }

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
          <h1 className="text-3xl font-bold text-white">Reportes Contables</h1>
          <p className="text-gray-400 mt-2">Genera y exporta reportes financieros</p>
        </div>

        {/* Date Range Filter */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Filtrar por Período
            </CardTitle>
            <CardDescription className="text-gray-400">Selecciona el rango de fechas para los reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fecha-inicio" className="text-gray-300">
                  Fecha Inicio
                </Label>
                <Input
                  id="fecha-inicio"
                  type="date"
                  value={dateRange.inicio}
                  onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="fecha-fin" className="text-gray-300">
                  Fecha Fin
                </Label>
                <Input
                  id="fecha-fin"
                  type="date"
                  value={dateRange.fin}
                  onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                Generar Reportes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="balance" className="data-[state=active]:bg-zinc-800">
              <FileText className="w-4 h-4 mr-2" />
              Balance General
            </TabsTrigger>
            <TabsTrigger value="resultados" className="data-[state=active]:bg-zinc-800">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estado de Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance">
            <BalanceGeneralReport data={balanceGeneral} />
          </TabsContent>

          <TabsContent value="resultados">
            <EstadoResultadosReport data={estadoResultados} />
          </TabsContent>
        </Tabs>

        {/* Quick Export Options */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Exportación Rápida</CardTitle>
            <CardDescription className="text-gray-400">Descarga todos los reportes en un solo archivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                <FileText className="w-4 h-4 mr-2" />
                Exportar Todo a PDF
              </Button>
              <Button variant="outline" className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar Todo a Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
