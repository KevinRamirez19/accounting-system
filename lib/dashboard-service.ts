import { api } from "./api"
import type { DashboardStats, ChartData } from "./types"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/dashboard")
    return response.data
  },

  async getChartData(): Promise<ChartData[]> {
    // This would come from your backend
    const response = await api.get<ChartData[]>("/dashboard/chart-data")
    return response.data
  },
}
