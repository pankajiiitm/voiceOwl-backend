// src/controllers/workflowController.ts
import type { Request, Response } from 'express';
import * as workflowService from '../services/workflowService.js';

export async function startWorkflowHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ success: false, error: "id required" });

  try {
    const result = await workflowService.startWorkflow(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
}

export async function manualReviewHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const { reviewer, notes } = req.body;

  if (!id) return res.status(400).json({ success: false, error: "id required" });
  if (!reviewer) return res.status(400).json({ success: false, error: 'reviewer required' });

  try {
    const result = await workflowService.manualReview(id, reviewer, notes);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
}

export async function approveHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const { reviewer } = req.body;

  if (!id) return res.status(400).json({ success: false, error: "id required" });

  try {
    const result = await workflowService.approve(id, reviewer);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
}

export async function rejectHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const { reviewer, notes } = req.body;

  if (!id) return res.status(400).json({ success: false, error: "id required" });

  try {
    const result = await workflowService.reject(id, reviewer, notes);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
}

export async function getWorkflowHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ success: false, error: "id required" });

  try {
    const result = await workflowService.getWorkflow(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
}
