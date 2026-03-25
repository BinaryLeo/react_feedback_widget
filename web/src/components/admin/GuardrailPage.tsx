import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, ArrowLeft, FloppyDisk, CircleNotch, Check, Warning, Lightbulb } from '@phosphor-icons/react';
import { useAppStore } from '../../lib/store';
import { t, type Language } from '../../lib/i18n';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333';

interface Example {
  label: string;
  value: string;
  icon?: string;
}

// Keys for examples - actual text comes from translations
const EXAMPLE_KEYS = [
  { id: 'school', key: 'guardrail.example.school' },
  { id: 'ecommerce', key: 'guardrail.example.ecommerce' },
  { id: 'saas', key: 'guardrail.example.saas' },
  { id: 'healthcare', key: 'guardrail.example.healthcare' },
] as const;

function getExamples(language: Language): Example[] {
  return EXAMPLE_KEYS.map(({ key }) => ({
    label: t(`${key}.label` as any, language),
    value: t(`${key}.value` as any, language),
  }));
}

export default function GuardrailPage() {
  const language = useAppStore((state) => state.language);
  
  // Get translated examples
  const EXAMPLES = getExamples(language);

  const [businessContext, setBusinessContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Animation states
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [flyingCard, setFlyingCard] = useState<{
    example: Example;
    fromRect: DOMRect;
    toRect: DOMRect;
    id: number;
  } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContext();
  }, []);

  const fetchContext = async () => {
    try {
      const res = await fetch(`${API_URL}/ai/config`);
      const data = await res.json();
      if (data.success) {
        setBusinessContext(data.config.businessContext || '');
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = useCallback((example: Example) => {
    const cardEl = cardRefs.current.get(example.label);
    const textareaEl = textareaRef.current;
    const containerEl = containerRef.current;
    
    if (!cardEl || !textareaEl || !containerEl) {
      // Fallback: just set the value without animation
      setBusinessContext(example.value);
      setSelectedExample(example.label);
      return;
    }

    const fromRect = cardEl.getBoundingClientRect();
    const toRect = textareaEl.getBoundingClientRect();

    // Set selected immediately
    setSelectedExample(example.label);
    
    // Start flying animation
    setFlyingCard({
      example,
      fromRect,
      toRect,
      id: Date.now(),
    });

    // After animation completes, set the value
    setTimeout(() => {
      setBusinessContext(example.value);
      setFlyingCard(null);
      textareaEl.focus();
      
      // Flash effect on textarea
      textareaEl.classList.add('bg-purple-100');
      setTimeout(() => textareaEl.classList.remove('bg-purple-100'), 300);
    }, 650);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setResult(null);
    try {
      const configRes = await fetch(`${API_URL}/ai/config`);
      const configData = await configRes.json();
      if (!configData.success) throw new Error('Failed to load config');

      const current = configData.config;

      const res = await fetch(`${API_URL}/ai/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: current.provider,
          model: current.model,
          enabled: current.enabled,
          apiKey: null,
          businessContext: businessContext.trim() || null,
          features: {
            autoCategorize: current.autoCategorize ?? true,
            validateType: current.validateType ?? true,
            priorityScoring: current.priorityScoring ?? true,
            sentimentAnalysis: current.sentimentAnalysis ?? true,
            autoResponse: current.autoResponse ?? true,
            screenshotAnalysis: current.screenshotAnalysis ?? false,
            duplicateDetection: current.duplicateDetection ?? true,
            smartRouting: current.smartRouting ?? true,
            languageDetection: current.languageDetection ?? true,
          },
          thresholds: {
            minConfidence: current.minConfidence ?? 0.7,
            duplicateThreshold: current.duplicateThreshold ?? 0.85,
          },
        }),
      });

      const data = await res.json();
      setResult({
        success: data.success,
        message: data.success ? t('ai.settings_saved', language) : (data.error || t('ai.settings_failed', language)),
      });
      if (!data.success) {
        console.error('Save failed:', data);
      }
    } catch (err) {
      console.error('Save error:', err);
      setResult({ success: false, message: t('ai.settings_failed', language) })
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
    <div className="min-h-screen bg-gray-50" ref={containerRef}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <a href="/settings" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <ArrowLeft size={20} weight="regular" />
            </a>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} weight="regular" className="text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">{t('guardrail.page_title', language)}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Explanation */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <p className="text-sm text-purple-900 font-medium mb-1">{t('guardrail.what_is_this', language)}</p>
          <p className="text-sm text-purple-800">
            {t('guardrail.description', language)}
          </p>
        </div>

        {/* Textarea with Envelope Slot Effect */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                {t('guardrail.context_label', language)}
              </label>
              {flyingCard && (
                <span className="text-purple-600 text-xs animate-pulse flex items-center gap-1">
                  <CircleNotch size={12} weight="regular" className="animate-spin" />
                  {t('guardrail.inserting', language)}
                </span>
              )}
            </div>
            
            {/* Envelope slot wrapper */}
            <div className="relative">
              {/* Envelope opening effect at top */}
              <div 
                className={`
                  absolute -top-3 left-4 right-4 h-6 z-10 pointer-events-none
                  transition-all duration-300
                  ${flyingCard ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <div className="absolute inset-0 bg-linear-to-b from-gray-200 to-transparent rounded-t-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>

              <textarea
                ref={textareaRef}
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                rows={6}
                maxLength={1000}
                placeholder={t('guardrail.placeholder', language)}
                className={`
                  w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white 
                  transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm
                  ${flyingCard ? 'ring-2 ring-purple-300 bg-purple-50/50' : ''}
                `}
              />

              {/* Envelope opening effect at bottom (when card enters) */}
              <div 
                className={`
                  absolute -bottom-2 left-4 right-4 h-4 z-10 pointer-events-none
                  transition-all duration-300
                  ${flyingCard ? 'opacity-100' : 'opacity-0'}
                `}
              >
                <div className="absolute inset-0 bg-linear-to-t from-purple-100 to-transparent rounded-b-lg" />
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-1 text-right">{businessContext.length}/1000</p>
          </div>

          {/* Flying Card Animation Layer - inside the container */}
          {flyingCard && (
            <FlyingCardAnimation
              example={flyingCard.example}
              fromRect={flyingCard.fromRect}
              toRect={flyingCard.toRect}
            />
          )}
        </div>

        {/* Quick-fill examples */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} weight="regular" className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">{t('guardrail.examples_title', language)}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                ref={(el) => {
                  if (el) cardRefs.current.set(ex.label, el);
                }}
                onClick={() => handleExampleClick(ex)}
                disabled={!!flyingCard}
                className={`
                  text-left p-4 border-2 rounded-xl transition-all duration-300 text-sm
                  relative overflow-hidden group
                  ${selectedExample === ex.label 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm'
                  }
                  ${flyingCard?.example.label === ex.label ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}
                  disabled:cursor-not-allowed
                `}
              >
                {/* Selection checkmark */}
                <div className={`
                  absolute top-3 right-3 transition-all duration-300
                  ${selectedExample === ex.label ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}>
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check size={12} weight="bold" className="text-white" />
                  </div>
                </div>
                
                <span className={`
                  font-semibold block mb-1 transition-colors
                  ${selectedExample === ex.label ? 'text-purple-900' : 'text-gray-900 group-hover:text-purple-900'}
                `}>
                  {ex.label}
                </span>
                <span className={`
                  block line-clamp-2 text-xs transition-colors
                  ${selectedExample === ex.label ? 'text-purple-700' : 'text-gray-500 group-hover:text-purple-600'}
                `}>
                  {ex.value.slice(0, 70)}…
                </span>

                {/* Hover click hint */}
                <div className="
                  absolute inset-0 flex items-center justify-center
                  bg-purple-600/90 opacity-0 group-hover:opacity-0
                  transition-opacity duration-200
                ">
                  <span className="text-white font-medium text-sm">Click to insert</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between">
          {result && (
            <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? <Check size={16} weight="regular" /> : <Warning size={16} weight="regular" />}
              {result.message}
            </div>
          )}
          <div className="ml-auto flex gap-3">
            <a
              href="/settings"
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm"
            >
              {t('common.cancel', language)}
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {saving ? <CircleNotch size={16} weight="regular" className="animate-spin" /> : <FloppyDisk size={16} weight="regular" />}
              {t('guardrail.save', language)}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

// Flying Card Animation Component
interface FlyingCardAnimationProps {
  example: Example;
  fromRect: DOMRect;
  toRect: DOMRect;
}

function FlyingCardAnimation({ example, fromRect, toRect }: FlyingCardAnimationProps) {
  const [animationState, setAnimationState] = useState<'start' | 'flying' | 'entering'>('start');

  useEffect(() => {
    // Start animation after mount
    const timer1 = setTimeout(() => setAnimationState('flying'), 10);
    const timer2 = setTimeout(() => setAnimationState('entering'), 400);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Calculate positions
  const startX = fromRect.left;
  const startY = fromRect.top;
  const startWidth = fromRect.width;
  const startHeight = fromRect.height;

  // Target: center of textarea
  const targetX = toRect.left + toRect.width / 2 - startWidth / 2;
  const targetY = toRect.top + 20; // Near top of textarea

  // Animation phases
  const getTransform = () => {
    switch (animationState) {
      case 'start':
        return `translate(0, 0) scale(1) rotate(0deg)`;
      case 'flying':
        return `translate(${targetX - startX}px, ${targetY - startY}px) scale(0.9) rotate(-2deg)`;
      case 'entering':
        return `translate(${targetX - startX}px, ${targetY - startY + 30}px) scale(0.7) rotate(0deg)`;
      default:
        return '';
    }
  };

  const getOpacity = () => {
    switch (animationState) {
      case 'start':
        return 1;
      case 'flying':
        return 1;
      case 'entering':
        return 0.3;
      default:
        return 0;
    }
  };

  return (
    <>
      {/* The Flying Card */}
      <div
        className="fixed z-100 pointer-events-none"
        style={{
          left: startX,
          top: startY,
          width: startWidth,
          height: startHeight,
          transform: getTransform(),
          opacity: getOpacity(),
          transition: 'all 650ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className={`
          w-full h-full bg-white rounded-xl shadow-2xl border-2 border-purple-500 p-4
          flex flex-col justify-center
          ${animationState === 'entering' ? 'shadow-[0_0_30px_rgba(168,85,247,0.6)]' : ''}
        `}>
          <span className="font-bold text-purple-900 block text-base mb-1">{example.label}</span>
          <span className="text-purple-700 text-xs line-clamp-2">{example.value.slice(0, 60)}…</span>
        </div>
      </div>




    </>
  );
}
