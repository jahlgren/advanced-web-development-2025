import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../utils/http-requests';

const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newQuote: { quote: string, author: string }) => postRequest('/quotes', newQuote),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['quotes']}); // Refresh quotes list
    },
  });
};

export default useCreateQuote;
