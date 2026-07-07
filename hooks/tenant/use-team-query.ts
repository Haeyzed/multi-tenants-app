import { useQuery } from "@tanstack/react-query"
import { getTeamMembers } from "@/lib/services/tenant/team-service"

export const useGetTeamMembers = (params?: {
  search?: string
  is_active?: "active" | "inactive"
  per_page?: number
}) => {
  return useQuery({
    queryKey: ["team-members", params],
    queryFn: () =>
      getTeamMembers({ ...params, per_page: params?.per_page ?? 100 }),
  })
}
