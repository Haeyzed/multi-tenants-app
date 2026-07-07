import { tenantApiClient } from "./api-client"
import { TenantUser } from "@/types/tenant/user"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const login = async (credentials: {
  email: string
  password: string
}) => {
  const response = await tenantApiClient.post<
    ApiResponse<{ user: TenantUser; token: string }>
  >("/auth/login", credentials)

  if (response.data.token) {
    tenantApiClient.setToken(response.data.token)
  }

  return response.data
}

export const logout = async () => {
  await tenantApiClient.post<ApiResponse<void>>("/auth/logout", {})
  tenantApiClient.setToken(null)
}

export const getProfile = async (): Promise<TenantUser> => {
  const response =
    await tenantApiClient.get<ApiResponse<TenantUser>>("/auth/me")
  return response.data
}

export const forgotPassword = async (email: string) => {
  return tenantApiClient.post<ApiResponse<void>>("/auth/forgot-password", {
    email,
  })
}

export const resetPassword = async (data: {
  email: string
  otp: string
  password: string
  password_confirmation: string
}) => {
  return tenantApiClient.post<ApiResponse<void>>("/auth/reset-password", data)
}

export const updateProfile = async (
  data: Partial<Pick<TenantUser, "name" | "email">>
): Promise<TenantUser> => {
  const response = await tenantApiClient.put<ApiResponse<TenantUser>>(
    "/auth/profile",
    data
  )
  return response.data
}

export const changePassword = async (data: {
  current_password: string
  password: string
  password_confirmation: string
}) => {
  return tenantApiClient.put<ApiResponse<void>>("/auth/password", data)
}
