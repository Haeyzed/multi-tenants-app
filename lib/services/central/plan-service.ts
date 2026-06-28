import { Plan } from "@/types/central/plan";
import { apiClient } from "./api-client";
import { PaginatedResponse } from "@/types/central/pagination";

export const getPlans = async (): Promise<PaginatedResponse<Plan>> => {
  return apiClient.get<PaginatedResponse<Plan>>("/plans");
};

export const getPlan = async (id: string): Promise<Plan> => {
  return apiClient.get<Plan>(`/plans/${id}`);
};

export const createPlan = async (plan: Omit<Plan, "id">): Promise<Plan> => {
  return apiClient.post<Plan>("/plans", plan);
};

export const updatePlan = async (id: string, plan: Partial<Omit<Plan, "id">>): Promise<Plan> => {
  return apiClient.put<Plan>(`/plans/${id}`, plan);
};

export const deletePlan = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/plans/${id}`);
};