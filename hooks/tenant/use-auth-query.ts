import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  updateProfile,
} from "@/lib/services/tenant/auth-service"
import { TenantUser } from "@/types/tenant/user"
import { tenantApiClient } from "@/lib/services/tenant/api-client"

export const useTenantLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-profile"] })
    },
  })
}

export const useTenantLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(["tenant-profile"], null)
    },
  })
}

export const useTenantForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  })
}

export const useTenantResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      email: string
      otp: string
      password: string
      password_confirmation: string
    }) => resetPassword(data),
  })
}

export const useGetTenantProfile = () => {
  return useQuery({
    queryKey: ["tenant-profile"],
    queryFn: getProfile,
    enabled: !!tenantApiClient.getToken(),
    retry: false,
  })
}

export const useUpdateTenantProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Pick<TenantUser, "name" | "email">>) =>
      updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-profile"] })
    },
  })
}

export const useChangeTenantPassword = () => {
  return useMutation({
    mutationFn: (data: {
      current_password: string
      password: string
      password_confirmation: string
    }) => changePassword(data),
  })
}
