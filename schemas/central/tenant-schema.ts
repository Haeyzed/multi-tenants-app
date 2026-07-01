import { z } from "zod"

export const tenantSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().max(255).nullable().optional(),
  email: z.string().email("Invalid email").max(255).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  plan_id: z.number().nullable().optional(),
  trial_ends_at: z
    .union([z.string().datetime(), z.literal(""), z.null()])
    .optional()
    .transform((value) => (value === "" ? null : value)),
  subdomain: z.string().max(63).nullable().optional(),
  status: z.enum(["pending", "active", "suspended"]).optional(),
  owner: z.object({
    name: z.string().min(1, "Owner name is required").max(255),
    email: z.string().email("Invalid email").max(255),
    phone: z.string().max(30).nullable().optional(),
  }),
})

export const updateTenantSchema = tenantSchema.omit({
  owner: true,
  subdomain: true,
  slug: true,
})

export type StoreTenantFormValues = z.infer<typeof tenantSchema>
export type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>
