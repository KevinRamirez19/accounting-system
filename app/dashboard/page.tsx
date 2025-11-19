"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Users, Truck, TrendingUp, ShoppingCart } from "lucide-react"
import type { DashboardStats, ChartData } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No se encontró el token. Por favor inicia sesión.")

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://concesionario-app-783489219466.northamerica-northeast1.run.app/api"

        const [statsRes, chartRes] = await Promise.all([
          fetch(`${baseUrl}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
          fetch(`${baseUrl}/dashboard/chart`, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }),
        ])

        if (!statsRes.ok) {
          const text = await statsRes.text()
          throw new Error(`Error en stats API: ${statsRes.status} ${text}`)
        }

        if (!chartRes.ok) {
          const text = await chartRes.text()
          throw new Error(`Error en chart API: ${chartRes.status} ${text}`)
        }

        const statsData = await statsRes.json()
        const chartDataRes = await chartRes.json()

        // Asegurarnos de que los valores de ventas_mes y compras_mes existan
        const correctedStats: DashboardStats = {
          ...statsData.data,
          ventas_mes: statsData.data?.ventas_mes ?? statsData.data?.total_ventas ?? 0,
          compras_mes: statsData.data?.compras_mes ?? statsData.data?.total_compras ?? 0,
        }

        setStats(correctedStats)
        setChartData(chartDataRes.data || chartDataRes)
      } catch (err: any) {
        console.error("❌ Dashboard fetch error:", err)
        setError(err.message || "No se pudieron cargar los datos del dashboard.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Cargando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )

  if (error)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-400 text-center px-4">{error}</p>
        </div>
      </DashboardLayout>
    )

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Resumen general del sistema contable</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clientes"
            value={stats?.total_clientes ?? 0}
            icon={Users}
            iconColor="text-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Proveedores"
            value={stats?.total_proveedores ?? 0}
            icon={Truck}
            iconColor="text-purple-500"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Ventas del Mes"
            value={`$${(stats?.ventas_mes ?? 0).toLocaleString()}`}
            icon={TrendingUp}
            iconColor="text-green-500"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Compras del Mes"
            value={`$${(stats?.compras_mes ?? 0).toLocaleString()}`}
            icon={ShoppingCart}
            iconColor="text-amber-500"
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={chartData} />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen Financiero</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Ventas</span>
                <span className="text-white font-semibold">${(stats?.total_ventas ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Compras</span>
                <span className="text-white font-semibold">${(stats?.total_compras ?? 0).toLocaleString()}</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Balance</span>
                <span
                  className={`font-bold ${
                    ((stats?.total_ventas ?? 0) - (stats?.total_compras ?? 0)) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  ${((stats?.total_ventas ?? 0) - (stats?.total_compras ?? 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Accesos Rápidos</h3>
            <div className="space-y-2">
              <a
                href="/ventas"
                className="block p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-300 hover:text-white"
              >
                Nueva Venta
              </a>
              <a
                href="/compras"
                className="block p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-300 hover:text-white"
              >
                Nueva Compra
              </a>
              <a
                href="/clientes"
                className="block p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-300 hover:text-white"
              >
                Agregar Cliente
              </a>
              <a
                href="/reportes"
                className="block p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-300 hover:text-white"
              >
                Ver Reportes
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
