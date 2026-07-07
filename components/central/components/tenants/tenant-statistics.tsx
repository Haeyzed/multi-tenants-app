"use client"

import { useGetTenantStatistics } from "@/hooks/central/use-tenant-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Building2, CheckCircle2, Clock } from "lucide-react"

export function TenantStatistics() {
  const { data: stats, isLoading } = useGetTenantStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
    {
      title: "Total Tenants",
      value: stats?.total ?? 0,
      icon: Building2,
    },
    {
      title: "Active",
      value: stats?.active ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
    },
    {
      title: "Suspended",
      value: stats?.suspended ?? 0,
      icon: AlertTriangle,
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
