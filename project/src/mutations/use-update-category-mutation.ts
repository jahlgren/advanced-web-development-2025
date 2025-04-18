import { UpdateCategoryInput, UpdateCategorySchema } from "@/form-schemas/update-category-schema";
import { httpPut } from "@/lib/http";
import { Category } from "@/models/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string, categoryId: string} & UpdateCategoryInput;

async function mutationFn(data: InputType): Promise<Category> {
  const parsed = UpdateCategorySchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);
  
  const response = await httpPut<Category>("/projects/" + data.projectId + "/categories/" + data.categoryId, data);
  return response.data;
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Updating category...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["categories", __.projectId] });
      queryClient.invalidateQueries({ queryKey: ["timelogs", __.projectId] });
      toast.success('Category updated successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to update category', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
