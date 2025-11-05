"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
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

  // 🔹 Generar reportes con contrapartidas reales
  const handleGenerateReport = () => {
    setReportLoading(true)

    const { inicio, fin } = dateRange

    const filteredAsientos = asientos.filter((a) => {
      const fecha = new Date(a.fecha).toISOString().split("T")[0]
      return fecha >= inicio && fecha <= fin
    })

    const bg: BalanceGeneral = { activos: [], pasivos: [], capital: [], total_activos: 0, total_pasivos: 0, total_capital: 0 }
    const er: EstadoResultados = { ingresos: [], egresos: [], total_ingresos: 0, total_egresos: 0, utilidad_neta: 0 }

    filteredAsientos.forEach((asiento) => {
      asiento.partidas?.forEach((p: PartidaContable) => {
        if (!p?.cuenta?.tipo || !p.cuenta?.nombre) return

        const tipo = p.cuenta.tipo.trim().toUpperCase()
        const debe = Number(p.debe ?? 0)
        const haber = Number(p.haber ?? 0)
        let monto = 0

        // 🧩 Crear contrapartidas reales (sin duplicados ni vacíos)
        const contrapartidasSet = new Set<string>()
        asiento.partidas?.forEach((x) => {
          if (x.cuenta?.nombre && x.cuenta.nombre !== p.cuenta?.nombre) {
            contrapartidasSet.add(x.cuenta.nombre)
          }
        })
        const contrapartida = Array.from(contrapartidasSet).join(" ↔ ") || "—"

        // 📊 Clasificar por tipo
        switch (tipo) {
          case "ACTIVO":
            monto = debe - haber
            if (monto !== 0) {
              bg.activos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
              bg.total_activos += monto
            }
            break
          case "PASIVO":
            monto = haber - debe
            if (monto !== 0) {
              bg.pasivos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
              bg.total_pasivos += monto
            }
            break
          case "PATRIMONIO":
          case "CAPITAL":
            monto = haber - debe
            if (monto !== 0) {
              bg.capital.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
              bg.total_capital += monto
            }
            break
          case "INGRESO":
            monto = haber - debe
            if (monto !== 0) {
              er.ingresos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
              er.total_ingresos += monto
            }
            break
          case "EGRESO":
          case "GASTO":
            monto = debe - haber
            if (monto !== 0) {
              er.egresos.push({ cuenta: p.cuenta.nombre, monto, contrapartida })
              er.total_egresos += monto
            }
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

  // 🔹 Render helper para tablas
  const renderTable = (title: string, items: any[], total: number) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="bg-zinc-800 text-gray-200">
              <th className="text-left px-4 py-2">Cuenta</th>
              <th className="text-left px-4 py-2">Contrapartida</th>
              <th className="text-right px-4 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, i) => (
                <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                  <td className="px-4 py-2">{item.cuenta}</td>
                  <td className="px-4 py-2 text-gray-400">{item.contrapartida || "—"}</td>
                  <td className="px-4 py-2 text-right text-blue-300">
                    {item.monto.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-3 text-gray-500 italic">
                  No hay registros en este período
                </td>
              </tr>
            )}
            <tr className="font-semibold bg-zinc-800">
              <td className="px-4 py-2">Total {title}</td>
              <td></td>
              <td className="px-4 py-2 text-right text-blue-400">
                {total.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

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
          <p className="text-gray-400 mt-2">Genera y exporta reportes financieros con contrapartidas reales</p>
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
                <Download className="w-4 h-4" /> PDF
              </Button>

              <Button
                onClick={() => descargarLibroDiario("excel")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Excel
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
            {renderTable("Activos", balanceGeneral.activos, balanceGeneral.total_activos)}
            {renderTable("Pasivos", balanceGeneral.pasivos, balanceGeneral.total_pasivos)}
            {renderTable("Capital", balanceGeneral.capital, balanceGeneral.total_capital)}
          </TabsContent>

          <TabsContent value="resultados">
            {renderTable("Ingresos", estadoResultados.ingresos, estadoResultados.total_ingresos)}
            {renderTable("Egresos", estadoResultados.egresos, estadoResultados.total_egresos)}
            <div className="mt-4 text-right font-semibold text-blue-400 text-lg">
              Utilidad Neta:{" "}
              {estadoResultados.utilidad_neta.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
