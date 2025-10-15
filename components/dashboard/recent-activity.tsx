import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, User, Truck } from "lucide-react"

interface Activity {
  id: number
  type: "venta" | "compra" | "cliente" | "proveedor"
  description: string
  amount?: number
  time: string
}

const activities: Activity[] = [
  {
    id: 1,
    type: "venta",
    description: "Nueva venta registrada",
    amount: 15000,
    time: "Hace 2 horas",
  },
  {
    id: 2,
    type: "cliente",
    description: "Nuevo cliente agregado: Juan Pérez",
    time: "Hace 3 horas",
  },
  {
    id: 3,
    type: "compra",
    description: "Compra de inventario",
    amount: 8500,
    time: "Hace 5 horas",
  },
  {
    id: 4,
    type: "proveedor",
    description: "Nuevo proveedor: Distribuidora XYZ",
    time: "Hace 1 día",
  },
]

const getIcon = (type: Activity["type"]) => {
  switch (type) {
    case "venta":
      return <TrendingUp className="w-5 h-5 text-green-500" />
    case "compra":
      return <TrendingDown className="w-5 h-5 text-amber-500" />
    case "cliente":
      return <User className="w-5 h-5 text-blue-500" />
    case "proveedor":
      return <Truck className="w-5 h-5 text-purple-500" />
  }
}

export function RecentActivity() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Actividad Reciente</CardTitle>
        <CardDescription className="text-gray-400">Últimas transacciones y eventos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <div className="p-2 rounded-lg bg-zinc-800">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
              {activity.amount && (
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${activity.type === "venta" ? "text-green-500" : "text-amber-500"}`}
                  >
                    ${activity.amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
