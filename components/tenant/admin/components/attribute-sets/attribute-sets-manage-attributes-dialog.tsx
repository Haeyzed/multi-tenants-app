"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  useGetAttributeSetAttributes,
  useSyncAttributeSetAttributes,
} from "@/hooks/tenant/use-attribute-set-query"
import { useGetAttributeOptions } from "@/hooks/tenant/use-attribute-query"
import { type AttributeSet } from "@/types/tenant/attribute-set"

type AttributeSetsManageAttributesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributeSet: AttributeSet
}

export function AttributeSetsManageAttributesDialog({
  open,
  onOpenChange,
  attributeSet,
}: AttributeSetsManageAttributesDialogProps) {
  const { data: assignedAttributes = [], isLoading: isLoadingAssigned } =
    useGetAttributeSetAttributes(attributeSet.id, open)
  const { data: attributeOptions = [], isLoading: isLoadingOptions } =
    useGetAttributeOptions()
  const syncAttributes = useSyncAttributeSetAttributes(attributeSet.id)

  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    if (!open) {
      setSearch("")
      return
    }

    if (!isLoadingAssigned) {
      setSelectedIds(assignedAttributes.map((attribute) => attribute.id))
    }
  }, [open, assignedAttributes, isLoadingAssigned])

  const isLoading = isLoadingAssigned || isLoadingOptions

  const filteredOptions = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return attributeOptions
    return attributeOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    )
  }, [attributeOptions, search])

  const toggleAttribute = (attributeId: number, checked: boolean) => {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(attributeId)
          ? current
          : [...current, attributeId]
      }
      return current.filter((id) => id !== attributeId)
    })
  }

  const handleSave = () => {
    syncAttributes.mutate(selectedIds, {
      onSuccess: () => {
        toast.success("Attributes synced successfully")
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to sync attributes")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] flex-col overflow-hidden sm:max-w-2xl">
        <ResponsiveDialogHeader className="shrink-0">
          <ResponsiveDialogTitle>Manage Attributes</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Select attributes for &quot;{attributeSet.name}&quot;. Changes are
            saved when you click Save.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="shrink-0">
          <Input
            placeholder="Search attributes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : filteredOptions.length === 0 ? (
            <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
              {attributeOptions.length === 0
                ? "No attributes available."
                : "No attributes match your search."}
            </p>
          ) : (
            <div className="max-h-[min(50dvh,360px)] space-y-2 overflow-y-auto rounded-md border p-4">
              {filteredOptions.map((option) => {
                const isChecked = selectedIds.includes(option.value)
                const checkboxId = `attribute-set-${attributeSet.id}-attribute-${option.value}`

                return (
                  <div
                    key={option.value}
                    className="flex items-center gap-3 rounded-md px-1 py-2 hover:bg-muted/50"
                  >
                    <Checkbox
                      id={checkboxId}
                      className="shrink-0"
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        toggleAttribute(option.value, !!checked)
                      }
                    />
                    <label
                      htmlFor={checkboxId}
                      className="flex-1 cursor-pointer text-sm font-medium"
                    >
                      {option.label}
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <ResponsiveDialogFooter className="shrink-0">
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            onClick={handleSave}
            disabled={syncAttributes.isPending || isLoading}
          >
            {syncAttributes.isPending && <Spinner />}
            Save
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
