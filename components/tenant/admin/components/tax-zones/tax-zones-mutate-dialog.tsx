"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateTaxZone,
  useUpdateTaxZone,
} from "@/hooks/tenant/use-tax-zone-query"
import { type TaxZone } from "@/types/tenant/tax-zone"
import { MapPin } from "lucide-react"
import {
  storeTaxZoneSchema,
  updateTaxZoneSchema,
  type StoreTaxZoneFormValues,
  type UpdateTaxZoneFormValues,
} from "@/schemas/tenant/tax-zone-schema"
import { TaxZoneMapDialog } from "./tax-zone-map-dialog"

type TaxZonesMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: TaxZone
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function parseOptionalNumber(value: string | number | null | undefined): number | null {
  if (value === "" || value === null || value === undefined) return null
  const num = typeof value === "number" ? value : Number(value)
  return Number.isNaN(num) ? null : num
}

export function TaxZonesMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: TaxZonesMutateDialogProps) {
  const isUpdate = !!currentRow
  const createTaxZone = useCreateTaxZone()
  const updateTaxZone = useUpdateTaxZone()
  const isSubmitting = createTaxZone.isPending || updateTaxZone.isPending
  const [mapOpen, setMapOpen] = React.useState(false)

  const schema = isUpdate ? updateTaxZoneSchema : storeTaxZoneSchema

  const form = useForm<StoreTaxZoneFormValues | UpdateTaxZoneFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      country_code: "",
      state: "",
      city: "",
      postal_code: "",
      postal_code_pattern: "",
      latitude: null,
      longitude: null,
      radius_km: null,
      is_default: false,
      is_active: true,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        country_code: currentRow.country_code || "",
        state: currentRow.state || "",
        city: currentRow.city || "",
        postal_code: currentRow.postal_code || "",
        postal_code_pattern: currentRow.postal_code_pattern || "",
        latitude: currentRow.latitude ? Number(currentRow.latitude) : null,
        longitude: currentRow.longitude ? Number(currentRow.longitude) : null,
        radius_km: currentRow.radius_km ? Number(currentRow.radius_km) : null,
        is_default: currentRow.is_default,
        is_active: currentRow.is_active,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        country_code: "",
        state: "",
        city: "",
        postal_code: "",
        postal_code_pattern: "",
        latitude: null,
        longitude: null,
        radius_km: null,
        is_default: false,
        is_active: true,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const latitude = form.watch("latitude")
  const longitude = form.watch("longitude")
  const hasMapCoordinates =
    typeof latitude === "number" &&
    !Number.isNaN(latitude) &&
    typeof longitude === "number" &&
    !Number.isNaN(longitude)

  const onSubmit = (data: StoreTaxZoneFormValues | UpdateTaxZoneFormValues) => {
    const payload = {
      ...data,
      country_code: data.country_code || null,
      state: data.state || null,
      city: data.city || null,
      postal_code: data.postal_code || null,
      postal_code_pattern: data.postal_code_pattern || null,
      latitude: parseOptionalNumber(data.latitude),
      longitude: parseOptionalNumber(data.longitude),
      radius_km: parseOptionalNumber(data.radius_km),
      is_default: data.is_default ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateTaxZone.mutate(
        { id: currentRow.id, taxZone: payload as UpdateTaxZoneFormValues },
        {
          onSuccess: () => {
            toast.success("Tax zone updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update tax zone")
          },
        }
      )
    } else {
      createTaxZone.mutate(payload as StoreTaxZoneFormValues, {
        onSuccess: () => {
          toast.success("Tax zone created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create tax zone")
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
            {isUpdate ? "Update" : "Create"} Tax Zone
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tax zone geographic scope."
              : "Add a new tax zone for your store."}{" "}
            Leave location fields empty to match all values at that level.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tax-zones-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="United Kingdom" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Country Code</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="GB"
                  maxLength={2}
                  className="font-mono uppercase"
                  {...form.register("country_code")}
                />
                <FieldError message={form.formState.errors.country_code?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>State / Province</FieldLabel>
              <FieldContent>
                <Input placeholder="England" {...form.register("state")} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>City</FieldLabel>
              <FieldContent>
                <Input placeholder="London" {...form.register("city")} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Postal Code</FieldLabel>
              <FieldContent>
                <Input placeholder="SW1A 1AA" {...form.register("postal_code")} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Postal Code Pattern</FieldLabel>
            <FieldContent>
              <Input
                placeholder="SW1%"
                className="font-mono"
                {...form.register("postal_code_pattern")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                SQL LIKE pattern for matching postal codes (e.g. SW1%)
              </p>
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
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

            <Field>
              <FieldLabel>Radius (km)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="any"
                  min={0}
                  {...form.register("radius_km", { valueAsNumber: true })}
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
                id="is_default"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) =>
                  form.setValue("is_default", !!checked)
                }
              />
              <label htmlFor="is_default" className="text-sm font-medium">
                Default
              </label>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tax-zones-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tax Zone"
                : "Create Tax Zone"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
      </ResponsiveDialog>

      {hasMapCoordinates ? (
        <TaxZoneMapDialog
          open={mapOpen}
          onOpenChange={setMapOpen}
          latitude={latitude}
          longitude={longitude}
          radiusKm={form.watch("radius_km")}
          title={isUpdate ? `Map: ${currentRow?.name}` : "Tax Zone Map"}
        />
      ) : null}
    </>
  )
}