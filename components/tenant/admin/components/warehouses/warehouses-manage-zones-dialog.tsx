"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2 } from "lucide-react"
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
import {
  useCreateWarehouseZone,
  useDeleteWarehouseZone,
  useGetWarehouseZones,
  useUpdateWarehouseZone,
} from "@/hooks/tenant/use-warehouse-query"
import { type Warehouse, type WarehouseZone } from "@/types/tenant/warehouse"
import {
  storeWarehouseZoneSchema,
  updateWarehouseZoneSchema,
  type StoreWarehouseZoneFormValues,
  type UpdateWarehouseZoneFormValues,
} from "@/schemas/tenant/warehouse-schema"

type WarehousesManageZonesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse
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

export function WarehousesManageZonesDialog({
  open,
  onOpenChange,
  warehouse,
}: WarehousesManageZonesDialogProps) {
  const { data: zones = [], isLoading } = useGetWarehouseZones(warehouse.id, open)
  const createZone = useCreateWarehouseZone(warehouse.id)
  const updateZone = useUpdateWarehouseZone(warehouse.id)
  const deleteZone = useDeleteWarehouseZone(warehouse.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<WarehouseZone | null>(null)
  const [deletingZone, setDeletingZone] = useState<WarehouseZone | null>(null)

  const isUpdate = !!editingZone
  const schema = isUpdate ? updateWarehouseZoneSchema : storeWarehouseZoneSchema

  const form = useForm<
    StoreWarehouseZoneFormValues | UpdateWarehouseZoneFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      zone_type: "",
      is_active: true,
      sort_order: 0,
    },
  })

  const openCreateForm = () => {
    setEditingZone(null)
    form.reset({
      name: "",
      code: "",
      description: "",
      zone_type: "",
      is_active: true,
      sort_order: 0,
    })
    setFormOpen(true)
  }

  const openEditForm = (zone: WarehouseZone) => {
    setEditingZone(zone)
    form.reset({
      name: zone.name,
      code: zone.code,
      description: zone.description || "",
      zone_type: zone.zone_type || "",
      is_active: zone.is_active,
      sort_order: zone.sort_order ?? 0,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreWarehouseZoneFormValues | UpdateWarehouseZoneFormValues
  ) => {
    const payload = {
      ...data,
      description: data.description || null,
      zone_type: data.zone_type || null,
      is_active: data.is_active ?? true,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && editingZone) {
      updateZone.mutate(
        { zoneId: editingZone.id, zone: payload },
        {
          onSuccess: () => {
            toast.success("Zone updated successfully")
            setFormOpen(false)
            setEditingZone(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update zone")
          },
        }
      )
    } else {
      createZone.mutate(payload as StoreWarehouseZoneFormValues, {
        onSuccess: () => {
          toast.success("Zone created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create zone")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingZone) return
    deleteZone.mutate(deletingZone.id, {
      onSuccess: () => {
        toast.success("Zone deleted successfully")
        setDeletingZone(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete zone")
      },
    })
  }

  const isSubmitting = createZone.isPending || updateZone.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] w-full flex-col gap-0 overflow-hidden sm:max-w-3xl">
          <ResponsiveDialogHeader className="shrink-0">
            <ResponsiveDialogTitle>Manage Zones</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Zones for &quot;{warehouse.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex shrink-0 justify-end">
            <Button size="sm" onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-2">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : zones.length === 0 ? (
              <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                No zones yet. Add one to get started.
              </p>
            ) : (
              <div className="max-h-[min(50dvh,360px)] overflow-auto rounded-md border">
                <div className="min-w-full overflow-x-auto">
                  <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Sort</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {zone.code}
                      </TableCell>
                      <TableCell>{zone.zone_type || "—"}</TableCell>
                      <TableCell>
                        {zone.is_active ? (
                          <Badge variant="secondary">Active</Badge>
                        ) : (
                          "Inactive"
                        )}
                      </TableCell>
                      <TableCell>{zone.sort_order ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditForm(zone)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeletingZone(zone)}
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
            setEditingZone(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent className="flex max-h-[min(90dvh,700px)] w-full flex-col gap-0 overflow-hidden sm:max-w-lg">
          <ResponsiveDialogHeader className="shrink-0">
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Zone
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update zone details."
                : "Add a new zone for this warehouse."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <form
              id="warehouse-zone-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Receiving"
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
                  placeholder="receiving"
                  className="font-mono"
                  {...form.register("code")}
                />
                <FieldError message={form.formState.errors.code?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Zone Type</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="storage, picking, receiving..."
                  {...form.register("zone_type")}
                />
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="zone_is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) =>
                  form.setValue("is_active", !!checked)
                }
              />
              <label htmlFor="zone_is_active" className="text-sm font-medium">
                Active
              </label>
            </div>
            </form>
          </div>

          <ResponsiveDialogFooter className="shrink-0">
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="warehouse-zone-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting
                ? "Saving..."
                : isUpdate
                  ? "Update Zone"
                  : "Add Zone"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingZone}
        onOpenChange={(val) => {
          if (!val) setDeletingZone(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete zone?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete &quot;{deletingZone?.name}&quot;. This
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
              disabled={deleteZone.isPending}
            >
              {deleteZone.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
