export interface User {
  id: number
  nombre: string
  email: string
  rol?: string
  created_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nombre: string
  email: string
  password: string
  password_confirmation: string
  rol?: string
}

export interface AuthResponse {
  token: string
  user:{
    id: number
    nombre: string
    email: string
    rol?: string

  }
  acces_token: string
  token_type: string
  users: any
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface DashboardStats {
  total_clientes: number
  total_proveedores: number
  total_ventas: number
  total_compras: number
  ventas_mes: number
  compras_mes: number
}

export interface ChartData {
  name: string
  ventas: number
  compras: number
}

export interface Cliente {
  id: number
  nombre: string
  direccion: string
  tipo_documento: string
  numero_documento: string
  telefono: string
  email: string
}

export interface Proveedor {
  id: number
  nombre: string
  nit: string
  email: string
  telefono: string
  direccion: string
  created_at: string
  updated_at: string
}



export interface Vehiculo {
  id: number
  proveedor_id: number
  marca: string
  modelo: string
  año: number
  color: string
  placa: string
  vin: string
  precio_compra: number
  precio_venta: number
  estado: string
  stock: number
  proveedor?: Proveedor // Relación opcional para mostrar el nombre
}


export interface CompraDetalle {
  producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type Compra = {
  id: number
  numero_factura?: string
  proveedor?: {
    id: number
    nombre?: string
  }
  fecha_compra?: string
  subtotal?: number
  iva?: number
  total?: number
  vehiculos?: VehiculoCompra[]
}

export interface VentaDetalle {
  producto: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Venta {
  id: number
  cliente_id: number
  cliente?: Cliente
  fecha: string
  total: number
  detalles: VentaDetalle[]
  created_at?: string
}

export interface Cuenta {
  id: number
  codigo: string
  nombre: string
  tipo: "activo" | "pasivo" | "capital" | "ingreso" | "egreso"
  saldo: number
  created_at?: string
}

export interface AsientoContable {
  id: number
  fecha: string
  descripcion: string
  total: number
  partidas: PartidaContable[]
  created_at?: string
}

export interface PartidaContable {
  id?: number
  cuenta_id: number
  cuenta?: Cuenta
  tipo: "activo" | "pasivo" | "capital" | "ingreso" | "egreso"
  monto: number
  debe?: number
  haber?: number
  contrapartida?: string
}

export interface BalanceGeneral {
  activos: { cuenta: string; monto: number; contrapartida?: string }[]
  pasivos: { cuenta: string; monto: number; contrapartida?: string }[]
  capital: { cuenta: string; monto: number; contrapartida?: string }[]
  total_activos: number
  total_pasivos: number
  total_capital: number
}
export type VehiculoCompra = {
  vehiculo?: {
    id: number
    marca?: string
    modelo?: string
  }
  cantidad?: number
  precio_unitario?: number
}

export interface EstadoResultados {
  ingresos: { cuenta: string; monto: number; contrapartida?: string }[]
  egresos: { cuenta: string; monto: number; contrapartida?: string }[]
  total_ingresos: number
  total_egresos: number
  utilidad_neta: number
}
