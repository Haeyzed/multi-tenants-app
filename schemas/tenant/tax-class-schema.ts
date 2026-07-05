import { z } from "zod"

const baseTaxClassSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50)
    .regex(/^[a-z0-9_-]+$/, "Code must be lowercase letters, numbers, hyphens, or underscores"),
  description: z.string().nullable().optional(),
  is_default: z.boolean().optional(),
  is_active: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeTaxClassSchema = baseTaxClassSchema

export const updateTaxClassSchema = baseTaxClassSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50)
    .regex(/^[a-z0-9_-]+$/, "Code must be lowercase letters, numbers, hyphens, or underscores")
    .optional(),
})

export type StoreTaxClassFormValues = z.infer<typeof storeTaxClassSchema>
export type UpdateTaxClassFormValues = z.infer<typeof updateTaxClassSchema>
