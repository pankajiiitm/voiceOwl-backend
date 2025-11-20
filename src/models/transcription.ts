// src/models/transcription.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITranscription extends Document {
  audioUrl: string;
  transcription: string;
  source?: string;
  createdAt: Date;
  chunksReceived?: number;
  durationMs?: number;
  // workflow state
  workflow?: {
    state: 'not_started' | 'pending_review' | 'in_review' | 'approved' | 'rejected';
    reviewer?: string | null;
    reviewedAt?: Date | null;
    notes?: string | null;
  };
}

const TranscriptionSchema: Schema = new Schema({
  audioUrl: { type: String, required: true },
  transcription: { type: String, required: true },
  source: { type: String, default: 'mock' },
  createdAt: { type: Date, default: Date.now, index: true },

  // streaming metadata
  chunksReceived: { type: Number, default: 0 },
  durationMs: { type: Number, default: 0 },

  // workflow embedded document
  workflow: {
    state: {
      type: String,
      enum: ['not_started', 'pending_review', 'in_review', 'approved', 'rejected'],
      default: 'not_started'
    },
    reviewer: { type: String, default: null },
    reviewedAt: { type: Date, default: null },
    notes: { type: String, default: null }
  }
});

export default mongoose.model<ITranscription>('Transcription', TranscriptionSchema);
