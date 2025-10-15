import { api } from "./api"
import type { Proveedor } from "./types"

export const proveedoresService = {
  // ✅ Obtener todos
  getAll: async (): Promise<Proveedor[]> => {
    const token = localStorage.getItem("token")
    const res = await api.get("/proveedores", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data
  },

  // ✅ Crear
  create: async (data: Omit<Proveedor, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("token")
    const res = await api.post("/proveedores", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },

  // ✅ Actualizar
  update: async (id: number, data: Omit<Proveedor, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("token")
    const res = await api.put(`/proveedores/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },

  // ✅ Eliminar
  delete: async (id: number) => {
    const token = localStorage.getItem("token")
    const res = await api.delete(`/proveedores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}
