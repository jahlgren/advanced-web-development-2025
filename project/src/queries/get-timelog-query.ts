import { useQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http";
import { Timelog } from "@/lib/types";

export const useTimeLogsQuery = (projectId: string | undefined) => {
  return useQuery<Timelog[]>({
    queryKey: ["timelogs", projectId],
    queryFn: async () => {
      const res = await httpGet<Timelog[]>("/projects/" + projectId + "/timelogs");
      return res.data;
    },
    enabled: !!projectId,
  });
};
