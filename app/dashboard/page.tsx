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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, using mock data
        // In production, uncomment these lines:
        // const statsData = await dashboardService.getStats()
        // const chartDataRes = await dashboardService.getChartData()

        // Mock data
        const statsData: DashboardStats = {
          total_clientes: 145,
          total_proveedores: 32,
          total_ventas: 1250000,
          total_compras: 850000,
          ventas_mes: 185000,
          compras_mes: 120000,
        }

        const chartDataRes: ChartData[] = [
          { name: "Ene", ventas: 45000, compras: 32000 },
          { name: "Feb", ventas: 52000, compras: 38000 },
          { name: "Mar", ventas: 48000, compras: 35000 },
          { name: "Abr", ventas: 61000, compras: 42000 },
          { name: "May", ventas: 55000, compras: 39000 },
          { name: "Jun", ventas: 67000, compras: 45000 },
        ]

        setStats(statsData)
        setChartData(chartDataRes)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
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
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Resumen general de tu sistema contable</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clientes"
            value={stats?.total_clientes || 0}
            icon={Users}
            iconColor="text-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Proveedores"
            value={stats?.total_proveedores || 0}
            icon={Truck}
            iconColor="text-purple-500"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Ventas del Mes"
            value={`$${(stats?.ventas_mes || 0).toLocaleString()}`}
            icon={TrendingUp}
            iconColor="text-green-500"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Compras del Mes"
            value={`$${(stats?.compras_mes || 0).toLocaleString()}`}
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
                <span className="text-white font-semibold">${(stats?.total_ventas || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Compras</span>
                <span className="text-white font-semibold">${(stats?.total_compras || 0).toLocaleString()}</span>
              </div>
              <div className="h-px bg-zinc-800" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Balance</span>
                <span className="text-green-500 font-bold">
                  ${((stats?.total_ventas || 0) - (stats?.total_compras || 0)).toLocaleString()}
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
