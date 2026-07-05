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
  useCreateSupplierContact,
  useDeleteSupplierContact,
  useGetSupplierContacts,
  useUpdateSupplierContact,
} from "@/hooks/tenant/use-supplier-query"
import { type Supplier, type SupplierContact } from "@/types/tenant/supplier"
import {
  storeSupplierContactSchema,
  updateSupplierContactSchema,
  type StoreSupplierContactFormValues,
  type UpdateSupplierContactFormValues,
} from "@/schemas/tenant/supplier-schema"

type SuppliersManageContactsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function SuppliersManageContactsDialog({
  open,
  onOpenChange,
  supplier,
}: SuppliersManageContactsDialogProps) {
  const { data: contacts = [], isLoading } = useGetSupplierContacts(
    supplier.id,
    open
  )
  const createContact = useCreateSupplierContact(supplier.id)
  const updateContact = useUpdateSupplierContact(supplier.id)
  const deleteContact = useDeleteSupplierContact(supplier.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<SupplierContact | null>(
    null
  )
  const [deletingContact, setDeletingContact] = useState<SupplierContact | null>(
    null
  )

  const isUpdate = !!editingContact
  const schema = isUpdate ? updateSupplierContactSchema : storeSupplierContactSchema

  const form = useForm<
    StoreSupplierContactFormValues | UpdateSupplierContactFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      is_primary: false,
    },
  })

  const openCreateForm = () => {
    setEditingContact(null)
    form.reset({
      name: "",
      email: "",
      phone: "",
      position: "",
      is_primary: false,
    })
    setFormOpen(true)
  }

  const openEditForm = (contact: SupplierContact) => {
    setEditingContact(contact)
    form.reset({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      position: contact.position || "",
      is_primary: contact.is_primary,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreSupplierContactFormValues | UpdateSupplierContactFormValues
  ) => {
    const payload = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      position: data.position || null,
      is_primary: data.is_primary ?? false,
    }

    if (isUpdate && editingContact) {
      updateContact.mutate(
        { contactId: editingContact.id, contact: payload },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully")
            setFormOpen(false)
            setEditingContact(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update contact")
          },
        }
      )
    } else {
      createContact.mutate(payload as StoreSupplierContactFormValues, {
        onSuccess: () => {
          toast.success("Contact created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create contact")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingContact) return
    deleteContact.mutate(deletingContact.id, {
      onSuccess: () => {
        toast.success("Contact deleted successfully")
        setDeletingContact(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete contact")
      },
    })
  }

  const isSubmitting = createContact.isPending || updateContact.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Manage Contacts</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Contacts for &quot;{supplier.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={openCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : contacts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No contacts yet. Add one to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email || "—"}</TableCell>
                      <TableCell>{contact.phone || "—"}</TableCell>
                      <TableCell>{contact.position || "—"}</TableCell>
                      <TableCell>
                        {contact.is_primary ? (
                          <Badge variant="secondary">Primary</Badge>
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
                            onClick={() => openEditForm(contact)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeletingContact(contact)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <ResponsiveDialogFooter>
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
            setEditingContact(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Contact
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update contact details."
                : "Add a new contact for this supplier."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="supplier-contact-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input placeholder="Jane Doe" {...form.register("name")} />
                <FieldError message={form.formState.errors.name?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  {...form.register("email")}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Input placeholder="+1 555 000 0000" {...form.register("phone")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Position</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Sales Manager"
                  {...form.register("position")}
                />
              </FieldContent>
            </Field>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_primary"
                checked={form.watch("is_primary")}
                onCheckedChange={(checked) =>
                  form.setValue("is_primary", !!checked)
                }
              />
              <label htmlFor="is_primary" className="text-sm font-medium">
                Primary contact
              </label>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="supplier-contact-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isUpdate ? "Update Contact" : "Add Contact"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingContact}
        onOpenChange={(val) => {
          if (!val) setDeletingContact(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete contact?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete &quot;{deletingContact?.name}&quot;. This
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
              disabled={deleteContact.isPending}
            >
              {deleteContact.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
