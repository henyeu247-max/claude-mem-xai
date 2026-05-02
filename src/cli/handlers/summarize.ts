/**
 * Summarize Handler - Stop
 *
 * Extracted from summary-hook.ts - sends summary request to worker.
 * Transcript parsing stays in the hook because only the hook has access to
 * the transcript file path.
 */

import type { EventHandler, NormalizedHookInput, HookResult } from '../types.js';
import { ensureWorkerRunning, workerHttpRequest } from '../../shared/worker-utils.js';
import { logger } from '../../utils/logger.js';
import { extractLastMessage } from '../../shared/transcript-parser.js';
import { HOOK_EXIT_CODES, HOOK_TIMEOUTS, getTimeout } from '../../shared/hook-constants.js';

const SUMMARIZE_TIMEOUT_MS = getTimeout(HOOK_TIMEOUTS.DEFAULT);

export const summarizeHandler: EventHandler = {
  async execute(input: NormalizedHookInput): Promise<HookResult> {
    // Ensure worker is running before any other logic
    const workerReady = await ensureWorkerRunning();
    if (!workerReady) {
      // Worker not available - skip summary gracefully
      return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
    }

    const { sessionId, transcriptPath, toolResponse, platform } = input;

    // Determine last assistant message:
    // - Claude Code: extract from transcriptPath file
    // - Windsurf: use toolResponse.response directly (from post_cascade_response)
    let lastAssistantMessage = '';

    if (transcriptPath) {
      // Claude Code path: extract from transcript file
      try {
        lastAssistantMessage = extractLastMessage(transcriptPath, 'assistant', true);
      } catch (err) {
        logger.warn('HOOK', `Stop hook: failed to extract last assistant message for session ${sessionId}: ${err instanceof Error ? err.message : err}`);
        return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
      }
    } else if (platform === 'windsurf' && toolResponse && typeof toolResponse === 'object' && 'response' in (toolResponse as any)) {
      // Windsurf path: use response from post_cascade_response directly
      lastAssistantMessage = (toolResponse as any).response ?? '';
    } else {
      // No transcript or response available - skip summary gracefully
      logger.debug('HOOK', `No transcriptPath or response in summarize hook for session ${sessionId} - skipping summary`);
      return { continue: true, suppressOutput: true, exitCode: HOOK_EXIT_CODES.SUCCESS };
    }

    logger.dataIn('HOOK', 'Stop: Requesting summary', {
      hasLastAssistantMessage: !!lastAssistantMessage
    });

    // Send to worker - worker handles privacy check and database operations
    const response = await workerHttpRequest('/api/sessions/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentSessionId: sessionId,
        last_assistant_message: lastAssistantMessage
      }),
      timeoutMs: SUMMARIZE_TIMEOUT_MS
    });

    if (!response.ok) {
      // Return standard response even on failure (matches original behavior)
      return { continue: true, suppressOutput: true };
    }

    logger.debug('HOOK', 'Summary request sent successfully');

    return { continue: true, suppressOutput: true };
  }
};
