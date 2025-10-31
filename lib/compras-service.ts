import { api } from "./api"
import type { Compra } from "./types"

// 🔐 Obtener headers con token
function getAuthHeader() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No hay token, inicia sesión primero")
  return { Authorization: `Bearer ${token}` }
}

// 🔒 Manejo de 401: limpiar token y redirigir al login
function handleUnauthorized() {
  localStorage.removeItem("token")
  alert("Tu sesión expiró o no estás autenticado. Por favor, inicia sesión de nuevo.")
  window.location.href = "/login"
}

export const comprasService = {
  // 📦 Obtener todas las compras
  async getAll(): Promise<Compra[]> {
    try {
      const res = await api.get("/compras", { headers: getAuthHeader() })
      return res.data.data || res.data
    } catch (error: any) {
      if (error.response?.status === 401) handleUnauthorized()
      throw error
    }
  },

  // 🔍 Obtener una compra por ID
  async getById(id: number): Promise<Compra> {
    try {
      const res = await api.get(`/compras/${id}`, { headers: getAuthHeader() })
      return res.data.data || res.data
    } catch (error: any) {
      if (error.response?.status === 401) handleUnauthorized()
      throw error
    }
  },

  // 📝 Crear una nueva compra
  async create(data: Omit<Compra, "id" | "created_at" | "updated_at">): Promise<Compra> {
    try {
      const res = await api.post("/compras", data, { headers: getAuthHeader() })
      return res.data.data || res.data
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.error("❌ Error de validación:", error.response.data.errors)
        alert("Error de validación. Revisa los campos obligatorios o repetidos.")
      } else if (error.response?.status === 401) {
        handleUnauthorized()
      } else {
        console.error("💥 Error al crear la compra:", error.response?.data || error)
      }
      throw error
    }
  },

  // ✏️ Actualizar una compra
  async update(id: number, data: Omit<Compra, "id" | "created_at" | "updated_at">): Promise<Compra> {
    try {
      const res = await api.put(`/compras/${id}`, data, { headers: getAuthHeader() })
      return res.data.data || res.data
    } catch (error: any) {
      if (error.response?.status === 401) handleUnauthorized()
      throw error
    }
  },

  // 🗑️ Eliminar una compra
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/compras/${id}`, { headers: getAuthHeader() })
    } catch (error: any) {
      if (error.response?.status === 401) handleUnauthorized()
      throw error
    }
  },
}
