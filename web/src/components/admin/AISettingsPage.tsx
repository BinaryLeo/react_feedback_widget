import { useState, useEffect } from 'react';
import { Robot, Key, Check, Warning, CircleNotch, Sparkle, ArrowLeft, ArrowSquareOut, FloppyDisk, Power, ShieldCheck } from '@phosphor-icons/react';
import { useAppStore } from '../../lib/store';
import { t, supportedLanguages } from '../../lib/i18n';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333';

const PROVIDER_IDS = ['NONE', 'MOONSHOT', 'ANTHROPIC'] as const;

export default function AISettingsPage() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const KEEP_KEY = '__keep__'; // sentinel: don't overwrite existing key

  const [config, setConfig] = useState({
    provider: 'NONE' as const,
    apiKey: '',
    model: 'kimi-k2.5',
    enabled: false,
  });
  const [hasExistingKey, setHasExistingKey] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const ProviderIcons = {
    NONE: Power,
    MOONSHOT: Robot,
    ANTHROPIC: Robot,
  };

  const ProviderDocs = {
    MOONSHOT: 'https://platform.moonshot.ai',
    ANTHROPIC: 'https://console.anthropic.com',
  };

  const Models: Record<string, string[]> = {
    MOONSHOT: ['kimi-k2.5', 'kimi-k2-0905-preview', 'kimi-k2-turbo-preview', 'kimi-k2-thinking'],
    ANTHROPIC: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250514'],
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/ai/config`);
      const data = await response.json();
      if (data.success && data.config.provider !== 'NONE') {
        const keyExists = !!data.config.hasApiKey;
        setHasExistingKey(keyExists);
        setConfig(prev => ({
          ...prev,
          provider: data.config.provider,
          model: data.config.model || 'kimi-k2.5',
          enabled: data.config.enabled ?? false,
          apiKey: keyExists ? KEEP_KEY : '',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (config.provider === 'NONE' || !config.apiKey || config.apiKey === KEEP_KEY) return;

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${API_URL}/ai/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      setTestResult({
        success: data.success,
        message: data.success ? t('ai.connection_success', language) : (data.error || t('ai.connection_failed', language))
      });
    } catch (error) {
      setTestResult({ success: false, message: t('ai.network_error', language) });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const hasKey = config.apiKey === KEEP_KEY || (config.apiKey && config.apiKey.length > 0);
      const payload: any = {
        ...config,
        // Auto-enable when a real provider + key is configured; disable when NONE
        enabled: config.provider !== 'NONE' && !!hasKey,
        // Don't send sentinel — keep existing key in DB
        apiKey: config.apiKey === KEEP_KEY ? null : config.apiKey,
        features: {
          autoCategorize: true,
          validateType: true,
          priorityScoring: true,
          sentimentAnalysis: true,
          autoResponse: true,
          screenshotAnalysis: false,
          duplicateDetection: true,
          smartRouting: true,
          languageDetection: true,
        },
        thresholds: { minConfidence: 0.7, duplicateThreshold: 0.85 },
      };

      const response = await fetch(`${API_URL}/ai/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) setHasExistingKey(true);
      setTestResult({
        success: data.success,
        message: data.success ? t('ai.settings_saved', language) : (data.error || t('ai.settings_failed', language))
      });
    } catch (error) {
      setTestResult({ success: false, message: t('ai.settings_failed', language) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircleNotch size={32} weight="regular" className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <ArrowLeft size={20} weight="regular" />
              </a>
              <h1 className="text-xl font-bold text-gray-900">{t('settings.title', language)}</h1>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Robot size={20} weight="regular" className="text-purple-600" />
            {t('settings.provider', language)}
          </h2>

          <div className="space-y-3">
            {PROVIDER_IDS.map((providerId) => {
              const Icon = ProviderIcons[providerId as keyof typeof ProviderIcons];
              const isSelected = config.provider === providerId;

              return (
                <label
                  key={providerId}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={providerId}
                    checked={isSelected}
                    onChange={(e) => setConfig({
                      ...config,
                      provider: e.target.value as any,
                      model: Models[e.target.value]?.[0] || ''
                    })}
                    className="w-5 h-5 text-purple-600"
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <Icon size={20} weight="regular" className={isSelected ? 'text-purple-600' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {t(`settings.providers.${providerId}.name`, language)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t(`settings.providers.${providerId}.description`, language)}
                    </p>
                  </div>
                  {isSelected && <Check size={20} weight="regular" className="text-purple-600" />}
                </label>
              );
            })}
          </div>
        </div>

        {/* API Configuration */}
        {config.provider !== 'NONE' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key size={20} weight="regular" className="text-purple-600" />
              {t('settings.api_config', language)}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.api_key', language)}
                </label>
                {config.apiKey === KEEP_KEY ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                      <Check size={16} weight="regular" className="shrink-0" />
                      <span className="text-sm font-medium">API key saved ••••••••••••••••</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, apiKey: '' })}
                      className="px-3 py-3 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 border border-gray-200 rounded-xl transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t('settings.api_key_hint', language)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.model', language)}
                </label>
                <select
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Models[config.provider]?.map((modelId) => (
                    <option key={modelId} value={modelId}>
                      {t(`settings.models.${modelId}` as any, language)}
                    </option>
                  ))}
                </select>
              </div>

              {ProviderDocs[config.provider as keyof typeof ProviderDocs] && (
                <a
                  href={ProviderDocs[config.provider as keyof typeof ProviderDocs]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  {t('settings.get_api_key', language)}
                  <ArrowSquareOut size={16} weight="regular" />
                </a>
              )}

              {/* Test Connection */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleTest}
                  disabled={testing || !config.apiKey || config.apiKey === KEEP_KEY}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  {testing ? <CircleNotch size={16} weight="regular" className="animate-spin" /> : <Sparkle size={16} weight="regular" />}
                  {t('settings.test_connection', language)}
                </button>

                {testResult && (
                  <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult.success ? <Check size={16} weight="regular" /> : <Warning size={16} weight="regular" />}
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Guardrail Link */}
        <a
          href="/guardrail"
          className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 hover:border-purple-300 hover:bg-purple-50 transition-all group"
        >
          <ShieldCheck size={24} weight="regular" className="text-purple-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Business Context Guardrail</p>
            <p className="text-sm text-gray-500">
              Define your app's industry and topic rules so the AI filters irrelevant feedback.
            </p>
          </div>
          <ArrowSquareOut size={16} weight="regular" className="text-gray-400 group-hover:text-purple-500" />
        </a>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            {t('settings.opensource_notice', language)}
          </p>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <a href="/" className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors">
            {t('common.cancel', language)}
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {saving ? <CircleNotch size={16} weight="regular" className="animate-spin" /> : <FloppyDisk size={16} weight="regular" />}
            {t('settings.save', language)}
          </button>
        </div>
      </main>
    </div>
  );
}
