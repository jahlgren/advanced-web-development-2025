import { CreateTimelogInput, CreateTimelogSchema } from "@/form-schemas/create-timelog.schema";
import { httpPost } from "@/lib/http";
import { Timelog } from "@/models/timelog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string} & CreateTimelogInput;

async function mutationFn(data: InputType): Promise<any> {
  const parsed = CreateTimelogSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);
  
  const response = await httpPost<any>("/projects/" + data.projectId + "/timelogs", data);
  return response.data;
};

export const useCreateTimelogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Timelog, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Creating new timelog...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["timelogs", _.projectId] });
      toast.success('Timelog created successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to create timelog', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
