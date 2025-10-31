"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehiculoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehiculoData) => void;
  initialData?: VehiculoData;
}

export interface VehiculoData {
  id?: number;
  proveedor_id: string;
  marca: string;
  modelo: string;
  año: string;
  color: string;
  placa: string;
  vin: string;
  precio_compra: string;
  precio_venta: string;
  estado: string;
  stock: string;
}

export const VehiculoForm: React.FC<VehiculoFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<VehiculoData>(
    initialData || {
      proveedor_id: "",
      marca: "",
      modelo: "",
      año: "",
      color: "",
      placa: "",
      vin: "",
      precio_compra: "",
      precio_venta: "",
      estado: "",
      stock: "",
    }
  );

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "proveedor_id" ||
      name === "precio_compra" ||
      name === "precio_venta" ||
      name === "stock" ||
      name === "año"
        ? Number(value)
        : value,
  }));
};


  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-gray-100 border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-white">
            {initialData ? "Editar Vehículo" : "Agregar Vehículo"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label>Proveedor ID</Label>
            <Input
              name="proveedor_id"
              value={formData.proveedor_id}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Marca</Label>
            <Input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Modelo</Label>
            <Input
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Año</Label>
            <Input
              name="año"
              value={formData.año}
              onChange={handleChange}
              type="number"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Color</Label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Placa</Label>
            <Input
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>VIN</Label>
            <Input
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Precio Compra</Label>
            <Input
              name="precio_compra"
              value={formData.precio_compra}
              onChange={handleChange}
              type="number"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label>Precio Venta</Label>
            <Input
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              type="number"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <select
  name="estado"
  value={formData.estado}
  onChange={handleChange}
  className="bg-gray-800 border-gray-600 text-white"
>
  <option value="">Selecciona estado</option>
  <option value="DISPONIBLE">DISPONIBLE</option>
  <option value="VENDIDO">VENDIDO</option>
  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
</select>

          <div>
            <Label>Stock</Label>
            <Input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              type="number"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {initialData ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
