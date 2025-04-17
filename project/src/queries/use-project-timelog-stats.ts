import { httpGet } from "@/lib/http";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { TimelogCategoryStats } from "@/app/api/projects/[id]/timelogs/stats/route";

async function fetchTimelogStats(projectId: string): Promise<TimelogCategoryStats[]> {
  try {
    const response = await httpGet<TimelogCategoryStats[]>(`/projects/${projectId}/timelogs/stats`);
    return response.data;
  } catch (err: any) {
    if (err instanceof AxiosError)
      throw { error: err.response?.data.error || err.message };
    if ("error" in err)
      throw { error: err.error };
    throw { error: "Unknown error" };
  }
}

export function useProjectTimelogStatsQuery(projectId: string) {
  return useQuery<TimelogCategoryStats[]>({
    queryKey: ["timelogs", projectId, "stats"],
    queryFn: () => fetchTimelogStats(projectId),
    enabled: !!projectId,
  });
}