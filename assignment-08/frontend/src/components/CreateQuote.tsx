import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import useCreateQuote from "../hooks/useCreateQuote";

export default function CreateQuote() {

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  const createQuoteMutation = useCreateQuote();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quote || !author) return;

    createQuoteMutation.mutate({ quote, author });
  }

  return (
    <div>
      <h2>Create a New Quote</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Quote</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={createQuoteMutation.isPending}>
          {createQuoteMutation.isPending ? <Spinner animation="border" size="sm" /> : 'Create Quote'}
        </Button>
      </Form>

      {createQuoteMutation.isError && (
        <Alert className="mt-3" variant="danger">Error creating quote!</Alert>
      )}
      
      {createQuoteMutation.isSuccess && (
        <Alert className="mt-3" variant="success">Quote added successfully!</Alert>
      )}
    </div>
  );
}