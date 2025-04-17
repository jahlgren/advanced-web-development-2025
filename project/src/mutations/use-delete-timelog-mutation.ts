import { httpDelete } from "@/lib/http";
import { Timelog } from "@/models/timelog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string, timelogId: string};

async function mutationFn(data: InputType): Promise<any> {
  const response = await httpDelete("/projects/" + data.projectId + "/timelogs/" + data.timelogId);
  return response.data;
};

export const useDeleteTimelogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Timelog, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Deleting timelog...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["timelogs", _.projectId] });
      toast.success('Timelog deleted successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to delete timelog', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
