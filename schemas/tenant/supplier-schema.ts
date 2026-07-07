import { z } from "zod"

const optionalUrl = z
  .string()
  .max(255)
  .nullable()
  .optional()
  .refine(
    (value) =>
      !value || value === "" || z.string().url().safeParse(value).success,
    { message: "Must be a valid URL" }
  )

const baseSupplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().min(1, "Code is required").max(50),
  description: z.string().nullable().optional(),
  contact_name: z.string().max(255).nullable().optional(),
  contact_email: z
    .string()
    .email("Must be a valid email")
    .max(255)
    .nullable()
    .optional()
    .or(z.literal("")),
  contact_phone: z.string().max(30).nullable().optional(),
  website_url: optionalUrl,
  tax_id: z.string().max(255).nullable().optional(),
  registration_number: z.string().max(255).nullable().optional(),
  is_active: z.boolean(),
})

export const storeSupplierSchema = baseSupplierSchema

export const updateSupplierSchema = baseSupplierSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  code: z.string().min(1, "Code is required").max(50).optional(),
})

export const storeSupplierContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z
    .string()
    .email("Must be a valid email")
    .max(255)
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: z.string().max(30).nullable().optional(),
  position: z.string().max(255).nullable().optional(),
  is_primary: z.boolean().optional(),
})

export const updateSupplierContactSchema = storeSupplierContactSchema
  .partial()
  .extend({
    name: z.string().min(1, "Name is required").max(255).optional(),
  })

export const storeSupplierAddressSchema = z.object({
  type: z.enum(["office", "billing", "shipping"]).optional(),
  address_line_1: z.string().min(1, "Address line 1 is required").max(255),
  address_line_2: z.string().max(255).nullable().optional(),
  city: z.string().min(1, "City is required").max(255),
  state: z.string().max(255).nullable().optional(),
  postal_code: z.string().max(20).nullable().optional(),
  country: z.string().length(2, "Country must be a 2-letter code"),
  is_default: z.boolean().optional(),
})

export const updateSupplierAddressSchema = storeSupplierAddressSchema
  .partial()
  .extend({
    address_line_1: z
      .string()
      .min(1, "Address line 1 is required")
      .max(255)
      .optional(),
    city: z.string().min(1, "City is required").max(255).optional(),
    country: z.string().length(2, "Country must be a 2-letter code").optional(),
  })

export const storeSupplierBankAccountSchema = z.object({
  account_name: z.string().min(1, "Account name is required").max(255),
  account_number: z.string().min(1, "Account number is required").max(50),
  bank_name: z.string().min(1, "Bank name is required").max(255),
  bank_branch: z.string().max(255).nullable().optional(),
  swift_code: z.string().max(20).nullable().optional(),
  iban: z.string().max(34).nullable().optional(),
  currency: z.string().length(3).optional(),
  is_default: z.boolean().optional(),
})

export const updateSupplierBankAccountSchema = storeSupplierBankAccountSchema
  .partial()
  .extend({
    account_name: z
      .string()
      .min(1, "Account name is required")
      .max(255)
      .optional(),
    account_number: z
      .string()
      .min(1, "Account number is required")
      .max(50)
      .optional(),
    bank_name: z.string().min(1, "Bank name is required").max(255).optional(),
  })

export type StoreSupplierFormValues = z.infer<typeof storeSupplierSchema>
export type UpdateSupplierFormValues = z.infer<typeof updateSupplierSchema>
export type StoreSupplierContactFormValues = z.infer<
  typeof storeSupplierContactSchema
>
export type UpdateSupplierContactFormValues = z.infer<
  typeof updateSupplierContactSchema
>
export type StoreSupplierAddressFormValues = z.infer<
  typeof storeSupplierAddressSchema
>
export type UpdateSupplierAddressFormValues = z.infer<
  typeof updateSupplierAddressSchema
>
export type StoreSupplierBankAccountFormValues = z.infer<
  typeof storeSupplierBankAccountSchema
>
export type UpdateSupplierBankAccountFormValues = z.infer<
  typeof updateSupplierBankAccountSchema
>
