"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";

export interface ConfirmDialogProps extends React.ComponentProps<typeof ResponsiveDialog> {
  trigger?: React.ReactElement; // Changed to ReactElement since `render` needs a valid element to clone props/refs into
  title: React.ReactNode;
  description?: React.ReactNode;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
}

export function ConfirmDialog({
                                trigger,
                                title,
                                description,
                                cancelText = "Cancel",
                                confirmText = "Confirm",
                                onConfirm,
                                isLoading = false,
                                confirmVariant = "default",
                                children,
                                ...props
                              }: ConfirmDialogProps) {
  return (
    <ResponsiveDialog {...props}>
      {/* Trigger using the render prop */}
      {trigger && (
        <ResponsiveDialogTrigger render={trigger} />
      )}

      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          {description && (
            <ResponsiveDialogDescription>
              {description}
            </ResponsiveDialogDescription>
          )}
        </ResponsiveDialogHeader>

        {/* Render any additional content if passed */}
        {children}

        <ResponsiveDialogFooter>

          {/* Close button using the render prop */}
          <ResponsiveDialogClose
            render={
              <Button variant="outline" disabled={isLoading}>
                {cancelText}
              </Button>
            }
          />

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmText}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}