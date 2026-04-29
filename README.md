# claude-mem-xai

> **xAI Grok-only fork** of [claude-mem](https://github.com/thedotmack/claude-mem) by Alex Newman

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL%203.0-blue.svg" alt="License">
  </a>
  <a href="package.json">
    <img src="https://img.shields.io/badge/version-10.6.3--xai-green.svg" alt="Version">
  </a>
  <a href="https://github.com/thedotmack/claude-mem">
    <img src="https://img.shields.io/badge/upstream-claude--mem-orange.svg" alt="Upstream">
  </a>
</p>

## 🎯 What is this?

This is a **specialized fork** of claude-mem that:

- ✅ **Only uses xAI Grok API** (removed Claude SDK, Gemini, OpenRouter)
- ✅ **Chroma disabled by default** for lower CPU usage
- ✅ **SQLite-only search mode** as default
- ✅ **Optimized for xAI Grok models**

## 🚀 Key Differences from Original

| Feature | Original claude-mem | claude-mem-xai |
|---------|-------------------|----------------|
| AI Providers | Claude, Gemini, OpenRouter, xAI | **xAI Grok only** |
| Vector DB (Chroma) | Enabled by default | **Disabled by default** |
| Search Mode | Hybrid (Chroma + SQLite) | **SQLite-only** |
| CPU Usage | Higher (chroma-mcp subprocess) | **Lower** |
| Default Model | claude-sonnet-4-5 | **grok-4-1-fast-non-reasoning** |

## 📦 Installation

Same as original claude-mem:

```bash
# Install via Claude Code
claude install plugin thedotmack/claude-mem

# Or manually
git clone https://github.com/henyeu247-max/claude-mem-xai.git
cd claude-mem-xai
npm install
npm run build
```

## ⚙️ Configuration

### xAI API Key

Set your xAI API key in settings:

```json
{
  "CLAUDE_MEM_PROVIDER": "xai",
  "CLAUDE_MEM_XAI_API_KEY": "xai-your-api-key-here",
  "CLAUDE_MEM_XAI_MODEL": "grok-4-1-fast-non-reasoning"
}
```

### Available Grok Models

- `grok-4-1-fast-non-reasoning` (default) - Fastest, no reasoning
- `grok-4-1-fast-reasoning` - Fast with reasoning
- `grok-3-fast` - Previous generation

### Chroma Vector Database

Chroma is **disabled by default** in this fork. To enable:

```json
{
  "CLAUDE_MEM_CHROMA_ENABLED": "true"
}
```

## 🔧 Why This Fork?

### Original claude-mem is excellent, but:

1. **Multiple AI providers** - Most users only need one
2. **Chroma enabled by default** - High CPU usage from chroma-mcp subprocess
3. **Complex setup** - More dependencies than needed

### This fork simplifies:

1. **Single provider** - Only xAI Grok (simpler, faster)
2. **Lower resource usage** - No Chroma subprocess by default
3. **Focused** - Optimized for xAI use case

## 📊 Performance

### CPU Usage Comparison:

| Mode | CPU Usage | Processes |
|------|-----------|-----------|
| Original (Chroma enabled) | ~300-500 MB | worker + chroma-mcp + python |
| **This fork (Chroma disabled)** | **~150-200 MB** | **worker only** |

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

## 🤝 Contributing

This is a personal fork for xAI-only use. For general claude-mem contributions, please contribute to the [original project](https://github.com/thedotmack/claude-mem).

For xAI-specific improvements to this fork, feel free to open issues or PRs.

---

**Made with ❤️ by henyeu247-max | Based on claude-mem by Alex Newman**
