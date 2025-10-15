"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import type { EstadoResultados } from "@/lib/types"

interface EstadoResultadosProps {
  data: EstadoResultados
}

export function EstadoResultadosReport({ data }: EstadoResultadosProps) {
  const handleExportPDF = () => {
    console.log("Exportar a PDF")
  }

  const handleExportExcel = () => {
    console.log("Exportar a Excel")
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Estado de Resultados</CardTitle>
            <CardDescription className="text-gray-400">Ingresos y egresos del período</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              size="sm"
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              size="sm"
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ingresos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Ingresos</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.ingresos.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-white">{item.cuenta}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 text-right">${item.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-white">Total Ingresos</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-green-500">
                    ${data.total_ingresos.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Egresos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Egresos</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.egresos.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-white">{item.cuenta}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 text-right">${item.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-white">Total Egresos</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-red-500">
                    ${data.total_egresos.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Utilidad Neta */}
        <div className="p-6 bg-zinc-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Total Ingresos</span>
            <span className="text-lg font-semibold text-green-500">${data.total_ingresos.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300">Total Egresos</span>
            <span className="text-lg font-semibold text-red-500">-${data.total_egresos.toLocaleString()}</span>
          </div>
          <div className="h-px bg-zinc-700 my-4" />
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white">Utilidad Neta</span>
            <span className={`text-2xl font-bold ${data.utilidad_neta >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${data.utilidad_neta.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
