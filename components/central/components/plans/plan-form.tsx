"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planSchema, PlanFormValues } from "@/schemas/central/plan-schema";
import { Plan } from "@/types/central/plan";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (values: PlanFormValues) => void;
  isSubmitting?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive mt-1">{message}</p>;
}

/** Convert limits to string array for form editing */
function normalizeLimits(limits: Plan["limits"]): string[] {
  if (Array.isArray(limits)) return limits;
  if (limits && typeof limits === "object") {
    // Convert object limits to display strings (read-only)
    return Object.entries(limits).map(
      ([key, val]) => `${key}: ${val ?? "unlimited"}`
    );
  }
  return [];
}

export function PlanForm({ plan, onSubmit, isSubmitting = false }: PlanFormProps) {
  const [featureInput, setFeatureInput] = useState("");
  const [limitInput, setLimitInput] = useState("");

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: plan
      ? {
        slug: plan.slug,
        name: plan.name,
        description: plan.description,
        price: parseFloat(plan.price),
        currency: plan.currency,
        interval: plan.interval as "monthly" | "yearly",
        stripe_price_id: plan.stripe_price_id,
        paddle_price_id: plan.paddle_price_id,
        paystack_plan_code: plan.paystack_plan_code,
        paypal_plan_id: plan.paypal_plan_id,
        flutterwave_plan_id: plan.flutterwave_plan_id,
        limits: normalizeLimits(plan.limits),
        is_active: plan.is_active,
        is_featured: plan.is_featured,
        sort_order: plan.sort_order,
        features: plan.features || [],
      }
      : {
        slug: "",
        name: "",
        description: null,
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
  });

  const features = form.watch("features") || [];
  const limits = form.watch("limits") || [];

  const addFeature = () => {
    if (featureInput.trim()) {
      form.setValue("features", [...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    form.setValue(
      "features",
      features.filter((_, i) => i !== index)
    );
  };

  const addLimit = () => {
    if (limitInput.trim()) {
      form.setValue("limits", [...(limits as string[]), limitInput.trim()]);
      setLimitInput("");
    }
  };

  const removeLimit = (index: number) => {
    form.setValue(
      "limits",
      (limits as string[]).filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={form.watch("description") || ""}
          />
          <FieldError message={form.formState.errors.description?.message} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field>
          <FieldLabel>Price *</FieldLabel>
          <FieldContent>
            <Input type="number" step="0.01" placeholder="99.99" {...form.register("price")} />
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
          <Input type="number" {...form.register("sort_order")} />
          <FieldError message={form.formState.errors.sort_order?.message} />
        </FieldContent>
      </Field>

      {/* Payment Provider IDs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Features */}
      <Field>
        <FieldLabel>Features</FieldLabel>
        <FieldContent>
          <div className="flex gap-2">
            <Input
              placeholder="Add a feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" size="sm" onClick={addFeature}>
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
              >
                {feature}
                <button type="button" onClick={() => removeFeature(index)} className="hover:text-destructive">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        </FieldContent>
      </Field>

      {/* Limits */}
      <Field>
        <FieldLabel>Limits</FieldLabel>
        <FieldContent>
          <div className="flex gap-2">
            <Input
              placeholder="Add a limit..."
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLimit())}
            />
            <Button type="button" size="sm" onClick={addLimit}>
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(limits as string[]).map((limit, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
              >
                {limit}
                <button type="button" onClick={() => removeLimit(index)} className="hover:text-destructive">
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
          {plan && !Array.isArray(plan.limits) && plan.limits && (
            <p className="text-xs text-muted-foreground mt-1">
              Original limits were object-based and converted to strings for editing.
            </p>
          )}
        </FieldContent>
      </Field>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={form.watch("is_active")}
            onCheckedChange={(checked) => form.setValue("is_active", !!checked)}
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Active
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            checked={form.watch("is_featured")}
            onCheckedChange={(checked) => form.setValue("is_featured", !!checked)}
          />
          <label htmlFor="is_featured" className="text-sm font-medium">
            Featured
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
      </Button>
    </form>
  );
}