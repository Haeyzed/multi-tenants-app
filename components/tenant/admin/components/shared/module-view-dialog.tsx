"use client"

import * as React from "react"

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
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"

export type ModuleViewField = {
  label: string
  value: React.ReactNode
  className?: string
}

type ModuleViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: ModuleViewField[]
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h4>
  )
}

function DetailItem({ label, value, className }: ModuleViewField) {
  return (
    <div className={className}>
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-1 text-sm font-medium">{value ?? "—"}</div>
    </div>
  )
}

export function ModuleViewDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
}: ModuleViewDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          {description ? (
            <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
          ) : null}
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <DetailItem key={field.label} {...field} />
            ))}
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

export function ModuleViewVisibility({
  isVisible,
}: {
  isVisible: boolean
}) {
  return (
    <Status variant={isVisible ? "success" : "default"}>
      <StatusIndicator />
      <StatusLabel>{isVisible ? "Visible" : "Hidden"}</StatusLabel>
    </Status>
  )
}

export function ModuleViewBadge({
  children,
  variant = "secondary",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
}) {
  return <Badge variant={variant}>{children}</Badge>
}

export { SectionTitle, DetailItem }
