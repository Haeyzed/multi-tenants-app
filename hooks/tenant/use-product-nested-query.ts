import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  answerProductQuestion,
  createProductDocument,
  createProductFaq,
  deleteProductDocument,
  deleteProductFaq,
  deleteProductQuestion,
  deleteProductReview,
  duplicateProduct,
  getProductDocuments,
  getProductFaqs,
  getProductQuestions,
  getProductReviews,
  syncProductVideos,
  updateProductDocument,
  updateProductFaq,
  updateProductReview,
} from "@/lib/services/tenant/product-service"
import {
  type AnswerProductQuestionFormValues,
  type ProductVideoFormValues,
  type StoreProductDocumentFormValues,
  type StoreProductFaqFormValues,
  type UpdateProductDocumentFormValues,
  type UpdateProductFaqFormValues,
  type UpdateProductReviewFormValues,
} from "@/schemas/tenant/product-nested-schema"

export const useDuplicateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => duplicateProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-options"] })
    },
  })
}

export const useGetProductFaqs = (productId: number, enabled = true) =>
  useQuery({
    queryKey: ["product-faqs", productId],
    queryFn: () => getProductFaqs(productId),
    enabled: enabled && !!productId,
  })

export const useCreateProductFaq = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoreProductFaqFormValues) =>
      createProductFaq(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", productId] })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useUpdateProductFaq = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      faqId,
      payload,
    }: {
      faqId: number
      payload: UpdateProductFaqFormValues
    }) => updateProductFaq(productId, faqId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", productId] })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useDeleteProductFaq = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (faqId: number) => deleteProductFaq(productId, faqId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-faqs", productId] })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useGetProductDocuments = (productId: number, enabled = true) =>
  useQuery({
    queryKey: ["product-documents", productId],
    queryFn: () => getProductDocuments(productId),
    enabled: enabled && !!productId,
  })

export const useCreateProductDocument = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: StoreProductDocumentFormValues) =>
      createProductDocument(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-documents", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useUpdateProductDocument = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      documentId,
      payload,
    }: {
      documentId: number
      payload: UpdateProductDocumentFormValues
    }) => updateProductDocument(productId, documentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-documents", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useDeleteProductDocument = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: number) =>
      deleteProductDocument(productId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-documents", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useGetProductReviews = (productId: number, enabled = true) =>
  useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: enabled && !!productId,
  })

export const useUpdateProductReview = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: number
      payload: UpdateProductReviewFormValues
    }) => updateProductReview(productId, reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useDeleteProductReview = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: number) => deleteProductReview(productId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useGetProductQuestions = (productId: number, enabled = true) =>
  useQuery({
    queryKey: ["product-questions", productId],
    queryFn: () => getProductQuestions(productId),
    enabled: enabled && !!productId,
  })

export const useAnswerProductQuestion = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: number
      payload: AnswerProductQuestionFormValues
    }) => answerProductQuestion(productId, questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-questions", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useDeleteProductQuestion = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (questionId: number) =>
      deleteProductQuestion(productId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-questions", productId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}

export const useSyncProductVideos = (productId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (videos: ProductVideoFormValues[]) =>
      syncProductVideos(productId, videos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
    },
  })
}
