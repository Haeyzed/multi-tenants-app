import { useQuery } from "@tanstack/react-query"
import { getPublicSettings } from "@/lib/services/tenant/settings-service"

export const usePublicSettings = () => {
  return useQuery({
    queryKey: ["tenant-public-settings"],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  })
}
