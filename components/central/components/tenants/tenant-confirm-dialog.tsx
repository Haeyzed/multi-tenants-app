"use client";

import { TrashIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function TenantConfirmDialog() {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const onDelete = React.useCallback(() => {
    setIsDeleting(true);

    // Simulate deletion
    setTimeout(() => {
      setIsDeleting(false);
      setOpen(false); // Close dialog on success
    }, 1000);
  }, []);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete tenant?"
      description='This will permanently delete the tenant and all of its data. This action cannot be undone.'
      confirmText="Delete"
      cancelText="Cancel"
      confirmVariant="destructive"
      isLoading={isDeleting}
      onConfirm={onDelete}
      trigger={
        <Button variant="destructive">
          <TrashIcon className="mr-2 size-4" />
          Delete Tenant
        </Button>
      }
    />
  );
}