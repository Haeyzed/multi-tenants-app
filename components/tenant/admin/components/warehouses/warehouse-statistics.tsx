"use client"

import { useGetWarehouseStatistics } from "@/hooks/tenant/use-warehouse-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Warehouse, CheckCircle, XCircle, Star, Package } from "lucide-react"

export function WarehouseStatistics() {
  const { data: stats, isLoading } = useGetWarehouseStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
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
    { title: "Total Warehouses", value: stats?.total ?? 0, icon: Warehouse },
    { title: "Active", value: stats?.active ?? 0, icon: CheckCircle },
    { title: "Inactive", value: stats?.inactive ?? 0, icon: XCircle },
    { title: "Primary", value: stats?.primary ?? 0, icon: Star },
    {
      title: "With Inventory",
      value: stats?.with_inventory ?? 0,
      icon: Package,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
