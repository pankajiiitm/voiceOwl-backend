export async function downloadAudio(url: string): Promise<Buffer> {
  if (Math.random() < 0.2) throw new Error('Download failed');
  return Buffer.from('mock-audio-data');
}

export async function transcribeAudio(buffer: Buffer): Promise<string> {
  return 'transcribed text';
}
