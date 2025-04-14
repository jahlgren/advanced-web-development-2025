import { useQuery } from "@tanstack/react-query";
import { httpGet } from "@/lib/http";
import { Project } from "@/lib/types";

export const useProjectsQuery = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await httpGet<Project[]>("/projects");
      return res.data;
    }
  });
};