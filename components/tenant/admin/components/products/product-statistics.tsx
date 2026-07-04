"use client"

import { useGetProductStatistics } from "@/hooks/tenant/use-product-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Archive,
  CheckCircle2,
  FileEdit,
  Package,
  Star,
  TriangleAlert,
} from "lucide-react"

export function ProductStatistics() {
  const { data: stats, isLoading } = useGetProductStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    { title: "Total", value: stats?.total ?? 0, icon: Package },
    { title: "Active", value: stats?.active ?? 0, icon: CheckCircle2 },
    { title: "Draft", value: stats?.draft ?? 0, icon: FileEdit },
    { title: "Archived", value: stats?.archived ?? 0, icon: Archive },
    { title: "Featured", value: stats?.featured ?? 0, icon: Star },
    { title: "Low Stock", value: stats?.low_stock ?? 0, icon: TriangleAlert },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
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
