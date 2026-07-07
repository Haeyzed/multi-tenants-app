import { z } from "zod"

export const storeProductFaqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required"),
  is_visible: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
})

export const updateProductFaqSchema = storeProductFaqSchema.partial().extend({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).optional(),
})

export const storeProductDocumentSchema = z.object({
  media_id: z.number().min(1, "Select a file"),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable().optional(),
  document_type: z
    .enum(["manual", "datasheet", "certificate", "warranty"])
    .default("manual"),
  language: z.string().max(10).default("en"),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_public: z.boolean().optional(),
})

export const updateProductDocumentSchema = storeProductDocumentSchema.partial().extend({
  media_id: z.number().min(1).optional(),
  title: z.string().min(1).max(255).optional(),
})

export const answerProductQuestionSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
  is_visible: z.boolean().optional(),
})

export const updateProductReviewSchema = z.object({
  is_approved: z.boolean().optional(),
  admin_reply: z.string().nullable().optional(),
})

export const productVideoSchema = z.object({
  video_url: z
    .string()
    .min(1, "Video URL is required")
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}.*/,
      "Enter a valid YouTube URL"
    ),
  title: z.string().max(255).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_primary: z.boolean().optional(),
})

export const syncProductVideosSchema = z.object({
  videos: z.array(productVideoSchema),
})

export type StoreProductFaqFormValues = z.infer<typeof storeProductFaqSchema>
export type UpdateProductFaqFormValues = z.infer<typeof updateProductFaqSchema>
export type StoreProductDocumentFormValues = z.infer<typeof storeProductDocumentSchema>
export type UpdateProductDocumentFormValues = z.infer<typeof updateProductDocumentSchema>
export type AnswerProductQuestionFormValues = z.infer<typeof answerProductQuestionSchema>
export type UpdateProductReviewFormValues = z.infer<typeof updateProductReviewSchema>
export type ProductVideoFormValues = z.infer<typeof productVideoSchema>
