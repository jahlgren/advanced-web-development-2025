import { PostProjectResponseError, PostProjectResponse } from "@/app/api/projects/route";
import { CreateProjectInput, CreateProjectSchema } from "@/form-schemas/create-project-schemas";
import { httpPost } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import z from 'zod';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PostProjectResponse, PostProjectResponseError, CreateProjectInput>({
    mutationFn: async data => {
      
      try {
        CreateProjectSchema.parse(data);
        const response = await httpPost<PostProjectResponse>("/projects", data);
        return response.data;
      }
      catch(err) {
        if (err instanceof z.ZodError) {
          throw { error: err.errors[0].message };
        }
        else if(err instanceof AxiosError) {
          throw { error: err.response?.data.error || err.message }
        } 
        else if (err instanceof Error) {
          throw { error: err.message };
        }
        throw { error: "Unknown error occurred" };
      }
    },

    onMutate: () => {
      const id = toast.loading('Creating new project...');
      return id;
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success('Project created successfully!', {
        id: context as string|number,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to create project', {
        id: context as string|number,
        description: err.error,
        duration: 2000
      });
    }
  });
};
