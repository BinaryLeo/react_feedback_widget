import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import { zh } from './locales/zh';

export type Language = 'en' | 'es' | 'pt' | 'zh';
export type TranslationKey = keyof typeof en;

// Use Record<string, string> to allow any string values in translations
const locales: Record<Language, Record<TranslationKey, string>> = {
  en,
  es,
  pt,
  zh,
};

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

export function detectLanguage(text: string): Language {
  // Simple detection based on common words
  const lower = text.toLowerCase();
  
  // Spanish indicators
  const spanishWords = ['el', 'la', 'es', 'son', 'por', 'para', 'que', 'con', 'está', 'esto', 'problema', 'idea'];
  const spanishCount = spanishWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  // Portuguese indicators
  const portugueseWords = ['o', 'a', 'é', 'são', 'por', 'para', 'que', 'com', 'está', 'isto', 'problema', 'ideia'];
  const portugueseCount = portugueseWords.filter(w => lower.includes(` ${w} `) || lower.startsWith(`${w} `)).length;
  
  if (spanishCount >= 2) return 'es';
  if (portugueseCount >= 2) return 'pt';
  return 'en';
}

export function getSupportedLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
  ];
}
