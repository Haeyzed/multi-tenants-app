import {
  type FieldValues,
  type Path,
  type UseFormSetError,
} from "react-hook-form"
import { toast } from "sonner"

type ValidationApiError = Error & {
  errors?: Record<string, string[]>
}

function isValidationApiError(error: unknown): error is ValidationApiError {
  return (
    error instanceof Error &&
    "errors" in error &&
    error.errors != null &&
    typeof error.errors === "object"
  )
}

export function applyFormApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  if (!isValidationApiError(error) || !error.errors) {
    return false
  }

  for (const [field, messages] of Object.entries(error.errors)) {
    const message = messages[0]
    if (message) {
      setError(field as Path<T>, { type: "server", message })
    }
  }

  return true
}

export function handleFormApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallbackMessage: string
) {
  applyFormApiErrors(error, setError)

  const message =
    error instanceof Error && error.message ? error.message : fallbackMessage

  toast.error(message)
}
