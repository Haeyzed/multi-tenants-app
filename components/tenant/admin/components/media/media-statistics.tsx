"use client"

import { FolderIcon, HardDriveIcon, ImageIcon } from "lucide-react"

import { useGetMediaStatistics } from "@/hooks/tenant/use-media-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MediaStatistics() {
  const { data: stats, isLoading } = useGetMediaStatistics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
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
    { title: "Total Files", value: stats?.total ?? 0, icon: HardDriveIcon },
    { title: "Images", value: stats?.images ?? 0, icon: ImageIcon },
    {
      title: "Storage (MB)",
      value: stats?.storage_mb ?? 0,
      icon: FolderIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
