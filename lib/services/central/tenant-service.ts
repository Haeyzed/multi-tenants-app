import { Tenant } from "@/types/central/tenant";
import { apiClient } from "./api-client";
import { PaginatedResponse } from "@/types/central/pagination";

export const getTenants = async (): Promise<PaginatedResponse<Tenant>> => {
  return apiClient.get<PaginatedResponse<Tenant>>("/tenants");
};

export const getTenant = async (id: string): Promise<Tenant> => {
  return apiClient.get<Tenant>(`/tenants/${id}`);
};

export const createTenant = async (tenant: Omit<Tenant, "id">): Promise<Tenant> => {
  return apiClient.post<Tenant>("/tenants", tenant);
};

export const updateTenant = async (id: string, tenant: Partial<Omit<Tenant, "id">>): Promise<Tenant> => {
  return apiClient.put<Tenant>(`/tenants/${id}`, tenant);
};

export const deleteTenant = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/tenants/${id}`);
};