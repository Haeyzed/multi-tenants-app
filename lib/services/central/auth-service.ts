import { apiClient } from "./api-client"
import { User } from "@/types/central/user"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const login = async (credentials: {
  email: string
  password: string
}) => {
  const response = await apiClient.post<
    ApiResponse<{ user: User; token: string }>
  >("/auth/login", credentials)
  if (response.data.token) {
    apiClient.setToken(response.data.token)
  }
  return response.data
}

export const register = async (userInfo: any) => {
  const response = await apiClient.post<
    ApiResponse<{ user: User; token: string }>
  >("/auth/register", userInfo)
  if (response.data.token) {
    apiClient.setToken(response.data.token)
  }
  return response.data
}

export const forgotPassword = async (email: string) => {
  return apiClient.post<ApiResponse<void>>("/auth/forgot-password", { email })
}

export const resetPassword = async (data: any) => {
  return apiClient.post<ApiResponse<void>>("/auth/reset-password", data)
}

export const logout = async () => {
  await apiClient.post<ApiResponse<void>>("/auth/logout", {})
  apiClient.setToken(null)
}

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me")
  return response.data
}

export const updateProfile = async (
  data: Partial<Pick<User, "name" | "email">>
): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>("/auth/profile", data)
  return response.data
}

export const changePassword = async (data: any) => {
  return apiClient.put<ApiResponse<void>>("/auth/password", data)
}
