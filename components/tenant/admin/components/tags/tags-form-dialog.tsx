"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/ui/color-picker"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import { useCreateTag, useUpdateTag } from "@/hooks/tenant/use-tag-query"
import { type Tag } from "@/types/tenant/tag"
import {
  type StoreTagFormValues,
  storeTagSchema,
  type UpdateTagFormValues,
  updateTagSchema,
} from "@/schemas/tenant/tag-schema"

type TagsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Tag
  onCreated?: (tag: Tag) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function TagsFormDialog({
  open,
  onOpenChange,
  currentRow,
  onCreated,
}: TagsFormDialogProps) {
  const isUpdate = !!currentRow
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const isSubmitting = createTag.isPending || updateTag.isPending

  const schema = isUpdate ? updateTagSchema : storeTagSchema

  const form = useForm<StoreTagFormValues | UpdateTagFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      color: "",
      icon: "",
      is_visible: true,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        color: currentRow.color || "",
        icon: currentRow.icon || "",
        is_visible: currentRow.is_visible,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        color: "",
        icon: "",
        is_visible: true,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StoreTagFormValues | UpdateTagFormValues) => {
    const payload = {
      ...data,
      color: data.color || null,
      icon: data.icon || null,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateTag.mutate(
        { id: currentRow.id, tag: payload as UpdateTagFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Tag updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update tag")
          },
        }
      )
    } else {
      createTag.mutate(payload as StoreTagFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Tag created successfully")
          onCreated?.(result.data)
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create tag")
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
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Tag
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tag by providing necessary info."
              : "Add a new tag by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tags-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Tag name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <FieldContent>
              <ColorPicker
                value={form.watch("color") || "#3b82f6"}
                onValueChange={(value) =>
                  form.setValue("color", value || "", { shouldDirty: true })
                }
                defaultFormat="hex"
              >
                <div className="flex items-center gap-3">
                  <ColorPickerTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 px-3"
                      >
                        <ColorPickerSwatch className="size-4" />
                        {form.watch("color") || "Pick color"}
                      </Button>
                    }
                  />
                  {form.watch("color") ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setValue("color", "", { shouldDirty: true })
                      }
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
                <ColorPickerContent>
                  <ColorPickerArea />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <div className="flex flex-1 flex-col gap-2">
                      <ColorPickerHueSlider />
                      <ColorPickerAlphaSlider />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                  </div>
                </ColorPickerContent>
              </ColorPicker>
              <FieldError message={form.formState.errors.color?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Icon</FieldLabel>
            <FieldContent>
              <Input placeholder="lucide-tag" {...form.register("icon")} />
              <FieldError message={form.formState.errors.icon?.message} />
            </FieldContent>
          </Field>

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
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tags-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tag"
                : "Create Tag"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
