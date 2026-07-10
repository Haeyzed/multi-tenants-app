"use client"

import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"
import {
  type ProductFormSectionProps,
  productVisibilityOptions,
  statusOptions,
} from "./product-form-shared"

function parsePublishedAt(value: string | null | undefined): Date | undefined {
  if (!value) return undefined

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export function ProductPublishingSection({ form }: ProductFormSectionProps) {
  const status = form.watch("status")
  const visibility = form.watch("visibility")
  const publishedAt = form.watch("published_at")

  const selectedStatus =
    statusOptions.find((item) => item.value === status) ?? statusOptions[0]
  const selectedVisibility =
    productVisibilityOptions.find((item) => item.value === visibility) ??
    productVisibilityOptions[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <Combobox
              items={statusOptions}
              itemToStringValue={(item) => item.label}
              value={selectedStatus}
              onValueChange={(item) => {
                if (!item) return
                form.setValue(
                  "status",
                  item.value as StoreProductFormValues["status"]
                )
              }}
            >
              <ComboboxInput placeholder="Select status..." showClear />
              <ComboboxContent>
                <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Visibility</FieldLabel>
          <FieldContent>
            <Combobox
              items={productVisibilityOptions}
              itemToStringValue={(item) => item.label}
              value={selectedVisibility}
              onValueChange={(item) => {
                if (!item) return
                form.setValue(
                  "visibility",
                  item.value as StoreProductFormValues["visibility"]
                )
              }}
            >
              <ComboboxInput placeholder="Select visibility..." showClear />
              <ComboboxContent>
                <ComboboxEmpty>No visibility options found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FieldContent>
        </Field>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_featured"
            checked={form.watch("is_featured")}
            onCheckedChange={(checked) =>
              form.setValue("is_featured", !!checked)
            }
          />
          <label htmlFor="is_featured" className="text-sm font-medium">
            Featured product
          </label>
        </div>

        <Field>
          <FieldLabel>Published at</FieldLabel>
          <FieldContent>
            <DateTimePicker
              value={parsePublishedAt(publishedAt)}
              onChange={(date) =>
                form.setValue(
                  "published_at",
                  date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : null
                )
              }
              placeholder="Pick publish date and time"
            />
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  )
}
