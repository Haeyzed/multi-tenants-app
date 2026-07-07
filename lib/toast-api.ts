import { toast } from "sonner"

export function toastApiError(error: unknown, fallback: string) {
  const message =
    error instanceof Error && error.message ? error.message : fallback

  toast.error(message)
}

export function toastApiSuccess(message?: string | null, fallback?: string) {
  toast.success(message || fallback || "Operation completed successfully")
}

export type ApiMutationResult<T> = {
  data: T
  message: string
}

export function unwrapApiMutation<T>(response: {
  data: T
  message: string
}): ApiMutationResult<T> {
  return {
    data: response.data,
    message: response.message,
  }
}
