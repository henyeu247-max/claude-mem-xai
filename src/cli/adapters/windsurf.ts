import type { PlatformAdapter, NormalizedHookInput, HookResult } from '../types.js';
import { writeWindsurfContextFile } from '../../utils/cursor-utils.js';
import { logger } from '../../utils/logger.js';

// Maps Windsurf Cascade Hooks stdin format
// Windsurf uses: trajectory_id, execution_id, agent_action_name, tool_info, model_name
// Hook events: pre_read_code, post_read_code, pre_write_code, post_write_code,
//   pre_run_command, post_run_command, pre_mcp_tool_use, post_mcp_tool_use,
//   pre_user_prompt, post_cascade_response, post_cascade_response_with_transcript
//
// Common input structure:
//   agent_action_name: string (hook event name)
//   trajectory_id: string (conversation ID)
//   execution_id: string (turn ID)
//   timestamp: string (ISO 8601)
//   model_name: string
//   tool_info: object (event-specific)

// Track last cwd so formatOutput can write context to the right workspace
let lastCwd: string = process.cwd();

export const windsurfAdapter: PlatformAdapter = {
  normalizeInput(raw) {
    const r = (raw ?? {}) as any;
    const action = r.agent_action_name as string | undefined;
    const info = r.tool_info ?? {};

    // Map Windsurf action names to claude-mem tool names
    let toolName: string | undefined;
    let toolInput: unknown;
    let toolResponse: unknown;
    let prompt: string | undefined;

    switch (action) {
      case 'pre_user_prompt':
        prompt = info.user_prompt;
        break;
      case 'pre_read_code':
      case 'post_read_code':
        toolName = 'Read';
        toolInput = { file_path: info.file_path };
        break;
      case 'pre_write_code':
      case 'post_write_code':
        toolName = 'Write';
        toolInput = { file_path: info.file_path, edits: info.edits };
        break;
      case 'pre_run_command':
      case 'post_run_command':
        toolName = 'Bash';
        toolInput = { command: info.command_line, cwd: info.cwd };
        break;
      case 'pre_mcp_tool_use':
      case 'post_mcp_tool_use':
        toolName = info.mcp_tool_name ?? 'MCP';
        toolInput = info.mcp_tool_arguments;
        toolResponse = info.mcp_result;
        break;
      case 'post_cascade_response':
        toolName = 'CascadeResponse';
        toolResponse = { response: info.response };
        break;
      case 'post_cascade_response_with_transcript':
        toolName = 'CascadeTranscript';
        toolResponse = { transcript_path: info.transcript_path };
        break;
      default:
        toolName = action;
        toolInput = info;
    }

    const cwd = info.cwd ?? process.cwd();
    lastCwd = cwd;  // Track for formatOutput

    return {
      sessionId: r.trajectory_id ?? r.execution_id,
      cwd,
      prompt,
      toolName,
      toolInput,
      toolResponse,
      transcriptPath: info.transcript_path,
      filePath: info.file_path,
      edits: info.edits,
      platform: 'windsurf',
    };
  },
  formatOutput(result) {
    // Windsurf hooks communicate via exit codes:
    //   0 = success (action proceeds)
    //   2 = blocking error (pre-hooks only)
    //   other = error (action still proceeds)
    //
    // For context injection: write context to .windsurf/rules/claude-mem-context.md
    // Windsurf will auto-load this as a Rule in every Cascade conversation
    const r = result ?? ({} as HookResult);
    if (r.hookSpecificOutput?.additionalContext) {
      try {
        writeWindsurfContextFile(lastCwd, r.hookSpecificOutput.additionalContext);
        logger.info('WINDSURF', 'Context written to .windsurf/rules/claude-mem-context.md', { cwd: lastCwd });
      } catch (err) {
        logger.warn('WINDSURF', 'Failed to write context file', { error: err instanceof Error ? err.message : String(err) });
      }
    }
    return { continue: r.continue ?? true };
  }
};
