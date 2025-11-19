"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// 🧩 Validación con Zod
const compraSchema = z.object({
  proveedor_id: z.string().nonempty("Selecciona un proveedor"),
  fecha_compra: z.string().optional(),
  vehiculos: z
    .array(
      z.object({
        vehiculo_id: z.string().nonempty("Selecciona un vehículo"),
        cantidad: z.number().min(1, "Cantidad mínima 1"),
        precio_unitario: z.number().min(0, "Precio inválido"),
      })
    )
    .min(1, "Agrega al menos un vehículo"),
})

interface Proveedor {
  id: number
  nombre: string
}

interface Vehiculo {
  id: number
  nombre: string
  precio: number
}

interface CompraFormProps {
  proveedores: Proveedor[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CompraForm({ proveedores, onSubmit, onCancel }: CompraFormProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [selectedProveedor, setSelectedProveedor] = useState("")
  const [compraVehiculos, setCompraVehiculos] = useState<any[]>([])
  const [totales, setTotales] = useState({ subtotal: 0, iva: 0, total: 0 })
  const [loadingVehiculos, setLoadingVehiculos] = useState(true)

  // ✅ Cargar vehículos desde backend
  useEffect(() => {
    const token = localStorage.getItem("token")
    axios
      .get("https://concesionario-app-783489219466.northamerica-northeast1.run.app/api/vehiculos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const raw = res.data?.data ?? res.data ?? []
        const normalized: Vehiculo[] = raw.map((v: any) => ({
          id: Number(v.id),
          nombre: v.nombre ?? `${v.marca} ${v.modelo}`,
          precio: Number(v.precio_unitario ?? v.precio ?? 0),
        }))
        setVehiculos(normalized)
        setLoadingVehiculos(false)
      })
      .catch((err) => {
        console.error("Error al cargar vehículos:", err)
        setLoadingVehiculos(false)
      })
  }, [])

  // 🔹 Calcular totales
  useEffect(() => {
    const subtotal = compraVehiculos.reduce(
      (acc, v) => acc + (Number(v.cantidad) || 0) * (Number(v.precio_unitario) || 0),
      0
    )
    const iva = subtotal * 0.19
    const total = subtotal + iva
    setTotales({ subtotal, iva, total })
  }, [compraVehiculos])

  // ✅ Agregar vehículo
  const addVehiculo = () => {
    setCompraVehiculos((prev) => [...prev, { vehiculo_id: "", cantidad: 1, precio_unitario: 0 }])
  }

  // ✅ Quitar vehículo
  const removeVehiculo = (index: number) => {
    setCompraVehiculos((prev) => prev.filter((_, i) => i !== index))
  }

  // ✅ Actualizar vehículo
  const updateVehiculo = (index: number, field: string, value: any) => {
    setCompraVehiculos((prev) => {
      const updated = [...prev]
      if (field === "vehiculo_id") {
        const vehIdStr = String(value ?? "")
        updated[index] = { ...updated[index], vehiculo_id: vehIdStr }
        const veh = vehiculos.find((v) => String(v.id) === vehIdStr)
        updated[index].precio_unitario = veh ? veh.precio : 0
      } else if (field === "cantidad") {
        updated[index] = { ...updated[index], cantidad: Number(value) || 1 }
      } else if (field === "precio_unitario") {
        updated[index] = { ...updated[index], precio_unitario: Number(value) || 0 }
      }
      return updated
    })
  }

  // ✅ Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (compraVehiculos.length === 0) return alert("Agrega al menos un vehículo")

    const vehiculosParaValidar = compraVehiculos.map((v) => ({
      ...v,
      cantidad: Number(v.cantidad) || 0,
      precio_unitario: Number(v.precio_unitario) || 0,
    }))

    try {
      const validData = compraSchema.parse({
        proveedor_id: selectedProveedor,
        fecha_compra: new Date().toISOString().split("T")[0],
        vehiculos: vehiculosParaValidar,
      })

      onSubmit({
        ...validData,
        subtotal: totales.subtotal,
        iva: totales.iva,
        total: totales.total,
        numero_factura: "FAC-" + Date.now(),
        estado: "Completada",
      })
    } catch (err: any) {
      alert(err.errors?.map((e: any) => e.message).join("\n") || "Error en la validación")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 p-6 rounded-xl shadow-lg text-white"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Proveedor</label>
          <Select onValueChange={setSelectedProveedor} value={selectedProveedor}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Selecciona un proveedor" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800">
              {proveedores.map((p) =>
                p.id != null ? (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label>Fecha de compra</label>
          <Input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="bg-gray-800 border-gray-700"
            disabled
          />
        </div>
      </div>

      <div>
        <h2>Vehículos</h2>
        {compraVehiculos.map((v, i) => {
          const vehiculoSeleccionado = vehiculos.find((veh) => String(veh.id) === String(v.vehiculo_id))
          const subtotal = (Number(v.cantidad) || 0) * (Number(v.precio_unitario) || 0)

          return (
            <div key={i} className="grid grid-cols-5 gap-3 items-center mb-2">
              <Select
                onValueChange={(val) => updateVehiculo(i, "vehiculo_id", val)}
                value={v.vehiculo_id ?? ""}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecciona un vehículo">
                    {vehiculoSeleccionado?.nombre}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800">
                  {loadingVehiculos ? (
                    <SelectItem value="loading" disabled>
                      Cargando...
                    </SelectItem>
                  ) : (
                    vehiculos.map((veh) =>
                      veh.id != null ? (
                        <SelectItem key={veh.id} value={String(veh.id)}>
                          {veh.nombre} — {veh.precio}
                        </SelectItem>
                      ) : null
                    )
                  )}
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={v.cantidad || 0}
                onChange={(e) => updateVehiculo(i, "cantidad", Number(e.target.value))}
                className="bg-gray-800 border-gray-700"
                min={1}
              />
              <Input
                type="number"
                value={v.precio_unitario}
                onChange={(e) => updateVehiculo(i, "precio_unitario", e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <div>${subtotal.toFixed(2)}</div>
              <button
                type="button"
                onClick={() => removeVehiculo(i)}
                className="bg-red-600 px-2 py-1 rounded"
              >
                ❌
              </button>
            </div>
          )
        })}
        <Button type="button" onClick={addVehiculo} className="bg-blue-700">
          + Agregar vehículo
        </Button>
      </div>

      <div className="text-right space-y-1 mt-6 border-t border-gray-700 pt-4">
        <p>Subtotal: ${totales.subtotal.toFixed(2)}</p>
        <p>IVA: ${totales.iva.toFixed(2)}</p>
        <p>Total: ${totales.total.toFixed(2)}</p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" onClick={onCancel} className="bg-gray-700">
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600">
          Confirmar Compra
        </Button>
      </div>
    </form>
  )
}
