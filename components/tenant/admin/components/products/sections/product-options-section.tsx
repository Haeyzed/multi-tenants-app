"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useSyncProductOptions } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductOptionsSchema,
  type SyncProductOptionsFormValues,
} from "@/schemas/tenant/product-schema"
import {
  type Product,
  type ProductGenerationOption,
} from "@/types/tenant/product"
import { FieldError } from "./product-form-shared"

type ProductOptionsSectionProps = {
  product: Product
}

function createEmptyOption(position = 0): SyncProductOptionsFormValues["options"][number] {
  return {
    name: "",
    code: "",
    position,
    values: [{ value: "", code: "", position: 0 }],
  }
}

function mapProductOptions(product: Product): SyncProductOptionsFormValues["options"] {
  if (!product.options?.length) {
    return [createEmptyOption()]
  }

  return product.options.map((option: ProductGenerationOption, index) => ({
    id: option.id,
    name: option.name,
    code: option.code ?? "",
    position: option.position ?? index,
    values: option.values.map((value, valueIndex) => ({
      id: value.id,
      value: value.value,
      code: value.code ?? "",
      position: value.position ?? valueIndex,
    })),
  }))
}

export function ProductOptionsSection({ product }: ProductOptionsSectionProps) {
  const syncOptions = useSyncProductOptions(product.id)
  const [options, setOptions] = React.useState(() => mapProductOptions(product))
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    setOptions(mapProductOptions(product))
  }, [product])

  const updateOption = (
    optionIndex: number,
    patch: Partial<SyncProductOptionsFormValues["options"][number]>
  ) => {
    setOptions((current) =>
      current.map((option, index) =>
        index === optionIndex ? { ...option, ...patch } : option
      )
    )
  }

  const updateOptionValue = (
    optionIndex: number,
    valueIndex: number,
    value: string
  ) => {
    setOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) return option

        return {
          ...option,
          values: option.values.map((entry, entryIndex) =>
            entryIndex === valueIndex ? { ...entry, value } : entry
          ),
        }
      })
    )
  }

  const addOption = () => {
    setOptions((current) => [...current, createEmptyOption(current.length)])
  }

  const removeOption = (optionIndex: number) => {
    setOptions((current) => current.filter((_, index) => index !== optionIndex))
  }

  const addOptionValue = (optionIndex: number) => {
    setOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) return option

        return {
          ...option,
          values: [
            ...option.values,
            { value: "", code: "", position: option.values.length },
          ],
        }
      })
    )
  }

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    setOptions((current) =>
      current.map((option, index) => {
        if (index !== optionIndex) return option

        return {
          ...option,
          values: option.values.filter((_, entryIndex) => entryIndex !== valueIndex),
        }
      })
    )
  }

  const handleSave = () => {
    const parsed = syncProductOptionsSchema.safeParse({ options })

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path.join(".")] = issue.message
      })
      setErrors(nextErrors)
      toast.error("Fix the option fields before saving")
      return
    }

    setErrors({})
    syncOptions.mutate(parsed.data, {
      onSuccess: () => toast.success("Product options saved"),
      onError: () => toast.error("Failed to save product options"),
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Variant options</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define options like Color or Size, then generate variants from their values.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="mr-2 size-4" />
          Add option
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {options.map((option, optionIndex) => (
          <div
            key={option.id ?? `option-${optionIndex}`}
            className="space-y-4 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Option name</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Color"
                      value={option.name}
                      onChange={(event) =>
                        updateOption(optionIndex, { name: event.target.value })
                      }
                    />
                    <FieldError message={errors[`options.${optionIndex}.name`]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Code</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="color"
                      value={option.code ?? ""}
                      onChange={(event) =>
                        updateOption(optionIndex, { code: event.target.value })
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              {options.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(optionIndex)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Values</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOptionValue(optionIndex)}
                >
                  <Plus className="mr-2 size-4" />
                  Add value
                </Button>
              </div>

              {option.values.map((value, valueIndex) => (
                <div key={value.id ?? `value-${valueIndex}`} className="flex gap-2">
                  <Input
                    placeholder="Red"
                    value={value.value}
                    onChange={(event) =>
                      updateOptionValue(optionIndex, valueIndex, event.target.value)
                    }
                  />
                  {option.values.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOptionValue(optionIndex, valueIndex)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              <FieldError message={errors[`options.${optionIndex}.values`]} />
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={syncOptions.isPending}
          >
            {syncOptions.isPending && <Spinner />}
            Save options
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
