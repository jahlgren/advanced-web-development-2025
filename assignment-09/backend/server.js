import express from 'express';
import cors from 'cors';
import { Quote, syncDb } from './src/models/index.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.findAll();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quotes' });
  }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const { quote, author } = req.body;
    if (!quote || !author) {
      return res.status(400).json({ error: 'Quote and author are required' });
    }
    const newQuote = await Quote.create({ quote, author });
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ error: 'Error creating quote' });
  }
});

app.put('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quote, author } = req.body;
    const quoteToUpdate = await Quote.findByPk(id);

    if (!quoteToUpdate) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    quoteToUpdate.quote = quote || quoteToUpdate.quote;
    quoteToUpdate.author = author || quoteToUpdate.author;
    await quoteToUpdate.save();

    res.json(quoteToUpdate);
  } catch (error) {
    res.status(500).json({ error: 'Error updating quote' });
  }
});

app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const quoteToDelete = await Quote.findByPk(id);

    if (!quoteToDelete) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    await quoteToDelete.destroy();
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting quote' });
  }
});

(async () => {
  try {
    await syncDb();
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    console.info('Server not started');
    return;
  }
  
  app.listen(port, err => {
    if(err) {
      console.error('Could not start server: ' + err.message);
      return;
    }
    console.log("Server running on: http://localhost:3000");
  });
})();
