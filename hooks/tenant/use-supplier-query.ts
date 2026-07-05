import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createSupplier,
  createSupplierAddress,
  createSupplierBankAccount,
  createSupplierContact,
  deleteManySuppliers,
  deleteSupplier,
  deleteSupplierAddress,
  deleteSupplierBankAccount,
  deleteSupplierContact,
  exportSuppliers,
  getSupplierAddresses,
  getSupplierBankAccounts,
  getSupplierContacts,
  getSupplierOptions,
  getSuppliers,
  getSupplierStatistics,
  importSuppliers,
  toggleSupplierActive,
  updateSupplier,
  updateSupplierAddress,
  updateSupplierBankAccount,
  updateSupplierContact,
} from "@/lib/services/tenant/supplier-service"
import {
  StoreSupplierAddressFormValues,
  StoreSupplierBankAccountFormValues,
  StoreSupplierContactFormValues,
  StoreSupplierFormValues,
  UpdateSupplierAddressFormValues,
  UpdateSupplierBankAccountFormValues,
  UpdateSupplierContactFormValues,
  UpdateSupplierFormValues,
} from "@/schemas/tenant/supplier-schema"
import { type ExportParams } from "@/types/tenant/export"

export const useGetSuppliers = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  })
}

export const useGetSupplierStatistics = () => {
  return useQuery({
    queryKey: ["supplier-statistics"],
    queryFn: () => getSupplierStatistics(),
  })
}

export const useCreateSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (supplier: StoreSupplierFormValues) => createSupplier(supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["supplierOptions"] })
    },
  })
}

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      supplier,
    }: {
      id: number
      supplier: UpdateSupplierFormValues
    }) => updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["supplierOptions"] })
    },
  })
}

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
    },
  })
}

export const useDeleteManySuppliers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManySuppliers(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
    },
  })
}

export const useExportSuppliers = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportSuppliers(params),
  })
}

export const useImportSuppliers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importSuppliers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["supplierOptions"] })
    },
  })
}

export const useToggleSupplierActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleSupplierActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["supplier-statistics"] })
    },
  })
}

export const useGetSupplierOptions = () => {
  return useQuery({
    queryKey: ["supplierOptions"],
    queryFn: () => getSupplierOptions(),
  })
}

export const useGetSupplierContacts = (supplierId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["supplier-contacts", supplierId],
    queryFn: () => getSupplierContacts(supplierId!),
    enabled: enabled && !!supplierId,
  })
}

export const useCreateSupplierContact = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contact: StoreSupplierContactFormValues) =>
      createSupplierContact(supplierId, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-contacts", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useUpdateSupplierContact = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      contactId,
      contact,
    }: {
      contactId: number
      contact: UpdateSupplierContactFormValues
    }) => updateSupplierContact(supplierId, contactId, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-contacts", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useDeleteSupplierContact = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contactId: number) => deleteSupplierContact(supplierId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-contacts", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useGetSupplierAddresses = (supplierId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["supplier-addresses", supplierId],
    queryFn: () => getSupplierAddresses(supplierId!),
    enabled: enabled && !!supplierId,
  })
}

export const useCreateSupplierAddress = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (address: StoreSupplierAddressFormValues) =>
      createSupplierAddress(supplierId, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-addresses", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useUpdateSupplierAddress = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      addressId,
      address,
    }: {
      addressId: number
      address: UpdateSupplierAddressFormValues
    }) => updateSupplierAddress(supplierId, addressId, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-addresses", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useDeleteSupplierAddress = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (addressId: number) => deleteSupplierAddress(supplierId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-addresses", supplierId] })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useGetSupplierBankAccounts = (supplierId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["supplier-bank-accounts", supplierId],
    queryFn: () => getSupplierBankAccounts(supplierId!),
    enabled: enabled && !!supplierId,
  })
}

export const useCreateSupplierBankAccount = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (account: StoreSupplierBankAccountFormValues) =>
      createSupplierBankAccount(supplierId, account),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplier-bank-accounts", supplierId],
      })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useUpdateSupplierBankAccount = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      accountId,
      account,
    }: {
      accountId: number
      account: UpdateSupplierBankAccountFormValues
    }) => updateSupplierBankAccount(supplierId, accountId, account),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplier-bank-accounts", supplierId],
      })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}

export const useDeleteSupplierBankAccount = (supplierId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (accountId: number) => deleteSupplierBankAccount(supplierId, accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplier-bank-accounts", supplierId],
      })
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
    },
  })
}
