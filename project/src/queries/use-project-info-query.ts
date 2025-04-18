import { GetProjectByIdResponse } from "@/app/api/projects/[id]/route";
import { httpGet } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

async function fetchProject(projectId: string): Promise<GetProjectByIdResponse> {
  const response = await httpGet<GetProjectByIdResponse>(`/projects/${projectId}`);
  return response.data;
}

export function useProjectInfoQuery(projectId: string) {
  return useQuery<GetProjectByIdResponse>({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    retry: false
  });
}
