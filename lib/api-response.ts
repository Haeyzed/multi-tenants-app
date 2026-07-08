export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export type ApiMutationResult<T> = {
  data: T
  message: string
}

export function toMutationResult<T>(
  response: ApiResponse<T>,
  data: T = response.data
): ApiMutationResult<T> {
  return {
    data,
    message: response.message,
  }
}
