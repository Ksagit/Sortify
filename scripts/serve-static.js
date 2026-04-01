const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const [, , rootArg, portArg] = process.argv;

if (!rootArg || !portArg) {
  console.error('Usage: node scripts/serve-static.js <directory> <port>');
  process.exit(1);
}

const rootDirectory = path.resolve(process.cwd(), rootArg);
const port = Number(portArg);

if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid port: ${portArg}`);
  process.exit(1);
}

if (!fs.existsSync(rootDirectory)) {
  console.error(`Directory does not exist: ${rootDirectory}`);
  process.exit(1);
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });

  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const requestedFile = path.resolve(rootDirectory, `.${requestPath}`);
  const safePath = requestedFile.startsWith(rootDirectory)
    ? requestedFile
    : rootDirectory;

  const candidates = [];

  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    candidates.push(path.join(safePath, 'index.html'));
  } else {
    candidates.push(safePath);
  }

  candidates.push(path.join(rootDirectory, 'index.html'));

  const resolvedFile = candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );

  if (!resolvedFile) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  sendFile(response, resolvedFile);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${rootDirectory} at http://127.0.0.1:${port}`);
});