"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { X, Plus } from "lucide-react"
import { useCreatePlan, useUpdatePlan } from "@/hooks/central/use-plan-query"
import { type Plan } from "@/types/central/plan"
import { planSchema, type PlanForm } from "@/schemas/central/plan-schema"

type PlansMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Plan
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive mt-1">{message}</p>
}

function normalizeLimits(limits: Plan["limits"]): string[] {
  if (Array.isArray(limits)) return limits
  if (limits && typeof limits === "object") {
    return Object.entries(limits).map(
      ([key, val]) => `${key}: ${val ?? "unlimited"}`
    )
  }
  return []
}

export function PlansMutateDialog({
                                    open,
                                    onOpenChange,
                                    currentRow,
                                  }: PlansMutateDialogProps) {
  const isUpdate = !!currentRow
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()
  const isSubmitting = createPlan.isPending || updatePlan.isPending

  const [featureInput, setFeatureInput] = React.useState("")
  const [limitInput, setLimitInput] = React.useState("")

  const form = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: currentRow
      ? {
        slug: currentRow.slug,
        name: currentRow.name,
        description: currentRow.description || "",
        price: parseFloat(currentRow.price),
        currency: currentRow.currency,
        interval: currentRow.interval as "monthly" | "yearly",
        stripe_price_id: currentRow.stripe_price_id,
        paddle_price_id: currentRow.paddle_price_id,
        paystack_plan_code: currentRow.paystack_plan_code,
        paypal_plan_id: currentRow.paypal_plan_id,
        flutterwave_plan_id: currentRow.flutterwave_plan_id,
        limits: normalizeLimits(currentRow.limits),
        is_active: currentRow.is_active,
        is_featured: currentRow.is_featured,
        sort_order: currentRow.sort_order,
        features: currentRow.features || [],
      }
      : {
        slug: "",
        name: "",
        description: "",
        price: 0,
        currency: "USD",
        interval: "monthly",
        stripe_price_id: null,
        paddle_price_id: null,
        paystack_plan_code: null,
        paypal_plan_id: null,
        flutterwave_plan_id: null,
        is_active: true,
        is_featured: false,
        sort_order: 0,
        features: [],
        limits: [],
      },
  })

  const features = form.watch("features") || []
  const limits = form.watch("limits") || []

  const addFeature = () => {
    if (featureInput.trim()) {
      form.setValue("features", [...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    form.setValue(
      "features",
      features.filter((_, i) => i !== index)
    )
  }

  const addLimit = () => {
    if (limitInput.trim()) {
      form.setValue("limits", [...(limits as string[]), limitInput.trim()])
      setLimitInput("")
    }
  }

  const removeLimit = (index: number) => {
    form.setValue(
      "limits",
      (limits as string[]).filter((_, i) => i !== index)
    )
  }

  const onSubmit = (data: PlanForm) => {
    if (isUpdate && currentRow) {
      updatePlan.mutate(
        { id: currentRow.id, plan: data },
        {
          onSuccess: () => {
            toast.success("Plan updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update plan")
          },
        }
      )
    } else {
      createPlan.mutate(data, {
        onSuccess: () => {
          toast.success("Plan created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create plan")
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
            {isUpdate ? "Update" : "Create"} Plan
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the plan by providing necessary info."
              : "Add a new plan by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          id="plans-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input placeholder="Pro Plan" {...form.register("name")} />
                <FieldError message={form.formState.errors.name?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Slug *</FieldLabel>
              <FieldContent>
                <Input placeholder="pro-plan" {...form.register("slug")} />
                <FieldError message={form.formState.errors.slug?.message} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="A plan for professionals..."
                {...form.register("description")}
              />
              <FieldError message={form.formState.errors.description?.message} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Price *</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="99.99"
                  {...form.register("price", { valueAsNumber: true })}
                />
                <FieldError message={form.formState.errors.price?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Currency *</FieldLabel>
              <FieldContent>
                <Input placeholder="USD" maxLength={3} {...form.register("currency")} />
                <FieldError message={form.formState.errors.currency?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Interval *</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(value) => form.setValue("interval", value as "monthly" | "yearly")}
                  defaultValue={form.getValues("interval")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={form.formState.errors.interval?.message} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Sort Order</FieldLabel>
            <FieldContent>
              <Input type="number" {...form.register("sort_order", { valueAsNumber: true })} />
              <FieldError message={form.formState.errors.sort_order?.message} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Stripe Price ID</FieldLabel>
              <FieldContent>
                <Input placeholder="price_xxx" {...form.register("stripe_price_id")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Paddle Price ID</FieldLabel>
              <FieldContent>
                <Input placeholder="pri_xxx" {...form.register("paddle_price_id")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Paystack Plan Code</FieldLabel>
              <FieldContent>
                <Input placeholder="PLN_xxx" {...form.register("paystack_plan_code")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>PayPal Plan ID</FieldLabel>
              <FieldContent>
                <Input placeholder="P-xxx" {...form.register("paypal_plan_id")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Flutterwave Plan ID</FieldLabel>
              <FieldContent>
                <Input placeholder="FLW_xxx" {...form.register("flutterwave_plan_id")} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Features</FieldLabel>
            <FieldContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <Button type="button" size="sm" onClick={addFeature}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm text-primary"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Limits</FieldLabel>
            <FieldContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a limit..."
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addLimit())
                  }
                />
                <Button type="button" size="sm" onClick={addLimit}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(limits as string[]).map((limit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                  >
                    {limit}
                    <button
                      type="button"
                      onClick={() => removeLimit(index)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
              {currentRow &&
                !Array.isArray(currentRow.limits) &&
                currentRow.limits && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Original limits were object-based and converted to strings
                    for editing.
                  </p>
                )}
            </FieldContent>
          </Field>

          <div className="flex items-center gap-6">
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
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) =>
                  form.setValue("is_featured", !!checked)
                }
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
          </div>
        </form>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Close</Button>} />
          <Button type="submit" form="plans-form" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Plan"
                : "Create Plan"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}