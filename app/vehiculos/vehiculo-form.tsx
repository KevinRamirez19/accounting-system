"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { vehiculosService } from "@/lib/vehiculos-service"
import type { Vehiculo } from "@/lib/types"

interface VehiculoFormProps {
  vehiculo?: Vehiculo | null
  onClose: () => void
  onSubmit: () => void
}

// ✅ Exportación con nombre
export function VehiculoForm({ vehiculo, onClose, onSubmit }: VehiculoFormProps) {
  const [form, setForm] = useState<Vehiculo>(
    vehiculo || {
      id: 0,
      proveedor_id: 0,
      marca: "",
      modelo: "",
      año: new Date().getFullYear(),
      color: "",
      placa: "",
      vin: "",
      precio_compra: 0,
      precio_venta: 0,
      estado: "Disponible",
      stock: 1,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "precio_compra" ||
        name === "precio_venta" ||
        name === "año" ||
        name === "stock"
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (vehiculo) {
        await vehiculosService.update(vehiculo.id, form)
        alert("Vehículo actualizado ✅")
      } else {
        await vehiculosService.create(form)
        alert("Vehículo creado ✅")
      }
      onSubmit()
    } catch (error) {
      console.error("Error al guardar vehículo:", error)
      alert("Error al guardar vehículo ❌")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px] animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          {vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} required />
          <Input name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} required />
          <Input name="año" type="number" placeholder="Año" value={form.año} onChange={handleChange} required />
          <Input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
          <Input name="placa" placeholder="Placa" value={form.placa} onChange={handleChange} />
          <Input name="vin" placeholder="VIN" value={form.vin} onChange={handleChange} />
          <Input
            name="precio_compra"
            type="number"
            placeholder="Precio de compra"
            value={form.precio_compra}
            onChange={handleChange}
            required
          />
          <Input
            name="precio_venta"
            type="number"
            placeholder="Precio de venta"
            value={form.precio_venta}
            onChange={handleChange}
            required
          />
          <Input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
          <Input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-3 mt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
