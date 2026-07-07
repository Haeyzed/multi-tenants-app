"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRightLeft, History, Package } from "lucide-react"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { useGetWarehouseOptions } from "@/hooks/tenant/use-warehouse-query"
import {
  useAdjustInventory,
  useGetInventoryMovements,
  useGetVariantInventories,
  useTransferInventory,
  useUpdateInventory,
} from "@/hooks/tenant/use-inventory-query"
import { type ProductVariant } from "@/types/tenant/product"
import { type InventoryRecord } from "@/types/tenant/inventory"
import { FieldError } from "./product-form-shared"

const adjustSchema = z.object({
  quantity_change: z.coerce.number().int().refine((value) => value !== 0, {
    message: "Quantity change cannot be zero",
  }),
  reason: z.string().max(1000).optional(),
})

const transferSchema = z.object({
  destination_warehouse_id: z.number(),
  quantity: z.coerce.number().int().min(1),
  reason: z.string().max(1000).optional(),
})

type ProductVariantInventoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  variant: ProductVariant
}

export function ProductVariantInventoryDialog({
  open,
  onOpenChange,
  productId,
  variant,
}: ProductVariantInventoryDialogProps) {
  const { data: inventories = [], isLoading } = useGetVariantInventories(
    productId,
    variant.id,
    open
  )
  const { data: warehouseOptions = [] } = useGetWarehouseOptions()
  const updateInventory = useUpdateInventory(productId, variant.id)
  const adjustInventory = useAdjustInventory(productId, variant.id)
  const transferInventory = useTransferInventory(productId, variant.id)

  const [selectedInventory, setSelectedInventory] =
    React.useState<InventoryRecord | null>(null)
  const [activeTab, setActiveTab] = React.useState("levels")

  const { data: movementsData, isLoading: movementsLoading } =
    useGetInventoryMovements(
      {
        product_variant_id: variant.id,
        per_page: 20,
      },
      open && activeTab === "movements"
    )

  const adjustForm = useForm<z.infer<typeof adjustSchema>>({
    resolver: zodResolver(adjustSchema),
    defaultValues: { quantity_change: 0, reason: "" },
  })

  const transferForm = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: { destination_warehouse_id: 0, quantity: 1, reason: "" },
  })

  React.useEffect(() => {
    if (!open) {
      setSelectedInventory(null)
      setActiveTab("levels")
      adjustForm.reset({ quantity_change: 0, reason: "" })
      transferForm.reset({ destination_warehouse_id: 0, quantity: 1, reason: "" })
      return
    }

    if (inventories.length > 0) {
      setSelectedInventory((current) => {
        if (current && inventories.some((item) => item.id === current.id)) {
          return current
        }
        return inventories[0]
      })
    }
  }, [open, inventories, adjustForm, transferForm])

  const handleReorderLevelSave = (inventory: InventoryRecord, value: string) => {
    const reorderLevel = value === "" ? null : Number(value)

    updateInventory.mutate(
      {
        id: inventory.id,
        payload: { reorder_level: reorderLevel },
      },
      {
        onSuccess: () => toastApiSuccess(undefined, "Reorder level updated"),
        onError: (error) => toastApiError(error, "Failed to update reorder level"),
      }
    )
  }

  const handleAdjust = (data: z.infer<typeof adjustSchema>) => {
    if (!selectedInventory) return

    adjustInventory.mutate(
      {
        id: selectedInventory.id,
        payload: data,
      },
      {
        onSuccess: () => {
          toastApiSuccess(undefined, "Inventory adjusted")
          adjustForm.reset({ quantity_change: 0, reason: "" })
        },
        onError: (error) => toastApiError(error, "Failed to adjust inventory"),
      }
    )
  }

  const handleTransfer = (data: z.infer<typeof transferSchema>) => {
    if (!selectedInventory) return

    transferInventory.mutate(
      {
        id: selectedInventory.id,
        payload: data,
      },
      {
        onSuccess: () => {
          toastApiSuccess(undefined, "Inventory transferred")
          transferForm.reset({ destination_warehouse_id: 0, quantity: 1, reason: "" })
        },
        onError: (error) => toastApiError(error, "Failed to transfer inventory"),
      }
    )
  }

  const destinationWarehouseId = transferForm.watch("destination_warehouse_id")
  const selectedDestination =
    warehouseOptions.find((item) => item.value === destinationWarehouseId) ?? null

  const availableDestinations = warehouseOptions.filter(
    (item) => item.value !== selectedInventory?.warehouse_id
  )

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2">
            <Package className="size-5" />
            Inventory — {variant.title}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Manage stock levels, adjustments, and transfers across warehouses for SKU{" "}
            {variant.sku}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="levels">Stock levels</TabsTrigger>
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : inventories.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>On hand</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Reorder level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventories.map((inventory) => (
                    <TableRow
                      key={inventory.id}
                      className={
                        selectedInventory?.id === inventory.id ? "bg-muted/50" : ""
                      }
                      onClick={() => setSelectedInventory(inventory)}
                    >
                      <TableCell>{inventory.warehouse?.name ?? "—"}</TableCell>
                      <TableCell>{inventory.quantity}</TableCell>
                      <TableCell>{inventory.available_quantity}</TableCell>
                      <TableCell>{inventory.reserved_quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8 w-24"
                          defaultValue={inventory.reorder_level ?? ""}
                          onBlur={(event) =>
                            handleReorderLevelSave(inventory, event.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {inventory.is_low_stock ? (
                          <Badge variant="destructive">Low stock</Badge>
                        ) : (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No inventory records yet. Adjust stock or set quantity when creating the variant.
              </p>
            )}
          </TabsContent>

          <TabsContent value="adjust">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : !selectedInventory ? (
              <p className="text-sm text-muted-foreground">
                Select a warehouse row in Stock levels first.
              </p>
            ) : (
              <form
                onSubmit={adjustForm.handleSubmit(handleAdjust)}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  Adjusting stock at {selectedInventory.warehouse?.name}. Use negative
                  values to decrease quantity.
                </p>
                <Field>
                  <FieldLabel>Quantity change</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...adjustForm.register("quantity_change", {
                        valueAsNumber: true,
                      })}
                    />
                    <FieldError
                      message={adjustForm.formState.errors.quantity_change?.message}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Reason</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Cycle count correction"
                      {...adjustForm.register("reason")}
                    />
                  </FieldContent>
                </Field>
                <Button type="submit" disabled={adjustInventory.isPending}>
                  {adjustInventory.isPending && <Spinner />}
                  Apply adjustment
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="transfer">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : !selectedInventory ? (
              <p className="text-sm text-muted-foreground">
                Select a source warehouse row in Stock levels first.
              </p>
            ) : (
              <form
                onSubmit={transferForm.handleSubmit(handleTransfer)}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  Transfer from {selectedInventory.warehouse?.name} (available:{" "}
                  {selectedInventory.available_quantity})
                </p>
                <Field>
                  <FieldLabel>Destination warehouse</FieldLabel>
                  <FieldContent>
                    <Combobox
                      items={availableDestinations}
                      itemToStringValue={(item) => item.label}
                      value={selectedDestination}
                      onValueChange={(item) => {
                        transferForm.setValue(
                          "destination_warehouse_id",
                          item ? item.value : 0
                        )
                      }}
                    >
                      <ComboboxInput placeholder="Select warehouse..." />
                      <ComboboxContent>
                        <ComboboxEmpty>No warehouses found.</ComboboxEmpty>
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
                  <FieldLabel>Quantity</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...transferForm.register("quantity", { valueAsNumber: true })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Reason</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Replenish retail store"
                      {...transferForm.register("reason")}
                    />
                  </FieldContent>
                </Field>
                <Button type="submit" disabled={transferInventory.isPending}>
                  {transferInventory.isPending && <Spinner />}
                  <ArrowRightLeft className="mr-2 size-4" />
                  Transfer stock
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="movements">
            {movementsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : movementsData?.data.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Before</TableHead>
                    <TableHead>After</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementsData.data.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">{movement.type}</TableCell>
                      <TableCell>
                        {movement.quantity_change > 0 ? "+" : ""}
                        {movement.quantity_change}
                      </TableCell>
                      <TableCell>{movement.quantity_before}</TableCell>
                      <TableCell>{movement.quantity_after}</TableCell>
                      <TableCell>{movement.reason || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="size-4" />
                No movement history yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
