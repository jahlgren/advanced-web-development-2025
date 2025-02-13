const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = './../assignment-01' + req.url;
  if (filePath === './../assignment-01/')
    filePath += 'all-in-one.html';

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  if (extname === '.css')
    contentType = 'text/css';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      console.log(err.message);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});