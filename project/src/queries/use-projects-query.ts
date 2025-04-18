import { useQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http";
import { Project } from "@/models/project";

async function fetchProjects(): Promise<Project[]> {
  const response = await httpGet<Project[]>("/projects");
  return response.data;
}

export function useProjectsQuery() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 60 * 1000,
    retry: false
  });
};
