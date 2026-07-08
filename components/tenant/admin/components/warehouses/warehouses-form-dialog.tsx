"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin } from "lucide-react"
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
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from "@/hooks/tenant/use-warehouse-query"
import { type Warehouse } from "@/types/tenant/warehouse"
import {
  type StoreWarehouseFormValues,
  storeWarehouseSchema,
  type UpdateWarehouseFormValues,
  updateWarehouseSchema,
} from "@/schemas/tenant/warehouse-schema"
import { TaxZoneMapDialog } from "@/components/tenant/admin/components/tax-zones/tax-zone-map-dialog"

type WarehousesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Warehouse
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function slugifyCode(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function parseOptionalNumber(
  value: string | number | null | undefined
): number | null {
  if (value === "" || value === null || value === undefined) return null
  const num = typeof value === "number" ? value : Number(value)
  return Number.isNaN(num) ? null : num
}

export function WarehousesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: WarehousesFormDialogProps) {
  const isUpdate = !!currentRow
  const createWarehouse = useCreateWarehouse()
  const updateWarehouse = useUpdateWarehouse()
  const isSubmitting = createWarehouse.isPending || updateWarehouse.isPending
  const [mapOpen, setMapOpen] = React.useState(false)

  const schema = isUpdate ? updateWarehouseSchema : storeWarehouseSchema

  const form = useForm<StoreWarehouseFormValues | UpdateWarehouseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      phone: "",
      email: "",
      manager_name: "",
      latitude: null,
      longitude: null,
      is_active: true,
      is_primary: false,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code,
        description: currentRow.description || "",
        address_line_1: currentRow.address_line_1 || "",
        address_line_2: currentRow.address_line_2 || "",
        city: currentRow.city || "",
        state: currentRow.state || "",
        postal_code: currentRow.postal_code || "",
        country: currentRow.country || "",
        phone: currentRow.phone || "",
        email: currentRow.email || "",
        manager_name: currentRow.manager_name || "",
        latitude: currentRow.latitude,
        longitude: currentRow.longitude,
        is_active: currentRow.is_active,
        is_primary: currentRow.is_primary,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone: "",
        email: "",
        manager_name: "",
        latitude: null,
        longitude: null,
        is_active: true,
        is_primary: false,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const latitude = form.watch("latitude")
  const longitude = form.watch("longitude")
  const hasMapCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    !Number.isNaN(Number(latitude)) &&
    longitude !== null &&
    longitude !== undefined &&
    !Number.isNaN(Number(longitude))

  const onSubmit = (
    data: StoreWarehouseFormValues | UpdateWarehouseFormValues
  ) => {
    const payload = {
      ...data,
      description: data.description || null,
      address_line_1: data.address_line_1 || null,
      address_line_2: data.address_line_2 || null,
      city: data.city || null,
      state: data.state || null,
      postal_code: data.postal_code || null,
      country: data.country || null,
      phone: data.phone || null,
      email: data.email || null,
      manager_name: data.manager_name || null,
      latitude: parseOptionalNumber(data.latitude),
      longitude: parseOptionalNumber(data.longitude),
      is_primary: data.is_primary ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateWarehouse.mutate(
        { id: currentRow.id, warehouse: payload as UpdateWarehouseFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Warehouse updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update warehouse"
            )
          },
        }
      )
    } else {
      createWarehouse.mutate(payload as StoreWarehouseFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Warehouse created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create warehouse")
        },
      })
    }
  }

  return (
    <>
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
              {isUpdate ? "Update" : "Create"} Warehouse
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update the warehouse details."
                : "Add a new warehouse for your store."}{" "}
              Click save when you&apos;re done.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="warehouses-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Main Warehouse"
                  {...form.register("name", {
                    onChange: (event) => {
                      if (!isUpdate && !form.getValues("code")) {
                        form.setValue("code", slugifyCode(event.target.value))
                      }
                    },
                  })}
                />
                <FieldError message={form.formState.errors.name?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Code *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="main_warehouse"
                  className="font-mono"
                  {...form.register("code")}
                />
                <FieldError message={form.formState.errors.code?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Warehouse description..."
                  {...form.register("description")}
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Address Line 1</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="123 Industrial Park"
                    {...form.register("address_line_1")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Address Line 2</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Unit 4"
                    {...form.register("address_line_2")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>City</FieldLabel>
                <FieldContent>
                  <Input placeholder="London" {...form.register("city")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>State / Province</FieldLabel>
                <FieldContent>
                  <Input placeholder="England" {...form.register("state")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Postal Code</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="SW1A 1AA"
                    {...form.register("postal_code")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="GB"
                    maxLength={2}
                    className="font-mono uppercase"
                    {...form.register("country")}
                  />
                  <FieldError
                    message={form.formState.errors.country?.message}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="+1 555 000 0000"
                    {...form.register("phone")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <FieldContent>
                  <Input
                    type="email"
                    placeholder="warehouse@example.com"
                    {...form.register("email")}
                  />
                  <FieldError message={form.formState.errors.email?.message} />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Manager Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Jane Doe"
                  {...form.register("manager_name")}
                />
              </FieldContent>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Latitude</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="any"
                    {...form.register("latitude", { valueAsNumber: true })}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Longitude</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="any"
                    {...form.register("longitude", { valueAsNumber: true })}
                  />
                </FieldContent>
              </Field>
            </div>

            {hasMapCoordinates ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMapOpen(true)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                View on Map
              </Button>
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
                  id="is_active"
                  checked={form.watch("is_active")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_active", !!checked)
                  }
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary"
                  checked={form.watch("is_primary")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_primary", !!checked)
                  }
                />
                <label htmlFor="is_primary" className="text-sm font-medium">
                  Primary warehouse
                </label>
              </div>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Close</Button>}
            />
            <Button
              type="submit"
              form="warehouses-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting
                ? "Saving..."
                : isUpdate
                  ? "Update Warehouse"
                  : "Create Warehouse"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      {hasMapCoordinates ? (
        <TaxZoneMapDialog
          open={mapOpen}
          onOpenChange={setMapOpen}
          latitude={Number(latitude)}
          longitude={Number(longitude)}
          title={`Map: ${form.watch("name") || "Warehouse"}`}
          description="Geographic location for this warehouse."
        />
      ) : null}
    </>
  )
}
