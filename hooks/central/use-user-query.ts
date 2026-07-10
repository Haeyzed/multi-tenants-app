import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createUser,
  deleteManyUsers,
  deleteUser,
  exportUsers,
  getUserOptions,
  getUsers,
  getUserStatistics,
  importUsers,
  updateUser,
} from "@/lib/services/central/user-service"
import { type ExportParams } from "@/types/central/export"
import {
  StoreUserFormValues,
  UpdateUserFormValues,
} from "@/schemas/central/user-schema"

export const useGetUsers = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  })
}

export const useGetUserStatistics = () => {
  return useQuery({
    queryKey: ["user-statistics"],
    queryFn: () => getUserStatistics(),
  })
}

export const useGetUserOptions = () => {
  return useQuery({
    queryKey: ["user-option"],
    queryFn: () => getUserOptions(),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user: StoreUserFormValues) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["user-options"] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, user }: { id: number; user: UpdateUserFormValues }) =>
      updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["user-options"] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["user-options"] })
    },
  })
}

export const useDeleteManyUsers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyUsers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["user-options"] })
    },
  })
}

export const useExportUsers = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportUsers(params),
  })
}

export const useImportUsers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importUsers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["user-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["user-options"] })
    },
  })
}
