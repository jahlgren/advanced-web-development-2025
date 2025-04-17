import { httpGet } from "@/lib/http";
import { Timelog } from "@/models/timelog";
import { useQuery } from "@tanstack/react-query";

async function query(projectId: string): Promise<Timelog|null> {
  const response = await httpGet<Timelog|null>(`/projects/${projectId}/timelogs/active`);
  return response.data;
}

export function useActiveTimelogQuery(projectId: string) {
  return useQuery<Timelog|null>({
    queryKey: ["timelogs", projectId, "active"],
    queryFn: () => query(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    retry: false
  });
}
