import { useQuery } from "@tanstack/react-query";
import { getTenants } from "@/lib/services/central/tenant-service";

export const useGetTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const response = await getTenants();
      return response.data;
    },
  });
};