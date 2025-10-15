import { api } from "./api"
import type { LoginCredentials, RegisterData, AuthResponse } from "./types"

export const authService = {
  // 🟢 LOGIN
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials)

    // Laravel normalmente devuelve: { success, data: { access_token, user } }
    const { data } = response.data

    if (!data?.access_token) {
      throw new Error("No se recibió un token válido del servidor.")
    }

    const token = data.access_token
    const token_type = data.token_type ?? "Bearer"
    const user = data.user

    // Guardamos en localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))

    return { token, token_type, user }
  },

  // 🟢 REGISTRO
  async register(data: RegisterData): Promise<{ message: string }> {
    try {
      // Asegura que password_confirmation esté incluido
      const payload = {
        ...data,
        password_confirmation: data.password_confirmation ?? data.password,
      }

      const response = await api.post("/auth/register", payload)
      return response.data
    } catch (error: any) {
      console.error("❌ Error al registrar usuario:", error.response?.data || error)
      throw error
    }
  },

  // 🟢 LOGOUT
  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  // 🟢 OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem("token")
  },

  // 🟢 OBTENER USUARIO
  getUser(): any | null {
    try {
      const user = localStorage.getItem("user")

      if (!user || user === "undefined" || user === "null") {
        return null
      }

      return JSON.parse(user)
    } catch (error) {
      console.error("❌ Error al leer usuario del localStorage:", error)
      localStorage.removeItem("user") // Limpia si está corrupto
      return null
    }
  },

  // 🟢 GUARDAR TOKEN Y USUARIO MANUALMENTE
  setAuth(token: string, user: any) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
  },
}
