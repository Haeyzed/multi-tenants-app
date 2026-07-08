import { toast } from "sonner"

export type { ApiMutationResult } from "@/lib/api-response"
export { toMutationResult as unwrapApiMutation } from "@/lib/api-response"

export function toastApiError(error: unknown, fallback: string) {
  const message =
    error instanceof Error && error.message ? error.message : fallback

  toast.error(message)
}

export function toastApiSuccess(message?: string | null, fallback?: string) {
  toast.success(message || fallback || "Operation completed successfully")
}
