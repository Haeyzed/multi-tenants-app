"use client"

import * as React from "react"
import { toast } from "sonner"

export function useQueryErrorToast(
  error: Error | null,
  fallback = "Something went wrong while loading data."
) {
  React.useEffect(() => {
    if (error) {
      toast.error(error.message || fallback)
    }
  }, [error, fallback])
}
