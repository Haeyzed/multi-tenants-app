import { User } from "@/types/central/user"
import {
  ExportParams,
  UserOption,
  UserStatistics,
} from "@/types/central/export"
import { apiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreUserFormValues,
  UpdateUserFormValues,
} from "@/schemas/central/user-schema"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"

export const getUsers = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User[]>>("/users", params)
  return {
    data: response.data,
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
  return response.data
}

export const createUser = async (
  user: StoreUserFormValues
): Promise<ApiMutationResult<User>> => {
  const response = await apiClient.post<ApiResponse<User>>("/users", user)
  return { data: response.data, message: response.message }
}

export const updateUser = async (
  id: number,
  user: UpdateUserFormValues
): Promise<ApiMutationResult<User>> => {
  const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, user)
  return { data: response.data, message: response.message }
}

export const deleteUser = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/users/${id}`)
  return { data: null, message: response.message }
}

export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response =
    await apiClient.get<ApiResponse<UserStatistics>>("/users/statistics")
  return response.data
}

export const getUserOptions = async (): Promise<UserOption[]> => {
  const response =
    await apiClient.get<ApiResponse<UserOption[]>>("/users/options")
  return response.data
}

export const deleteManyUsers = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>("/users/bulk", {
    ids,
  })
  return { data: null, message: response.message }
}

export const exportUsers = async (
  params: ExportParams
): Promise<void | ApiMutationResult<null>> => {
  const body = {
    ids: params.ids,
    delivery: params.delivery,
    type: params.type ?? "xlsx",
    start_date: params.start_date,
    end_date: params.end_date,
    recipient_id: params.recipient_id,
    columns: params.columns,
  }

  if (params.delivery === "email") {
    const response = await apiClient.post<ApiResponse<void>>(
      "/users/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await apiClient.postFileDownload("/users/export", body, {
    defaultFilename: `users-export.${extension}`,
  })
}

export const downloadUsersImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await apiClient.getFileDownload(
    "/users/import/sample",
    { type },
    `users-import-sample.${type}`
  )
}

export const importUsers = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await apiClient.upload<ApiResponse<null>>(
    "/users/import",
    formData
  )
  return { data: null, message: response.message }
}
