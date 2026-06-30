"use client"

import * as React from "react"
import { format } from "date-fns"
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
import { type Tenant } from "@/types/central/tenant"
import { Badge } from "@/components/ui/badge"

type TenantsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  )
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
          <div className="grid grid-cols-2 gap-4 border-b pb-6 md:grid-cols-3">
            <DetailItem label="Name" value={tenant.name} />
            <DetailItem label="Slug" value={tenant.slug} />
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
                >
                  {tenant.status}
                </Badge>
              }
            />
            <DetailItem label="Email" value={tenant.email} />
            <DetailItem label="Phone" value={tenant.phone} />
            <DetailItem label="Plan" value={tenant.plan} />
          </div>

          <div className="space-y-4 border-b pb-6">
            <h4 className="text-sm font-semibold">System Dates</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <DetailItem
                label="Created At"
                value={
                  tenant.created_at
                    ? format(new Date(tenant.created_at), "PPP")
                    : ""
                }
              />
              <DetailItem
                label="Trial Ends"
                value={
                  tenant.trial_ends_at
                    ? format(new Date(tenant.trial_ends_at), "PPP")
                    : ""
                }
              />
              <DetailItem
                label="Suspended At"
                value={
                  tenant.suspended_at
                    ? format(new Date(tenant.suspended_at), "PPP")
                    : "N/A"
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Associated Domains</h4>
            {tenant.domains?.length > 0 ? (
              <ul className="space-y-2">
                {tenant.domains.map((d: any) => (
                  <li
                    key={d.id || d.domain}
                    className="flex items-center space-x-2 rounded-md border p-2 text-sm"
                  >
                    <span className="font-medium">{d.domain}</span>
                    {d.is_primary && (
                      <Badge variant="outline" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
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
