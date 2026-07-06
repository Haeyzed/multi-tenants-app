"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useSyncProductSubscription } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductSubscriptionSchema,
  type SyncProductSubscriptionFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { FieldError } from "./product-form-shared"

type ProductSubscriptionSectionProps = {
  product: Product
}

function defaultSubscriptionValues(
  product: Product
): SyncProductSubscriptionFormValues {
  return {
    subscription: {
      interval: product.subscription?.interval ?? "month",
      interval_count: product.subscription?.interval_count ?? 1,
      trial_days: product.subscription?.trial_days ?? 0,
      trial_price: product.subscription?.trial_price
        ? Number(product.subscription.trial_price)
        : null,
      billing_cycles: product.subscription?.billing_cycles ?? null,
      prorate: product.subscription?.prorate ?? true,
      allow_pause: product.subscription?.allow_pause ?? true,
      allow_cancel_anytime: product.subscription?.allow_cancel_anytime ?? true,
    },
  }
}

export function ProductSubscriptionSection({
  product,
}: ProductSubscriptionSectionProps) {
  const syncSubscription = useSyncProductSubscription(product.id)
  const [formValues, setFormValues] = React.useState(() =>
    defaultSubscriptionValues(product)
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const updateSubscription = (
    patch: Partial<SyncProductSubscriptionFormValues["subscription"]>
  ) => {
    setFormValues((current) => ({
      subscription: { ...current.subscription, ...patch },
    }))
  }

  const handleSave = () => {
    const result = syncProductSubscriptionSchema.safeParse(formValues)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    syncSubscription.mutate(result.data, {
      onSuccess: () => toast.success("Subscription settings saved"),
      onError: () => toast.error("Failed to save subscription settings"),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription billing</CardTitle>
        <p className="text-sm text-muted-foreground">
          Recurring billing interval, trial, and cancellation rules.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Billing interval</FieldLabel>
            <FieldContent>
              <Select
                value={formValues.subscription.interval}
                onValueChange={(value) =>
                  updateSubscription({
                    interval:
                      value as SyncProductSubscriptionFormValues["subscription"]["interval"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FieldError message={errors["subscription.interval"]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Interval count</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={1}
                value={formValues.subscription.interval_count ?? 1}
                onChange={(event) =>
                  updateSubscription({
                    interval_count: Number(event.target.value) || 1,
                  })
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Trial days</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                value={formValues.subscription.trial_days ?? 0}
                onChange={(event) =>
                  updateSubscription({
                    trial_days: Number(event.target.value) || 0,
                  })
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Trial price</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                value={formValues.subscription.trial_price ?? ""}
                onChange={(event) =>
                  updateSubscription({
                    trial_price: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                placeholder="Free trial"
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Billing cycles</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={1}
                value={formValues.subscription.billing_cycles ?? ""}
                onChange={(event) =>
                  updateSubscription({
                    billing_cycles: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                placeholder="Unlimited"
              />
            </FieldContent>
          </Field>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="subscription-prorate"
              checked={formValues.subscription.prorate ?? true}
              onCheckedChange={(checked) => updateSubscription({ prorate: !!checked })}
            />
            <label htmlFor="subscription-prorate" className="text-sm">
              Prorate plan changes
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="subscription-pause"
              checked={formValues.subscription.allow_pause ?? true}
              onCheckedChange={(checked) =>
                updateSubscription({ allow_pause: !!checked })
              }
            />
            <label htmlFor="subscription-pause" className="text-sm">
              Allow customers to pause
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="subscription-cancel"
              checked={formValues.subscription.allow_cancel_anytime ?? true}
              onCheckedChange={(checked) =>
                updateSubscription({ allow_cancel_anytime: !!checked })
              }
            />
            <label htmlFor="subscription-cancel" className="text-sm">
              Allow cancel anytime
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={syncSubscription.isPending}
          >
            {syncSubscription.isPending && <Spinner />}
            Save subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
