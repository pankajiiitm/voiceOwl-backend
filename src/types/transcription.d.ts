export interface TranscriptionRequest {
  audioUrl: string;
}

export interface AzureTranscriptionRequest {
  audioUrl: string;
  language?: string;
}
