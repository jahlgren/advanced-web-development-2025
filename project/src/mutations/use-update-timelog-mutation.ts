import { UpdateTimeLogInput, UpdateTimeLogSchema } from "@/form-schemas/update-timelog-schema";
import { httpPatch } from "@/lib/http";
import { Timelog } from "@/models/timelog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string, timelogId: string} & UpdateTimeLogInput;

async function mutationFn(data: InputType): Promise<any> {
  const parsed = UpdateTimeLogSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);
  
  const response = await httpPatch<any>("/projects/" + data.projectId + "/timelogs/" + data.timelogId, data);
  return response.data;
};

export const useUpdateTimelogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Timelog, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Updating timelog...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["timelogs", _.projectId] });
      toast.success('Timelog updated successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to update timelog', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
