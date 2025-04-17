import { useQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http";
import { GetProjectsResponse } from "@/app/api/projects/route";

async function fetchProjects(): Promise<GetProjectsResponse> {
  const response = await httpGet<GetProjectsResponse>("/projects");
  return response.data;
}

export function useProjectsQuery() {
  return useQuery<GetProjectsResponse>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 60 * 1000,
    retry: false
  });
};
