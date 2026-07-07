"use client"

import { GalleryVerticalEndIcon } from "lucide-react"
import { usePublicSettings } from "@/hooks/tenant/use-settings-query"
import { Skeleton } from "@/components/ui/skeleton"

type AuthBrandHeaderProps = {
  fallback?: string
}

export function AuthBrandHeader({ fallback = "Store" }: AuthBrandHeaderProps) {
  const { data, isLoading } = usePublicSettings()
  const brandName = data?.brand_name ?? data?.store_name ?? data?.business_name

  return (
    <div className="flex justify-center gap-2 md:justify-start">
      <a href="#" className="flex items-center gap-2 font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEndIcon className="size-4" />
        </div>
        {isLoading ? <Skeleton className="h-5 w-28" /> : brandName || fallback}
      </a>
    </div>
  )
}
