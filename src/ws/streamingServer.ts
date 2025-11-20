// src/ws/streamingServer.ts
import { WebSocketServer } from 'ws';
import Transcription from '../models/transcription.js';
import { transcribeAudio } from '../services/audioService.js';

export function initializeWebSocket(server: any) {
  const wss = new WebSocketServer({ server, path: '/stream' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected.');

    let chunks = 0;
    const startTime = Date.now();

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // 1) Receive chunks
        if (msg.type === 'chunk') {
          chunks++;
          ws.send(JSON.stringify({ partial: `partial transcription (${chunks})` }));
        }

        // 2) Finalize when type=end
        if (msg.type === 'end') {
          const audioUrl = msg.audioUrl || 'ws://dummy-stream';

          // Use your mock STT service
          const finalText = await transcribeAudio(Buffer.from('fake-audio'));

          const durationMs = Date.now() - startTime;

          // Save metadata to Mongo
          const record = await Transcription.create({
            audioUrl,
            transcription: finalText,
            source: 'ws',
            chunksReceived: chunks,
            durationMs
          });

          ws.send(
            JSON.stringify({
              final: finalText,
              _id: record._id
            })
          );
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });

    ws.on('close', () => console.log('WebSocket client disconnected.'));
  });

  console.log('WebSocket server initialized at ws://localhost:3000/stream');
}
