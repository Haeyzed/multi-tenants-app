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
} from "@/lib/services/central/auth-service"
import { apiClient } from "@/lib/services/central/api-client"
import { User } from "@/types/central/user"

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userInfo: any) => register(userInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => resetPassword(data),
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(["profile"], null)
    },
  })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!apiClient.getToken(),
    retry: false,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Pick<User, "name" | "email">>) =>
      updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: any) => changePassword(data),
  })
}
