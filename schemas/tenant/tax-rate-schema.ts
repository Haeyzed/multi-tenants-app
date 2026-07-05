import { z } from "zod"

const baseTaxRateSchema = z.object({
  tax_class_id: z.number({ required_error: "Tax class is required" }).min(1),
  tax_zone_id: z.number({ required_error: "Tax zone is required" }).min(1),
  name: z.string().min(1, "Name is required").max(255),
  rate: z.number({ required_error: "Rate is required" }).min(0).max(100),
  priority: z.number().min(1).nullable().optional(),
  is_compound: z.boolean().optional(),
  applies_to_shipping: z.boolean().optional(),
  effective_from: z.string().nullable().optional(),
  effective_to: z.string().nullable().optional(),
  is_active: z.boolean(),
})

export const storeTaxRateSchema = baseTaxRateSchema

export const updateTaxRateSchema = baseTaxRateSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  tax_class_id: z.number().min(1).optional(),
  tax_zone_id: z.number().min(1).optional(),
  rate: z.number().min(0).max(100).optional(),
})

export type StoreTaxRateFormValues = z.infer<typeof storeTaxRateSchema>
export type UpdateTaxRateFormValues = z.infer<typeof updateTaxRateSchema>
