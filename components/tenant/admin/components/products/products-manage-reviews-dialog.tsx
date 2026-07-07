"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { handleFormApiError } from "@/lib/form-api-errors"
import { toastApiSuccess } from "@/lib/toast-api"
import {
  useDeleteProductReview,
  useGetProductReviews,
  useUpdateProductReview,
} from "@/hooks/tenant/use-product-nested-query"
import { type Product } from "@/types/tenant/product"
import { type ProductReview } from "@/types/tenant/product-nested"
import {
  updateProductReviewSchema,
  type UpdateProductReviewFormValues,
} from "@/schemas/tenant/product-nested-schema"

type ProductsManageReviewsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ProductsManageReviewsDialog({
  open,
  onOpenChange,
  product,
}: ProductsManageReviewsDialogProps) {
  const { data: reviews = [], isLoading } = useGetProductReviews(product.id, open)
  const updateReview = useUpdateProductReview(product.id)
  const deleteReview = useDeleteProductReview(product.id)
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null)

  const form = useForm<UpdateProductReviewFormValues>({
    resolver: zodResolver(updateProductReviewSchema),
    defaultValues: { is_approved: false, admin_reply: "" },
  })

  React.useEffect(() => {
    if (!selectedReview) return
    form.reset({
      is_approved: selectedReview.is_approved,
      admin_reply: selectedReview.admin_reply ?? "",
    })
  }, [selectedReview, form])

  const onSubmit = (data: UpdateProductReviewFormValues) => {
    if (!selectedReview) return
    updateReview.mutate(
      { reviewId: selectedReview.id, payload: data },
      {
        onSuccess: (response) => {
          toastApiSuccess(response.message, "Review updated")
          setSelectedReview(null)
        },
        onError: (error) =>
          handleFormApiError(error, form.setError, "Failed to update review"),
      }
    )
  }

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Product reviews</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Moderate customer reviews for <strong>{product.name}</strong>.
              Reviews are submitted on the storefront.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : reviews.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rating</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.rating}/5</TableCell>
                    <TableCell>
                      {review.author_name ?? review.author_email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.is_approved ? "secondary" : "outline"}>
                        {review.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSelectedReview(review)}
                        >
                          <MessageSquare className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive"
                          onClick={() =>
                            deleteReview.mutate(review.id, {
                              onSuccess: (response) =>
                                toastApiSuccess(response.message, "Review deleted"),
                              onError: () => toast.error("Failed to delete review"),
                            })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!selectedReview}
        onOpenChange={(val) => !val && setSelectedReview(null)}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Moderate review</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {selectedReview?.title ?? selectedReview?.content ?? ""}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="review-approved"
                checked={form.watch("is_approved")}
                onCheckedChange={(checked) =>
                  form.setValue("is_approved", !!checked)
                }
              />
              <label htmlFor="review-approved" className="text-sm font-medium">
                Approved for storefront
              </label>
            </div>
            <Field>
              <FieldLabel>Admin reply</FieldLabel>
              <FieldContent>
                <Textarea
                  className="min-h-24"
                  {...form.register("admin_reply")}
                />
              </FieldContent>
            </Field>
            <ResponsiveDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedReview(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateReview.isPending}>
                {updateReview.isPending && <Spinner />}
                Save
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
