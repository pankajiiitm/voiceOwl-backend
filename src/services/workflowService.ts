// src/services/workflowService.ts
import Transcription from '../models/transcription.js';

type Timers = {
  pendingTimer?: NodeJS.Timeout | null;
  autoApproveTimer?: NodeJS.Timeout | null;
};

const PENDING_REVIEW_DELAY_MS = 5 * 1000; // demo: after 5s move to in_review
const AUTO_APPROVE_DELAY_MS = 10 * 1000; // demo: auto approve 10s after in_review

// keep timers in memory so we can cancel if manual action happens
const timers = new Map<string, Timers>();

/**
 * Start workflow for a transcription.
 * Moves state: not_started -> pending_review (immediately) -> in_review -> approved (auto)
 */
export async function startWorkflow(transcriptionId: string) {
  const t = await Transcription.findById(transcriptionId);
  if (!t) throw new Error('Transcription not found');

  // if already started or finished, return
  if (t.workflow?.state && t.workflow.state !== 'not_started') {
    return t;
  }

  // set to pending_review
  t.workflow = { ...(t.workflow || {}), state: 'pending_review' };
  await t.save();

  // clear any existing timers just in case
  clearTimers(transcriptionId);

  // schedule transition to in_review then auto-approve
  const pendingTimer = setTimeout(async () => {
    await Transcription.findByIdAndUpdate(transcriptionId, { 'workflow.state': 'in_review' });

    // schedule auto approve later
    const autoApproveTimer = setTimeout(async () => {
      await Transcription.findByIdAndUpdate(transcriptionId, {
        'workflow.state': 'approved',
        'workflow.reviewedAt': new Date()
      });
      timers.delete(transcriptionId);
    }, AUTO_APPROVE_DELAY_MS);

    timers.set(transcriptionId, { pendingTimer: null, autoApproveTimer });
  }, PENDING_REVIEW_DELAY_MS);

  timers.set(transcriptionId, { pendingTimer, autoApproveTimer: null });

  return t;
}

export async function manualReview(transcriptionId: string, reviewer: string, notes?: string) {
  // cancel timers if any
  clearTimers(transcriptionId);

  const updated = await Transcription.findByIdAndUpdate(
    transcriptionId,
    {
      'workflow.state': 'in_review',
      'workflow.reviewer': reviewer,
      'workflow.notes': notes || null
    },
    { new: true }
  );

  return updated;
}

export async function approve(transcriptionId: string, reviewer?: string) {
  clearTimers(transcriptionId);
  const updated = await Transcription.findByIdAndUpdate(
    transcriptionId,
    {
      'workflow.state': 'approved',
      'workflow.reviewedAt': new Date(),
      'workflow.reviewer': reviewer || null
    },
    { new: true }
  );
  return updated;
}

export async function reject(transcriptionId: string, reviewer?: string, notes?: string) {
  clearTimers(transcriptionId);
  const updated = await Transcription.findByIdAndUpdate(
    transcriptionId,
    {
      'workflow.state': 'rejected',
      'workflow.reviewedAt': new Date(),
      'workflow.reviewer': reviewer || null,
      'workflow.notes': notes || null
    },
    { new: true }
  );
  return updated;
}

export async function getWorkflow(transcriptionId: string) {
  const t = await Transcription.findById(transcriptionId).select('workflow');
  return t;
}

function clearTimers(id: string) {
  const entry = timers.get(id);
  if (!entry) return;
  if (entry.pendingTimer) clearTimeout(entry.pendingTimer);
  if (entry.autoApproveTimer) clearTimeout(entry.autoApproveTimer);
  timers.delete(id);
}
