"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel, FieldGroup, FieldSeparator, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/central/use-auth-query";
import { loginSchema } from "@/schemas/central/auth-schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { handleFormApiError } from "@/lib/form-api-errors";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const loginMutation = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push("/central/dashboard");
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Login failed");
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="m@example.com" {...form.register("email")} />
            <FieldError errors={form.formState.errors.email ? [form.formState.errors.email] : []} />
          </FieldContent>
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel>Password</FieldLabel>
            <Link
              href="/central/forgot-password"
              className="ms-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <FieldContent>
            <PasswordInput {...form.register("password")} />
            <FieldError errors={form.formState.errors.password ? [form.formState.errors.password] : []} />
          </FieldContent>
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Spinner />}
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/central/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
