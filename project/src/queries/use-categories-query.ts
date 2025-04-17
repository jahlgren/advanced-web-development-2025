import { httpGet } from "@/lib/http";
import { Category } from "@/models/category";
import { useQuery } from "@tanstack/react-query";

async function fetchCategories(projectId: string): Promise<Category[]> {
  const response = await httpGet<Category[]>(`/projects/${projectId}/categories`);
  return response.data;
}

export function useCategoriesQuery(projectId: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", projectId],
    queryFn: () => fetchCategories(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    retry: false
  });
}
