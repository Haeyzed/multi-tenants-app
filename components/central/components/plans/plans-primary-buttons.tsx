import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Guard } from "@/components/central/components/auth/guard"
import { usePlans } from "./plans-provider"

export function PlansPrimaryButtons() {
  const { setOpen } = usePlans()

  return (
    <div className="flex gap-2">
      <Guard permissions="plans.create">
        <Button
          variant="outline"
          className="space-x-1"
          onClick={() => setOpen("import")}
        >
          <span>Import</span> <Download size={18} />
        </Button>
      </Guard>
      <Guard permissions="plans.create">
        <Button className="space-x-1" onClick={() => setOpen("create")}>
          <span>Create</span> <Plus size={18} />
        </Button>
      </Guard>
    </div>
  )
}
