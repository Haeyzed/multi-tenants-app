"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useTenantLogout } from "@/hooks/tenant/use-auth-query"

type TenantSignOutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TenantSignOutDialog({
  open,
  onOpenChange,
}: TenantSignOutDialogProps) {
  const router = useRouter()
  const logoutMutation = useTenantLogout()

  const handleSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false)
        router.push("/admin/login")
      },
      onError: (error) => {
        toast.error(error.message || "Failed to sign out")
      },
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Sign out</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to sign out? You will need to sign in again to
            access your account.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending && <Spinner />}
            Sign out
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
