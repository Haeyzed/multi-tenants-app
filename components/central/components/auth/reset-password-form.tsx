"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/central/use-auth-query";
import { resetPasswordSchema } from "@/schemas/central/auth-schema";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      otp: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        router.push("/central/login");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input {...form.register("email")} readOnly />
                <FieldError errors={form.formState.errors.email ? [form.formState.errors.email] : []} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>OTP</FieldLabel>
              <FieldContent>
                <Input {...form.register("otp")} />
                <FieldError errors={form.formState.errors.otp ? [form.formState.errors.otp] : []} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <FieldContent>
                <Input type="password" {...form.register("password")} />
                <FieldError errors={form.formState.errors.password ? [form.formState.errors.password] : []} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Confirm New Password</FieldLabel>
              <FieldContent>
                <Input type="password" {...form.register("password_confirmation")} />
                <FieldError errors={form.formState.errors.password_confirmation ? [form.formState.errors.password_confirmation] : []} />
              </FieldContent>
            </Field>
            <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}