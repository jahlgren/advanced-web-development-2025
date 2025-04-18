import { httpDelete } from "@/lib/http";
import { Project } from "@/models/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string};

async function mutationFn(data: InputType): Promise<any> {
  const response = await httpDelete("/projects/" + data.projectId);
  return response.data;
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Deleting project...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success('Project deleted successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to delete project', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
