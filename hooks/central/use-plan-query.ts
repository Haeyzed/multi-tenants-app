import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPlan,
  deleteManyPlans,
  deletePlan,
  exportPlans,
  getPlanOptions,
  getPlans,
  getPlanStatistics,
  importPlans,
  updatePlan,
} from "@/lib/services/central/plan-service"
import { type ExportParams } from "@/types/central/export"
import {
  StorePlanFormValues,
  UpdatePlanFormValues,
} from "@/schemas/central/plan-schema"

export const useGetPlans = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["plans", params],
    queryFn: () => getPlans(params),
  })
}

export const useGetPlanStatistics = () => {
  return useQuery({
    queryKey: ["plan-statistics"],
    queryFn: () => getPlanStatistics(),
  })
}

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (plan: StorePlanFormValues) => createPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plan-statistics"] })
    },
  })
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, plan }: { id: number; plan: UpdatePlanFormValues }) =>
      updatePlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plan-statistics"] })
    },
  })
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plan-statistics"] })
    },
  })
}

export const useGetPlanOptions = () => {
  return useQuery({
    queryKey: ["planOptions"],
    queryFn: () => getPlanOptions(),
  })
}

export const useDeleteManyPlans = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyPlans(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plan-statistics"] })
    },
  })
}

export const useExportPlans = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportPlans(params),
  })
}

export const useImportPlans = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importPlans(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      queryClient.invalidateQueries({ queryKey: ["plan-statistics"] })
    },
  })
}
