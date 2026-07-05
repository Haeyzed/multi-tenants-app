import { z } from "zod"

const baseTaxZoneSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  country_code: z
    .string()
    .length(2, "Country code must be 2 characters")
    .nullable()
    .optional()
    .or(z.literal("")),
  state: z.string().max(255).nullable().optional(),
  city: z.string().max(255).nullable().optional(),
  postal_code: z.string().max(20).nullable().optional(),
  postal_code_pattern: z.string().max(50).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  radius_km: z.number().min(0).nullable().optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeTaxZoneSchema = baseTaxZoneSchema

export const updateTaxZoneSchema = baseTaxZoneSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreTaxZoneFormValues = z.infer<typeof storeTaxZoneSchema>
export type UpdateTaxZoneFormValues = z.infer<typeof updateTaxZoneSchema>
