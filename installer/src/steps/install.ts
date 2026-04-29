import * as p from '@clack/prompts';
import pc from 'picocolors';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync } from 'fs';
import { join } from 'path';
import { homedir, tmpdir } from 'os';
import type { IDE } from './ide-selection.js';

const MARKETPLACE_NAME = 'henyeu247-max';
const MARKETPLACE_DIR = join(homedir(), '.claude', 'plugins', 'marketplaces', MARKETPLACE_NAME);
const PLUGINS_DIR = join(homedir(), '.claude', 'plugins');
const CLAUDE_SETTINGS_PATH = join(homedir(), '.claude', 'settings.json');

function ensureDir(directoryPath: string): void {
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }
}

function readJsonFile(filepath: string): any {
  if (!existsSync(filepath)) return {};
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

function writeJsonFile(filepath: string, data: any): void {
  ensureDir(join(filepath, '..'));
  writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function registerMarketplace(): void {
  const knownMarketplacesPath = join(PLUGINS_DIR, 'known_marketplaces.json');
  const knownMarketplaces = readJsonFile(knownMarketplacesPath);

  knownMarketplaces[MARKETPLACE_NAME] = {
    source: {
      source: 'github',
      repo: 'henyeu247-max/claude-mem-xai',
    },
    installLocation: MARKETPLACE_DIR,
    lastUpdated: new Date().toISOString(),
    autoUpdate: true,
  };

  ensureDir(PLUGINS_DIR);
  writeJsonFile(knownMarketplacesPath, knownMarketplaces);
}

function registerPlugin(version: string): void {
  const installedPluginsPath = join(PLUGINS_DIR, 'installed_plugins.json');
  const installedPlugins = readJsonFile(installedPluginsPath);

  if (!installedPlugins.version) installedPlugins.version = 2;
  if (!installedPlugins.plugins) installedPlugins.plugins = {};

  const pluginCachePath = join(PLUGINS_DIR, 'cache', MARKETPLACE_NAME, 'claude-mem', version);
  const now = new Date().toISOString();

  installedPlugins.plugins[`claude-mem@${MARKETPLACE_NAME}`] = [
    {
      scope: 'user',
      installPath: pluginCachePath,
      version,
      installedAt: now,
      lastUpdated: now,
    },
  ];

  writeJsonFile(installedPluginsPath, installedPlugins);

  // Copy built plugin to cache directory
  ensureDir(pluginCachePath);
  const pluginSourceDir = join(MARKETPLACE_DIR, 'plugin');
  if (existsSync(pluginSourceDir)) {
    cpSync(pluginSourceDir, pluginCachePath, { recursive: true });
  }
}

function enablePluginInClaudeSettings(): void {
  const settings = readJsonFile(CLAUDE_SETTINGS_PATH);

  if (!settings.enabledPlugins) settings.enabledPlugins = {};
  settings.enabledPlugins[`claude-mem@${MARKETPLACE_NAME}`] = true;

  writeJsonFile(CLAUDE_SETTINGS_PATH, settings);
}

function getPluginVersion(): string {
  const pluginJsonPath = join(MARKETPLACE_DIR, 'plugin', '.claude-plugin', 'plugin.json');
  if (existsSync(pluginJsonPath)) {
    const pluginJson = JSON.parse(readFileSync(pluginJsonPath, 'utf-8'));
    return pluginJson.version ?? '1.0.0';
  }
  return '1.0.0';
}

export async function runInstallation(selectedIDEs: IDE[]): Promise<void> {
  const tempDir = join(tmpdir(), `claude-mem-install-${Date.now()}`);

  await p.tasks([
    {
      title: 'Cloning claude-mem-xai repository',
      task: async (message) => {
        message('Downloading latest release...');
        execSync(
          `git clone --depth 1 https://github.com/henyeu247-max/claude-mem-xai.git "${tempDir}"`,
          { stdio: 'pipe' },
        );
        return `Repository cloned ${pc.green('OK')}`;
      },
    },
    {
      title: 'Installing dependencies',
      task: async (message) => {
        message('Running npm install...');
        execSync('npm install', { cwd: tempDir, stdio: 'pipe' });
        return `Dependencies installed ${pc.green('OK')}`;
      },
    },
    {
      title: 'Building plugin',
      task: async (message) => {
        message('Compiling TypeScript and bundling...');
        execSync('npm run build', { cwd: tempDir, stdio: 'pipe' });
        return `Plugin built ${pc.green('OK')}`;
      },
    },
    {
      title: 'Registering plugin',
      task: async (message) => {
        message('Copying files to marketplace directory...');
        ensureDir(MARKETPLACE_DIR);

        // Cross-platform copy (replaces rsync)
        const excludePatterns = ['.git', 'package-lock.json', 'bun.lock', 'node_modules', 'dist'];
        cpSync(tempDir, MARKETPLACE_DIR, {
          recursive: true,
          force: true,
          filter: (src) => {
            const relative = src.replace(tempDir, '').replace(/^[/\\]/, '');
            return !excludePatterns.some(p => relative.startsWith(p) || relative.includes(`/${p}/`) || relative.includes(`\\${p}\\`));
          }
        });

        message('Registering marketplace...');
        registerMarketplace();

        message('Installing marketplace dependencies...');
        execSync('npm install', { cwd: MARKETPLACE_DIR, stdio: 'pipe' });

        message('Registering plugin in Claude Code...');
        const version = getPluginVersion();
        registerPlugin(version);

        message('Enabling plugin...');
        enablePluginInClaudeSettings();

        return `Plugin registered (v${getPluginVersion()}) ${pc.green('OK')}`;
      },
    },
  ]);

  // Cleanup temp directory (cross-platform)
  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {
    // Temp dir will be cleaned by OS eventually
  }

  if (selectedIDEs.includes('cursor')) {
    p.log.info('Cursor hook configuration will be available after first launch.');
    p.log.info('Run: claude-mem cursor-setup (coming soon)');
  }
}
