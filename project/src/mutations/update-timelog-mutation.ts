import { PatchTimelogResponse, PatchTimelogResponseError } from "@/app/api/projects/[id]/timelogs/[timelogId]/route";
import { UpdateTimeLogInput, UpdateTimeLogSchema } from "@/form-schemas/update-timelog-schema";
import { httpPatch } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import z from "zod";

export const useUpdateTimeLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PatchTimelogResponse, PatchTimelogResponseError, UpdateTimeLogInput & { projectId: string; timelogId: string }>(
    {
      mutationFn: async (data) => {
        try {
          UpdateTimeLogSchema.parse(data);
          const response = await httpPatch<PatchTimelogResponse>(
            `/projects/${data.projectId}/timelogs/${data.timelogId}`,
            data
          );
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
        const id = toast.loading("Updating time log...");
        return id;
      },

      onSuccess: (timelog, __, context) => {
        queryClient.invalidateQueries({ queryKey: ["timelogs", timelog.projectId] });
        toast.success("Time log updated successfully!", {
          id: context as string | number,
          duration: 2000,
        });
      },

      onError: (err, _, context) => {
        toast.error("Failed to update time log", {
          id: context as string | number,
          description: err.error,
          duration: 2000,
        });
      },
    }
  );
};