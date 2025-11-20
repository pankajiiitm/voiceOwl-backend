export async function azureTranscribeAudio(buffer: Buffer, language: string): Promise<string> {
  return `[Azure-${language}] dummy azure transcription`;
}
