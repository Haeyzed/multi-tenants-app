"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Globe, Plus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
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
import {
  useAddTenantDomain,
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

export function TenantsDomainDialog({
  open,
  onOpenChange,
  tenant,
}: TenantsDomainDialogProps) {
  const addDomain = useAddTenantDomain()
  const verifyDomain = useVerifyTenantDomain()
  const [verifyingId, setVerifyingId] = React.useState<number | null>(null)

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
          toast.success("Domain verification initiated")
          setVerifyingId(null)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to verify domain")
          setVerifyingId(null)
        },
      }
    )
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Manage Domains</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Add new domains and manage existing verification status for{" "}
            <strong>{tenant.name}</strong>.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2">
          {/* Add New Domain Form */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_primary"
                  checked={form.watch("is_primary")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_primary", !!checked)
                  }
                />
                <label
                  htmlFor="is_primary"
                  className="text-sm leading-none font-medium"
                >
                  Set as primary domain
                </label>
              </div>
              <Button
                type="submit"
                disabled={addDomain.isPending}
                className="w-full"
              >
                {addDomain.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Domain
              </Button>
            </form>
          </div>

          {/* Existing Domains List */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Existing Domains
            </h3>
            {tenant.domains?.length > 0 ? (
              <div className="space-y-3">
                {tenant.domains.map((d: any) => (
                  <div
                    key={d.id || d.domain}
                    className="flex flex-col space-y-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{d.domain}</span>
                      </div>
                      {d.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <div className="flex items-center space-x-1 text-xs">
                        {d.is_verified ? (
                          <span className="text-success flex items-center">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-warning flex items-center">
                            <AlertCircle className="mr-1 h-3 w-3" /> Unverified
                          </span>
                        )}
                      </div>

                      {!d.is_verified && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleVerify(d.id)}
                          disabled={verifyingId === d.id}
                        >
                          {verifyingId === d.id && (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          )}
                          Verify Setup
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-8 text-center">
                <Globe className="mb-2 h-8 w-8 text-muted-foreground opacity-50" />
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
