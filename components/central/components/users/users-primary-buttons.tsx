import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Guard } from "@/components/central/components/auth/guard"
import { useUsers } from "./users-provider"

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()

  return (
    <Guard permissions="users.create">
      <Button className="space-x-1" onClick={() => setOpen("create")}>
        <span>Create</span> <Plus size={18} />
      </Button>
    </Guard>
  )
}