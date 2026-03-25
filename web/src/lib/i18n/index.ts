// Centralized i18n system for the entire application
// All strings must be defined here - no hardcoded strings in components!

import type { Language } from './lang';
import { en } from './locales/en';
import { es } from './locales/es';
import { ptBR } from './locales/pt-BR';
import { zh } from './locales/zh';

export type { Language } from './lang';

export const translations = {
  en,
  es,
  'pt-BR': ptBR,
  zh,
} as const;

export type TranslationKey = keyof typeof en;

// Helper type for model keys
export type ModelKey = `settings.models.${string}`;
export type ProviderKey = `settings.providers.${string}.name` | `settings.providers.${string}.description`;

// Type for the t function - accepts known keys or dynamic string keys
export type TFunction = {
  (key: TranslationKey, lang?: Language, params?: Record<string, string>): string;
  (key: string, lang?: Language, params?: Record<string, string>): string;
};

/**
 * Get translated string
 */
export function t(key: TranslationKey | string, lang: Language = 'en', params?: Record<string, string>): string {
  const locale = translations[lang] || translations.en;
  // Use type assertion to allow dynamic key access
  let text = (locale as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
  
  if (params) {
    Object.entries(params).forEach(([k, value]) => {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), value);
    });
  }
  
  return text;
}

/**
 * Get label for feedback type
 */
export function getLabel(type: string, lang: Language = 'en'): string {
  return t(`type.${type}` as TranslationKey, lang);
}

/**
 * Supported languages configuration
 */
export const supportedLanguages: { code: Language; name: string; flag: string; locale: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'zh', name: '中文', flag: '🇨🇳', locale: 'zh-CN' },
];

/**
 * Detect language from text content
 */
export function detectLanguage(text: string): Language {
  const chineseChars = /[\u4e00-\u9fa5]/;
  if (chineseChars.test(text)) return 'zh';
  
  const lower = text.toLowerCase();
  
  const spanishWords = ['el', 'la', 'es', 'son', 'por', 'para', 'que', 'con', 'está', 'esto', 'problema', 'idea', 'error', 'gracias'];
  const spanishCount = spanishWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  const portugueseWords = ['o', 'a', 'é', 'são', 'por', 'para', 'que', 'com', 'está', 'isto', 'problema', 'ideia', 'erro', 'obrigado'];
  const portugueseCount = portugueseWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  if (spanishCount >= 2) return 'es';
  if (portugueseCount >= 2) return 'pt-BR';
  return 'en';
}

/**
 * Format date according to locale
 */
export function formatDate(date: string | Date, lang: Language): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const locale = supportedLanguages.find(l => l.code === lang)?.locale || 'en-US';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}
