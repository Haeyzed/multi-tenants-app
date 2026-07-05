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
  useCreateSupplierBankAccount,
  useDeleteSupplierBankAccount,
  useGetSupplierBankAccounts,
  useUpdateSupplierBankAccount,
} from "@/hooks/tenant/use-supplier-query"
import { type Supplier, type SupplierBankAccount } from "@/types/tenant/supplier"
import {
  storeSupplierBankAccountSchema,
  updateSupplierBankAccountSchema,
  type StoreSupplierBankAccountFormValues,
  type UpdateSupplierBankAccountFormValues,
} from "@/schemas/tenant/supplier-schema"

type SuppliersManageBankAccountsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function SuppliersManageBankAccountsDialog({
  open,
  onOpenChange,
  supplier,
}: SuppliersManageBankAccountsDialogProps) {
  const { data: bankAccounts = [], isLoading } = useGetSupplierBankAccounts(
    supplier.id,
    open
  )
  const createBankAccount = useCreateSupplierBankAccount(supplier.id)
  const updateBankAccount = useUpdateSupplierBankAccount(supplier.id)
  const deleteBankAccount = useDeleteSupplierBankAccount(supplier.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] =
    useState<SupplierBankAccount | null>(null)
  const [deletingAccount, setDeletingAccount] =
    useState<SupplierBankAccount | null>(null)

  const isUpdate = !!editingAccount
  const schema = isUpdate
    ? updateSupplierBankAccountSchema
    : storeSupplierBankAccountSchema

  const form = useForm<
    StoreSupplierBankAccountFormValues | UpdateSupplierBankAccountFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      account_name: "",
      account_number: "",
      bank_name: "",
      bank_branch: "",
      swift_code: "",
      iban: "",
      currency: "USD",
      is_default: false,
    },
  })

  const openCreateForm = () => {
    setEditingAccount(null)
    form.reset({
      account_name: "",
      account_number: "",
      bank_name: "",
      bank_branch: "",
      swift_code: "",
      iban: "",
      currency: "USD",
      is_default: false,
    })
    setFormOpen(true)
  }

  const openEditForm = (account: SupplierBankAccount) => {
    setEditingAccount(account)
    form.reset({
      account_name: account.account_name,
      account_number: account.account_number,
      bank_name: account.bank_name,
      bank_branch: account.bank_branch || "",
      swift_code: account.swift_code || "",
      iban: account.iban || "",
      currency: account.currency,
      is_default: account.is_default,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreSupplierBankAccountFormValues | UpdateSupplierBankAccountFormValues
  ) => {
    const payload = {
      ...data,
      bank_branch: data.bank_branch || null,
      swift_code: data.swift_code || null,
      iban: data.iban || null,
      currency: data.currency || "USD",
      is_default: data.is_default ?? false,
    }

    if (isUpdate && editingAccount) {
      updateBankAccount.mutate(
        { accountId: editingAccount.id, account: payload },
        {
          onSuccess: () => {
            toast.success("Bank account updated successfully")
            setFormOpen(false)
            setEditingAccount(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update bank account"
            )
          },
        }
      )
    } else {
      createBankAccount.mutate(payload as StoreSupplierBankAccountFormValues, {
        onSuccess: () => {
          toast.success("Bank account created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create bank account")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingAccount) return
    deleteBankAccount.mutate(deletingAccount.id, {
      onSuccess: () => {
        toast.success("Bank account deleted successfully")
        setDeletingAccount(null)
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete bank account")
      },
    })
  }

  const isSubmitting = createBankAccount.isPending || updateBankAccount.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Manage Bank Accounts</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Bank accounts for &quot;{supplier.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={openCreateForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : bankAccounts.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No bank accounts yet. Add one to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.account_name}
                      </TableCell>
                      <TableCell>{account.bank_name}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {account.account_number}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell>
                        {account.is_default ? (
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
                            onClick={() => openEditForm(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeletingAccount(account)}
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
            setEditingAccount(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Bank Account
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update bank account details."
                : "Add a new bank account for this supplier."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="supplier-bank-account-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Account Name *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Operating Account"
                  {...form.register("account_name")}
                />
                <FieldError
                  message={form.formState.errors.account_name?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Account Number *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="1234567890"
                  className="font-mono"
                  {...form.register("account_number")}
                />
                <FieldError
                  message={form.formState.errors.account_number?.message}
                />
              </FieldContent>
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Bank Name *</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Bank name"
                    {...form.register("bank_name")}
                  />
                  <FieldError
                    message={form.formState.errors.bank_name?.message}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Bank Branch</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Branch name"
                    {...form.register("bank_branch")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>SWIFT Code</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="SWIFT"
                    className="uppercase"
                    {...form.register("swift_code")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>IBAN</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="IBAN"
                    className="uppercase"
                    {...form.register("iban")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Currency</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="USD"
                    maxLength={3}
                    className="uppercase"
                    {...form.register("currency", {
                      onChange: (e) => {
                        form.setValue("currency", e.target.value.toUpperCase())
                      },
                    })}
                  />
                  <FieldError message={form.formState.errors.currency?.message} />
                </FieldContent>
              </Field>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default_account"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) =>
                  form.setValue("is_default", !!checked)
                }
              />
              <label htmlFor="is_default_account" className="text-sm font-medium">
                Default bank account
              </label>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="supplier-bank-account-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isUpdate ? "Update Bank Account" : "Add Bank Account"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingAccount}
        onOpenChange={(val) => {
          if (!val) setDeletingAccount(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete bank account?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete &quot;{deletingAccount?.account_name}&quot;.
              This action cannot be undone.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBankAccount.isPending}
            >
              {deleteBankAccount.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
