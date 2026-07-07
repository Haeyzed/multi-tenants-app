"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { PasswordInput } from "@/components/ui/password-input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import { useCreateUser, useUpdateUser } from "@/hooks/central/use-user-query"
import { type User } from "@/types/central/user"
import {
  type StoreUserFormValues,
  storeUserSchema,
  type UpdateUserFormValues,
  updateUserSchema,
} from "@/schemas/central/user-schema"

type UsersMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: User
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function UsersMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: UsersMutateDialogProps) {
  const isUpdate = !!currentRow
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isSubmitting = createUser.isPending || updateUser.isPending
  const schema = isUpdate ? updateUserSchema : storeUserSchema

  const form = useForm<StoreUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        email: currentRow.email,
        phone: currentRow.phone || "",
        password: "",
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        is_active: true,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StoreUserFormValues | UpdateUserFormValues) => {
    const payload = {
      ...data,
      phone: data.phone || null,
    }

    if (isUpdate && currentRow) {
      const updatePayload = { ...payload } as UpdateUserFormValues
      if (!updatePayload.password) {
        delete updatePayload.password
      }

      updateUser.mutate(
        { id: currentRow.id, user: updatePayload },
        {
          onSuccess: () => {
            toast.success("User updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update user")
          },
        }
      )
    } else {
      createUser.mutate(payload as StoreUserFormValues, {
        onSuccess: () => {
          toast.success("User created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create user")
        },
      })
    }
  }

  return (
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
            {isUpdate ? "Update" : "Create"} User
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the user by providing necessary info."
              : "Add a new user by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="users-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="John Doe" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Email *</FieldLabel>
            <FieldContent>
              <Input
                type="email"
                placeholder="john@example.com"
                {...form.register("email")}
              />
              <FieldError message={form.formState.errors.email?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Phone</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    placeholder="Enter phone number"
                    defaultCountry="NG"
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={form.formState.errors.phone?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>{isUpdate ? "New Password" : "Password *"}</FieldLabel>
            <FieldContent>
              <PasswordInput
                placeholder={
                  isUpdate
                    ? "Leave blank to keep current"
                    : "Minimum 8 characters"
                }
                {...form.register("password")}
              />
              <FieldError message={form.formState.errors.password?.message} />
            </FieldContent>
          </Field>

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
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="users-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update User"
                : "Create User"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
