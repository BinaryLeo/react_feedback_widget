import { useState, useEffect, useCallback, useRef } from 'react';
import type { AIConfig, AIInsight, Language } from '../types';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333';

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/ai/status`);
      const data = await response.json();
      
      if (data.success && data.data.enabled) {
        const configRes = await fetch(`${API_URL}/ai/config`);
        const configData = await configRes.json();
        if (configData.success) {
          setConfig(configData.config ?? configData.data);
        }
      } else {
        setConfig(null);
      }
    } catch (err) {
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (providerConfig: {
    provider: string;
    apiKey: string;
    model: string;
    baseUrl?: string;
  }) => {
    const response = await fetch(`${API_URL}/ai/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerConfig),
    });
    return response.json();
  };

  const testAnalysis = async (testData: {
    message: string;
    type: string;
    provider: string;
    apiKey: string;
    model: string;
    baseUrl?: string;
  }) => {
    const response = await fetch(`${API_URL}/ai/test-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    return response.json();
  };

  return {
    config,
    loading,
    error,
    isEnabled: !!config?.enabled,
    refetch: fetchConfig,
    testConnection,
    testAnalysis,
  };
}

// Debounced pre-submit analysis — calls /ai/analyze with stored config
export function useAIPreview() {
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<AIInsight | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAnalysis = useCallback(async (message: string, type: string): Promise<AIInsight | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s max
    let res: Response;
    try {
      res = await fetch(`${API_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), type }),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeout);
      // AbortError = our own timeout → allow submission (AI unavailable)
      if (err?.name === 'AbortError') return null;
      // Network error → throw so caller can show an error
      throw err;
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) {
      // Server error (4xx/5xx) → throw so caller can show an error
      throw new Error(`AI analyze failed: ${res.status}`);
    }
    const data = await res.json();
    if (data.success && data.data) {
      return {
        analyzed: true,
        suggestedType: data.data.suggestedType,
        confidence: data.data.confidence,
        priority: data.data.priority,
        sentiment: data.data.sentiment,
        category: data.data.category,
        summary: data.data.summary,
        actionItems: data.data.actionItems || [],
        language: data.data.language,
        suggestedResponse: data.data.suggestedResponse,
        translatedResponse: data.data.translatedResponse,
        typeValidation: data.data.typeValidation,
        isRelevant: data.data.isRelevant,
      };
    }
    return null; // AI disabled on backend
  }, []);

  const triggerPreview = useCallback((message: string, type: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (message.trim().length < 10) {
      setPreview(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setPreviewing(true);
      try {
        const result = await fetchAnalysis(message, type);
        if (result) setPreview(result);
      } catch {
        // silent — don't break the widget
      } finally {
        setPreviewing(false);
      }
    }, 1500);
  }, [fetchAnalysis]);

  // Immediate (no debounce) — used to gate the submit button
  const runNow = useCallback(async (message: string, type: string): Promise<AIInsight | null> => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPreviewing(true);
    try {
      const result = await fetchAnalysis(message, type);
      if (result) setPreview(result);
      return result;
    } finally {
      setPreviewing(false);
    }
  }, [fetchAnalysis]);

  const resetPreview = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPreview(null);
  }, []);

  return { previewing, preview, triggerPreview, runNow, resetPreview };
}

export function useAISubmit() {
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async ({
    type,
    comment,
    screenshot,
    language,
    uiLanguage,
  }: {
    type: string;
    comment: string;
    screenshot?: string | null;
    language: Language;
    uiLanguage?: Language;
  }) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/feedbacks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          comment,
          screenshot,
          uiLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.ai) {
          setInsight(data.ai);
        }
        return { success: true, data: data.data, ai: data.ai };
      } else {
        setError(data.error || 'Failed to submit');
        return { success: false, error: data.error };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error';
      setError(message);
      return { success: false, error: message };
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    submitFeedback,
    analyzing,
    insight,
    error,
    resetInsight: () => setInsight(null),
  };
}
