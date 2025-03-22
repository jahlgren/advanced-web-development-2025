import { useState, useEffect, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useEditQuote } from '../hooks/useEditQuote';

const EditQuote = ({ quoteToEdit, onClose }: {quoteToEdit: {id: number, quote: string, author: string}, onClose: () => void}) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  
  const { mutate: editQuote, isPending, isError, isSuccess } = useEditQuote();

  useEffect(() => {
    if (quoteToEdit) {
      setQuote(quoteToEdit.quote);
      setAuthor(quoteToEdit.author);
    }
  }, [quoteToEdit]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedQuote = { id: quoteToEdit.id, quote, author };
    editQuote(updatedQuote);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h2>Edit Quote</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="quote">
          <Form.Label>Quote</Form.Label>
          <Form.Control
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Enter quote"
            required
          />
        </Form.Group>
        <Form.Group controlId="author">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author"
            required
          />
        </Form.Group>
        <div className='mt-4' style={{display: 'flex', gap: '1rem'}}>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Quote'}
          </Button>
          <Button variant="secondary" onClick={onClose} className="ml-2">
            Cancel
          </Button>
        </div>
      </Form>
      
      {isError && (
        <Alert className="mt-3" variant="danger">Error updating quote!</Alert>
      )}
      
      {isSuccess && (
        <Alert className="mt-3" variant="success">Quote updated successfully!</Alert>
      )}
    </div>
  );
};

export default EditQuote;