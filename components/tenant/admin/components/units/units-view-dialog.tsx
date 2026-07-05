"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import { type Unit } from "@/types/tenant/unit"

type UnitsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit
}

function getUnitViewFields(unit: Unit): ModuleViewField[] {
  return [
    { label: "Name", value: unit.name },
    { label: "Code", value: unit.code },
    { label: "Symbol", value: unit.symbol },
    {
      label: "Type",
      value: <Badge variant="outline" className="capitalize">{unit.type}</Badge>,
    },
    { label: "Conversion factor", value: String(unit.conversion_factor) },
    {
      label: "Base unit",
      value: unit.is_base ? (
        <Badge variant="secondary">Base</Badge>
      ) : (
        "No"
      ),
    },
    { label: "Sort order", value: String(unit.sort_order ?? 0) },
    {
      label: "Created",
      value: unit.created_at
        ? format(new Date(unit.created_at), "PPP")
        : "—",
    },
  ]
}

export function UnitsViewDialog({
  open,
  onOpenChange,
  unit,
}: UnitsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Unit Details"
      description={`Viewing unit #${unit.id}`}
      fields={getUnitViewFields(unit)}
    />
  )
}
