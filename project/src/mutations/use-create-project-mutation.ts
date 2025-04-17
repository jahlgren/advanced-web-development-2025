import { PostProjectResponse } from "@/app/api/projects/route";
import { CreateProjectInput, CreateProjectSchema } from "@/form-schemas/create-project-schemas";
import { httpPost } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function mutationFn(data: CreateProjectInput): Promise<PostProjectResponse> {
  const parsed = CreateProjectSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);

  const response = await httpPost<PostProjectResponse>("/projects", data);
  return response.data;
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PostProjectResponse, Error, CreateProjectInput, { toastId: string|number }>({
    mutationFn,
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Creating new project...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success('Project created successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to create project', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
