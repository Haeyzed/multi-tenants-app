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
import { useCreateUser, useUpdateUser } from "@/hooks/central/use-user-query"
import { type User } from "@/types/central/user"
import {
  storeUserSchema,
  updateUserSchema,
  type StoreUserFormValues,
  type UpdateUserFormValues,
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

  const createForm = useForm<StoreUserFormValues>({
    resolver: zodResolver(storeUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      is_active: true,
    },
  })

  const updateForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (currentRow) {
      updateForm.reset({
        name: currentRow.name,
        email: currentRow.email,
        phone: currentRow.phone,
        password: "",
        is_active: currentRow.is_active,
      })
    } else {
      createForm.reset({
        name: "",
        email: "",
        phone: "",
        password: "",
        is_active: true,
      })
    }
  }, [currentRow, createForm, updateForm])

  const onCreateSubmit = (data: StoreUserFormValues) => {
    createUser.mutate(data, {
      onSuccess: () => {
        toast.success("User created successfully")
        onOpenChange(false)
        createForm.reset()
      },
      onError: (error) =>
        handleFormApiError(error, createForm.setError, "Failed to create user"),
    })
  }

  const onUpdateSubmit = (data: UpdateUserFormValues) => {
    if (!currentRow) return

    const payload = { ...data }
    if (!payload.password) delete payload.password

    updateUser.mutate(
      { id: currentRow.id, user: payload },
      {
        onSuccess: () => {
          toast.success("User updated successfully")
          onOpenChange(false)
          updateForm.reset()
        },
        onError: (error) =>
          handleFormApiError(error, updateForm.setError, "Failed to update user"),
      }
    )
  }

  const formId = isUpdate ? "users-update-form" : "users-create-form"

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          createForm.reset()
          updateForm.reset()
        }
      }}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} User
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the user account details."
              : "Add a new central platform user."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {isUpdate ? (
          <form
            id={formId}
            onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input placeholder="John Doe" {...updateForm.register("name")} />
                <FieldError message={updateForm.formState.errors.name?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent>
                <Input placeholder="john@example.com" {...updateForm.register("email")} />
                <FieldError message={updateForm.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Input placeholder="+1234567890" {...updateForm.register("phone")} />
                <FieldError message={updateForm.formState.errors.phone?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  {...updateForm.register("password")}
                />
                <FieldError message={updateForm.formState.errors.password?.message} />
              </FieldContent>
            </Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={updateForm.watch("is_active")}
                onCheckedChange={(checked) =>
                  updateForm.setValue("is_active", !!checked)
                }
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active
              </label>
            </div>
          </form>
        ) : (
          <form
            id={formId}
            onSubmit={createForm.handleSubmit(onCreateSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <FieldContent>
                <Input placeholder="John Doe" {...createForm.register("name")} />
                <FieldError message={createForm.formState.errors.name?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent>
                <Input placeholder="john@example.com" {...createForm.register("email")} />
                <FieldError message={createForm.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Input placeholder="+1234567890" {...createForm.register("phone")} />
                <FieldError message={createForm.formState.errors.phone?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Password *</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...createForm.register("password")}
                />
                <FieldError message={createForm.formState.errors.password?.message} />
              </FieldContent>
            </Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={createForm.watch("is_active")}
                onCheckedChange={(checked) =>
                  createForm.setValue("is_active", !!checked)
                }
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active
              </label>
            </div>
          </form>
        )}

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Close</Button>} />
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : isUpdate ? "Update User" : "Create User"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}