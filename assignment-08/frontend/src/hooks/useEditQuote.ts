import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putRequest } from '../utils/http-requests';

export const useEditQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedQuote: {id: number, quote: string, author: string}) => putRequest(`/quotes/${updatedQuote.id}`, updatedQuote),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['quotes']}); 
    },
  });
};
