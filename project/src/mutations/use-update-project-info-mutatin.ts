import { UpdateProjectInfoInput, UpdateProjectInfoSchema } from "@/form-schemas/update-project-info-schema";
import { httpPut } from "@/lib/http";
import { Project } from "@/models/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string} & UpdateProjectInfoInput;

async function mutationFn(data: InputType): Promise<Project> {
  const parsed = UpdateProjectInfoSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);
  
  const response = await httpPut<Project>("/projects/" + data.projectId, data);
  return response.data;
};

export const useUpdateProjectInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Updating project info...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["projects", _.id] });
      toast.success('Project info updated successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to update project info', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
