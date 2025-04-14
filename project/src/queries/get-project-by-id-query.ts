import { GetProjectByIdResponse, GetProjectByIdResponseError } from "@/app/api/projects/[id]/route";
import { httpGet } from "@/lib/http";
import { Project } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function fetchProjectById(projectId: string): Promise<GetProjectByIdResponse> {
  try {
    const response = await httpGet<GetProjectByIdResponse>(`/projects/${projectId}`);
    return response.data;
  }
  catch(err: any) {
    if(err instanceof AxiosError)
      throw { error: err.response?.data.error };
    if("error" in err)
      throw { error: err.error };
    throw { error: 'Unknown error' };
  }
}

export function useProjectQuery(projectId: string) {
  return useQuery<GetProjectByIdResponse, GetProjectByIdResponseError>({
    queryKey: ["project", projectId],
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId
  });
}
