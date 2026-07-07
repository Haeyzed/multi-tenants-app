"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDeleteManyTaxRules } from "@/hooks/tenant/use-tax-rule-query"

type TaxRulesMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  onComplete?: () => void
}

const CONFIRM_WORD = "DELETE"

export function TaxRulesMultiDeleteDialog({
  open,
  onOpenChange,
  ids,
  onComplete,
}: TaxRulesMultiDeleteDialogProps) {
  const [value, setValue] = useState("")
  const deleteMany = useDeleteManyTaxRules()

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    deleteMany.mutate(ids, {
      onSuccess: () => {
        toast.success(
          `Deleted ${ids.length} ${ids.length > 1 ? "tax rules" : "tax rule"}`
        )
        setValue("")
        onComplete?.()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete tax rules")
      },
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        if (!val) setValue("")
        onOpenChange(val)
      }}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Delete {ids.length} {ids.length > 1 ? "tax rules" : "tax rule"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to delete the selected tax rules?
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-2">
          <Label className="flex flex-col items-start gap-1.5">
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={value.trim() !== CONFIRM_WORD || deleteMany.isPending}
          >
            {deleteMany.isPending && <Spinner />}
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
