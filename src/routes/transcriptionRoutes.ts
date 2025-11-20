import { Router } from 'express';
import {
  createTranscription,
  getRecentTranscriptions,
  createAzureTranscription
} from '../controllers/transcriptionController.js';

const router = Router();

router.post('/transcription', createTranscription);
router.get('/transcriptions', getRecentTranscriptions);
router.post('/azure-transcription', createAzureTranscription);

export default router;
