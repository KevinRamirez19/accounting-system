"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import type { BalanceGeneral } from "@/lib/types"

interface BalanceGeneralProps {
  data: BalanceGeneral
}

export function BalanceGeneralReport({ data }: BalanceGeneralProps) {
  const handleExportPDF = () => {
    console.log("Exportar a PDF")
    // Implement PDF export
  }

  const handleExportExcel = () => {
    console.log("Exportar a Excel")
    // Implement Excel export
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Balance General</CardTitle>
            <CardDescription className="text-gray-400">Estado de situación financiera</CardDescription>
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
        {/* Activos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Activos</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.activos.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-white">{item.cuenta}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 text-right">${item.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-white">Total Activos</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-blue-500">
                    ${data.total_activos.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Pasivos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Pasivos</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.pasivos.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-white">{item.cuenta}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 text-right">${item.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-white">Total Pasivos</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-amber-500">
                    ${data.total_pasivos.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Capital */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Capital</h3>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Cuenta</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.capital.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-white">{item.cuenta}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 text-right">${item.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-800">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-white">Total Capital</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-green-500">
                    ${data.total_capital.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Ecuación Contable */}
        <div className="p-4 bg-zinc-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Pasivo + Capital</span>
            <span className="text-xl font-bold text-white">
              ${(data.total_pasivos + data.total_capital).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-300">Activos</span>
            <span className="text-xl font-bold text-white">${data.total_activos.toLocaleString()}</span>
          </div>
          <div className="h-px bg-zinc-700 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Balance</span>
            <span
              className={`text-xl font-bold ${data.total_activos === data.total_pasivos + data.total_capital ? "text-green-500" : "text-red-500"}`}
            >
              {data.total_activos === data.total_pasivos + data.total_capital ? "✓ Balanceado" : "✗ No balanceado"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
