"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateTaxRate,
  useUpdateTaxRate,
} from "@/hooks/tenant/use-tax-rate-query"
import { useGetTaxClassOptions } from "@/hooks/tenant/use-tax-class-query"
import { useGetTaxZoneOptions } from "@/hooks/tenant/use-tax-zone-query"
import { type TaxClassOption } from "@/types/tenant/tax-class"
import { type TaxZoneOption } from "@/types/tenant/tax-zone"
import { type TaxRate } from "@/types/tenant/tax-rate"
import {
  type StoreTaxRateFormValues,
  storeTaxRateSchema,
  type UpdateTaxRateFormValues,
  updateTaxRateSchema,
} from "@/schemas/tenant/tax-rate-schema"

type TaxRatesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: TaxRate
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function parseDateString(value?: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function TaxRatesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: TaxRatesFormDialogProps) {
  const isUpdate = !!currentRow
  const createTaxRate = useCreateTaxRate()
  const updateTaxRate = useUpdateTaxRate()
  const { data: taxClassOptions = [] } = useGetTaxClassOptions()
  const { data: taxZoneOptions = [] } = useGetTaxZoneOptions()
  const isSubmitting = createTaxRate.isPending || updateTaxRate.isPending

  const schema = isUpdate ? updateTaxRateSchema : storeTaxRateSchema

  const form = useForm<StoreTaxRateFormValues | UpdateTaxRateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tax_class_id: undefined,
      tax_zone_id: undefined,
      name: "",
      rate: 0,
      priority: 1,
      is_compound: false,
      applies_to_shipping: false,
      effective_from: null,
      effective_to: null,
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        tax_class_id: currentRow.tax_class_id,
        tax_zone_id: currentRow.tax_zone_id,
        name: currentRow.name,
        rate: Number(currentRow.rate),
        priority: currentRow.priority ?? 1,
        is_compound: currentRow.is_compound,
        applies_to_shipping: currentRow.applies_to_shipping,
        effective_from: currentRow.effective_from,
        effective_to: currentRow.effective_to,
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        tax_class_id: taxClassOptions[0]?.value,
        tax_zone_id: taxZoneOptions[0]?.value,
        name: "",
        rate: 0,
        priority: 1,
        is_compound: false,
        applies_to_shipping: false,
        effective_from: null,
        effective_to: null,
        is_active: true,
      })
    }
  }, [open, currentRow, form, taxClassOptions, taxZoneOptions])

  const taxClassId = form.watch("tax_class_id")
  const taxZoneId = form.watch("tax_zone_id")
  const effectiveFrom = form.watch("effective_from")
  const effectiveTo = form.watch("effective_to")

  const selectedTaxClass =
    taxClassOptions.find((item) => item.value === taxClassId) ?? null

  const selectedTaxZone =
    taxZoneOptions.find((item) => item.value === taxZoneId) ?? null

  const onSubmit = (data: StoreTaxRateFormValues | UpdateTaxRateFormValues) => {
    const payload = {
      ...data,
      priority: data.priority ?? 1,
      is_compound: data.is_compound ?? false,
      applies_to_shipping: data.applies_to_shipping ?? false,
      effective_from: data.effective_from || null,
      effective_to: data.effective_to || null,
    }

    if (isUpdate && currentRow) {
      updateTaxRate.mutate(
        { id: currentRow.id, taxRate: payload as UpdateTaxRateFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Tax rate updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update tax rate"
            )
          },
        }
      )
    } else {
      createTaxRate.mutate(payload as StoreTaxRateFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Tax rate created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create tax rate")
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
            {isUpdate ? "Update" : "Create"} Tax Rate
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tax rate details."
              : "Add a tax rate for a class and zone combination."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tax-rates-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Standard VAT" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Tax Class *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={taxClassOptions}
                  itemToStringValue={(item: TaxClassOption) => item.label}
                  value={selectedTaxClass}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("tax_class_id", item.value, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput placeholder="Select tax class..." showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>No tax classes found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: TaxClassOption) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError
                  message={form.formState.errors.tax_class_id?.message}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Tax Zone *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={taxZoneOptions}
                  itemToStringValue={(item: TaxZoneOption) => item.label}
                  value={selectedTaxZone}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("tax_zone_id", item.value, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput placeholder="Select tax zone..." showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>No tax zones found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: TaxZoneOption) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError
                  message={form.formState.errors.tax_zone_id?.message}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Rate (%) *</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.0001"
                  min={0}
                  max={100}
                  {...form.register("rate", { valueAsNumber: true })}
                />
                <FieldError message={form.formState.errors.rate?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Priority</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min={1}
                  {...form.register("priority", { valueAsNumber: true })}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Effective From</FieldLabel>
              <FieldContent>
                <DatePicker
                  selected={parseDateString(effectiveFrom)}
                  onSelect={(date) => {
                    form.setValue(
                      "effective_from",
                      date ? format(date, "yyyy-MM-dd") : null
                    )
                  }}
                  placeholder="Pick start date"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Effective To</FieldLabel>
              <FieldContent>
                <DatePicker
                  selected={parseDateString(effectiveTo)}
                  onSelect={(date) => {
                    form.setValue(
                      "effective_to",
                      date ? format(date, "yyyy-MM-dd") : null
                    )
                  }}
                  placeholder="Pick end date"
                  minDate={parseDateString(effectiveFrom)}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) =>
                  form.setValue("is_active", !!checked)
                }
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_compound"
                checked={form.watch("is_compound")}
                onCheckedChange={(checked) =>
                  form.setValue("is_compound", !!checked)
                }
              />
              <label htmlFor="is_compound" className="text-sm font-medium">
                Compound
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="applies_to_shipping"
                checked={form.watch("applies_to_shipping")}
                onCheckedChange={(checked) =>
                  form.setValue("applies_to_shipping", !!checked)
                }
              />
              <label
                htmlFor="applies_to_shipping"
                className="text-sm font-medium"
              >
                Applies to Shipping
              </label>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tax-rates-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tax Rate"
                : "Create Tax Rate"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
