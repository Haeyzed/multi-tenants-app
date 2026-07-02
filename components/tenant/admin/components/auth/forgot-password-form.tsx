"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
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
import { Spinner } from "@/components/ui/spinner"
import { useTenantForgotPassword } from "@/hooks/tenant/use-auth-query"
import { tenantAdminForgotPasswordSchema } from "@/schemas/tenant/tenant-admin-auth-schema"
import { handleFormApiError } from "@/lib/form-api-errors"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const forgotPasswordMutation = useTenantForgotPassword()

  const form = useForm<z.infer<typeof tenantAdminForgotPasswordSchema>>({
    resolver: zodResolver(tenantAdminForgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = (values: z.infer<typeof tenantAdminForgotPasswordSchema>) => {
    forgotPasswordMutation.mutate(values.email, {
      onSuccess: () => {
        toast.success("Password reset OTP sent to your email")
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Failed to send reset OTP")
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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we&apos;ll send you a reset OTP.
          </p>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="m@example.com" {...form.register("email")} />
            <FieldError
              errors={
                form.formState.errors.email ? [form.formState.errors.email] : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending && <Spinner />}
            {forgotPasswordMutation.isPending ? "Sending..." : "Send reset OTP"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link href="/admin/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
