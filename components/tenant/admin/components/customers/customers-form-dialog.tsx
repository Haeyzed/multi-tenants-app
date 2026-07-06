"use client"

import * as React from "react"
import { format } from "date-fns"
import { Plus } from "lucide-react"
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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import { TenantAdminAuthGuard } from "@/components/tenant/admin/components/auth-guard"
import { CustomerGroupsFormDialog } from "@/components/tenant/admin/components/customer-groups/customer-groups-form-dialog"
import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/hooks/tenant/use-customer-query"
import { useGetCustomerGroupOptions } from "@/hooks/tenant/use-customer-group-query"
import { type Customer } from "@/types/tenant/customer"
import {
  type CustomerGroup,
  type CustomerGroupOption,
} from "@/types/tenant/customer-group"
import {
  storeCustomerSchema,
  updateCustomerSchema,
  type StoreCustomerFormValues,
  type UpdateCustomerFormValues,
} from "@/schemas/tenant/customer-schema"

type CustomersFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Customer
}

type GenderOption = { label: string; value: string }

const noneGroupOption: CustomerGroupOption = {
  label: "No group",
  value: 0,
}

const genderOptions: GenderOption[] = [
  { label: "Not specified", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function parseDateString(value?: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function CustomersFormDialog({
  open,
  onOpenChange,
  currentRow,
}: CustomersFormDialogProps) {
  const isUpdate = !!currentRow
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const { data: groupOptions = [] } = useGetCustomerGroupOptions()
  const isSubmitting = createCustomer.isPending || updateCustomer.isPending
  const schema = isUpdate ? updateCustomerSchema : storeCustomerSchema
  const [groupDialogOpen, setGroupDialogOpen] = React.useState(false)

  const groupItems = React.useMemo(
    () => [noneGroupOption, ...groupOptions],
    [groupOptions]
  )

  const form = useForm<StoreCustomerFormValues | UpdateCustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      customer_group_id: null,
      date_of_birth: null,
      gender: null,
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        first_name: currentRow.first_name,
        last_name: currentRow.last_name,
        email: currentRow.email || "",
        phone: currentRow.phone || "",
        customer_group_id: currentRow.customer_group_id,
        date_of_birth: currentRow.date_of_birth || null,
        gender: currentRow.gender || null,
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        customer_group_id: null,
        date_of_birth: null,
        gender: null,
        is_active: true,
      })
    }
  }, [open, currentRow, form])

  const groupId = form.watch("customer_group_id")
  const selectedGroup =
    groupItems.find((item) =>
      groupId ? item.value === groupId : item.value === 0
    ) ?? noneGroupOption

  const gender = form.watch("gender")
  const selectedGender =
    genderOptions.find((item) => item.value === (gender ?? "")) ??
    genderOptions[0]

  const dateOfBirth = form.watch("date_of_birth")
  const selectedDateOfBirth = parseDateString(dateOfBirth)

  const onSubmit = (
    data: StoreCustomerFormValues | UpdateCustomerFormValues
  ) => {
    const payload = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      customer_group_id: data.customer_group_id ?? null,
    }

    if (isUpdate && currentRow) {
      updateCustomer.mutate(
        { id: currentRow.id, customer: payload as UpdateCustomerFormValues },
        {
          onSuccess: () => {
            toast.success("Customer updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update customer"
            )
          },
        }
      )
    } else {
      createCustomer.mutate(payload as StoreCustomerFormValues, {
        onSuccess: () => {
          toast.success("Customer created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create customer"
          )
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
        if (!val) {
          form.reset()
          setGroupDialogOpen(false)
        }
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Customer
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the customer by providing necessary info."
              : "Add a new customer by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="customers-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>First Name *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="First name"
                  {...form.register("first_name")}
                />
                <FieldError
                  message={form.formState.errors.first_name?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Last Name *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Last name"
                  {...form.register("last_name")}
                />
                <FieldError
                  message={form.formState.errors.last_name?.message}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...form.register("email")}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Phone number"
                  {...form.register("phone")}
                />
                <FieldError message={form.formState.errors.phone?.message} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Customer Group</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Combobox
                    items={groupItems}
                    itemToStringValue={(item) => item.label}
                    value={selectedGroup}
                    onValueChange={(item) => {
                      if (!item) return
                      form.setValue(
                        "customer_group_id",
                        item.value === 0 ? null : item.value
                      )
                    }}
                  >
                    <ComboboxInput placeholder="Select customer group..." />
                    <ComboboxContent>
                      <ComboboxEmpty>No groups found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <TenantAdminAuthGuard permissions="customers.manage">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setGroupDialogOpen(true)}
                    aria-label="Create customer group"
                  >
                    <Plus className="size-4" />
                  </Button>
                </TenantAdminAuthGuard>
              </div>
              <FieldError
                message={form.formState.errors.customer_group_id?.message}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Date of Birth</FieldLabel>
              <FieldContent>
                <DatePicker
                  selected={selectedDateOfBirth}
                  onSelect={(date) => {
                    form.setValue(
                      "date_of_birth",
                      date ? format(date, "yyyy-MM-dd") : null
                    )
                  }}
                  placeholder="Pick date of birth"
                  maxDate={new Date()}
                />
                <FieldError
                  message={form.formState.errors.date_of_birth?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <FieldContent>
                <Combobox
                  items={genderOptions}
                  itemToStringValue={(item) => item.label}
                  value={selectedGender}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("gender", item.value || null)
                  }}
                >
                  <ComboboxInput placeholder="Select gender..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No options found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value || "none"} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError message={form.formState.errors.gender?.message} />
              </FieldContent>
            </Field>
          </div>

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
          <Button type="submit" form="customers-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Customer"
                : "Create Customer"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>

    <CustomerGroupsFormDialog
      open={groupDialogOpen}
      onOpenChange={setGroupDialogOpen}
      onSuccess={(group: CustomerGroup) => {
        form.setValue("customer_group_id", group.id)
      }}
    />
    </>
  )
}
