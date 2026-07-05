import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { useTaxRules } from "./tax-rules-provider"

export function TaxRulesPrimaryButtons() {
  const { setOpen } = useTaxRules()

  return (
    <div className="flex gap-2">
      <TenantAdminAuthGuard permissions="tax.create">
        <Button className="space-x-1" onClick={() => setOpen("create")}>
          <span>Create</span> <Plus size={18} />
        </Button>
      </TenantAdminAuthGuard>
    </div>
  )
}
