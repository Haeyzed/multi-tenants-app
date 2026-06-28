"use client"

import * as React from "react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"

interface FormDialogProps {
  trigger?: React.ReactElement
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOpen?: () => void
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open: controlledOpen,
  onOpenChange,
  onOpen,
}: FormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value)
    onOpenChange?.(value)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (value && onOpen) {
      onOpen()
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <ResponsiveDialogTrigger render={trigger} />}
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          {description && (
            <ResponsiveDialogDescription>
              {description}
            </ResponsiveDialogDescription>
          )}
        </ResponsiveDialogHeader>
        {children}
        {footer && <ResponsiveDialogFooter>{footer}</ResponsiveDialogFooter>}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
