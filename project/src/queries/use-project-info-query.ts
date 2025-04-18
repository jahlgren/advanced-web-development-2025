import { httpGet } from "@/lib/http";
import { Project } from "@/models/project";
import { useQuery } from "@tanstack/react-query";

async function fetchProject(projectId: string): Promise<Project> {
  const response = await httpGet<Project>(`/projects/${projectId}`);
  return response.data;
}

export function useProjectInfoQuery(projectId: string) {
  return useQuery<Project>({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    retry: false
  });
}
