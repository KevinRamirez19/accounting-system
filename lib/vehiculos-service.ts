import axios from "axios";
import { Vehiculo } from "@/lib/types";

const API_URL = "https://concesionario-app-783489219466.northamerica-northeast1.run.app/api/vehiculos"; // ajusta si es necesario

// 🧩 Configurar un cliente de axios con el token automáticamente
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o el nombre que uses al guardar el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
  const response = await api.get("/vehiculos");
  // 👇 si tu backend devuelve { data: [...] }
  return response.data.data || response.data;
},

  create: async (data: Omit<Vehiculo, "id" | "created_at" | "updated_at">) => {
    const response = await api.post("/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Vehiculo>) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};
