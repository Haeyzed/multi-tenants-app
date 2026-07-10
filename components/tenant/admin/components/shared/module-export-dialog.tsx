"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { format } from "date-fns"
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
import { useTenantAuth } from "@/lib/providers/tenant/tenant-auth-provider"
import { type ExportColumnOption } from "@/lib/export-columns"
import { type ExportFileType, type ExportParams } from "@/types/tenant/export"

type ModuleExportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resourceLabel: string
  selectedIds: (number | string)[]
  columnOptions: ExportColumnOption[]
  onExport: (
    params: ExportParams
  ) => Promise<void | { message?: string } | null | undefined>
  onComplete?: () => void
  isPending?: boolean
}

type DeliveryOption = {
  label: string
  value: "download" | "email"
}

type FormatOption = {
  label: string
  value: ExportFileType
}

const deliveryOptions: DeliveryOption[] = [
  { label: "Download file", value: "download" },
  { label: "Send via Email", value: "email" },
]

const formatOptions: FormatOption[] = [
  { label: "Excel (.xlsx)", value: "xlsx" },
  { label: "CSV (.csv)", value: "csv" },
]

type ModuleExportDialogContentProps = Omit<
  ModuleExportDialogProps,
  "open"
>

function ModuleExportDialogContent({
  onOpenChange,
  resourceLabel,
  selectedIds,
  columnOptions,
  onExport,
  onComplete,
  isPending = false,
}: ModuleExportDialogContentProps) {
  const { user } = useTenantAuth()
  const [delivery, setDelivery] = React.useState<"download" | "email">(
    "download"
  )
  const [fileType, setFileType] = React.useState<ExportFileType>("xlsx")
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(() =>
    columnOptions.map((column) => column.key)
  )
  const [submitting, setSubmitting] = React.useState(false)

  const allColumnKeys = React.useMemo(
    () => columnOptions.map((column) => column.key),
    [columnOptions]
  )

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
      toastApiError(
        new Error("Please select at least one column to export."),
        "Please select at least one column to export."
      )
      return
    }

    if (delivery === "email" && !user) {
      toastApiError(
        new Error("You must be logged in to send an email export."),
        "You must be logged in to send an email export."
      )
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
        recipient_id: delivery === "email" ? user?.id : undefined,
        columns: selectedColumns,
      }

      const exportResult = await onExport(params)

      if (delivery === "download") {
        toastApiSuccess(
          null,
          `${resourceLabel} export downloaded (${fileType.toUpperCase()})`
        )
      } else {
        toastApiSuccess(
          exportResult && typeof exportResult === "object"
            ? exportResult.message
            : null,
          `Export sent to ${user?.email ?? "your email"}`
        )
      }

      onComplete?.()
      onOpenChange(false)
    } catch (error) {
      toastApiError(error, `Failed to export ${resourceLabel}`)
    } finally {
      setSubmitting(false)
    }
  }

  const pending = isPending || submitting
  const selectedDelivery =
    deliveryOptions.find((option) => option.value === delivery) ??
    deliveryOptions[0]
  const selectedFormat =
    formatOptions.find((option) => option.value === fileType) ?? formatOptions[0]
  const allSelected = selectedColumns.length === allColumnKeys.length

  return (
    <>
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
              <ComboboxInput placeholder="Select file type..." showClear />
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
              <ComboboxInput
                placeholder="Select delivery method..."
                showClear
              />
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

        {delivery === "email" && user && (
          <p className="text-sm text-muted-foreground">
            The export will be sent to <strong>{user.email}</strong>.
          </p>
        )}

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
      </div>

      <ResponsiveDialogFooter>
        <ResponsiveDialogClose
          render={<Button variant="outline">Cancel</Button>}
        />
        <Button onClick={handleExport} disabled={pending}>
          {pending && <Spinner />}
          Export
        </Button>
      </ResponsiveDialogFooter>
    </>
  )
}

export function ModuleExportDialog({
  open,
  onOpenChange,
  ...props
}: ModuleExportDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        {open ? (
          <ModuleExportDialogContent
            onOpenChange={onOpenChange}
            {...props}
          />
        ) : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
