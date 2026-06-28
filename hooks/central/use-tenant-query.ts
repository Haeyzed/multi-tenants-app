import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTenant,
  deleteTenant,
  getTenants,
  updateTenant,
  getTenantStatistics,
  activateTenant,
  suspendTenant,
  addTenantDomain,
  verifyTenantDomain,
} from "@/lib/services/central/tenant-service";

export const useGetTenants = (params?: {
  search?: string;
  status?: ("pending" | "active" | "suspended")[];
  per_page?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["tenants", params],
    queryFn: () => getTenants(params),
  });
};

export const useGetTenantStatistics = () => {
  return useQuery({
    queryKey: ["tenant-statistics"],
    queryFn: getTenantStatistics,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tenant: any) => createTenant(tenant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tenant }: { id: string; tenant: any }) =>
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

export const useActivateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useSuspendTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useAddTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, domain }: { id: string; domain: { domain: string; is_primary?: boolean } }) =>
      addTenantDomain(id, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useVerifyTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, domainId }: { tenantId: string; domainId: number }) =>
      verifyTenantDomain(tenantId, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};