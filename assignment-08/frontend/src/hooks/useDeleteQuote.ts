import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRequest } from '../utils/http-requests';

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRequest(`/quotes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['quotes']});
    },
  });
};
