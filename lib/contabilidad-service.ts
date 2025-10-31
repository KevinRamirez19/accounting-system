import { api } from "./api"
import type { Cuenta, AsientoContable } from "./types"

export const contabilidadService = {
  // 🔹 Cuentas
  async getCuentas(): Promise<Cuenta[]> {
    const response = await api.get<Cuenta[]>("/cuentas")
    return response.data
  },

  async createCuenta(data: Omit<Cuenta, "id" | "created_at">): Promise<Cuenta> {
    const response = await api.post("/cuentas", data)
    return response.data.data
  },

  // 🔹 Asientos contables
  async getAsientos(): Promise<AsientoContable[]> {
    const response = await api.get("/asientos-contables")
    return response.data.data
  },

  async createAsiento(data: {
    codigo: string
    descripcion: string
    fecha: string
    compra_id?: number | null
    venta_id?: number | null
    partidas: {
      cuenta_id: number
      debe: number
      haber: number
      descripcion?: string | null
    }[]
  }): Promise<{ asiento: AsientoContable; mensajeBalance: string }> {
    // 🔹 Validación de balance en frontend
    const totalDebe = data.partidas.reduce((sum, p) => sum + Number(p.debe || 0), 0)
    const totalHaber = data.partidas.reduce((sum, p) => sum + Number(p.haber || 0), 0)
    let mensajeBalance = ""
    if (totalDebe > totalHaber) mensajeBalance = "Hay de más en el DEBE"
    else if (totalDebe < totalHaber) mensajeBalance = "Hay de más en el HABER"
    else mensajeBalance = "El asiento está balanceado ✅"

    // 🔹 Crear asiento con partidas
    const response = await api.post("/asientos-contables", {
      codigo: data.codigo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      compra_id: data.compra_id || null,
      venta_id: data.venta_id || null,
      partidas: data.partidas.map((p) => ({
        cuenta_id: p.cuenta_id,
        debe: p.debe,
        haber: p.haber,
        descripcion: p.descripcion || null,
      })),
    })

    const asiento: AsientoContable = response.data.data

    return { asiento, mensajeBalance }
  },

  // 🔹 Reportes
  async getBalanceGeneral(): Promise<any> {
    const response = await api.get("/reportes/balance-general")
    return response.data
  },

  async getEstadoResultados(): Promise<any> {
    const response = await api.get("/reportes/estado-resultados")
    return response.data
  },
}
