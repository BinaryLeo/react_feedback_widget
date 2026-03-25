import { useState } from 'react';
import { Robot, Key, HardDrive, Check, Warning, CircleNotch, Sparkle, X, Tag, CheckCircle, ChartBar, Smiley, ChatCircleText, Camera, Copy, MapPin } from '@phosphor-icons/react';
import type { AIConfig, Language } from '../../types';
import { t } from '../../lib/i18n';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Partial<AIConfig>) => Promise<void>;
  initialConfig?: AIConfig | null;
  lang: Language;
}

const PROVIDERS = [
  { id: 'NONE', nameKey: 'settings.providers.NONE.name', descKey: 'settings.providers.NONE.description' },
  { id: 'MOONSHOT', nameKey: 'settings.providers.MOONSHOT.name', descKey: 'settings.providers.MOONSHOT.description' },
  { id: 'ANTHROPIC', nameKey: 'settings.providers.ANTHROPIC.name', descKey: 'settings.providers.ANTHROPIC.description' },
] as const;

const MODELS: Record<string, string[]> = {
  MOONSHOT: ['kimi-k2.5', 'kimi-k2-turbo-preview'],
  ANTHROPIC: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250514'],
};

type ConfigWithDefaults = Partial<AIConfig> & {
  features: NonNullable<AIConfig['features']>;
  thresholds: NonNullable<AIConfig['thresholds']>;
};

export function AISettings({ isOpen, onClose, onSave, initialConfig, lang }: AISettingsProps) {
  const [config, setConfig] = useState<ConfigWithDefaults>({
    provider: initialConfig?.provider || 'NONE',
    apiKey: '',
    baseUrl: initialConfig?.baseUrl || '',
    model: initialConfig?.model || 'kimi-k2.5',
    enabled: initialConfig?.enabled || false,
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
      ...(initialConfig?.features || {}),
    },
    thresholds: {
      minConfidence: 0.7,
      duplicateThreshold: 0.85,
      ...(initialConfig?.thresholds || {}),
    },
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (config.provider === 'NONE') return;

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:3333/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          baseUrl: config.baseUrl || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult({ success: true, message: t('ai.connection_success', lang) });
      } else {
        setTestResult({ success: false, message: data.error || t('ai.connection_failed', lang) });
      }
    } catch (error) {
      setTestResult({ success: false, message: t('error.network', lang) });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (key: keyof AIConfig['features'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, [key]: value } as NonNullable<AIConfig['features']>,
    }));
  };

  const FEATURES = [
    { key: 'autoCategorize', labelKey: 'feature.auto_categorize', Icon: Tag },
    { key: 'validateType', labelKey: 'feature.validate_type', Icon: CheckCircle },
    { key: 'priorityScoring', labelKey: 'feature.priority_scoring', Icon: ChartBar },
    { key: 'sentimentAnalysis', labelKey: 'feature.sentiment_analysis', Icon: Smiley },
    { key: 'autoResponse', labelKey: 'feature.auto_response', Icon: ChatCircleText },
    { key: 'screenshotAnalysis', labelKey: 'feature.screenshot_analysis', Icon: Camera },
    { key: 'duplicateDetection', labelKey: 'feature.duplicate_detection', Icon: Copy },
    { key: 'smartRouting', labelKey: 'feature.smart_routing', Icon: MapPin },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Robot size={20} weight="regular" className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('settings.title', lang)}</h2>
              <p className="text-xs text-gray-500">{t('settings.ai_description', lang)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} weight="regular" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('settings.provider', lang)}</label>
            <div className="space-y-2">
              {PROVIDERS.map((provider) => (
                <label
                  key={provider.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    config.provider === provider.id
                      ? 'border-purple-500 bg-purple-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={provider.id}
                    checked={config.provider === provider.id}
                    onChange={(e) => {
                      const provider = e.target.value as any;
                      setConfig(prev => ({
                        ...prev,
                        provider,
                        model: MODELS[provider]?.[0] || '',
                        enabled: provider !== 'NONE',
                      }));
                    }}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{t(provider.nameKey as any, lang)}</p>
                    <p className="text-sm text-gray-500">{t(provider.descKey as any, lang)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          {config.provider !== 'NONE' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Key size={16} weight="regular" className="inline mr-1" />
                    {t('settings.api_key', lang)}
                  </label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('settings.api_key_hint', lang)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('settings.model', lang)}
                  </label>
                  <select
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {MODELS[config.provider || 'NONE']?.map((model: string) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HardDrive size={16} weight="regular" className="inline mr-1" />
                    {t('settings.custom_url', lang)}
                  </label>
                  <input
                    type="text"
                    value={config.baseUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.provider.com/v1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Test Connection */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing || !config.apiKey}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    {testing ? (
                      <>
                        <CircleNotch size={16} weight="regular" className="animate-spin" />
                        {t('common.testing', lang)}
                      </>
                    ) : (
                      <>
                        <Sparkle size={16} weight="regular" />
                        {t('settings.test_connection', lang)}
                      </>
                    )}
                  </button>

                  {testResult && (
                    <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.success ? <Check size={16} weight="regular" /> : <Warning size={16} weight="regular" />}
                      {testResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('settings.features', lang)}</label>
                <div className="grid grid-cols-2 gap-3">
                  {FEATURES.map((feature) => (
                    <label
                      key={feature.key}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={config.features?.[feature.key as keyof typeof config.features]}
                        onChange={(e) => updateFeature(feature.key as keyof AIConfig['features'], e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <feature.Icon size={20} weight="regular" className="text-gray-500" />
                      <span className="text-sm text-gray-700">{t(feature.labelKey as any, lang)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Thresholds */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('threshold.min_confidence', lang)}: {Math.round((config.thresholds?.minConfidence || 0.7) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={config.thresholds?.minConfidence || 0.7}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, minConfidence: parseFloat(e.target.value) },
                    }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('threshold.duplicate', lang)}: {Math.round((config.thresholds?.duplicateThreshold || 0.85) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="0.95"
                    step="0.05"
                    value={config.thresholds?.duplicateThreshold || 0.85}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, duplicateThreshold: parseFloat(e.target.value) },
                    }))}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {t('common.cancel', lang)}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {saving ? (
              <>
                <CircleNotch size={16} weight="regular" className="animate-spin" />
                {t('common.saving', lang)}
              </>
            ) : (
              <>
                <Check size={16} weight="regular" />
                {t('settings.save', lang)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
