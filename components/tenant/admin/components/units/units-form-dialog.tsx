"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import { useCreateUnit, useUpdateUnit } from "@/hooks/tenant/use-unit-query"
import { type Unit, type UnitType } from "@/types/tenant/unit"
import {
  type StoreUnitFormValues,
  storeUnitSchema,
  type UpdateUnitFormValues,
  updateUnitSchema,
} from "@/schemas/tenant/unit-schema"

type UnitTypeOption = { label: string; value: UnitType }

const unitTypeOptions: UnitTypeOption[] = [
  { label: "Weight", value: "weight" },
  { label: "Length", value: "length" },
  { label: "Volume", value: "volume" },
  { label: "Area", value: "area" },
  { label: "Count", value: "count" },
]

type UnitsMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Unit
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function slugifyCode(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function UnitsFormDialog({
  open,
  onOpenChange,
  currentRow,
}: UnitsMutateDialogProps) {
  const isUpdate = !!currentRow
  const createUnit = useCreateUnit()
  const updateUnit = useUpdateUnit()
  const isSubmitting = createUnit.isPending || updateUnit.isPending

  const schema = isUpdate ? updateUnitSchema : storeUnitSchema

  const form = useForm<StoreUnitFormValues | UpdateUnitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      symbol: "",
      type: "weight",
      conversion_factor: 1,
      is_base: false,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code,
        symbol: currentRow.symbol,
        type: currentRow.type,
        conversion_factor: Number(currentRow.conversion_factor),
        is_base: currentRow.is_base,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        code: "",
        symbol: "",
        type: "weight",
        conversion_factor: 1,
        is_base: false,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const typeValue = form.watch("type")
  const selectedType =
    unitTypeOptions.find((item) => item.value === typeValue) ??
    unitTypeOptions[0]

  const onSubmit = (data: StoreUnitFormValues | UpdateUnitFormValues) => {
    const payload = {
      ...data,
      is_base: data.is_base ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateUnit.mutate(
        { id: currentRow.id, unit: payload as UpdateUnitFormValues },
        {
          onSuccess: () => {
            toast.success("Unit updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update unit")
          },
        }
      )
    } else {
      createUnit.mutate(payload as StoreUnitFormValues, {
        onSuccess: () => {
          toast.success("Unit created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create unit")
        },
      })
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Unit
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the measurement unit details."
              : "Add a new measurement unit for your store."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="units-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Kilogram"
                {...form.register("name", {
                  onChange: (event) => {
                    if (!isUpdate && !form.getValues("code")) {
                      form.setValue("code", slugifyCode(event.target.value))
                    }
                  },
                })}
              />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Code *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="kg"
                  className="font-mono"
                  {...form.register("code")}
                />
                <FieldError message={form.formState.errors.code?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Symbol *</FieldLabel>
              <FieldContent>
                <Input placeholder="kg" {...form.register("symbol")} />
                <FieldError message={form.formState.errors.symbol?.message} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Type *</FieldLabel>
            <FieldContent>
              <Combobox
                items={unitTypeOptions}
                itemToStringValue={(item) => item.label}
                value={selectedType}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue("type", item.value)
                }}
              >
                <ComboboxInput placeholder="Select unit type..." />
                <ComboboxContent>
                  <ComboboxEmpty>No unit types found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError message={form.formState.errors.type?.message} />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Conversion Factor *</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="any"
                  {...form.register("conversion_factor", {
                    valueAsNumber: true,
                  })}
                />
                <FieldError
                  message={form.formState.errors.conversion_factor?.message}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Sort Order</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...form.register("sort_order", { valueAsNumber: true })}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_base"
              checked={form.watch("is_base")}
              onCheckedChange={(checked) => form.setValue("is_base", !!checked)}
            />
            <label htmlFor="is_base" className="text-sm font-medium">
              Base unit for this type
            </label>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="units-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Unit"
                : "Create Unit"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
