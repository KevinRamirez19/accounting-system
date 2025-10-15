import { api } from "./api"
import type { Compra } from "./types"

export const comprasService = {
  async getAll(): Promise<Compra[]> {
    const response = await api.get<Compra[]>("/compra")
    return response.data
  },

  async getById(id: number): Promise<Compra> {
    const response = await api.get<Compra>(`/compra/${id}`)
    return response.data
  },

  async create(data: Omit<Compra, "id" | "created_at">): Promise<Compra> {
    const response = await api.post<Compra>("/compra", data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/compra/${id}`)
  },
}
