"use client"

import Link from "next/link"
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { useProducts } from "./products-provider"

export function ProductsPrimaryButtons() {
  const { setOpen, setExportSelection } = useProducts()

  return (
    <div className="flex gap-2">
      <TenantAdminAuthGuard permissions="products.view">
        <Button
          variant="outline"
          className="space-x-1"
          onClick={() => {
            setExportSelection({ ids: [] })
            setOpen("export")
          }}
        >
          <span>Export</span> <Download size={18} />
        </Button>
      </TenantAdminAuthGuard>
      <TenantAdminAuthGuard permissions="products.create">
        <Button
          className="space-x-1"
          render={<Link href="/admin/products/new" />}
          nativeButton={false}
        >
          <span>Create</span> <Plus size={18} />
        </Button>
      </TenantAdminAuthGuard>
    </div>
  )
}
