import { httpGet } from "@/lib/http";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { GetTimelogStatsResponse, GetTimelogStatsResponseError } from "@/app/api/projects/[id]/timelogs/stats/route";

async function fetchTimelogStats(projectId: string): Promise<GetTimelogStatsResponse> {
  try {
    const response = await httpGet<GetTimelogStatsResponse>(`/projects/${projectId}/timelogs/stats`);
    return response.data;
  } catch (err: any) {
    if (err instanceof AxiosError)
      throw { error: err.response?.data.error || err.message };
    if ("error" in err)
      throw { error: err.error };
    throw { error: "Unknown error" };
  }
}

export function useTimelogStatsQuery(projectId: string) {
  return useQuery<GetTimelogStatsResponse, GetTimelogStatsResponseError>({
    queryKey: ["timelogStats", projectId],
    queryFn: () => fetchTimelogStats(projectId),
    enabled: !!projectId
  });
}