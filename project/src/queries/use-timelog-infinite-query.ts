import { useInfiniteQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http";
import { Timelog } from "@/models/timelog";

type TimelogPage = {
  data: (Timelog & {
    categoryName: string
  })[];
  nextPage: number | null;
};

async function fetchTimelogs({
  projectId,
  pageParam = 1,
}: {
  projectId: string;
  pageParam: number;
}): Promise<TimelogPage> {
  const res = await httpGet<TimelogPage>(`/projects/${projectId}/timelogs?page=${pageParam}`);
  return res.data;
}

export const useTimeLogsInfiniteQuery = (projectId: string | undefined) => {
  return useInfiniteQuery<TimelogPage, Error>({
    queryKey: ['timelogs', projectId],
    queryFn: ({ pageParam }) => {
      if (!projectId) throw new Error('projectId is required');
      return fetchTimelogs({ projectId, pageParam: pageParam as number });
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!projectId
  });
};
