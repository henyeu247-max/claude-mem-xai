/**
 * Transcript Handler - Windsurf post_cascade_response_with_transcript
 *
 * Handles the Windsurf transcript event which provides a full conversation
 * transcript as a JSONL file. Used for detailed session logging and
 * summarization.
 */

import type { EventHandler, NormalizedHookInput, HookResult } from '../types.js';
import { ensureWorkerRunning, workerHttpRequest } from '../../shared/worker-utils.js';
import { logger } from '../../utils/logger.js';
import { HOOK_EXIT_CODES } from '../../shared/hook-constants.js';

export const transcriptHandler: EventHandler = {
  async execute(input: NormalizedHookInput): Promise<HookResult> {
    // Ensure worker is running before any other logic
    const workerReady = await ensureWorkerRunning();
    if (!workerReady) {
      return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
    }

    const { sessionId, transcriptPath } = input;

    if (!transcriptPath) {
      logger.debug('HOOK', `No transcriptPath in transcript handler for session ${sessionId}`);
      return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
    }

    logger.info('HOOK', `Transcript received for session ${sessionId}`, { transcriptPath });

    // Send transcript path to worker for processing
    // The worker will read the JSONL file and extract observations/summary
    try {
      const response = await workerHttpRequest('/api/sessions/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentSessionId: sessionId,
          transcriptPath
        }),
        timeoutMs: 30000
      });

      if (!response.ok) {
        logger.warn('HOOK', `Transcript processing failed: ${response.status}`);
      }
    } catch (err) {
      logger.warn('HOOK', `Transcript processing error: ${err instanceof Error ? err.message : err}`);
    }

    return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
  }
};
