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
import type { BalanceGeneral, EstadoResultados, AsientoContable, PartidaContable } from "@/lib/types"
import axios from "axios"

export default function ReportesPage() {
  const [loading, setLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    inicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    fin: new Date().toISOString().split("T")[0],
  })
  const [asientos, setAsientos] = useState<AsientoContable[]>([])
  const [balanceGeneral, setBalanceGeneral] = useState<BalanceGeneral>({
    activos: [],
    pasivos: [],
    capital: [],
    total_activos: 0,
    total_pasivos: 0,
    total_capital: 0,
  })
  const [estadoResultados, setEstadoResultados] = useState<EstadoResultados>({
    ingresos: [],
    egresos: [],
    total_ingresos: 0,
    total_egresos: 0,
    utilidad_neta: 0,
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  })

  // 🔹 Cargar asientos con partidas y cuentas
  useEffect(() => {
    if (!token) {
      alert("No se encontró token. Debes iniciar sesión.")
      setLoading(false)
      return
    }

    const fetchAsientos = async () => {
      try {
        const res = await api.get("/asientos?withPartidas=true")
        setAsientos(res.data.data || [])
      } catch (err) {
        console.error("Error al cargar asientos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAsientos()
  }, [token])

  // 🔹 Generar los reportes incluyendo contrapartida
  const handleGenerateReport = () => {
    setReportLoading(true)
    const start = dateRange.inicio
    const end = dateRange.fin

    const filteredAsientos = asientos.filter((a) => {
      const fecha = new Date(a.fecha).toISOString().split("T")[0]
      return fecha >= start && fecha <= end
    })

    const bg: BalanceGeneral = { activos: [], pasivos: [], capital: [], total_activos: 0, total_pasivos: 0, total_capital: 0 }
    const er: EstadoResultados = { ingresos: [], egresos: [], total_ingresos: 0, total_egresos: 0, utilidad_neta: 0 }

    filteredAsientos.forEach((asiento) => {
      asiento.partidas?.forEach((p: PartidaContable) => {
        if (!p?.cuenta?.tipo) return
        const tipo = p.cuenta.tipo.trim().toUpperCase()
        const debe = parseFloat(String(p.debe ?? "0"))
        const haber = parseFloat(String(p.haber ?? "0"))
        const contrapartida = p.contrapartida ?? asiento.descripcion ?? "—"
        let monto = 0

        switch (tipo) {
          case "ACTIVO":
            monto = debe - haber
            bg.activos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
            bg.total_activos += monto
            break
          case "PASIVO":
            monto = haber - debe
            bg.pasivos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
            bg.total_pasivos += monto
            break
          case "PATRIMONIO":
          case "CAPITAL":
            monto = haber - debe
            bg.capital.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
            bg.total_capital += monto
            break
          case "INGRESO":
            monto = haber - debe
            er.ingresos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
            er.total_ingresos += monto
            break
          case "EGRESO":
          case "GASTO":
            monto = debe - haber
            er.egresos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
            er.total_egresos += monto
            break
          default:
            console.warn("Tipo de cuenta desconocido:", tipo)
        }
      })
    })

    er.utilidad_neta = er.total_ingresos - er.total_egresos

    setBalanceGeneral(bg)
    setEstadoResultados(er)
    setReportLoading(false)
  }

  // 🔹 Descargar PDF o Excel
  const descargarLibroDiario = async (tipo: "pdf" | "excel") => {
    try {
      const response = await api.get(`/reportes/libro-diario/${tipo}`, {
        params: { fecha_inicio: dateRange.inicio, fecha_fin: dateRange.fin },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `libro_diario.${tipo === "pdf" ? "pdf" : "xlsx"}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Error al descargar archivo:", err)
      alert("No se pudo descargar el archivo. Verifica la ruta o el token.")
    }
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
          <p className="text-gray-400 mt-2">Genera y exporta reportes financieros con contrapartidas</p>
        </div>

        {/* 🔹 Filtro de fechas */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Filtrar por Período
            </CardTitle>
            <CardDescription className="text-gray-400">
              Selecciona el rango de fechas para los reportes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fecha-inicio" className="text-gray-300">Fecha Inicio</Label>
                <Input
                  id="fecha-inicio"
                  type="date"
                  value={dateRange.inicio}
                  onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="fecha-fin" className="text-gray-300">Fecha Fin</Label>
                <Input
                  id="fecha-fin"
                  type="date"
                  value={dateRange.fin}
                  onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <Button
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={reportLoading}
              >
                {reportLoading ? "Generando..." : "Generar Reportes"}
              </Button>

              <Button
                onClick={() => descargarLibroDiario("pdf")}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Descargar PDF
              </Button>

              <Button
                onClick={() => descargarLibroDiario("excel")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Descargar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 🔹 Tabs de Reportes */}
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
      </div>
    </DashboardLayout>
  )
}
