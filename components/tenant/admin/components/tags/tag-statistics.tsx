"use client"

import { useGetTagStatistics } from "@/hooks/tenant/use-tag-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tags, Eye, EyeOff } from "lucide-react"

export function TagStatistics() {
  const { data: stats, isLoading } = useGetTagStatistics()

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

  const items = [
    { title: "Total Tags", value: stats?.total ?? 0, icon: Tags },
    { title: "Visible", value: stats?.visible ?? 0, icon: Eye },
    { title: "Hidden", value: stats?.hidden ?? 0, icon: EyeOff },
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
