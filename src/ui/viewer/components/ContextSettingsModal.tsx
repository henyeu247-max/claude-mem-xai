import React, { useState, useCallback, useEffect } from 'react';
import type { Settings } from '../types';
import { TerminalPreview } from './TerminalPreview';
import { useContextPreview } from '../hooks/useContextPreview';

interface ContextSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
  isSaving: boolean;
  saveStatus: string;
}

// Collapsible section component
function CollapsibleSection({
  title,
  description,
  children,
  defaultOpen = true
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`settings-section-collapsible ${isOpen ? 'open' : ''}`}>
      <button
        className="section-header-btn"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="section-header-content">
          <span className="section-title">{title}</span>
          {description && <span className="section-description">{description}</span>}
        </div>
        <svg
          className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div className="section-content">{children}</div>}
    </div>
  );
}

// Form field with optional tooltip
function FormField({
  label,
  tooltip,
  children
}: {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field">
      <label className="form-field-label">
        {label}
        {tooltip && (
          <span className="tooltip-trigger" title={tooltip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// Toggle switch component
function ToggleSwitch({
  id,
  label,
  description,
  checked,
  onChange,
  disabled
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <label htmlFor={id} className="toggle-label">{label}</label>
        {description && <span className="toggle-description">{description}</span>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? 'on' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

export function ContextSettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  isSaving,
  saveStatus
}: ContextSettingsModalProps) {
  const [formState, setFormState] = useState<Settings>(settings);

  // Update form state when settings prop changes
  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  // Get context preview based on current form state
  const { preview, isLoading, error, projects, selectedProject, setSelectedProject } = useContextPreview(formState);

  const updateSetting = useCallback((key: keyof Settings, value: string) => {
    const newState = { ...formState, [key]: value };
    setFormState(newState);
  }, [formState]);

  const handleSave = useCallback(() => {
    onSave(formState);
  }, [formState, onSave]);

  const toggleBoolean = useCallback((key: keyof Settings) => {
    const currentValue = formState[key];
    const newValue = currentValue === 'true' ? 'false' : 'true';
    updateSetting(key, newValue);
  }, [formState, updateSetting]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="context-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Settings</h2>
          <div className="header-controls">
            <label className="preview-selector">
              Preview for:
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </label>
            <button
              onClick={onClose}
              className="modal-close-btn"
              title="Close (Esc)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body - 2 columns */}
        <div className="modal-body">
          {/* Left column - Terminal Preview */}
          <div className="preview-column">
            <div className="preview-content">
              {error ? (
                <div style={{ color: '#ff6b6b' }}>
                  Error loading preview: {error}
                </div>
              ) : (
                <TerminalPreview content={preview} isLoading={isLoading} />
              )}
            </div>
          </div>

          {/* Right column - Settings Panel */}
          <div className="settings-column">
            {/* Section 1: Loading */}
            <CollapsibleSection
              title="Loading"
              description="How many observations to inject"
            >
              <FormField
                label="Observations"
                tooltip="Number of recent observations to include in context (1-200)"
              >
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formState.CLAUDE_MEM_CONTEXT_OBSERVATIONS || '50'}
                  onChange={(e) => updateSetting('CLAUDE_MEM_CONTEXT_OBSERVATIONS', e.target.value)}
                />
              </FormField>
              <FormField
                label="Sessions"
                tooltip="Number of recent sessions to pull observations from (1-50)"
              >
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formState.CLAUDE_MEM_CONTEXT_SESSION_COUNT || '10'}
                  onChange={(e) => updateSetting('CLAUDE_MEM_CONTEXT_SESSION_COUNT', e.target.value)}
                />
              </FormField>
            </CollapsibleSection>

            {/* Section 2: Display */}
            <CollapsibleSection
              title="Display"
              description="What to show in context tables"
            >
              <div className="display-subsection">
                <span className="subsection-label">Full Observations</span>
                <FormField
                  label="Count"
                  tooltip="How many observations show expanded details (0-20)"
                >
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formState.CLAUDE_MEM_CONTEXT_FULL_COUNT || '5'}
                    onChange={(e) => updateSetting('CLAUDE_MEM_CONTEXT_FULL_COUNT', e.target.value)}
                  />
                </FormField>
                <FormField
                  label="Field"
                  tooltip="Which field to expand for full observations"
                >
                  <select
                    value={formState.CLAUDE_MEM_CONTEXT_FULL_FIELD || 'narrative'}
                    onChange={(e) => updateSetting('CLAUDE_MEM_CONTEXT_FULL_FIELD', e.target.value)}
                  >
                    <option value="narrative">Narrative</option>
                    <option value="facts">Facts</option>
                  </select>
                </FormField>
              </div>

              <div className="display-subsection">
                <span className="subsection-label">Token Economics</span>
                <div className="toggle-group">
                  <ToggleSwitch
                    id="show-read-tokens"
                    label="Read cost"
                    description="Tokens to read this observation"
                    checked={formState.CLAUDE_MEM_CONTEXT_SHOW_READ_TOKENS === 'true'}
                    onChange={() => toggleBoolean('CLAUDE_MEM_CONTEXT_SHOW_READ_TOKENS')}
                  />
                  <ToggleSwitch
                    id="show-work-tokens"
                    label="Work investment"
                    description="Tokens spent creating this observation"
                    checked={formState.CLAUDE_MEM_CONTEXT_SHOW_WORK_TOKENS === 'true'}
                    onChange={() => toggleBoolean('CLAUDE_MEM_CONTEXT_SHOW_WORK_TOKENS')}
                  />
                  <ToggleSwitch
                    id="show-savings-amount"
                    label="Savings"
                    description="Total tokens saved by reusing context"
                    checked={formState.CLAUDE_MEM_CONTEXT_SHOW_SAVINGS_AMOUNT === 'true'}
                    onChange={() => toggleBoolean('CLAUDE_MEM_CONTEXT_SHOW_SAVINGS_AMOUNT')}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Section 4: Advanced */}
            <CollapsibleSection
              title="Advanced"
              description="AI provider and model selection"
              defaultOpen={false}
            >
              <FormField
                label="AI Provider"
                tooltip="NVIDIA NIM provides 100+ AI models via OpenAI-compatible API. Free credits at build.nvidia.com"
              >
                <select
                  value={formState.CLAUDE_MEM_PROVIDER || 'nvidia'}
                  onChange={(e) => updateSetting('CLAUDE_MEM_PROVIDER', e.target.value)}
                >
                  <option value="nvidia">NVIDIA NIM (100+ models, free credits)</option>
                </select>
              </FormField>

                  <FormField
                    label="NVIDIA API Key"
                    tooltip="Your NVIDIA API key from build.nvidia.com (format: nvapi-...)"
                  >
                    <input
                      type="password"
                      value={formState.CLAUDE_MEM_NVIDIA_API_KEY || ''}
                      onChange={(e) => updateSetting('CLAUDE_MEM_NVIDIA_API_KEY', e.target.value)}
                      placeholder="nvapi-..."
                    />
                  </FormField>
                  <FormField
                    label="Model"
                    tooltip="Select an NVIDIA NIM model. Larger models = better quality, slower speed."
                  >
                    <select
                      value={formState.CLAUDE_MEM_NVIDIA_MODEL || 'openai/gpt-oss-120b'}
                      onChange={(e) => updateSetting('CLAUDE_MEM_NVIDIA_MODEL', e.target.value)}
                    >
                      <optgroup label="⚡ Fastest (tested, &lt;2s)">
                        <option value="openai/gpt-oss-20b">gpt-oss-20b (~1s, 194 tok/s) ⭐ FASTEST</option>
                        <option value="openai/gpt-oss-120b">gpt-oss-120b (~1.4s, 74 tok/s)</option>
                        <option value="nvidia/nemotron-3-nano-30b-a3b">nemotron-3-nano-30b (~1.4s, 78 tok/s)</option>
                      </optgroup>
                      <optgroup label="🚀 Fast (tested, 1.5-3s)">
                        <option value="mistralai/mistral-medium-3.5-128b">mistral-medium-3.5-128b (~1.6s, 44 tok/s)</option>
                        <option value="qwen/qwen3.5-122b-a10b">qwen3.5-122b (~2.7s, 36 tok/s)</option>
                      </optgroup>
                      <optgroup label="✅ Good (tested, 4-6s)">
                        <option value="nvidia/nemotron-3-super-120b-a12b">nemotron-3-super-120b (~4s, 64 tok/s)</option>
                        <option value="meta/llama-3.1-405b-instruct">llama-3.1-405b (~5s, 13 tok/s)</option>
                        <option value="nvidia/nvidia-nemotron-nano-9b-v2">nemotron-nano-9b (~5s, 49 tok/s)</option>
                        <option value="deepseek-ai/deepseek-v4-pro">deepseek-v4-pro (~5.3s, 15 tok/s)</option>
                        <option value="qwen/qwen3.5-397b-a17b">qwen3.5-397b (~5.7s, 16 tok/s)</option>
                      </optgroup>
                      <optgroup label="🐢 Slower (tested, 7-11s)">
                        <option value="google/gemma-4-31b-it">gemma-4-31b (~7.8s, 9 tok/s)</option>
                        <option value="deepseek-ai/deepseek-v4-flash">deepseek-v4-flash (~8.7s, 8 tok/s)</option>
                        <option value="minimaxai/minimax-m2.7">minimax-m2.7 (~8.8s, 25 tok/s)</option>
                        <option value="qwen/qwen3-coder-480b-a35b-instruct">qwen3-coder-480b (~11s, 9 tok/s)</option>
                      </optgroup>
                      <optgroup label="⚠️ Very Slow / Unstable (tested)">
                        <option value="nvidia/llama-3.3-nemotron-super-49b-v1.5">nemotron-super-49b (~27s, 9 tok/s)</option>
                        <option value="meta/llama-3.1-8b-instruct">llama-3.1-8b (~46s, 1 tok/s)</option>
                        <option value="moonshotai/kimi-k2.6">kimi-k2.6 (~5.3s, unstable output)</option>
                      </optgroup>
                      <optgroup label="--- Other Models (not tested) ---">
                        <option value="nvidia/llama-3.3-nemotron-super-49b-v1">nemotron-super-49b-v1</option>
                        <option value="nvidia/llama-3.1-nemotron-51b-instruct">nemotron-51b-instruct</option>
                        <option value="nvidia/nemotron-mini-4b-instruct">nemotron-mini-4b</option>
                        <option value="nvidia/llama-3.1-nemotron-nano-8b-v1">nemotron-nano-8b</option>
                        <option value="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning">nemotron-3-nano-omni-reasoning</option>
                        <option value="nvidia/nemotron-nano-3-30b-a3b">nemotron-nano-3-30b</option>
                        <option value="nvidia/mistral-nemo-minitron-8b-8k-instruct">mistral-nemo-minitron-8b</option>
                        <option value="deepseek-ai/deepseek-v3.2">deepseek-v3.2</option>
                        <option value="deepseek-ai/deepseek-v3.1-terminus">deepseek-v3.1-terminus</option>
                        <option value="deepseek-ai/deepseek-coder-6.7b-instruct">deepseek-coder-6.7b</option>
                        <option value="qwen/qwen2.5-coder-32b-instruct">qwen2.5-coder-32b</option>
                        <option value="qwen/qwen3-next-80b-a3b-instruct">qwen3-next-80b</option>
                        <option value="meta/llama-3.3-70b-instruct">llama-3.3-70b</option>
                        <option value="meta/llama-3.1-70b-instruct">llama-3.1-70b</option>
                        <option value="meta/llama-4-maverick-17b-128e-instruct">llama-4-maverick-17b</option>
                        <option value="meta/llama-3.2-3b-instruct">llama-3.2-3b</option>
                        <option value="meta/llama-3.2-1b-instruct">llama-3.2-1b</option>
                        <option value="meta/codellama-70b">codellama-70b</option>
                        <option value="mistralai/mistral-small-4-119b-2603">mistral-small-4-119b</option>
                        <option value="mistralai/devstral-2-123b-instruct-2512">devstral-2-123b</option>
                        <option value="mistralai/codestral-22b-instruct-v0.1">codestral-22b</option>
                        <option value="mistralai/ministral-14b-instruct-2512">ministral-14b</option>
                        <option value="mistralai/magistral-small-2506">magistral-small</option>
                        <option value="mistralai/mistral-7b-instruct-v0.3">mistral-7b</option>
                        <option value="google/gemma-3-27b-it">gemma-3-27b</option>
                        <option value="google/gemma-3-12b-it">gemma-3-12b</option>
                        <option value="google/gemma-3-4b-it">gemma-3-4b</option>
                        <option value="google/gemma-3n-e4b-it">gemma-3n-e4b</option>
                        <option value="google/gemma-2-2b-it">gemma-2-2b</option>
                        <option value="moonshotai/kimi-k2-instruct">kimi-k2-instruct</option>
                        <option value="moonshotai/kimi-k2-thinking">kimi-k2-thinking</option>
                        <option value="01-ai/yi-large">yi-large</option>
                        <option value="ai21labs/jamba-1.5-large-instruct">jamba-1.5-large</option>
                        <option value="bytedance/seed-oss-36b-instruct">seed-oss-36b</option>
                        <option value="databricks/dbrx-instruct">dbrx-instruct</option>
                        <option value="ibm/granite-34b-code-instruct">granite-34b-code</option>
                        <option value="ibm/granite-3.0-8b-instruct">granite-3.0-8b</option>
                        <option value="writer/palmyra-creative-122b">palmyra-creative-122b</option>
                        <option value="microsoft/phi-4-mini-instruct">phi-4-mini</option>
                        <option value="microsoft/phi-3.5-moe-instruct">phi-3.5-moe</option>
                      </optgroup>
                    </select>
                  </FormField>
              <FormField
                label="Worker Port"
                tooltip="Port for the background worker service"
              >
                <input
                  type="number"
                  min="1024"
                  max="65535"
                  value={formState.CLAUDE_MEM_WORKER_PORT || '37777'}
                  onChange={(e) => updateSetting('CLAUDE_MEM_WORKER_PORT', e.target.value)}
                />
              </FormField>

              <div className="toggle-group" style={{ marginTop: '12px' }}>
                <ToggleSwitch
                  id="show-last-summary"
                  label="Include last summary"
                  description="Add previous session's summary to context"
                  checked={formState.CLAUDE_MEM_CONTEXT_SHOW_LAST_SUMMARY === 'true'}
                  onChange={() => toggleBoolean('CLAUDE_MEM_CONTEXT_SHOW_LAST_SUMMARY')}
                />
                <ToggleSwitch
                  id="show-last-message"
                  label="Include last message"
                  description="Add previous session's final message"
                  checked={formState.CLAUDE_MEM_CONTEXT_SHOW_LAST_MESSAGE === 'true'}
                  onChange={() => toggleBoolean('CLAUDE_MEM_CONTEXT_SHOW_LAST_MESSAGE')}
                />
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Footer with Save button */}
        <div className="modal-footer">
          <div className="save-status">
            {saveStatus && <span className={saveStatus.includes('✓') ? 'success' : saveStatus.includes('✗') ? 'error' : ''}>{saveStatus}</span>}
          </div>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
