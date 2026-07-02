"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { PasswordInput } from "@/components/ui/password-input"
import { Spinner } from "@/components/ui/spinner"
import { useCustomerRegister } from "@/hooks/tenant/use-customer-auth-query"
import { customerRegisterSchema } from "@/schemas/tenant/customer-auth-schema"
import { handleFormApiError } from "@/lib/form-api-errors"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const registerMutation = useCustomerRegister()

  const form = useForm<z.infer<typeof customerRegisterSchema>>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  })

  const onSubmit = (values: z.infer<typeof customerRegisterSchema>) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Account created successfully")
        router.push("/dashboard")
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Registration failed")
      },
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>First name</FieldLabel>
            <FieldContent>
              <Input placeholder="John" {...form.register("first_name")} />
              <FieldError
                errors={
                  form.formState.errors.first_name
                    ? [form.formState.errors.first_name]
                    : []
                }
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Last name</FieldLabel>
            <FieldContent>
              <Input placeholder="Doe" {...form.register("last_name")} />
              <FieldError
                errors={
                  form.formState.errors.last_name
                    ? [form.formState.errors.last_name]
                    : []
                }
              />
            </FieldContent>
          </Field>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="m@example.com" {...form.register("email")} />
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
            <FieldError
              errors={
                form.formState.errors.email ? [form.formState.errors.email] : []
              }
            />
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
            <FieldError
              errors={
                form.formState.errors.phone ? [form.formState.errors.phone] : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldContent>
            <PasswordInput {...form.register("password")} />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
            <FieldError
              errors={
                form.formState.errors.password
                  ? [form.formState.errors.password]
                  : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Confirm password</FieldLabel>
          <FieldContent>
            <PasswordInput {...form.register("password_confirmation")} />
            <FieldError
              errors={
                form.formState.errors.password_confirmation
                  ? [form.formState.errors.password_confirmation]
                  : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && <Spinner />}
            {registerMutation.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            Sign up with Google
          </Button>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
