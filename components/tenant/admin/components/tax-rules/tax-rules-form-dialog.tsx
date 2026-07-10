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
  useCreateTaxRule,
  useUpdateTaxRule,
} from "@/hooks/tenant/use-tax-rule-query"
import { useGetTaxRateOptions } from "@/hooks/tenant/use-tax-rate-query"
import { useGetProductOptions } from "@/hooks/tenant/use-product-query"
import { useGetCustomerGroupOptions } from "@/hooks/tenant/use-customer-group-query"
import { type TaxRateOption } from "@/types/tenant/tax-rate"
import { type ProductOption } from "@/types/tenant/product"
import { type CustomerGroupOption } from "@/types/tenant/customer-group"
import {
  type TaxRule,
  type TaxRuleApplicableType,
  type TaxRuleType,
} from "@/types/tenant/tax-rule"
import {
  type StoreTaxRuleFormValues,
  storeTaxRuleSchema,
  type UpdateTaxRuleFormValues,
  updateTaxRuleSchema,
} from "@/schemas/tenant/tax-rule-schema"

type TaxRulesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: TaxRule
}

type SelectOption<T extends string = string> = {
  label: string
  value: T
}

const APPLICABLE_TYPE_OPTIONS: SelectOption<TaxRuleApplicableType>[] = [
  { label: "Product", value: "product" },
  { label: "Customer Group", value: "customer_group" },
]

const RULE_TYPE_OPTIONS: SelectOption<TaxRuleType>[] = [
  { label: "Override", value: "override" },
  { label: "Exempt", value: "exempt" },
  { label: "Reduce", value: "reduce" },
  { label: "Increase", value: "increase" },
]

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

export function TaxRulesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: TaxRulesFormDialogProps) {
  const isUpdate = !!currentRow
  const createTaxRule = useCreateTaxRule()
  const updateTaxRule = useUpdateTaxRule()
  const { data: taxRateOptions = [] } = useGetTaxRateOptions()
  const { data: productOptions = [] } = useGetProductOptions()
  const { data: customerGroupOptions = [] } = useGetCustomerGroupOptions()
  const isSubmitting = createTaxRule.isPending || updateTaxRule.isPending

  const schema = isUpdate ? updateTaxRuleSchema : storeTaxRuleSchema

  const form = useForm<StoreTaxRuleFormValues | UpdateTaxRuleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tax_rate_id: undefined,
      applicable_type: "product",
      applicable_id: undefined,
      rule_type: "override",
      adjustment_rate: null,
      effective_from: null,
      effective_to: null,
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        tax_rate_id: currentRow.tax_rate_id,
        applicable_type: currentRow.applicable_type,
        applicable_id: currentRow.applicable_id,
        rule_type: currentRow.rule_type,
        adjustment_rate:
          currentRow.adjustment_rate !== null
            ? Number(currentRow.adjustment_rate)
            : null,
        effective_from: currentRow.effective_from,
        effective_to: currentRow.effective_to,
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        tax_rate_id: taxRateOptions[0]?.value,
        applicable_type: "product",
        applicable_id: productOptions[0]?.value,
        rule_type: "override",
        adjustment_rate: null,
        effective_from: null,
        effective_to: null,
        is_active: true,
      })
    }
  }, [open, currentRow, form, taxRateOptions, productOptions])

  const taxRateId = form.watch("tax_rate_id")
  const applicableType = form.watch("applicable_type")
  const applicableId = form.watch("applicable_id")
  const ruleType = form.watch("rule_type")
  const effectiveFrom = form.watch("effective_from")
  const effectiveTo = form.watch("effective_to")

  const applicableOptions =
    applicableType === "customer_group" ? customerGroupOptions : productOptions

  const selectedTaxRate =
    taxRateOptions.find((item) => item.value === taxRateId) ?? null

  const selectedApplicableType =
    APPLICABLE_TYPE_OPTIONS.find((item) => item.value === applicableType) ??
    null

  const selectedApplicable =
    applicableOptions.find((item) => item.value === applicableId) ?? null

  const selectedRuleType =
    RULE_TYPE_OPTIONS.find((item) => item.value === ruleType) ?? null

  const prevApplicableType = React.useRef(applicableType)

  React.useEffect(() => {
    if (!open) return
    if (prevApplicableType.current !== applicableType) {
      const options =
        applicableType === "customer_group"
          ? customerGroupOptions
          : productOptions
      form.setValue("applicable_id", options[0]?.value, {
        shouldValidate: true,
      })
    }
    prevApplicableType.current = applicableType
  }, [applicableType, customerGroupOptions, productOptions, form, open])

  const onSubmit = (data: StoreTaxRuleFormValues | UpdateTaxRuleFormValues) => {
    const payload = {
      ...data,
      adjustment_rate: data.adjustment_rate ?? null,
      effective_from: data.effective_from || null,
      effective_to: data.effective_to || null,
    }

    if (isUpdate && currentRow) {
      updateTaxRule.mutate(
        { id: currentRow.id, taxRule: payload as UpdateTaxRuleFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Tax rule updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update tax rule"
            )
          },
        }
      )
    } else {
      createTaxRule.mutate(payload as StoreTaxRuleFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Tax rule created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create tax rule")
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
            {isUpdate ? "Update" : "Create"} Tax Rule
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tax rule details."
              : "Add a tax rule for a specific product or customer group."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tax-rules-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Tax Rate *</FieldLabel>
            <FieldContent>
              <Combobox
                items={taxRateOptions}
                itemToStringValue={(item: TaxRateOption) => item.label}
                value={selectedTaxRate}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue("tax_rate_id", item.value, {
                    shouldValidate: true,
                  })
                }}
              >
                <ComboboxInput placeholder="Select tax rate..." showClear />
                <ComboboxContent>
                  <ComboboxEmpty>No tax rates found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: TaxRateOption) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError
                message={form.formState.errors.tax_rate_id?.message}
              />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Applicable Type *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={APPLICABLE_TYPE_OPTIONS}
                  itemToStringValue={(item) => item.label}
                  value={selectedApplicableType}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("applicable_type", item.value, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput
                    placeholder="Select applicable type..."
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
                <FieldError
                  message={form.formState.errors.applicable_type?.message}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                {applicableType === "customer_group"
                  ? "Customer Group"
                  : "Product"}{" "}
                *
              </FieldLabel>
              <FieldContent>
                <Combobox
                  items={applicableOptions}
                  itemToStringValue={(
                    item: ProductOption | CustomerGroupOption
                  ) => item.label}
                  value={selectedApplicable}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("applicable_id", item.value, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput
                    placeholder={
                      applicableType === "customer_group"
                        ? "Select customer group..."
                        : "Select product..."
                    }
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No options found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: ProductOption | CustomerGroupOption) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError
                  message={form.formState.errors.applicable_id?.message}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Rule Type *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={RULE_TYPE_OPTIONS}
                  itemToStringValue={(item) => item.label}
                  value={selectedRuleType}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("rule_type", item.value, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput placeholder="Select rule type..." showClear />
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
                <FieldError
                  message={form.formState.errors.rule_type?.message}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Adjustment Rate (%)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.0001"
                  min={0}
                  max={100}
                  placeholder="Optional"
                  {...form.register("adjustment_rate", {
                    setValueAs: (value) =>
                      value === "" || value === null ? null : Number(value),
                  })}
                />
                <FieldError
                  message={form.formState.errors.adjustment_rate?.message}
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
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tax-rules-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tax Rule"
                : "Create Tax Rule"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
