import { z } from "zod"

const applicableTypeSchema = z.enum(["product", "customer_group"])
const ruleTypeSchema = z.enum(["override", "exempt", "reduce", "increase"])

const baseTaxRuleSchema = z.object({
  tax_rate_id: z.number({ message: "Tax rate is required" }).min(1),
  applicable_type: applicableTypeSchema,
  applicable_id: z.number({ message: "Applicable entity is required" }).min(1),
  rule_type: ruleTypeSchema,
  adjustment_rate: z.number().min(0).max(100).nullable().optional(),
  effective_from: z.string().nullable().optional(),
  effective_to: z.string().nullable().optional(),
  is_active: z.boolean(),
})

export const storeTaxRuleSchema = baseTaxRuleSchema

export const updateTaxRuleSchema = baseTaxRuleSchema.partial().extend({
  tax_rate_id: z.number().min(1).optional(),
  applicable_type: applicableTypeSchema.optional(),
  applicable_id: z.number().min(1).optional(),
  rule_type: ruleTypeSchema.optional(),
})

export type StoreTaxRuleFormValues = z.infer<typeof storeTaxRuleSchema>
export type UpdateTaxRuleFormValues = z.infer<typeof updateTaxRuleSchema>
