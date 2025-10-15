"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Truck,
  ShoppingCart,
  TrendingUp,
  FileText,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Proveedores", href: "/proveedores", icon: Truck },
  { name: "Vehículos", href: "/vehiculos", icon: ShoppingCart },
  { name: "Compras", href: "/compras", icon: ShoppingCart },
  { name: "Ventas", href: "/ventas", icon: TrendingUp },
  { name: "Contabilidad", href: "/contabilidad", icon: BookOpen },
  { name: "Reportes", href: "/reportes", icon: FileText },
  { name: "Usuarios", href: "/usuarios", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="flex flex-col h-screen w-64 bg-zinc-900 border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-white">Sistema Contable</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.nombre}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-zinc-800"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
