import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
} from "@/lib/services/tenant/customer-auth-service"
import { tenantCustomerApiClient } from "@/lib/services/tenant/api-client"

export const useCustomerLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] })
    },
  })
}

export const useCustomerRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      first_name: string
      last_name: string
      email: string
      phone?: string
      password: string
      password_confirmation: string
    }) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] })
    },
  })
}

export const useCustomerLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(["customer-profile"], null)
    },
  })
}

export const useCustomerForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  })
}

export const useCustomerResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      email: string
      otp: string
      password: string
      password_confirmation: string
    }) => resetPassword(data),
  })
}

export const useGetCustomerProfile = () => {
  return useQuery({
    queryKey: ["customer-profile"],
    queryFn: getProfile,
    enabled: !!tenantCustomerApiClient.getToken(),
    retry: false,
  })
}

export const useUpdateCustomerProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      first_name?: string
      last_name?: string
      email?: string
      phone?: string | null
    }) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-profile"] })
    },
  })
}

export const useChangeCustomerPassword = () => {
  return useMutation({
    mutationFn: (data: {
      current_password: string
      new_password: string
      new_password_confirmation: string
    }) => changePassword(data),
  })
}
