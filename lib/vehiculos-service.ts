import axios from "axios";
import { Vehiculo } from "@/lib/types";

const API_URL = "https://concesionario-app-783489219466.northamerica-northeast1.run.app/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Agregar timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const vehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const response = await api.get("/vehiculos");
    console.log("Vehiculos response:", response.data); // Para debug
    return response.data.data || response.data || [];
  },

  create: async (data: Omit<Vehiculo, "id" | "created_at" | "updated_at">) => {
    const response = await api.post("/vehiculos", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Vehiculo>) => {
    const response = await api.put(`/vehiculos/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },
};
