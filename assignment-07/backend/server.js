import express from 'express'
import sqlite3 from 'sqlite3'
import path from 'path'
import cors from 'cors'

const port = 3000;

const db = new sqlite3.Database('database.db', err => {
  if(err) {
    console.log(err)
    process.exit()
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL
    );`,
    err => {
      if(err) {
        console.log(err)
        process.exit()
      }
      start()
    }
  )
})

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.static(path.join('public')));

app.get('/api/books', (_, res) => {
  const stmt = db.prepare('SELECT * FROM books');
  
  stmt.all([], (err, rows) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: 'Failed to fetch books' });
    }
    res.json(rows);
  });
  
  stmt.finalize();
})

app.post('/api/books', (req, res) => {
  const {title, author} = req.body
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author required.' });
  }

  const stmt = db.prepare('INSERT INTO books (title, author) VALUES (?, ?)');

  stmt.run([title, author], function (err) {
    if (err) {
      console.error('Error inserting book:', err);
      return res.status(500).json({ success: false, message: 'Failed to add the book.' });
    }
    res.status(201).json({ id: this.lastID, title, author });
  });

  stmt.finalize();
})

app.put('/api/books', (req, res) => {
  const {id, title, author} = req.body
  if (!id || !title || !author) {
    return res.status(400).json({ error: 'Id, title and author required.' });
  }

  const stmt = db.prepare(`UPDATE books SET title = ?, author = ? WHERE id = ?`);

  stmt.run([title, author, id], function (err) {
    if (err) {
      console.error('Error updating book:', err);
      return res.status(500).json({ success: false, message: 'Failed to add the book.' });
    }
    res.status(200).json({ id, title, author });
  });

  stmt.finalize();
})

app.delete('/api/books/:id', (req, res) => {
  const {id} = req.params
  if (!id) {
    return res.status(400).json({ error: 'Id required.' });
  }

  const stmt = db.prepare(`DELETE FROM books WHERE id = ?`);

  stmt.run([id], function (err) {
    if (err) {
      console.error('Error deleting book:', err);
      return res.status(500).json({ success: false, message: 'Failed to add the book.' });
    }
    res.status(200).json({ id });
  });

  stmt.finalize();
})

function start() {
  app.listen(port, err => {
    if(err)
      console.log(err.message)
    else
      console.log('Server running: http://localhost:' + port)
  })
}
