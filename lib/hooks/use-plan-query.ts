import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/lib/services/central/plan-service";

export const useGetPlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await getPlans();
      return response.data;
    },
  });
};