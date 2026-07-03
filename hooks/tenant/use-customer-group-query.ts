import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCustomerGroup,
  deleteManyCustomerGroups,
  deleteCustomerGroup,
  exportCustomerGroups,
  getCustomerGroupOptions,
  getCustomerGroups,
  getCustomerGroupStatistics,
  importCustomerGroups,
  updateCustomerGroup,
} from "@/lib/services/tenant/customer-group-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreCustomerGroupFormValues,
  UpdateCustomerGroupFormValues,
} from "@/schemas/tenant/customer-group-schema"

export const useGetCustomerGroups = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["customer-groups", params],
    queryFn: () => getCustomerGroups(params),
  })
}

export const useGetCustomerGroupStatistics = () => {
  return useQuery({
    queryKey: ["customer-group-statistics"],
    queryFn: () => getCustomerGroupStatistics(),
  })
}

export const useCreateCustomerGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (group: StoreCustomerGroupFormValues) => createCustomerGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-groups"] })
      queryClient.invalidateQueries({ queryKey: ["customer-group-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["customerGroupOptions"] })
    },
  })
}

export const useUpdateCustomerGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, group }: { id: number; group: UpdateCustomerGroupFormValues }) =>
      updateCustomerGroup(id, group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-groups"] })
      queryClient.invalidateQueries({ queryKey: ["customer-group-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["customerGroupOptions"] })
    },
  })
}

export const useDeleteCustomerGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCustomerGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-groups"] })
      queryClient.invalidateQueries({ queryKey: ["customer-group-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["customerGroupOptions"] })
    },
  })
}

export const useGetCustomerGroupOptions = () => {
  return useQuery({
    queryKey: ["customerGroupOptions"],
    queryFn: () => getCustomerGroupOptions(),
  })
}

export const useDeleteManyCustomerGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyCustomerGroups(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-groups"] })
      queryClient.invalidateQueries({ queryKey: ["customer-group-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["customerGroupOptions"] })
    },
  })
}

export const useExportCustomerGroups = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportCustomerGroups(params),
  })
}

export const useImportCustomerGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCustomerGroups(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-groups"] })
      queryClient.invalidateQueries({ queryKey: ["customer-group-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["customerGroupOptions"] })
    },
  })
}
