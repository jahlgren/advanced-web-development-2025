const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, '../assignment-01')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
