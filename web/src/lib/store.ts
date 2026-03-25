import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, WidgetPosition } from '../types';
import './i18n';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  widgetPosition: WidgetPosition;
  setWidgetPosition: (position: WidgetPosition) => void;
  aiConfig: {
    provider: 'MOONSHOT' | 'ANTHROPIC' | 'NONE';
    apiKey: string;
    model: string;
    baseUrl: string;
    enabled: boolean;
  } | null;
  setAIConfig: (config: AppState['aiConfig']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      widgetPosition: 'bottom-right',
      setWidgetPosition: (position) => set({ widgetPosition: position }),
      aiConfig: null,
      setAIConfig: (config) => set({ aiConfig: config }),
    }),
    {
      name: 'feedback-widget-storage',
    }
  )
);
