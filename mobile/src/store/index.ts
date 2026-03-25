import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language, AIConfig, AIProvider } from '../types';

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // AI Configuration
  aiConfig: AIConfig | null;
  setAIConfig: (config: AIConfig | null) => void;
  updateAIConfig: (updates: Partial<AIConfig>) => void;

  // UI State
  isWidgetOpen: boolean;
  setIsWidgetOpen: (isOpen: boolean) => void;

  // Admin screens
  currentScreen: 'home' | 'dashboard' | 'settings' | 'guardrail';
  setCurrentScreen: (screen: 'home' | 'dashboard' | 'settings' | 'guardrail') => void;
}

const defaultAIConfig: AIConfig = {
  provider: 'NONE' as AIProvider,
  model: 'kimi-k2.5',
  enabled: false,
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
  thresholds: {
    minConfidence: 0.7,
    duplicateThreshold: 0.85,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Language
      language: 'en' as Language,
      setLanguage: (lang) => set({ language: lang }),

      // AI Configuration
      aiConfig: null,
      setAIConfig: (config) => set({ aiConfig: config }),
      updateAIConfig: (updates) =>
        set((state) => ({
          aiConfig: state.aiConfig
            ? { ...state.aiConfig, ...updates }
            : { ...defaultAIConfig, ...updates },
        })),

      // UI State
      isWidgetOpen: false,
      setIsWidgetOpen: (isOpen) => set({ isWidgetOpen: isOpen }),

      // Admin screens
      currentScreen: 'home',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
    }),
    {
      name: 'feedback-widget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        aiConfig: state.aiConfig,
      }),
    }
  )
);
