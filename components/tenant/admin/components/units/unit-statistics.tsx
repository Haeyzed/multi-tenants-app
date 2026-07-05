"use client"

import { useGetUnitStatistics } from "@/hooks/tenant/use-unit-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Star, Layers } from "lucide-react"

export function UnitStatistics() {
  const { data: stats, isLoading } = useGetUnitStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
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

  const typeCount = Object.keys(stats?.types ?? {}).length

  const items = [
    { title: "Total Units", value: stats?.total ?? 0, icon: Ruler },
    { title: "Base Units", value: stats?.base ?? 0, icon: Star },
    { title: "Types", value: typeCount, icon: Layers },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
