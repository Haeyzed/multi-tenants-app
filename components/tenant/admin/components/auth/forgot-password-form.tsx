"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="Skinner-center flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-sm text-balance text-muted-foreground">
          Enter your email address below and we&#39;ll send you a link to reset your
          password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
          />
        </div>
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </div>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link
          href="/admin/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </form>
  )
}
