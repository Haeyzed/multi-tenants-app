"use client"

import * as React from "react"
import { format } from "date-fns"
import { Spinner } from "@/components/ui/spinner"
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
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useAuth } from "@/lib/providers/central/auth-provider"
import { useGetUserOptions } from "@/hooks/central/use-user-query"
import { type ExportColumnOption } from "@/lib/export-columns"
import { type ExportParams, type ExportFileType } from "@/types/central/export"
import { type UserOption } from "@/types/central/export"

type ModuleExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceLabel: string
  selectedIds: (number | string)[]
  columnOptions: ExportColumnOption[]
  onExport: (params: ExportParams) => Promise<void>
  onComplete?: () => void
  isPending?: boolean
}

const deliveryOptions = [
  { label: "Download file", value: "download" as const },
  { label: "Send via Email", value: "email" as const },
]

const formatOptions = [
  { label: "Excel (.xlsx)", value: "xlsx" as const },
  { label: "CSV (.csv)", value: "csv" as const },
]

export function ModuleExportDialog({
  open,
  onOpenChange,
  resourceLabel,
  selectedIds,
  columnOptions,
  onExport,
  onComplete,
  isPending = false,
}: ModuleExportDialogProps) {
  const { user } = useAuth()
  const { data: userOptions = [] } = useGetUserOptions()
  const [delivery, setDelivery] = React.useState<"download" | "email">("download")
  const [fileType, setFileType] = React.useState<ExportFileType>("xlsx")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [recipient, setRecipient] = React.useState<UserOption | null>(null)
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  const allColumnKeys = React.useMemo(
    () => columnOptions.map((column) => column.key),
    [columnOptions]
  )

  React.useEffect(() => {
    if (!open) return

    setDelivery("download")
    setFileType("xlsx")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedColumns(allColumnKeys)

    if (user && userOptions.length > 0) {
      const current = userOptions.find((option) => option.value === user.id) ?? null
      setRecipient(current)
    } else {
      setRecipient(null)
    }
  }, [open, user, userOptions, allColumnKeys])

  const toggleColumn = (key: string, checked: boolean) => {
    setSelectedColumns((current) => {
      const next = checked
        ? current.includes(key)
          ? current
          : [...current, key]
        : current.filter((columnKey) => columnKey !== key)

      return columnOptions
        .map((column) => column.key)
        .filter((columnKey) => next.includes(columnKey))
    })
  }

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export.")
      return
    }

    if (delivery === "email" && !recipient) {
      toast.error("Please select a recipient for the email export.")
      return
    }

    setSubmitting(true)

    try {
      const params: ExportParams = {
        ids: selectedIds.length > 0 ? selectedIds : undefined,
        delivery,
        type: fileType,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
        recipient_id: delivery === "email" ? recipient?.value : undefined,
        columns: selectedColumns,
      }

      await onExport(params)

      if (delivery === "download") {
        toast.success(`${resourceLabel} export downloaded (${fileType.toUpperCase()})`)
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
  const selectedFormat =
    formatOptions.find((option) => option.value === fileType) ?? formatOptions[0]
  const allSelected = selectedColumns.length === allColumnKeys.length

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
            <FieldLabel>Columns</FieldLabel>
            <FieldContent>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {selectedColumns.length} of {allColumnKeys.length} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    disabled={allSelected}
                    onClick={() => setSelectedColumns(allColumnKeys)}
                  >
                    Select all
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    disabled={selectedColumns.length === 0}
                    onClick={() => setSelectedColumns([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                {columnOptions.map((column) => {
                  const checked = selectedColumns.includes(column.key)

                  return (
                    <label
                      key={column.key}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleColumn(column.key, value === true)
                        }
                      />
                      <span>{column.label}</span>
                    </label>
                  )
                })}
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>File Type</FieldLabel>
            <FieldContent>
              <Combobox
                items={formatOptions}
                itemToStringValue={(item) => item.label}
                value={selectedFormat}
                onValueChange={(item) => {
                  if (item) setFileType(item.value)
                }}
              >
                <ComboboxInput placeholder="Select file type..." />
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
                <DatePicker
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date)
                    if (date && endDate && endDate < date) {
                      setEndDate(undefined)
                    }
                  }}
                  placeholder="Pick start date"
                  maxDate={endDate ?? new Date()}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>End Date</FieldLabel>
              <FieldContent>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholder="Pick end date"
                  minDate={startDate}
                  maxDate={new Date()}
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
            {pending && <Spinner />}
            Export
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
