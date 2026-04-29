#!/usr/bin/env node
/**
 * Cross-platform sync-marketplace script
 * Replaces rsync with Node.js fs.cpSync for Windows compatibility
 */

const { existsSync, readFileSync, cpSync, rmSync, mkdirSync } = require('fs');
const path = require('path');
const os = require('os');

const MARKETPLACE_NAME = 'henyeu247-max';
const INSTALLED_PATH = path.join(os.homedir(), '.claude', 'plugins', 'marketplaces', MARKETPLACE_NAME);
const CACHE_BASE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'cache', MARKETPLACE_NAME, 'claude-mem');

function getCurrentBranch() {
  try {
    if (!existsSync(path.join(INSTALLED_PATH, '.git'))) {
      return null;
    }
    const { execSync } = require('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: INSTALLED_PATH,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return null;
  }
}

function getGitignorePatterns(basePath) {
  const gitignorePath = path.join(basePath, '.gitignore');
  if (!existsSync(gitignorePath)) return [];

  const lines = readFileSync(gitignorePath, 'utf-8').split('\n');
  return lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && !line.startsWith('!'));
}

function shouldExclude(filePath, baseDir, extraExcludes = []) {
  const relative = path.relative(baseDir, filePath);
  const parts = relative.split(path.sep);

  // Always exclude these
  const alwaysExclude = ['.git', 'bun.lock', 'package-lock.json', 'node_modules', 'dist', '.DS_Store', '.env', '.env.local'];
  const allExcludes = [...alwaysExclude, ...extraExcludes];

  for (const part of parts) {
    if (allExcludes.includes(part)) return true;
    if (part.endsWith('.log') || part.endsWith('.tmp') || part.endsWith('.temp')) return true;
  }

  return false;
}

function crossPlatformCopy(src, dest, extraExcludes = []) {
  if (!existsSync(src)) {
    console.error(`Source not found: ${src}`);
    return;
  }

  mkdirSync(dest, { recursive: true });

  cpSync(src, dest, {
    recursive: true,
    force: true,
    filter: (srcPath) => {
      return !shouldExclude(srcPath, src, extraExcludes);
    }
  });
}

const branch = getCurrentBranch();
const isForce = process.argv.includes('--force');

if (branch && branch !== 'main' && !isForce) {
  console.log('');
  console.log('\x1b[33m%s\x1b[0m', `WARNING: Installed plugin is on beta branch: ${branch}`);
  console.log('\x1b[33m%s\x1b[0m', 'Running sync would overwrite beta code.');
  console.log('');
  console.log('Options:');
  console.log('  1. Use UI at http://localhost:37777 to update beta');
  console.log('  2. Switch to stable in UI first, then run sync');
  console.log('  3. Force sync: npm run sync-marketplace:force');
  console.log('');
  process.exit(1);
}

// Get version from plugin.json
function getPluginVersion() {
  try {
    const pluginJsonPath = path.join(__dirname, '..', 'plugin', '.claude-plugin', 'plugin.json');
    const pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    return pluginJson.version;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to read plugin version:', error.message);
    process.exit(1);
  }
}

// Cross-platform sync
console.log('Syncing to marketplace...');
try {
  const rootDir = path.join(__dirname, '..');
  const gitignoreExcludes = getGitignorePatterns(rootDir);

  // Sync to marketplace
  crossPlatformCopy(rootDir, INSTALLED_PATH, gitignoreExcludes);

  // Install dependencies in marketplace
  console.log('Running npm install in marketplace...');
  const { execSync } = require('child_process');
  execSync('npm install --production', { cwd: INSTALLED_PATH, stdio: 'inherit' });

  // Sync to cache folder with version
  const version = getPluginVersion();
  const CACHE_VERSION_PATH = path.join(CACHE_BASE_PATH, version);

  const pluginDir = path.join(rootDir, 'plugin');
  const pluginGitignoreExcludes = getGitignorePatterns(pluginDir);

  console.log(`Syncing to cache folder (version ${version})...`);
  crossPlatformCopy(pluginDir, CACHE_VERSION_PATH, pluginGitignoreExcludes);

  // Install dependencies in cache directory so worker can resolve them
  console.log(`Running npm install in cache folder (version ${version})...`);
  execSync('npm install --production', { cwd: CACHE_VERSION_PATH, stdio: 'inherit' });

  console.log('\x1b[32m%s\x1b[0m', 'Sync complete!');

  // Trigger worker restart after file sync
  console.log('\nTriggering worker restart...');
  const http = require('http');
  const req = http.request({
    hostname: '127.0.0.1',
    port: 37777,
    path: '/api/admin/restart',
    method: 'POST',
    timeout: 2000
  }, (res) => {
    if (res.statusCode === 200) {
      console.log('\x1b[32m%s\x1b[0m', 'Worker restart triggered');
    } else {
      console.log('\x1b[33m%s\x1b[0m', `Worker restart returned status ${res.statusCode}`);
    }
  });
  req.on('error', () => {
    console.log('\x1b[33m%s\x1b[0m', 'Worker not running, will start on next hook');
  });
  req.on('timeout', () => {
    req.destroy();
    console.log('\x1b[33m%s\x1b[0m', 'Worker restart timed out');
  });
  req.end();

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Sync failed:', error.message);
  process.exit(1);
}
