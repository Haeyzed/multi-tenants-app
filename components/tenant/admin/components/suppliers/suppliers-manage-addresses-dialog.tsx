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
  useCreateSupplierAddress,
  useDeleteSupplierAddress,
  useGetSupplierAddresses,
  useUpdateSupplierAddress,
} from "@/hooks/tenant/use-supplier-query"
import { type Supplier, type SupplierAddress } from "@/types/tenant/supplier"
import {
  type StoreSupplierAddressFormValues,
  storeSupplierAddressSchema,
  type UpdateSupplierAddressFormValues,
  updateSupplierAddressSchema,
} from "@/schemas/tenant/supplier-schema"

type SuppliersManageAddressesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier
}

const ADDRESS_TYPES: {
  value: "office" | "billing" | "shipping"
  label: string
}[] = [
  { value: "office", label: "Office" },
  { value: "billing", label: "Billing" },
  { value: "shipping", label: "Shipping" },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function formatAddress(address: SupplierAddress): string {
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter(Boolean)
  return parts.join(", ")
}

export function SuppliersManageAddressesDialog({
  open,
  onOpenChange,
  supplier,
}: SuppliersManageAddressesDialogProps) {
  const { data: addresses = [], isLoading } = useGetSupplierAddresses(
    supplier.id,
    open
  )
  const createAddress = useCreateSupplierAddress(supplier.id)
  const updateAddress = useUpdateSupplierAddress(supplier.id)
  const deleteAddress = useDeleteSupplierAddress(supplier.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SupplierAddress | null>(
    null
  )
  const [deletingAddress, setDeletingAddress] =
    useState<SupplierAddress | null>(null)

  const isUpdate = !!editingAddress
  const schema = isUpdate
    ? updateSupplierAddressSchema
    : storeSupplierAddressSchema

  const form = useForm<
    StoreSupplierAddressFormValues | UpdateSupplierAddressFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "office",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    },
  })

  const openCreateForm = () => {
    setEditingAddress(null)
    form.reset({
      type: "office",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    })
    setFormOpen(true)
  }

  const openEditForm = (address: SupplierAddress) => {
    setEditingAddress(address)
    form.reset({
      type: address.type,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country,
      is_default: address.is_default,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreSupplierAddressFormValues | UpdateSupplierAddressFormValues
  ) => {
    const payload = {
      ...data,
      address_line_2: data.address_line_2 || null,
      state: data.state || null,
      postal_code: data.postal_code || null,
      is_default: data.is_default ?? false,
    }

    if (isUpdate && editingAddress) {
      updateAddress.mutate(
        { addressId: editingAddress.id, address: payload },
        {
          onSuccess: () => {
            toast.success("Address updated successfully")
            setFormOpen(false)
            setEditingAddress(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update address")
          },
        }
      )
    } else {
      createAddress.mutate(payload as StoreSupplierAddressFormValues, {
        onSuccess: () => {
          toast.success("Address created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create address")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingAddress) return
    deleteAddress.mutate(deletingAddress.id, {
      onSuccess: () => {
        toast.success("Address deleted successfully")
        setDeletingAddress(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete address")
      },
    })
  }

  const isSubmitting = createAddress.isPending || updateAddress.isPending
  const addressType = form.watch("type") ?? "office"
  const selectedAddressType =
    ADDRESS_TYPES.find((item) => item.value === addressType) ?? ADDRESS_TYPES[0]

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] flex-col gap-0 overflow-hidden sm:max-w-3xl">
          <ResponsiveDialogHeader className="shrink-0">
            <ResponsiveDialogTitle>Manage Addresses</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Addresses for &quot;{supplier.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex shrink-0 justify-end">
            <Button size="sm" onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-2">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : addresses.length === 0 ? (
              <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                No addresses yet. Add one to get started.
              </p>
            ) : (
              <div className="max-h-[min(50dvh,360px)] overflow-auto rounded-md border">
                <div className="min-w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addresses.map((address) => (
                        <TableRow key={address.id}>
                          <TableCell className="capitalize">
                            {address.type}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {formatAddress(address)}
                          </TableCell>
                          <TableCell>
                            {address.is_default ? (
                              <Badge variant="secondary">Default</Badge>
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
                                onClick={() => openEditForm(address)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeletingAddress(address)}
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
            setEditingAddress(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Address
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update address details."
                : "Add a new address for this supplier."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="supplier-address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent>
                <Combobox
                  items={ADDRESS_TYPES}
                  itemToStringValue={(item) => item.label}
                  value={selectedAddressType}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("type", item.value)
                  }}
                >
                  <ComboboxInput placeholder="Select type..." />
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
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Address Line 1 *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="123 Main St"
                  {...form.register("address_line_1")}
                />
                <FieldError
                  message={form.formState.errors.address_line_1?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Address Line 2</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Suite 100"
                  {...form.register("address_line_2")}
                />
              </FieldContent>
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>City *</FieldLabel>
                <FieldContent>
                  <Input placeholder="City" {...form.register("city")} />
                  <FieldError message={form.formState.errors.city?.message} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>State</FieldLabel>
                <FieldContent>
                  <Input placeholder="State" {...form.register("state")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Postal Code</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Postal code"
                    {...form.register("postal_code")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Country *</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="US"
                    maxLength={2}
                    className="uppercase"
                    {...form.register("country", {
                      onChange: (e) => {
                        form.setValue("country", e.target.value.toUpperCase())
                      },
                    })}
                  />
                  <FieldError
                    message={form.formState.errors.country?.message}
                  />
                </FieldContent>
              </Field>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default_address"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) =>
                  form.setValue("is_default", !!checked)
                }
              />
              <label
                htmlFor="is_default_address"
                className="text-sm font-medium"
              >
                Default address
              </label>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="supplier-address-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting
                ? "Saving..."
                : isUpdate
                  ? "Update Address"
                  : "Add Address"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingAddress}
        onOpenChange={(val) => {
          if (!val) setDeletingAddress(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete address?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete this address. This action cannot be
              undone.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAddress.isPending}
            >
              {deleteAddress.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
