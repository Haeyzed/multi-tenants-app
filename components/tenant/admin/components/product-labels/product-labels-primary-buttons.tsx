import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { useProductLabels } from "./product-labels-provider"

export function ProductLabelsPrimaryButtons() {
  const { setOpen } = useProductLabels()

  return (
    <div className="flex gap-2">
      <TenantAdminAuthGuard permissions="product-labels.create">
        <Button
          variant="outline"
          className="space-x-1"
          onClick={() => setOpen("import")}
        >
          <span>Import</span> <Download size={18} />
        </Button>
      </TenantAdminAuthGuard>
      <TenantAdminAuthGuard permissions="product-labels.create">
        <Button className="space-x-1" onClick={() => setOpen("create")}>
          <span>Create</span> <Plus size={18} />
        </Button>
      </TenantAdminAuthGuard>
    </div>
  )
}
