import { api } from "./api"
import type { Vehiculo } from "./types"

export const vehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const token = localStorage.getItem("token")
    const res = await api.get("/vehiculos", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data || res.data
  },

  create: async (data: Omit<Vehiculo, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("token")
    const res = await api.post("/vehiculos", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },

  delete: async (id: number) => {
    const token = localStorage.getItem("token")
    const res = await api.delete(`/vehiculos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}
