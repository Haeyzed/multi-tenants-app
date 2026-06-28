import { Tenant } from "@/types/central/tenant";
import { Domain } from "@/types/central/domain";
import { apiClient } from "./api-client";
import { PaginatedResponse } from "@/types/central/pagination";
import { TenantFormValues, UpdateTenantFormValues } from "@/schemas/central/tenant-schema";

export const getTenants = async (params?: {
  search?: string;
  status?: ("pending" | "active" | "suspended")[];
  per_page?: number;
  page?: number;
}): Promise<PaginatedResponse<Tenant>> => {
  return apiClient.get<PaginatedResponse<Tenant>>("/tenants", params);
};

export const getTenant = async (id: string): Promise<Tenant> => {
  return apiClient.get<Tenant>(`/tenants/${id}`);
};

export const createTenant = async (tenant: TenantFormValues): Promise<Tenant> => {
  return apiClient.post<Tenant>("/tenants", tenant);
};

export const updateTenant = async (id: string, tenant: UpdateTenantFormValues): Promise<Tenant> => {
  return apiClient.put<Tenant>(`/tenants/${id}`, tenant);
};

export const deleteTenant = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/tenants/${id}`);
};

export const getTenantStatistics = async (): Promise<{
  total: number;
  active: number;
  suspended: number;
  pending: number;
}> => {
  return apiClient.get("/tenants/statistics");
};

export const activateTenant = async (id: string): Promise<Tenant> => {
  return apiClient.post<Tenant>(`/tenants/${id}/activate`, {});
};

export const suspendTenant = async (id: string): Promise<Tenant> => {
  return apiClient.post<Tenant>(`/tenants/${id}/suspend`, {});
};

export const addTenantDomain = async (
  id: string,
  domain: { domain: string; is_primary?: boolean }
): Promise<Domain> => {
  return apiClient.post<Domain>(`/tenants/${id}/domains`, domain);
};

export const verifyTenantDomain = async (
  tenantId: string,
  domainId: number
): Promise<Domain> => {
  return apiClient.post<Domain>(`/tenants/${tenantId}/domains/${domainId}/verify`, {});
};