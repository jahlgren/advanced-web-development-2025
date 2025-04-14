import { PostTimelogResponse, PostTimelogResponseError } from "@/app/api/projects/[id]/timelogs/route";
import { CreateTimeLogInput, CreateTimeLogSchema } from "@/form-schemas/create-time-log-schema";
import { httpPost } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import z from "zod";

export const useCreateTimeLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PostTimelogResponse, PostTimelogResponseError, CreateTimeLogInput & {projectId: string}>({
    mutationFn: async data => {
      try {
        CreateTimeLogSchema.parse(data);
        const response = await httpPost<PostTimelogResponse>("/projects/" + data.projectId + "/timelogs", data);
        return response.data;
      } catch (err) {
        if (err instanceof z.ZodError) {
          throw { error: err.errors[0].message };
        } else if (err instanceof AxiosError) {
          throw { error: err.response?.data.error || err.message };
        } else if (err instanceof Error) {
          throw { error: err.message };
        }
        throw { error: "Unknown error occurred" };
      }
    },

    onMutate: () => {
      const id = toast.loading("Creating new time log...");
      return id;
    },

    onSuccess: (timelog, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["timelogs", timelog.projectId] });
      toast.success("Time log created successfully!", {
        id: context as string | number,
        duration: 2000,
      });
    },

    onError: (err, _, context) => {
      toast.error("Failed to create time log", {
        id: context as string | number,
        description: err.error,
        duration: 2000,
      });
    },
  });
};