import { api } from "./api"
import type { Venta } from "./types"

export const ventasService = {
  async getAll(): Promise<Venta[]> {
    const response = await api.get<Venta[]>("/ventas")
    return response.data
  },

  async getById(id: number): Promise<Venta> {
    const response = await api.get<Venta>(`/ventas/${id}`)
    return response.data
  },

  async create(data: Omit<Venta, "id" | "created_at">): Promise<Venta> {
    const response = await api.post<Venta>("/ventas", data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/ventas/${id}`)
  },
}
