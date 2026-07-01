import { MoreHorizontal, Trash2 } from "lucide-react"
import { type Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Guard } from "@/components/central/components/auth/guard"
import { type Plan } from "@/types/central/plan"
import { usePlans } from "./plans-provider"

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
                                             row,
                                           }: DataTableRowActionsProps<TData>) {
  const plan = row.original as Plan
  const { setOpen, setCurrentRow } = usePlans()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        <Guard permissions="plans.update">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(plan)
              setOpen("update")
            }}
          >
            Edit
          </DropdownMenuItem>
        </Guard>
        <DropdownMenuSeparator />
        <Guard permissions="plans.delete">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(plan)
              setOpen("delete")
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </Guard>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}