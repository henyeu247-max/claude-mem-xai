# claude-mem-xai

> **Multi-platform fork** of [claude-mem](https://github.com/thedotmack/claude-mem) by Alex Newman

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg" alt="License">
  </a>
  <a href="package.json">
    <img src="https://img.shields.io/badge/version-10.7.0--xai-green.svg" alt="Version">
  </a>
  <a href="https://github.com/thedotmack/claude-mem">
    <img src="https://img.shields.io/badge/upstream-claude--mem-orange.svg" alt="Upstream">
  </a>
</p>

## 🎯 What is this?

A **specialized fork** of claude-mem with multi-platform and multi-provider support:

- ✅ **Multi-platform**: Claude Code, Windsurf, Cursor, Gemini CLI
- ✅ **Multi-provider**: xAI Grok, NVIDIA NIM (removed Claude SDK)
- ✅ **Chroma disabled by default** for lower CPU usage
- ✅ **SQLite-only search mode** as default
- ✅ **Windsurf Cascade Hooks** integration with automatic memory context injection

## 🚀 Key Differences from Original

| Feature | Original claude-mem | claude-mem-xai |
|---------|-------------------|----------------|
| AI Providers | Claude, Gemini, OpenRouter, xAI | **xAI Grok, NVIDIA NIM** |
| IDE Platforms | Claude Code only | **Claude Code, Windsurf, Cursor, Gemini CLI** |
| Vector DB (Chroma) | Enabled by default | **Disabled by default** |
| Search Mode | Hybrid (Chroma + SQLite) | **SQLite-only** |
| CPU Usage | Higher (chroma-mcp subprocess) | **Lower** |
| Default Model | claude-sonnet-4-5 | **grok-4-1-fast-non-reasoning** |

## 📦 Installation

```bash
# Install via Claude Code
claude install plugin henyeu247-max/claude-mem

# Or manually
git clone https://github.com/henyeu247-max/claude-mem-xai.git
cd claude-mem-xai
npm install
npm run build
```

## 🌊 Windsurf Integration

claude-mem works with **Windsurf IDE** via Cascade Hooks — automatically capturing your coding sessions and injecting memory context.

### Install Windsurf Hooks

```bash
# Install for current project
claude-mem windsurf install

# Install globally (all projects)
claude-mem windsurf install user

# Check installation status
claude-mem windsurf status

# Uninstall
claude-mem windsurf uninstall
```

### How It Works

Windsurf Cascade Hooks fire at key points during your coding session:

| Windsurf Event | claude-mem Action |
|---|---|
| `pre_user_prompt` | Session init + context injection |
| `post_read_code` | Record file read observation |
| `post_write_code` | Track file edits |
| `post_run_command` | Record command execution |
| `post_mcp_tool_use` | Record MCP tool usage |
| `post_cascade_response` | Generate session summary |
| `post_cascade_response_with_transcript` | Process full transcript |

Context is automatically written to `.windsurf/rules/claude-mem-context.md` — Windsurf loads this as a Rule in every Cascade conversation, giving the AI memory of your past sessions.

### Setup Steps

1. **Start the worker**: `claude-mem start`
2. **Install hooks**: `claude-mem windsurf install`
3. **Restart Windsurf** to load the hooks
4. **Verify**: Check Windsurf Settings → Hooks

## 🖥️ Cursor Integration

```bash
# Install Cursor hooks
claude-mem cursor install

# Check status
claude-mem cursor status
```

## ⚙️ Configuration

Settings are stored in `~/.claude-mem/settings.json`:

### xAI Provider

```json
{
  "CLAUDE_MEM_PROVIDER": "xai",
  "CLAUDE_MEM_XAI_API_KEY": "xai-your-api-key-here",
  "CLAUDE_MEM_XAI_MODEL": "grok-4-1-fast-non-reasoning"
}
```

### NVIDIA NIM Provider

```json
{
  "CLAUDE_MEM_PROVIDER": "nvidia",
  "CLAUDE_MEM_NVIDIA_API_KEY": "nvapi-your-key-here",
  "CLAUDE_MEM_NVIDIA_MODEL": "openai/gpt-oss-120b"
}
```

### Available Models

**xAI Grok:**
- `grok-4-1-fast-non-reasoning` (default) - Fastest, no reasoning
- `grok-4-1-fast-reasoning` - Fast with reasoning
- `grok-3-fast` - Previous generation

**NVIDIA NIM:**
- `openai/gpt-oss-120b` (default) - Best performance/cost ratio
- `nvidia/llama-3.3-nemotron-super-49b-v1` - NVIDIA's model
- `deepseek-ai/deepseek-r1` - DeepSeek reasoning

### Chroma Vector Database

Chroma is **disabled by default**. To enable:

```json
{
  "CLAUDE_MEM_CHROMA_ENABLED": "true"
}
```

## � Performance

| Mode | CPU Usage | Processes |
|------|-----------|-----------|
| Original (Chroma enabled) | ~300-500 MB | worker + chroma-mcp + python |
| **This fork (Chroma disabled)** | **~150-200 MB** | **worker only** |

## �🔧 Why This Fork?

### Original claude-mem is excellent, but:

1. **Single platform** - Only Claude Code, no Windsurf/Cursor support
2. **Claude SDK dependency** - Requires Claude subscription for AI processing
3. **Chroma enabled by default** - High CPU usage from chroma-mcp subprocess

### This fork adds:

1. **Multi-platform** - Windsurf, Cursor, Claude Code, Gemini CLI
2. **Alternative AI providers** - xAI Grok, NVIDIA NIM (no Claude subscription needed)
3. **Lower resource usage** - No Chroma subprocess by default
4. **Windsurf context injection** - Auto-writes memory to `.windsurf/rules/`

## 🙏 Credits

This fork is based on [claude-mem](https://github.com/thedotmack/claude-mem) by **Alex Newman** (@thedotmack).

All core functionality and architecture credit goes to the original project and its 78+ contributors.

## 📝 License

AGPL-3.0 (same as original claude-mem)

## 🔗 Links

- **Original Project:** https://github.com/thedotmack/claude-mem
- **Original Docs:** https://docs.claude-mem.ai
- **This Fork:** https://github.com/henyeu247-max/claude-mem-xai
- **xAI Platform:** https://x.ai
- **NVIDIA NIM:** https://build.nvidia.ai
- **Windsurf Hooks Docs:** https://docs.windsurf.com/windsurf/cascade/hooks

## 🤝 Contributing

This is a personal fork for xAI/NVIDIA multi-platform use. For general claude-mem contributions, please contribute to the [original project](https://github.com/thedotmack/claude-mem).

For improvements to this fork, feel free to open issues or PRs.

---

**Made with ❤️ by henyeu247-max | Based on claude-mem by Alex Newman**
