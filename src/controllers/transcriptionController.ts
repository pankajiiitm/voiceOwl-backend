import type { Request, Response } from 'express';
import Transcription from '../models/transcription.js';
import { startWorkflow } from '../services/workflowService.js';
import { downloadAudio, transcribeAudio } from '../services/audioService.js';
import { azureTranscribeAudio } from '../services/azureService.js';
import { retry } from '../utils/retry.js';


export async function createTranscription(req: Request, res: Response) {
  const { audioUrl, startWorkflowImmediately = false } = req.body;
  if (!audioUrl) return res.status(400).json({ error: 'audioUrl required' });

  try {
    const audioBuffer = await retry(() => downloadAudio(audioUrl));
    const transcription = await transcribeAudio(audioBuffer);
    const record = await Transcription.create({ audioUrl, transcription });

    if (startWorkflowImmediately) {
      // fire-and-forget: start workflow asynchronously
      startWorkflow(record._id.toString()).catch((e) => console.error('startWorkflow error', e));
    }

    res.json({ transcriptionId: record._id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}


export async function getRecentTranscriptions(req: Request, res: Response) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const records = await Transcription.find({ createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: -1 });
  res.json(records);
}

export async function createAzureTranscription(req: Request, res: Response) {
  const { audioUrl, language = 'en-US' } = req.body;
  if (!audioUrl) return res.status(400).json({ error: 'audioUrl required' });

  try {
    const audioBuffer = await retry(() => downloadAudio(audioUrl));
    const transcription = await retry(() => azureTranscribeAudio(audioBuffer, language));
    const record = await Transcription.create({ audioUrl, transcription, source: 'azure' });
    res.json({ transcriptionId: record._id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
