import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCustomer,
  deleteCustomer,
  deleteManyCustomers,
  exportCustomers,
  getCustomerOptions,
  getCustomers,
  getCustomerStatistics,
  importCustomers,
  updateCustomer,
} from "@/lib/services/tenant/customer-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreCustomerFormValues,
  UpdateCustomerFormValues,
} from "@/schemas/tenant/customer-schema"

export const useGetCustomers = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  customer_group_id?: number
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  })
}

export const useGetCustomerStatistics = () => {
  return useQuery({
    queryKey: ["customer-statistics"],
    queryFn: () => getCustomerStatistics(),
  })
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (customer: StoreCustomerFormValues) => createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-statistics"] })
    },
  })
}

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: {
      id: number
      customer: UpdateCustomerFormValues
    }) => updateCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-statistics"] })
    },
  })
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-statistics"] })
    },
  })
}

export const useGetCustomerOptions = () => {
  return useQuery({
    queryKey: ["customerOptions"],
    queryFn: () => getCustomerOptions(),
  })
}

export const useDeleteManyCustomers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyCustomers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-statistics"] })
    },
  })
}

export const useExportCustomers = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportCustomers(params),
  })
}

export const useImportCustomers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCustomers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer-statistics"] })
    },
  })
}
