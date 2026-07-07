"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/central/use-auth-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
})

export function RegisterForm() {
  const router = useRouter()
  const registerMutation = useRegister()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        router.push("/central/dashboard")
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Registration failed")
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input placeholder="John Doe" {...form.register("name")} />
                <FieldError
                  errors={
                    form.formState.errors.name
                      ? [form.formState.errors.name]
                      : []
                  }
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="m@example.com"
                  {...form.register("email")}
                />
                <FieldError
                  errors={
                    form.formState.errors.email
                      ? [form.formState.errors.email]
                      : []
                  }
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <Input type="password" {...form.register("password")} />
                <FieldError
                  errors={
                    form.formState.errors.password
                      ? [form.formState.errors.password]
                      : []
                  }
                />
              </FieldContent>
            </Field>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && <Spinner />}
              {registerMutation.isPending
                ? "Creating account..."
                : "Create an account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/central/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
