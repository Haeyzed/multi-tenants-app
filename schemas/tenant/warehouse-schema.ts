import { z } from "zod"

const baseWarehouseSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required").max(50),
  description: z.string().nullable().optional(),
  address_line_1: z.string().max(255).nullable().optional(),
  address_line_2: z.string().max(255).nullable().optional(),
  city: z.string().max(255).nullable().optional(),
  state: z.string().max(255).nullable().optional(),
  postal_code: z.string().max(20).nullable().optional(),
  country: z
    .string()
    .length(2, "Country must be a 2-letter code")
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: z.string().max(30).nullable().optional(),
  email: z
    .string()
    .email("Must be a valid email")
    .max(255)
    .nullable()
    .optional()
    .or(z.literal("")),
  manager_name: z.string().max(255).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  is_active: z.boolean(),
  is_primary: z.boolean().optional(),
  sort_order: z.number().int().min(0).nullable().optional(),
})

export const storeWarehouseSchema = baseWarehouseSchema

export const updateWarehouseSchema = baseWarehouseSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  code: z.string().min(1, "Code is required").max(50).optional(),
})

export const storeWarehouseZoneSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required").max(50),
  description: z.string().nullable().optional(),
  zone_type: z.string().max(50).nullable().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).nullable().optional(),
})

export const updateWarehouseZoneSchema = storeWarehouseZoneSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  code: z.string().min(1, "Code is required").max(50).optional(),
})

export const storeWarehouseLocationSchema = z.object({
  zone_id: z.number().int().nullable().optional(),
  code: z.string().min(1, "Code is required").max(50),
  name: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  max_weight: z.number().min(0).nullable().optional(),
  max_volume: z.number().min(0).nullable().optional(),
  is_active: z.boolean().optional(),
  is_picking_location: z.boolean().optional(),
})

export const updateWarehouseLocationSchema =
  storeWarehouseLocationSchema.partial().extend({
    code: z.string().min(1, "Code is required").max(50).optional(),
  })

export type StoreWarehouseFormValues = z.infer<typeof storeWarehouseSchema>
export type UpdateWarehouseFormValues = z.infer<typeof updateWarehouseSchema>
export type StoreWarehouseZoneFormValues = z.infer<typeof storeWarehouseZoneSchema>
export type UpdateWarehouseZoneFormValues = z.infer<
  typeof updateWarehouseZoneSchema
>
export type StoreWarehouseLocationFormValues = z.infer<
  typeof storeWarehouseLocationSchema
>
export type UpdateWarehouseLocationFormValues = z.infer<
  typeof updateWarehouseLocationSchema
>
