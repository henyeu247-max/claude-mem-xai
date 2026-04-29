#!/usr/bin/env node
/**
 * Cross-platform SessionEnd hook for claude-mem-xai
 * Sends session completion to worker API
 */

let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  try {
    const { sessionId } = JSON.parse(data);
    if (!sessionId) {
      process.exit(0);
    }

    const http = require('http');
    const req = http.request({
      hostname: '127.0.0.1',
      port: 37777,
      path: '/api/sessions/complete',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000
    }, () => process.exit(0));

    req.on('error', () => process.exit(0));
    req.end(JSON.stringify({ contentSessionId: sessionId }));

    setTimeout(() => process.exit(0), 3000);
  } catch {
    process.exit(0);
  }
});
