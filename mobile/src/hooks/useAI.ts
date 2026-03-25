import { useState, useCallback, useRef, useEffect } from 'react';
import type { AIConfig, AIAnalysis, FeedbackType, FeedbackResponse } from '../types';
import { aiService, feedbackService } from '../services/api';
import { useAppStore } from '../store';

// Hook to manage AI configuration
export function useAIConfig() {
  const { aiConfig, setAIConfig } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getConfig();
      if (result.success && result.config) {
        setAIConfig(result.config);
        return result.config;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch AI config');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setAIConfig]);

  const saveConfig = useCallback(async (config: AIConfig) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.updateConfig(config);
      if (result.success && result.config) {
        setAIConfig(result.config);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to save AI config');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setAIConfig]);

  const testConnection = useCallback(async (provider: string, apiKey: string, model: string, baseUrl?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.testConnection(provider, apiKey, model, baseUrl);
      return result;
    } catch (err) {
      return { success: false, error: 'Connection test failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    config: aiConfig,
    isEnabled: aiConfig?.enabled && aiConfig?.provider !== 'NONE',
    loading,
    error,
    fetchConfig,
    saveConfig,
    testConnection,
  };
}

// Hook to submit feedback with AI analysis
export function useAISubmit() {
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async ({
    type,
    comment,
    screenshot,
    language,
    uiLanguage,
  }: {
    type: FeedbackType;
    comment: string;
    screenshot?: string | null;
    language?: string;
    uiLanguage?: string;
  }): Promise<FeedbackResponse> => {
    setAnalyzing(true);
    setError(null);
    setInsight(null);

    try {
      const result = await feedbackService.createFeedback({
        type,
        comment,
        screenshot,
        language,
        uiLanguage,
      });

      if (result.success) {
        setInsight(result.ai || null);
      } else {
        setError(result.error || 'Failed to submit feedback');
      }

      return result;
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const resetInsight = useCallback(() => {
    setInsight(null);
    setError(null);
  }, []);

  return {
    submitFeedback,
    analyzing,
    insight,
    error,
    resetInsight,
  };
}

// Hook for real-time AI preview with debounce
export function useAIPreview() {
  const { aiConfig } = useAppStore();
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runPreview = useCallback(async (message: string, type: FeedbackType) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset if message is too short
    if (!message || message.trim().length < 10) {
      setPreview(null);
      setPreviewing(false);
      return null;
    }

    // Debounce: wait 500ms after user stops typing
    timeoutRef.current = setTimeout(async () => {
      if (!aiConfig?.enabled || aiConfig?.provider === 'NONE') {
        return;
      }

      setPreviewing(true);
      setError(null);
      
      abortControllerRef.current = new AbortController();

      try {
        const result = await aiService.analyzeFeedback(
          message,
          type,
          aiConfig.provider,
          aiConfig.apiKey,
          aiConfig.model
        );

        if (result.success && result.data) {
          setPreview(result.data);
          return result.data;
        }
      } catch (err) {
        // Silent fail for preview
        console.log('Preview analysis failed:', err);
      } finally {
        setPreviewing(false);
      }
    }, 500);

    return null;
  }, [aiConfig]);

  const runNow = useCallback(async (message: string, type: FeedbackType): Promise<AIAnalysis | null> => {
    if (!aiConfig?.enabled || aiConfig?.provider === 'NONE') {
      return null;
    }

    setPreviewing(true);
    setError(null);

    try {
      const result = await aiService.analyzeFeedback(
        message,
        type,
        aiConfig.provider,
        aiConfig.apiKey,
        aiConfig.model
      );

      if (result.success && result.data) {
        setPreview(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setPreviewing(false);
    }

    return null;
  }, [aiConfig]);

  const resetPreview = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPreview(null);
    setPreviewing(false);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    preview,
    previewing,
    error,
    runPreview,
    runNow,
    resetPreview,
  };
}

// Combined hook for all AI features
export function useAI() {
  const config = useAIConfig();
  const submit = useAISubmit();
  const preview = useAIPreview();

  return {
    ...config,
    ...submit,
    preview,
  };
}
