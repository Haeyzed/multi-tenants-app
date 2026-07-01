"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useAuth } from "@/lib/providers/auth-provider"
import { useGetUserOptions } from "@/hooks/central/use-user-query"
import { type ExportParams } from "@/types/central/export"
import { type UserOption } from "@/types/central/export"

type ModuleExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceLabel: string
  selectedIds: (number | string)[]
  onExport: (params: ExportParams) => Promise<void>
  onComplete?: () => void
  isPending?: boolean
}

const deliveryOptions = [
  { label: "Download Excel", value: "download" as const },
  { label: "Send via Email", value: "email" as const },
]

export function ModuleExportDialog({
  open,
  onOpenChange,
  resourceLabel,
  selectedIds,
  onExport,
  onComplete,
  isPending = false,
}: ModuleExportDialogProps) {
  const { user } = useAuth()
  const { data: userOptions = [] } = useGetUserOptions()
  const [delivery, setDelivery] = React.useState<"download" | "email">("download")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [recipient, setRecipient] = React.useState<UserOption | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    setDelivery("download")
    setStartDate("")
    setEndDate("")

    if (user && userOptions.length > 0) {
      const current = userOptions.find((option) => option.value === user.id) ?? null
      setRecipient(current)
    } else {
      setRecipient(null)
    }
  }, [open, user, userOptions])

  const handleExport = async () => {
    if (delivery === "email" && !recipient) {
      toast.error("Please select a recipient for the email export.")
      return
    }

    setSubmitting(true)

    try {
      const params: ExportParams = {
        ids: selectedIds.length > 0 ? selectedIds : undefined,
        delivery,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        recipient_id: delivery === "email" ? recipient?.value : undefined,
      }

      await onExport(params)

      if (delivery === "download") {
        toast.success(`${resourceLabel} export downloaded`)
      } else {
        toast.success(`Export sent to ${recipient?.email ?? "recipient"}`)
      }

      onComplete?.()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to export ${resourceLabel}`
      )
    } finally {
      setSubmitting(false)
    }
  }

  const pending = isPending || submitting
  const selectedDelivery =
    deliveryOptions.find((option) => option.value === delivery) ?? deliveryOptions[0]

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Export {resourceLabel}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {selectedIds.length > 0
              ? `Export ${selectedIds.length} selected ${resourceLabel.toLowerCase()}.`
              : `Export all matching ${resourceLabel.toLowerCase()} or filter by date range.`}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-2">
          <Field>
            <FieldLabel>Delivery</FieldLabel>
            <FieldContent>
              <Combobox
                items={deliveryOptions}
                itemToStringValue={(item) => item.label}
                value={selectedDelivery}
                onValueChange={(item) => {
                  if (item) setDelivery(item.value)
                }}
              >
                <ComboboxInput placeholder="Select delivery method..." />
                <ComboboxContent>
                  <ComboboxEmpty>No options found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>End Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FieldContent>
            </Field>
          </div>

          {delivery === "email" && (
            <Field>
              <FieldLabel>Send To</FieldLabel>
              <FieldContent>
                <Combobox
                  items={userOptions}
                  itemToStringValue={(item) => `${item.label} (${item.email})`}
                  value={recipient}
                  onValueChange={setRecipient}
                >
                  <ComboboxInput placeholder="Select recipient..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No users found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label} ({item.email})
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FieldContent>
            </Field>
          )}
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleExport} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Export
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
