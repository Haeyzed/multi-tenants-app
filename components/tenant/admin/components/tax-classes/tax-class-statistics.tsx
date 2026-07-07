"use client"

import { useGetTaxClassStatistics } from "@/hooks/tenant/use-tax-class-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Percent, Star, XCircle } from "lucide-react"

export function TaxClassStatistics() {
  const { data: stats, isLoading } = useGetTaxClassStatistics()

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
    { title: "Total Classes", value: stats?.total ?? 0, icon: Percent },
    { title: "Active", value: stats?.active ?? 0, icon: CheckCircle },
    { title: "Inactive", value: stats?.inactive ?? 0, icon: XCircle },
    { title: "Default", value: stats?.default ?? 0, icon: Star },
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
