import { ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import useGetQuotes from '../hooks/useGetQuotes';
import { useDeleteQuote } from '../hooks/useDeleteQuote';

const QuotesList = ({onEdit}: {onEdit: (quote: {id: number, quote: string, author: string}) => void}) => {
  const { data: quotes, isLoading, isError } = useGetQuotes();
  const deleteQuoteMutation = useDeleteQuote();

  return (
    <div>
      <h2>Quotes List</h2>
      
      {isLoading && <Spinner animation="border" />}
      {isError && <Alert variant="danger">Failed to load quotes!</Alert>}

      <ListGroup>
        { (isLoading || isError) ? undefined :(
          !quotes || quotes.length === 0 ? (
            <ListGroup.Item>No quotes found.</ListGroup.Item>
          ) : (
          quotes.map((quote) => (
            <ListGroup.Item key={quote.id} style={{display: 'flex', gap: '1rem'}}>
              <p style={{margin: 0}}><strong>"{quote.quote}"</strong> <br />- {quote.author}</p>
              <Button
                variant="warning"
                size="sm"
                onClick={() => onEdit(quote)}
                style={{margin: '0 0 0 auto'}}
              >
                Edit
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => deleteQuoteMutation.mutate(quote.id)}
                disabled={deleteQuoteMutation.isPending}
                style={{margin: '0 0 0 0'}}
              >
                {deleteQuoteMutation.isPending ? <Spinner /> : 'Delete'}
              </Button>
            </ListGroup.Item>
          ))
        ))}
      </ListGroup>
    </div>
  );
};

export default QuotesList;