import { downloadAudio, transcribeAudio } from '../src/services/audioService.js';

test('downloadAudio returns buffer', async () => {
  const buffer = await downloadAudio('https://example.com/sample.mp3');
  expect(buffer).toBeInstanceOf(Buffer);
});

test('transcribeAudio returns text', async () => {
  const text = await transcribeAudio(Buffer.from('test'));
  expect(typeof text).toBe('string');
});
