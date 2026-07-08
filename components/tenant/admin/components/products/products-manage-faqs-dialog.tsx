"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2 } from "lucide-react"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import {
  useCreateProductFaq,
  useDeleteProductFaq,
  useGetProductFaqs,
  useUpdateProductFaq,
} from "@/hooks/tenant/use-product-nested-query"
import { type Product } from "@/types/tenant/product"
import { type ProductFaq } from "@/types/tenant/product-nested"
import {
  type StoreProductFaqFormValues,
  storeProductFaqSchema,
  type UpdateProductFaqFormValues,
  updateProductFaqSchema,
} from "@/schemas/tenant/product-nested-schema"

type ProductsManageFaqsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function ProductsManageFaqsDialog({
  open,
  onOpenChange,
  product,
}: ProductsManageFaqsDialogProps) {
  const { data: faqs = [], isLoading } = useGetProductFaqs(product.id, open)
  const createFaq = useCreateProductFaq(product.id)
  const updateFaq = useUpdateProductFaq(product.id)
  const deleteFaq = useDeleteProductFaq(product.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<ProductFaq | null>(null)
  const [deletingFaq, setDeletingFaq] = useState<ProductFaq | null>(null)

  const isUpdate = !!editingFaq
  const schema = isUpdate ? updateProductFaqSchema : storeProductFaqSchema

  const form = useForm<StoreProductFaqFormValues | UpdateProductFaqFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      answer: "",
      is_visible: true,
      sort_order: 0,
    },
  })

  const openCreateForm = () => {
    setEditingFaq(null)
    form.reset({
      question: "",
      answer: "",
      is_visible: true,
      sort_order: faqs.length,
    })
    setFormOpen(true)
  }

  const openEditForm = (faq: ProductFaq) => {
    setEditingFaq(faq)
    form.reset({
      question: faq.question,
      answer: faq.answer,
      is_visible: faq.is_visible,
      sort_order: faq.sort_order,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreProductFaqFormValues | UpdateProductFaqFormValues
  ) => {
    if (isUpdate && editingFaq) {
      updateFaq.mutate(
        { faqId: editingFaq.id, payload: data },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "FAQ updated")
            setFormOpen(false)
            setEditingFaq(null)
          },
          onError: (error) =>
            handleFormApiError(error, form.setError, "Failed to update FAQ"),
        }
      )
      return
    }

    createFaq.mutate(data as StoreProductFaqFormValues, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "FAQ created")
        setFormOpen(false)
        form.reset()
      },
      onError: (error) =>
        handleFormApiError(error, form.setError, "Failed to create FAQ"),
    })
  }

  const handleDelete = () => {
    if (!deletingFaq) return
    deleteFaq.mutate(deletingFaq.id, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "FAQ deleted")
        setDeletingFaq(null)
      },
      onError: (error) => toastApiError(error, "Failed to delete FAQ"),
    })
  }

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Manage FAQs</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Curated questions and answers for <strong>{product.name}</strong>.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={openCreateForm}>
              <Plus className="mr-1 size-3.5" />
              Add FAQ
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : faqs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No FAQs yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="max-w-md truncate">
                      {faq.question}
                    </TableCell>
                    <TableCell>
                      <Badge variant={faq.is_visible ? "secondary" : "outline"}>
                        {faq.is_visible ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => openEditForm(faq)}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive"
                          onClick={() => setDeletingFaq(faq)}
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

      <ResponsiveDialog open={formOpen} onOpenChange={setFormOpen}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit FAQ" : "Add FAQ"}
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Question *</FieldLabel>
              <FieldContent>
                <Input {...form.register("question")} />
                <FieldError message={form.formState.errors.question?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Answer *</FieldLabel>
              <FieldContent>
                <Textarea className="min-h-24" {...form.register("answer")} />
                <FieldError message={form.formState.errors.answer?.message} />
              </FieldContent>
            </Field>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="faq-visible"
                checked={form.watch("is_visible")}
                onCheckedChange={(checked) =>
                  form.setValue("is_visible", !!checked)
                }
              />
              <label htmlFor="faq-visible" className="text-sm font-medium">
                Visible on storefront
              </label>
            </div>
            <ResponsiveDialogFooter>
              <ResponsiveDialogClose
                render={
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                }
              />
              <Button
                type="submit"
                disabled={createFaq.isPending || updateFaq.isPending}
              >
                {(createFaq.isPending || updateFaq.isPending) && <Spinner />}
                Save
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingFaq}
        onOpenChange={(val) => !val && setDeletingFaq(null)}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete FAQ?</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setDeletingFaq(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteFaq.isPending}
            >
              {deleteFaq.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
