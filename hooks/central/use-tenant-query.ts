import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
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
  updateTenantDomain,
  deleteTenantDomain,
  getTenantDomains,
  deleteManyTenants,
  exportTenants,
  importTenants,
} from "@/lib/services/central/tenant-service";
import { type ExportParams } from "@/types/central/export";
import { type Domain } from "@/types/central/domain";

function invalidateTenantDomainQueries(
  queryClient: QueryClient,
  tenantId: string
) {
  queryClient.invalidateQueries({ queryKey: ["tenant-domains", tenantId] });
  invalidateTenantListQueries(queryClient);
}

function invalidateTenantListQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["tenants"] });
  queryClient.invalidateQueries({ queryKey: ["tenant-statistics"] });
}

export const useGetTenantDomains = (
  tenantId: string | null,
  enabled = true
) => {
  return useQuery({
    queryKey: ["tenant-domains", tenantId],
    queryFn: () => getTenantDomains(tenantId!),
    enabled: enabled && !!tenantId,
  });
};

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
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tenant }: { id: string; tenant: any }) =>
      updateTenant(id, tenant),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useActivateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateTenant(id),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useSuspendTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendTenant(id),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useAddTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, domain }: { id: string; domain: { domain: string; is_primary?: boolean } }) =>
      addTenantDomain(id, domain),
    onSuccess: (newDomain, { id }) => {
      queryClient.setQueryData<Domain[]>(["tenant-domains", id], (current: Domain[] | undefined) =>
        current ? [...current, newDomain] : [newDomain]
      );
      invalidateTenantDomainQueries(queryClient, id);
    },
  });
};

export const useVerifyTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, domainId }: { tenantId: string; domainId: number }) =>
      verifyTenantDomain(tenantId, domainId),
    onSuccess: (_, { tenantId }) => {
      invalidateTenantDomainQueries(queryClient, tenantId);
    },
  });
};

export const useUpdateTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      domainId,
      data,
    }: {
      tenantId: string;
      domainId: number;
      data: { is_primary?: boolean };
    }) => updateTenantDomain(tenantId, domainId, data),
    onSuccess: (_, { tenantId }) => {
      invalidateTenantDomainQueries(queryClient, tenantId);
    },
  });
};

export const useDeleteTenantDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      domainId,
    }: {
      tenantId: string;
      domainId: number;
    }) => deleteTenantDomain(tenantId, domainId),
    onSuccess: (_, { tenantId, domainId }) => {
      queryClient.setQueryData<Domain[]>(
        ["tenant-domains", tenantId],
        (current: Domain[] | undefined) =>
          current?.filter((domain) => domain.id !== domainId) ?? []
      );
      invalidateTenantDomainQueries(queryClient, tenantId);
    },
  });
};

export const useDeleteManyTenants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteManyTenants(ids),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};

export const useExportTenants = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTenants(params),
  });
};

export const useImportTenants = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importTenants(file),
    onSuccess: () => {
      invalidateTenantListQueries(queryClient);
    },
  });
};