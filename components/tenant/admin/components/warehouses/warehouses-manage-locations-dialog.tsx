"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
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
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateWarehouseLocation,
  useDeleteWarehouseLocation,
  useGetWarehouseLocations,
  useGetWarehouseZones,
  useUpdateWarehouseLocation,
} from "@/hooks/tenant/use-warehouse-query"
import {
  type Warehouse,
  type WarehouseLocation,
  type WarehouseZone,
} from "@/types/tenant/warehouse"
import {
  type StoreWarehouseLocationFormValues,
  storeWarehouseLocationSchema,
  type UpdateWarehouseLocationFormValues,
  updateWarehouseLocationSchema,
} from "@/schemas/tenant/warehouse-schema"

type WarehousesManageLocationsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse
}

type ZoneOption = {
  label: string
  value: number
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function parseOptionalNumber(
  value: string | number | null | undefined
): number | null {
  if (value === "" || value === null || value === undefined) return null
  const num = typeof value === "number" ? value : Number(value)
  return Number.isNaN(num) ? null : num
}

export function WarehousesManageLocationsDialog({
  open,
  onOpenChange,
  warehouse,
}: WarehousesManageLocationsDialogProps) {
  const { data: locations = [], isLoading } = useGetWarehouseLocations(
    warehouse.id,
    open
  )
  const { data: zones = [] } = useGetWarehouseZones(warehouse.id, open)
  const createLocation = useCreateWarehouseLocation(warehouse.id)
  const updateLocation = useUpdateWarehouseLocation(warehouse.id)
  const deleteLocation = useDeleteWarehouseLocation(warehouse.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] =
    useState<WarehouseLocation | null>(null)
  const [deletingLocation, setDeletingLocation] =
    useState<WarehouseLocation | null>(null)

  const zoneOptions: ZoneOption[] = zones.map((zone: WarehouseZone) => ({
    label: `${zone.name} (${zone.code})`,
    value: zone.id,
  }))

  const isUpdate = !!editingLocation
  const schema = isUpdate
    ? updateWarehouseLocationSchema
    : storeWarehouseLocationSchema

  const form = useForm<
    StoreWarehouseLocationFormValues | UpdateWarehouseLocationFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      zone_id: null,
      code: "",
      name: "",
      max_weight: null,
      max_volume: null,
      is_active: true,
      is_picking_location: false,
    },
  })

  const selectedZoneId = form.watch("zone_id")
  const selectedZone =
    zoneOptions.find((option) => option.value === selectedZoneId) ?? null

  const openCreateForm = () => {
    setEditingLocation(null)
    form.reset({
      zone_id: null,
      code: "",
      name: "",
      max_weight: null,
      max_volume: null,
      is_active: true,
      is_picking_location: false,
    })
    setFormOpen(true)
  }

  const openEditForm = (location: WarehouseLocation) => {
    setEditingLocation(location)
    form.reset({
      zone_id: location.zone_id,
      code: location.code,
      name: location.name || "",
      max_weight: location.max_weight,
      max_volume: location.max_volume,
      is_active: location.is_active,
      is_picking_location: location.is_picking_location,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreWarehouseLocationFormValues | UpdateWarehouseLocationFormValues
  ) => {
    const payload = {
      ...data,
      zone_id: data.zone_id ?? null,
      name: data.name || null,
      max_weight: parseOptionalNumber(data.max_weight),
      max_volume: parseOptionalNumber(data.max_volume),
      is_active: data.is_active ?? true,
      is_picking_location: data.is_picking_location ?? false,
    }

    if (isUpdate && editingLocation) {
      updateLocation.mutate(
        { locationId: editingLocation.id, location: payload },
        {
          onSuccess: () => {
            toast.success("Location updated successfully")
            setFormOpen(false)
            setEditingLocation(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update location"
            )
          },
        }
      )
    } else {
      createLocation.mutate(payload as StoreWarehouseLocationFormValues, {
        onSuccess: () => {
          toast.success("Location created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create location")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingLocation) return
    deleteLocation.mutate(deletingLocation.id, {
      onSuccess: () => {
        toast.success("Location deleted successfully")
        setDeletingLocation(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete location")
      },
    })
  }

  const isSubmitting = createLocation.isPending || updateLocation.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] w-full flex-col gap-0 overflow-hidden sm:max-w-4xl">
          <ResponsiveDialogHeader className="shrink-0">
            <ResponsiveDialogTitle>Manage Locations</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Storage locations for &quot;{warehouse.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex shrink-0 justify-end">
            <Button size="sm" onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-2">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : locations.length === 0 ? (
              <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                No locations yet. Add one to get started.
              </p>
            ) : (
              <div className="max-h-[min(50dvh,360px)] overflow-auto rounded-md border">
                <div className="min-w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Max Weight</TableHead>
                        <TableHead>Max Volume</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Picking</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-mono text-sm">
                            {location.code}
                          </TableCell>
                          <TableCell>{location.name || "—"}</TableCell>
                          <TableCell>{location.zone?.name || "—"}</TableCell>
                          <TableCell>{location.max_weight ?? "—"}</TableCell>
                          <TableCell>{location.max_volume ?? "—"}</TableCell>
                          <TableCell>
                            {location.is_active ? (
                              <Badge variant="secondary">Active</Badge>
                            ) : (
                              "Inactive"
                            )}
                          </TableCell>
                          <TableCell>
                            {location.is_picking_location ? (
                              <Badge variant="secondary">Yes</Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditForm(location)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeletingLocation(location)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <ResponsiveDialogFooter className="shrink-0">
            <ResponsiveDialogClose
              render={<Button variant="outline">Close</Button>}
            />
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={formOpen}
        onOpenChange={(val) => {
          setFormOpen(val)
          if (!val) {
            setEditingLocation(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Location
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update location details."
                : "Add a new storage location for this warehouse."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="warehouse-location-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Zone</FieldLabel>
              <FieldContent>
                <Combobox
                  items={zoneOptions}
                  itemToStringValue={(item: ZoneOption) => item.label}
                  value={selectedZone}
                  onValueChange={(item) => {
                    form.setValue("zone_id", item?.value ?? null, {
                      shouldValidate: true,
                    })
                  }}
                >
                  <ComboboxInput placeholder="Select zone (optional)..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No zones found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: ZoneOption) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError message={form.formState.errors.zone_id?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Code *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="A-01-01"
                  className="font-mono"
                  {...form.register("code")}
                />
                <FieldError message={form.formState.errors.code?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input placeholder="Shelf A1" {...form.register("name")} />
              </FieldContent>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Max Weight</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="any"
                    min={0}
                    {...form.register("max_weight", { valueAsNumber: true })}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Max Volume</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="any"
                    min={0}
                    {...form.register("max_volume", { valueAsNumber: true })}
                  />
                </FieldContent>
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location_is_active"
                  checked={form.watch("is_active")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_active", !!checked)
                  }
                />
                <label
                  htmlFor="location_is_active"
                  className="text-sm font-medium"
                >
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_picking_location"
                  checked={form.watch("is_picking_location")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_picking_location", !!checked)
                  }
                />
                <label
                  htmlFor="is_picking_location"
                  className="text-sm font-medium"
                >
                  Picking location
                </label>
              </div>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="warehouse-location-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting
                ? "Saving..."
                : isUpdate
                  ? "Update Location"
                  : "Add Location"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingLocation}
        onOpenChange={(val) => {
          if (!val) setDeletingLocation(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete location?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete &quot;{deletingLocation?.code}&quot;. This
              action cannot be undone.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLocation.isPending}
            >
              {deleteLocation.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
