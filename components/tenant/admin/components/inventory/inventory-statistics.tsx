"use client"

import { useGetInventoryStatistics } from "@/hooks/tenant/use-inventory-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Bell, Package, PackageX } from "lucide-react"

export function InventoryStatistics() {
  const { data: stats, isLoading } = useGetInventoryStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    { title: "Inventory records", value: stats?.total_records ?? 0, icon: Package },
    { title: "Low stock", value: stats?.low_stock ?? 0, icon: AlertTriangle },
    { title: "Out of stock", value: stats?.out_of_stock ?? 0, icon: PackageX },
    {
      title: "Pending alerts",
      value: stats?.pending_stock_alerts ?? 0,
      icon: Bell,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
