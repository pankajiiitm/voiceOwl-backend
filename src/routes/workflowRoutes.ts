// src/routes/workflowRoutes.ts
import { Router } from 'express';
import {
  startWorkflowHandler,
  manualReviewHandler,
  approveHandler,
  rejectHandler,
  getWorkflowHandler
} from '../controllers/workflowController.js';

const router = Router();

router.post('/workflow/start/:id', startWorkflowHandler);
router.post('/workflow/review/:id', manualReviewHandler);
router.post('/workflow/approve/:id', approveHandler);
router.post('/workflow/reject/:id', rejectHandler);
router.get('/workflow/:id', getWorkflowHandler);

export default router;
