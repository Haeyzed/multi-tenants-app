import { z } from "zod"

const unitTypeSchema = z.enum(["weight", "length", "volume", "area", "count"])

const baseUnitSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50)
    .regex(
      /^[a-z0-9_-]+$/,
      "Code must be lowercase letters, numbers, hyphens, or underscores"
    ),
  symbol: z.string().min(1, "Symbol is required").max(20),
  type: unitTypeSchema,
  conversion_factor: z
    .number()
    .gt(0, "Conversion factor must be greater than 0"),
  is_base: z.boolean().optional(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeUnitSchema = baseUnitSchema

export const updateUnitSchema = baseUnitSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  code: z
    .string()
    .min(1, "Code is required")
    .max(50)
    .regex(
      /^[a-z0-9_-]+$/,
      "Code must be lowercase letters, numbers, hyphens, or underscores"
    )
    .optional(),
  symbol: z.string().min(1, "Symbol is required").max(20).optional(),
  type: unitTypeSchema.optional(),
})

export type StoreUnitFormValues = z.infer<typeof storeUnitSchema>
export type UpdateUnitFormValues = z.infer<typeof updateUnitSchema>
