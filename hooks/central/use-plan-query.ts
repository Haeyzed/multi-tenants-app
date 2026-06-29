import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlan,
  deletePlan,
  getPlanOptions,
  getPlans,
  updatePlan,
} from "@/lib/services/central/plan-service";

export const useGetPlans = (params?: {
  search?: string;
  is_active?: ("active" | "inactive")[];
  per_page?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["plans", params],
    queryFn: () => getPlans(params),
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plan: any) => createPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }: { id: number; plan: any }) =>
      updatePlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const useGetPlanOptions = () => {
  return useQuery({
    queryKey: ["planOptions"],
    queryFn: () => getPlanOptions(),
  });
};
