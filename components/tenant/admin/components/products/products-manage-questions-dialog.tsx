"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquareReply, Trash2 } from "lucide-react"
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
  useAnswerProductQuestion,
  useDeleteProductQuestion,
  useGetProductQuestions,
} from "@/hooks/tenant/use-product-nested-query"
import { type Product } from "@/types/tenant/product"
import { type ProductQuestion } from "@/types/tenant/product-nested"
import {
  answerProductQuestionSchema,
  type AnswerProductQuestionFormValues,
} from "@/schemas/tenant/product-nested-schema"

type ProductsManageQuestionsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ProductsManageQuestionsDialog({
  open,
  onOpenChange,
  product,
}: ProductsManageQuestionsDialogProps) {
  const { data: questions = [], isLoading } = useGetProductQuestions(
    product.id,
    open
  )
  const answerQuestion = useAnswerProductQuestion(product.id)
  const deleteQuestion = useDeleteProductQuestion(product.id)
  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestion | null>(
    null
  )

  const form = useForm<AnswerProductQuestionFormValues>({
    resolver: zodResolver(answerProductQuestionSchema),
    defaultValues: { answer: "", is_visible: true },
  })

  React.useEffect(() => {
    if (!selectedQuestion) return
    form.reset({
      answer: selectedQuestion.answer ?? "",
      is_visible: selectedQuestion.is_visible,
    })
  }, [selectedQuestion, form])

  const onSubmit = (data: AnswerProductQuestionFormValues) => {
    if (!selectedQuestion) return
    answerQuestion.mutate(
      { questionId: selectedQuestion.id, payload: data },
      {
        onSuccess: (response) => {
          toastApiSuccess(response.message, "Question answered")
          setSelectedQuestion(null)
        },
        onError: (error) =>
          handleFormApiError(error, form.setError, "Failed to answer question"),
      }
    )
  }

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Customer questions</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Questions submitted by customers for{" "}
              <strong>{product.name}</strong>. Answer them here to publish on the
              storefront.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : questions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No customer questions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-md truncate">
                      {question.question}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={question.is_answered ? "secondary" : "outline"}
                      >
                        {question.is_answered ? "Answered" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <MessageSquareReply className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive"
                          onClick={() =>
                            deleteQuestion.mutate(question.id, {
                              onSuccess: (response) =>
                                toastApiSuccess(
                                  response.message,
                                  "Question deleted"
                                ),
                              onError: () =>
                                toast.error("Failed to delete question"),
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
        open={!!selectedQuestion}
        onOpenChange={(val) => !val && setSelectedQuestion(null)}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Answer question</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {selectedQuestion?.question}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Answer *</FieldLabel>
              <FieldContent>
                <Textarea className="min-h-24" {...form.register("answer")} />
              </FieldContent>
            </Field>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="question-visible"
                checked={form.watch("is_visible")}
                onCheckedChange={(checked) =>
                  form.setValue("is_visible", !!checked)
                }
              />
              <label htmlFor="question-visible" className="text-sm font-medium">
                Visible on storefront
              </label>
            </div>
            <ResponsiveDialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedQuestion(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={answerQuestion.isPending}>
                {answerQuestion.isPending && <Spinner />}
                Save answer
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
