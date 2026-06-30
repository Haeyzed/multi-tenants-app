import { z } from "zod"

const basePlanSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(100),
  name: z.string().min(1, "Name is required").max(150),
  description: z.string().max(2000).nullable().optional(),
  price: z.number().min(0, "Price must be at least 0"),
  currency: z.string().length(3, "Currency must be 3 characters"),
  interval: z.enum(["monthly", "yearly"]),
  stripe_price_id: z.string().max(255).nullable().optional(),
  paddle_price_id: z.string().max(255).nullable().optional(),
  paystack_plan_code: z.string().max(255).nullable().optional(),
  paypal_plan_id: z.string().max(255).nullable().optional(),
  flutterwave_plan_id: z.string().max(255).nullable().optional(),
  limits: z
    .union([z.record(z.string(), z.number().nullable()), z.array(z.string())])
    .nullable()
    .optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number().min(0),
  features: z.array(z.string().max(255)).nullable().optional(),
})

export const storePlanSchema = basePlanSchema

export const updatePlanSchema = basePlanSchema.omit({
  slug: true,
})

export type StorePlanFormValues = z.infer<typeof storePlanSchema>
export type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>
