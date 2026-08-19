const { spawn } = require('child_process');
const http = require('http');

// Kill any orphaned processes on port 3000 and 3001 before starting
const NEXT_PORT = 3000;
const PROXY_PORT = 3001;

// 1. Start Next.js on port 3000
const nextApp = spawn('npx', ['next', 'dev', '-p', String(NEXT_PORT)], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start reverse proxy on port 3001 forwarding to port 3000 (including WebSockets)
const proxy = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${NEXT_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', () => {
    res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h3>Next.js dev server is initializing... Please refresh in a few seconds.</h3>');
  });

  req.pipe(proxyReq, { end: true });
});

// Forward WebSocket connections (Next.js HMR Fast Refresh)
proxy.on('upgrade', (req, socket, head) => {
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${NEXT_PORT}`,
    },
  });

  proxyReq.on('upgrade', (proxyRes, upstreamSocket, upstreamHead) => {
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
      Object.keys(proxyRes.headers)
        .map((h) => `${h}: ${proxyRes.headers[h]}`)
        .join('\r\n') +
      '\r\n\r\n'
    );
    if (upstreamHead && upstreamHead.length > 0) socket.write(upstreamHead);
    if (head && head.length > 0) upstreamSocket.write(head);
    upstreamSocket.pipe(socket);
    socket.pipe(upstreamSocket);
  });

  proxyReq.on('error', () => {
    socket.destroy();
  });

  proxyReq.end();
});

proxy.listen(PROXY_PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✓ JakDev Dev Server: http://localhost:${NEXT_PORT}`);
  console.log(`✓ Mirror Port (Proxy): http://localhost:${PROXY_PORT}`);
  console.log(`======================================================\n`);
});

process.on('SIGINT', () => {
  nextApp.kill();
  proxy.close();
  process.exit();
});

process.on('SIGTERM', () => {
  nextApp.kill();
  proxy.close();
  process.exit();
});
