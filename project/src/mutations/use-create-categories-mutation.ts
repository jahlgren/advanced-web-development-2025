import { CreateCategoriesInput, CreateCategoriesSchema } from "@/form-schemas/create-categories-schema";
import { httpPost } from "@/lib/http";
import { Category } from "@/models/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = { projectId: string } & CreateCategoriesInput;

async function mutationFn(data: InputType): Promise<Category[]> {
  const parsed = CreateCategoriesSchema.safeParse(data);
  if (!parsed.success)
    throw new Error(parsed.error.errors[0].message);

  const response = await httpPost<Category[]>("/projects/" + data.projectId + "/categories", data);
  return response.data;
};

export const useCreateCategoriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Category[], Error, InputType, { toastId: string|number }>({
    mutationFn,
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Creating categories...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["categories", __.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", __.projectId, "stats"] });
      toast.success('Categories created successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to create categories', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
