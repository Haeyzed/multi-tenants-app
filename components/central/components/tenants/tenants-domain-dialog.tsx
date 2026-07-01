"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertCircle,
  Star,
  Trash2,
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { type Tenant } from "@/types/central/tenant"
import { type Domain } from "@/types/central/domain"
import {
  useAddTenantDomain,
  useDeleteTenantDomain,
  useGetTenantDomains,
  useUpdateTenantDomain,
  useVerifyTenantDomain,
} from "@/hooks/central/use-tenant-query"

const domainSchema = z.object({
  domain: z.string().min(3, "Valid domain is required").max(255),
  is_primary: z.boolean().default(false).optional(),
})

type DomainFormValues = z.infer<typeof domainSchema>

type TenantsDomainDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
}

function isDomainVerified(domain: Domain) {
  return domain.verification_status === "verified"
}

export function TenantsDomainDialog({
  open,
  onOpenChange,
  tenant,
}: TenantsDomainDialogProps) {
  const addDomain = useAddTenantDomain()
  const updateDomain = useUpdateTenantDomain()
  const verifyDomain = useVerifyTenantDomain()
  const deleteDomain = useDeleteTenantDomain()
  const { data: domains = [], isLoading: isLoadingDomains } = useGetTenantDomains(
    tenant.id,
    open
  )
  const [verifyingId, setVerifyingId] = React.useState<number | null>(null)
  const [updatingId, setUpdatingId] = React.useState<number | null>(null)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: "",
      is_primary: false,
    },
  })

  const onSubmit = (data: DomainFormValues) => {
    addDomain.mutate(
      { id: tenant.id, domain: data },
      {
        onSuccess: () => {
          toast.success("Domain added successfully")
          form.reset()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add domain")
        },
      }
    )
  }

  const handleVerify = (domainId: number) => {
    setVerifyingId(domainId)
    verifyDomain.mutate(
      { tenantId: tenant.id, domainId },
      {
        onSuccess: () => {
          toast.success("Domain verified successfully")
          setVerifyingId(null)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to verify domain")
          setVerifyingId(null)
        },
      }
    )
  }

  const handleSetPrimary = (domain: Domain) => {
    if (domain.is_primary) return

    setUpdatingId(domain.id)
    updateDomain.mutate(
      { tenantId: tenant.id, domainId: domain.id, data: { is_primary: true } },
      {
        onSuccess: () => {
          toast.success("Primary domain updated")
          setUpdatingId(null)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update domain")
          setUpdatingId(null)
        },
      }
    )
  }

  const handleDelete = (domain: Domain) => {
    setDeletingId(domain.id)
    deleteDomain.mutate(
      { tenantId: tenant.id, domainId: domain.id },
      {
        onSuccess: () => {
          toast.success("Domain deleted successfully")
          setDeletingId(null)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete domain")
          setDeletingId(null)
        },
      }
    )
  }

  const canDeleteDomain = (domain: Domain) =>
    !domain.is_primary && domains.length > 1

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Manage Domains</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Add new domains and manage existing verification status for{" "}
            <strong>{tenant.name}</strong>.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Add New Domain
            </h3>
            <form
              id="domain-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Field>
                <FieldLabel>Domain Name *</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="example.com"
                    {...form.register("domain")}
                  />
                  {form.formState.errors.domain && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.domain.message}
                    </p>
                  )}
                </FieldContent>
              </Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_primary"
                  checked={form.watch("is_primary")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_primary", !!checked)
                  }
                />
                <label htmlFor="is_primary" className="text-sm font-medium">
                  Set as primary domain
                </label>
              </div>
              <Button
                type="submit"
                disabled={addDomain.isPending}
                className="w-full"
              >
                {addDomain.isPending ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                Add Domain
              </Button>
            </form>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Existing Domains
            </h3>
            {isLoadingDomains ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : domains.length > 0 ? (
              <div className="space-y-3">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="space-y-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Globe className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium">
                          {domain.domain}
                        </span>
                      </div>
                      {domain.is_primary && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                      <div className="flex items-center gap-1 text-xs">
                        {isDomainVerified(domain) ? (
                          <span className="flex items-center text-emerald-600">
                            <CheckCircle2 className="mr-1 size-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-600">
                            <AlertCircle className="mr-1 size-3" />
                            Unverified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!domain.is_primary && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleSetPrimary(domain)}
                            disabled={updatingId === domain.id}
                          >
                            {updatingId === domain.id ? (
                              <Spinner className="mr-1 size-3" />
                            ) : (
                              <Star className="mr-1 size-3" />
                            )}
                            Set Primary
                          </Button>
                        )}
                        {!isDomainVerified(domain) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleVerify(domain.id)}
                            disabled={verifyingId === domain.id}
                          >
                            {verifyingId === domain.id && (
                              <Spinner className="mr-1 size-3" />
                            )}
                            Verify Setup
                          </Button>
                        )}
                        {canDeleteDomain(domain) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDelete(domain)}
                            disabled={deletingId === domain.id}
                          >
                            {deletingId === domain.id ? (
                              <Spinner className="mr-1 size-3" />
                            ) : (
                              <Trash2 className="mr-1 size-3" />
                            )}
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-8 text-center">
                <Globe className="mb-2 size-8 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No domains added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
