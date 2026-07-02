import { tenantCustomerApiClient } from "./api-client"
import {
  CustomerAuthResult,
  CustomerProfile,
} from "@/types/tenant/customer"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const setAuthToken = (token: string | null) => {
  tenantCustomerApiClient.setToken(token)
}

export const login = async (credentials: {
  email: string
  password: string
}) => {
  const response = await tenantCustomerApiClient.post<
    ApiResponse<CustomerAuthResult>
  >("/customer/auth/login", credentials)

  if (response.data.token) {
    setAuthToken(response.data.token)
  }

  return response.data
}

export const register = async (data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
}) => {
  const response = await tenantCustomerApiClient.post<
    ApiResponse<CustomerAuthResult>
  >("/customer/auth/register", data)

  if (response.data.token) {
    setAuthToken(response.data.token)
  }

  return response.data
}

export const logout = async () => {
  await tenantCustomerApiClient.post<ApiResponse<void>>(
    "/customer/auth/logout",
    {}
  )
  setAuthToken(null)
}

export const getProfile = async (): Promise<CustomerProfile> => {
  const response = await tenantCustomerApiClient.get<
    ApiResponse<CustomerProfile>
  >("/customer/auth/me")
  return response.data
}

export const forgotPassword = async (email: string) => {
  return tenantCustomerApiClient.post<ApiResponse<void>>(
    "/customer/auth/forgot-password",
    { email }
  )
}

export const resetPassword = async (data: {
  email: string
  otp: string
  password: string
  password_confirmation: string
}) => {
  return tenantCustomerApiClient.post<ApiResponse<void>>(
    "/customer/auth/reset-password",
    data
  )
}

export const updateProfile = async (data: {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
}): Promise<CustomerProfile> => {
  const response = await tenantCustomerApiClient.put<
    ApiResponse<CustomerProfile>
  >("/customer/auth/profile", data)
  return response.data
}

export const changePassword = async (data: {
  current_password: string
  new_password: string
  new_password_confirmation: string
}) => {
  return tenantCustomerApiClient.put<ApiResponse<void>>(
    "/customer/auth/password",
    data
  )
}
