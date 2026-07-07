"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useBulkUpdateProducts } from "@/hooks/tenant/use-product-query"
import {
  productVisibilityOptions,
  statusOptions,
} from "./sections/product-form-shared"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import {
  type ProductStatus,
  type ProductVisibilityValue,
} from "@/types/tenant/product"

type ProductsBulkUpdateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  field: "status" | "visibility"
  onComplete?: () => void
}

export function ProductsBulkUpdateDialog({
  open,
  onOpenChange,
  ids,
  field,
  onComplete,
}: ProductsBulkUpdateDialogProps) {
  const bulkUpdate = useBulkUpdateProducts()
  const [status, setStatus] = React.useState(statusOptions[0])
  const [visibility, setVisibility] = React.useState(productVisibilityOptions[0])

  const handleSave = () => {
    if (ids.length === 0) {
      toast.error("No products selected.")
      return
    }

    bulkUpdate.mutate(
      {
        ids,
        ...(field === "status"
          ? { status: status.value as ProductStatus }
          : { visibility: visibility.value as ProductVisibilityValue }),
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Products updated successfully")
          onOpenChange(false)
          onComplete?.()
        },
        onError: (error) => toastApiError(error, "Failed to update products"),
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Update {field === "status" ? "status" : "visibility"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Apply a new {field} to {ids.length} selected product
            {ids.length === 1 ? "" : "s"}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {field === "status" ? (
          <Combobox
            items={statusOptions}
            itemToStringValue={(item) => item.label}
            value={status}
            onValueChange={(item) => {
              if (item) setStatus(item)
            }}
          >
            <ComboboxInput placeholder="Select status..." />
            <ComboboxContent>
              <ComboboxEmpty>No statuses found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ) : (
          <Combobox
            items={productVisibilityOptions}
            itemToStringValue={(item) => item.label}
            value={visibility}
            onValueChange={(item) => {
              if (item) setVisibility(item)
            }}
          >
            <ComboboxInput placeholder="Select visibility..." />
            <ComboboxContent>
              <ComboboxEmpty>No visibility options found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleSave} disabled={bulkUpdate.isPending}>
            {bulkUpdate.isPending && <Spinner />}
            Update products
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
