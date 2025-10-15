import { api } from "./api"
import type { Cliente } from "./types"

export const clientesService = {
  getAll: async (): Promise<Cliente[]> => {
    const token = localStorage.getItem("token")
    const res = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data
  },

  getById: async (id: number): Promise<Cliente> => {
    const token = localStorage.getItem("token")
    const res = await api.get(`/clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data.data
  },

  create: async (data: Omit<Cliente, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("token")

    // 👀 Mostramos los datos que se envían al backend
    console.log("📦 Enviando cliente al backend:", data)

    try {
      const res = await api.post("/clientes", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("✅ Cliente creado:", res.data)
      return res.data
    } catch (error: any) {
      // 🔥 Mostramos error detallado si la validación falla (422)
      if (error.response?.status === 422) {
        console.error("❌ Error de validación:", error.response.data.errors)
        alert("Error de validación. Revisa los campos obligatorios o repetidos.")
      } else {
        console.error("💥 Error al crear cliente:", error.response?.data || error)
      }
      throw error
    }
  },

  update: async (id: number, data: Omit<Cliente, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("token")
    const res = await api.put(`/clientes/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },

  delete: async (id: number) => {
    const token = localStorage.getItem("token")
    const res = await api.delete(`/clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}
