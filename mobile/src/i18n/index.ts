export type Language = 'en' | 'es' | 'pt-BR' | 'zh';

import { en } from './locales/en';
import { es } from './locales/es';
import { ptBR } from './locales/pt-BR';
import { zh } from './locales/zh';

export type Translations = typeof en;
export type TranslationKey = keyof Translations;

const locales: Record<Language, Translations> = {
  en,
  es,
  'pt-BR': ptBR,
  zh,
};

export const supportedLanguages: Array<{ code: Language; name: string; flag: string }> = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function t(key: TranslationKey, lang: Language = 'en', params?: Record<string, string>): string {
  const locale = locales[lang] || locales.en;
  let text = locale[key] || locales.en[key] || key;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{{${key}}}`, value);
    });
  }
  
  return text;
}

// Simple language detection based on common words
export function detectLanguage(text: string): Language {
  const lower = text.toLowerCase();
  
  // Spanish indicators
  const spanishWords = ['el', 'la', 'es', 'son', 'por', 'para', 'que', 'con', 'está', 'esto', 'problema', 'idea'];
  const spanishCount = spanishWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  // Portuguese indicators
  const portugueseWords = ['o', 'a', 'é', 'são', 'por', 'para', 'que', 'com', 'está', 'isto', 'problema', 'ideia'];
  const portugueseCount = portugueseWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  // Chinese indicators (simplified check for common characters)
  const chineseChars = /[\u4e00-\u9fa5]/;
  if (chineseChars.test(text)) return 'zh';
  
  if (spanishCount >= 2) return 'es';
  if (portugueseCount >= 2) return 'pt-BR';
  return 'en';
}

// Alias for SettingsScreen compatibility
export function getSupportedLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return supportedLanguages;
}
