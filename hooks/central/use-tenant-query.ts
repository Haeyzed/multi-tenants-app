import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
} from "@/lib/services/central/tenant-service";
import { Tenant } from "@/types/central/tenant";

export const useGetTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await getTenants();
      return response.data;
    },
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenant: Omit<Tenant, "id">) => createTenant(tenant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tenant }: { id: string; tenant: Partial<Omit<Tenant, "id">> }) =>
      updateTenant(id, tenant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};