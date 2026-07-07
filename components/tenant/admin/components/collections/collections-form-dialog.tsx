"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateCollection,
  useUpdateCollection,
} from "@/hooks/tenant/use-collection-query"
import { type Collection, type CollectionType } from "@/types/tenant/collection"
import {
  type StoreCollectionFormValues,
  storeCollectionSchema,
  type UpdateCollectionFormValues,
  updateCollectionSchema,
} from "@/schemas/tenant/collection-schema"

type CollectionsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Collection
  onCreated?: (collection: Collection) => void
}

const TYPE_OPTIONS: { label: string; value: CollectionType }[] = [
  { label: "Manual", value: "manual" },
  { label: "Automated", value: "automated" },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function stringifyConditions(
  conditions: Record<string, unknown> | null | undefined
): string {
  if (!conditions || Object.keys(conditions).length === 0) {
    return ""
  }

  return JSON.stringify(conditions, null, 2)
}

function parseConditionsJson(value: string): Record<string, unknown> | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const parsed = JSON.parse(trimmed) as unknown
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Conditions must be a JSON object.")
  }

  return parsed as Record<string, unknown>
}

export function CollectionsFormDialog({
  open,
  onOpenChange,
  currentRow,
  onCreated,
}: CollectionsFormDialogProps) {
  const isUpdate = !!currentRow
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const isSubmitting = createCollection.isPending || updateCollection.isPending

  const schema = isUpdate ? updateCollectionSchema : storeCollectionSchema

  const form = useForm<StoreCollectionFormValues | UpdateCollectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      meta_title: "",
      meta_description: "",
      is_visible: true,
      is_featured: false,
      sort_order: 0,
      type: "manual",
      sort_by: "",
      conditions: null,
    },
  })

  const [conditionsJson, setConditionsJson] = React.useState("")
  const [conditionsError, setConditionsError] = React.useState<string | null>(
    null
  )

  const typeValue = form.watch("type")
  const selectedType =
    TYPE_OPTIONS.find((option) => option.value === typeValue) ?? TYPE_OPTIONS[0]

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || "",
        meta_title: currentRow.meta_title || "",
        meta_description: currentRow.meta_description || "",
        is_visible: currentRow.is_visible,
        is_featured: currentRow.is_featured,
        sort_order: currentRow.sort_order ?? 0,
        type: currentRow.type,
        sort_by: currentRow.sort_by || "",
        conditions: currentRow.conditions,
      })
      setConditionsJson(stringifyConditions(currentRow.conditions))
    } else {
      form.reset({
        name: "",
        description: "",
        meta_title: "",
        meta_description: "",
        is_visible: true,
        is_featured: false,
        sort_order: 0,
        type: "manual",
        sort_by: "",
        conditions: null,
      })
      setConditionsJson("")
    }

    setConditionsError(null)
  }, [open, currentRow, form])

  const onSubmit = (
    data: StoreCollectionFormValues | UpdateCollectionFormValues
  ) => {
    let conditions: Record<string, unknown> | null = null

    try {
      conditions = parseConditionsJson(conditionsJson)
      setConditionsError(null)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid conditions JSON."
      setConditionsError(message)
      toast.error(message)
      return
    }

    const payload = {
      ...data,
      description: data.description || null,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      sort_by: data.sort_by || null,
      is_featured: data.is_featured ?? false,
      conditions,
    }

    if (isUpdate && currentRow) {
      updateCollection.mutate(
        {
          id: currentRow.id,
          collection: payload as UpdateCollectionFormValues,
        },
        {
          onSuccess: () => {
            toast.success("Collection updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update collection"
            )
          },
        }
      )
    } else {
      createCollection.mutate(payload as StoreCollectionFormValues, {
        onSuccess: (created) => {
          toast.success("Collection created successfully")
          onCreated?.(created)
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create collection"
          )
        },
      })
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Collection
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the collection by providing necessary info."
              : "Add a new collection by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="collections-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Collection name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Collection description..."
                {...form.register("description")}
              />
              <FieldError
                message={form.formState.errors.description?.message}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Meta Title</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="SEO title"
                  {...form.register("meta_title")}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Sort By</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="e.g. created_at"
                  {...form.register("sort_by")}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Meta Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="SEO description..."
                {...form.register("meta_description")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Type *</FieldLabel>
            <FieldContent>
              <Combobox
                items={TYPE_OPTIONS}
                itemToStringValue={(item) => item.label}
                value={selectedType}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue("type", item.value)
                }}
              >
                <ComboboxInput placeholder="Select collection type..." />
                <ComboboxContent>
                  <ComboboxEmpty>No types found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError message={form.formState.errors.type?.message} />
            </FieldContent>
          </Field>

          {typeValue === "automated" ? (
            <Field>
              <FieldLabel>Conditions (JSON)</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder='{"rules": []}'
                  value={conditionsJson}
                  onChange={(event) => setConditionsJson(event.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <FieldError message={conditionsError ?? undefined} />
              </FieldContent>
            </Field>
          ) : null}

          <Field>
            <FieldLabel>Sort Order</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                {...form.register("sort_order", { valueAsNumber: true })}
              />
            </FieldContent>
          </Field>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_visible"
                checked={form.watch("is_visible")}
                onCheckedChange={(checked) =>
                  form.setValue("is_visible", !!checked)
                }
              />
              <label htmlFor="is_visible" className="text-sm font-medium">
                Visible
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) =>
                  form.setValue("is_featured", !!checked)
                }
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="collections-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Collection"
                : "Create Collection"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
