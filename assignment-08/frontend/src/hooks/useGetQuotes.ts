import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../utils/http-requests';

const fetchQuotes = async () => {
  return await getRequest('/quotes'); 
};

const useGetQuotes = () => {
  return useQuery<Array<{id: number, quote: string, author: string}>>({
    queryKey: ['quotes'],
    queryFn: fetchQuotes
  });
};

export default useGetQuotes;
