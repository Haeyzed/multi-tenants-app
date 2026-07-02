"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { useCustomerLogout } from "@/hooks/tenant/use-customer-auth-query"

type CustomerSignOutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerSignOutDialog({
  open,
  onOpenChange,
}: CustomerSignOutDialogProps) {
  const router = useRouter()
  const logoutMutation = useCustomerLogout()

  const handleSignOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false)
        router.push("/login")
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
