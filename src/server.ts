// src/server.ts
import http from 'http';
import app from './app.js';
import { initializeWebSocket } from './ws/streamingServer.js';

const PORT = process.env.PORT || 3000;

// Create HTTP server (required for WebSocket upgrade)
const server = http.createServer(app);

// Attach WebSocket server
initializeWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
