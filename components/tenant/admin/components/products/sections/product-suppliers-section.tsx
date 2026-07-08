"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetSupplierOptions } from "@/hooks/tenant/use-supplier-query"
import { useSyncProductSuppliers } from "@/hooks/tenant/use-product-variant-query"
import {
  type SyncProductSuppliersFormValues,
  syncProductSuppliersSchema,
} from "@/schemas/tenant/product-schema"
import {
  type Product,
  type ProductSupplierAssignment,
} from "@/types/tenant/product"
import { FieldError } from "./product-form-shared"

type ProductSuppliersSectionProps = {
  product: Product
}

function createEmptySupplier(): SyncProductSuppliersFormValues["suppliers"][number] {
  return {
    supplier_id: 0,
    supplier_sku: "",
    supplier_cost: null,
    lead_time_days: null,
    minimum_quantity: 1,
    is_primary: false,
  }
}

function mapProductSuppliers(
  product: Product
): SyncProductSuppliersFormValues["suppliers"] {
  if (!product.suppliers?.length) {
    return []
  }

  return product.suppliers.map((assignment: ProductSupplierAssignment) => ({
    supplier_id: assignment.supplier_id,
    supplier_sku: assignment.supplier_sku ?? "",
    supplier_cost: assignment.supplier_cost
      ? Number(assignment.supplier_cost)
      : null,
    lead_time_days: assignment.lead_time_days ?? null,
    minimum_quantity: assignment.minimum_quantity ?? 1,
    is_primary: assignment.is_primary ?? false,
  }))
}

export function ProductSuppliersSection({
  product,
}: ProductSuppliersSectionProps) {
  const syncSuppliers = useSyncProductSuppliers(product.id)
  const { data: supplierOptions = [] } = useGetSupplierOptions()
  const [suppliers, setSuppliers] = React.useState(() =>
    mapProductSuppliers(product)
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    setSuppliers(mapProductSuppliers(product))
  }, [product])

  const addSupplier = () => {
    setSuppliers((current) => [...current, createEmptySupplier()])
  }

  const removeSupplier = (index: number) => {
    setSuppliers((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  const updateSupplier = (
    index: number,
    patch: Partial<SyncProductSuppliersFormValues["suppliers"][number]>
  ) => {
    setSuppliers((current) =>
      current.map((supplier, itemIndex) => {
        if (itemIndex !== index) {
          if (patch.is_primary) {
            return { ...supplier, is_primary: false }
          }

          return supplier
        }

        return { ...supplier, ...patch }
      })
    )
  }

  const handleSave = () => {
    const payload = {
      suppliers: suppliers.filter((supplier) => supplier.supplier_id > 0),
    }
    const parsed = syncProductSuppliersSchema.safeParse(payload)

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path.join(".")] = issue.message
      })
      setErrors(nextErrors)
      toastApiError(
        new Error("Fix supplier fields before saving"),
        "Fix supplier fields before saving"
      )
      return
    }

    setErrors({})
    syncSuppliers.mutate(parsed.data, {
      onSuccess: (result) =>
        toastApiSuccess(result.message, "Product suppliers saved"),
      onError: (error) =>
        toastApiError(error, "Failed to save product suppliers"),
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Suppliers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Assign sourcing suppliers with SKU, cost, and lead time.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addSupplier}>
          <Plus className="mr-2 size-4" />
          Add supplier
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {suppliers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No suppliers assigned yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier SKU</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Lead time</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier, index) => {
                const selectedSupplier =
                  supplierOptions.find(
                    (option) => option.value === supplier.supplier_id
                  ) ?? null

                return (
                  <TableRow key={`supplier-${index}`}>
                    <TableCell>
                      <Combobox
                        items={supplierOptions}
                        itemToStringValue={(item) => item.label}
                        value={selectedSupplier}
                        onValueChange={(item) => {
                          updateSupplier(index, {
                            supplier_id: item ? item.value : 0,
                          })
                        }}
                      >
                        <ComboboxInput placeholder="Select supplier..." />
                        <ComboboxContent>
                          <ComboboxEmpty>No suppliers found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FieldError
                        message={errors[`suppliers.${index}.supplier_id`]}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={supplier.supplier_sku ?? ""}
                        onChange={(event) =>
                          updateSupplier(index, {
                            supplier_sku: event.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={supplier.supplier_cost ?? ""}
                        onChange={(event) =>
                          updateSupplier(index, {
                            supplier_cost:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={supplier.lead_time_days ?? ""}
                        onChange={(event) =>
                          updateSupplier(index, {
                            lead_time_days:
                              event.target.value === ""
                                ? null
                                : Number(event.target.value),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={supplier.minimum_quantity ?? 1}
                        onChange={(event) =>
                          updateSupplier(index, {
                            minimum_quantity: Number(event.target.value) || 1,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={supplier.is_primary ?? false}
                        onCheckedChange={(checked) =>
                          updateSupplier(index, { is_primary: !!checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSupplier(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={syncSuppliers.isPending}
          >
            {syncSuppliers.isPending && <Spinner />}
            Save suppliers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
