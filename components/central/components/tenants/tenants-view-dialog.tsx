"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Tenant } from "@/types/central/tenant"
import { type Domain } from "@/types/central/domain"
import { CheckCircle2, Globe } from "lucide-react"

type TenantsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h4>
  )
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium">{value ?? "—"}</div>
    </div>
  )
}

function isDomainVerified(domain: Domain) {
  return domain.verification_status === "verified"
}

export function TenantsViewDialog({
  open,
  onOpenChange,
  tenant,
}: TenantsViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Tenant Details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Overview of the tenant information and status.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <SectionTitle>General</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem label="Name" value={tenant.name} />
              <DetailItem label="Slug" value={tenant.slug} />
              <DetailItem label="Email" value={tenant.email} />
              <DetailItem label="Phone" value={tenant.phone} />
              <DetailItem
                label="Plan"
                value={tenant.plan_name ?? tenant.plan}
              />
              <DetailItem
                label="Status"
                value={
                  <Badge
                    variant={
                      tenant.status === "active"
                        ? "default"
                        : tenant.status === "suspended"
                          ? "destructive"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {tenant.status}
                  </Badge>
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <SectionTitle>System Dates</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailItem
                label="Created At"
                value={
                  tenant.created_at
                    ? format(new Date(tenant.created_at), "PPP")
                    : "—"
                }
              />
              <DetailItem
                label="Trial Ends"
                value={
                  tenant.trial_ends_at
                    ? format(new Date(tenant.trial_ends_at), "PPP")
                    : "—"
                }
              />
              <DetailItem
                label="Suspended At"
                value={
                  tenant.suspended_at
                    ? format(new Date(tenant.suspended_at), "PPP")
                    : "—"
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <SectionTitle>Associated Domains</SectionTitle>
            {tenant.domains?.length > 0 ? (
              <div className="space-y-2">
                {tenant.domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Globe className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm font-medium">
                        {domain.domain}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {domain.is_primary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                      {isDomainVerified(domain) ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="size-3" />
                          Verified
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No domains associated with this tenant.
              </p>
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
