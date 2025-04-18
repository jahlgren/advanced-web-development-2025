import { httpDelete } from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type InputType = {projectId: string, categoryId: string, replacementId: string};

async function mutationFn(data: InputType): Promise<any> {
  const response = await httpDelete("/projects/" + data.projectId + "/categories/" + data.categoryId + "?replacement=" + data.replacementId);
  return response.data;
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ok: boolean}, Error, InputType, { toastId: string|number }>({
    mutationFn: async (data) => await mutationFn(data),
    retry: false,

    onMutate: () => {
      const toastId = toast.loading('Deleting category...');
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["categories", __.projectId] });
      queryClient.invalidateQueries({ queryKey: ["timelogs", __.projectId] });
      toast.success('Category deleted successfully!', {
        id: context.toastId,
        duration: 2000
      });
    },

    onError: (err, _, context) => {
      toast.error('Failed to delete category', {
        id: context?.toastId,
        description: err.message,
        duration: 2000
      });
    }
  });
};
