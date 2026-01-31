// app.js
const http = require('http');

// Handlers untuk tiap HTTP method
const handlers = {
  GET: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World (GET)');
  },
  POST: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World (POST)');
  },
  PUT: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World (PUT)');
  },
  PATCH: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World (PATCH)');
  },
  DELETE: (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World (DELETE)');
  }
};

// Buat server
const server = http.createServer((req, res) => {
  const handler = handlers[req.method];
  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method tidak didukung');
  }
});

// Port
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
