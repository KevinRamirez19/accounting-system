import { api } from "./api"
import type { Cuenta, AsientoContable, BalanceGeneral, EstadoResultados } from "./types"

export const contabilidadService = {
  // Cuentas
  async getCuentas(): Promise<Cuenta[]> {
    const response = await api.get<Cuenta[]>("/cuentas")
    return response.data
  },

  async createCuenta(data: Omit<Cuenta, "id" | "created_at">): Promise<Cuenta> {
    const response = await api.post<Cuenta>("/cuentas", data)
    return response.data
  },

  // Asientos Contables
  async getAsientos(): Promise<AsientoContable[]> {
    const response = await api.get<AsientoContable[]>("/asientos-contables")
    return response.data
  },

  async createAsiento(data: Omit<AsientoContable, "id" | "created_at">): Promise<AsientoContable> {
    const response = await api.post<AsientoContable>("/asientos-contables", data)
    return response.data
  },

  // Reportes
  async getBalanceGeneral(): Promise<BalanceGeneral> {
    const response = await api.get<BalanceGeneral>("/reportes/balance-general")
    return response.data
  },

  async getEstadoResultados(): Promise<EstadoResultados> {
    const response = await api.get<EstadoResultados>("/reportes/estado-resultados")
    return response.data
  },
}
