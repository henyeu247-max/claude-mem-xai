#!/usr/bin/env node
/**
 * Cross-platform hook dispatcher for claude-mem-xai
 * Works on Windows (PowerShell/cmd) and Unix (bash/zsh)
 *
 * Usage: node hook-dispatcher.cjs <hook-type> [extra-args...]
 *
 * Hook types: setup, smart-install, worker-start, context, session-init, observation, summarize
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Resolve plugin root from this script's location
const SCRIPTS_DIR = __dirname;
const PLUGIN_ROOT = path.resolve(SCRIPTS_DIR, '..');

const hookType = process.argv[2];
const extraArgs = process.argv.slice(3);

// If no hook type, exit silently (Claude Code may invoke with no args)
if (!hookType) {
  process.exit(0);
}

const hookMap = {
  'smart-install': {
    script: path.join(SCRIPTS_DIR, 'smart-install.js'),
    args: [],
    useNode: true,
    timeout: 300000
  },
  'worker-start': {
    script: path.join(SCRIPTS_DIR, 'bun-runner.js'),
    args: [path.join(SCRIPTS_DIR, 'worker-service.cjs'), 'start'],
    useNode: true,
    timeout: 60000
  },
  'context': {
    script: path.join(SCRIPTS_DIR, 'bun-runner.js'),
    args: [path.join(SCRIPTS_DIR, 'worker-service.cjs'), 'hook', 'claude-code', 'context'],
    useNode: true,
    timeout: 60000
  },
  'session-init': {
    script: path.join(SCRIPTS_DIR, 'bun-runner.js'),
    args: [path.join(SCRIPTS_DIR, 'worker-service.cjs'), 'hook', 'claude-code', 'session-init'],
    useNode: true,
    timeout: 60000
  },
  'observation': {
    script: path.join(SCRIPTS_DIR, 'bun-runner.js'),
    args: [path.join(SCRIPTS_DIR, 'worker-service.cjs'), 'hook', 'claude-code', 'observation'],
    useNode: true,
    timeout: 120000
  },
  'summarize': {
    script: path.join(SCRIPTS_DIR, 'bun-runner.js'),
    args: [path.join(SCRIPTS_DIR, 'worker-service.cjs'), 'hook', 'claude-code', 'summarize'],
    useNode: true,
    timeout: 120000
  }
};

const hook = hookMap[hookType];

if (!hook) {
  // Unknown hook type, exit silently
  process.exit(0);
}

// Check if script exists
if (!fs.existsSync(hook.script)) {
  console.error(`Hook script not found: ${hook.script}`);
  process.exit(0);
}

const allArgs = [...hook.args, ...extraArgs];
const quotedArgs = allArgs.map(a => `"${a}"`).join(' ');

try {
  if (hook.useNode) {
    execSync(`node "${hook.script}" ${quotedArgs}`, {
      stdio: 'inherit',
      timeout: hook.timeout,
      cwd: PLUGIN_ROOT,
      windowsHide: true
    });
  }
} catch (err) {
  // Exit 0 to prevent blocking Claude Code (hook contract)
  // Log error for diagnostics but don't block
  if (err.status && err.status !== 0) {
    console.error(`Hook ${hookType} exited with code ${err.status}`);
  }
}
