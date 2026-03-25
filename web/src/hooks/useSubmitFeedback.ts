import { useState, useCallback } from 'react';
import type { CreateFeedbackInput } from '../domain/entities/Feedback';
import { container } from '../container';

export function useSubmitFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    feedback: any;
    aiAnalysis?: any;
  } | null>(null);

  const submit = useCallback(async (input: CreateFeedbackInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Domain validation happens in use case
      const response = await container.submitFeedbackUseCase.execute(input);
      
      setResult({
        feedback: response.feedback,
        aiAnalysis: response.aiAnalysis,
      });

      return { success: true, data: response };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsSubmitting(false);
  }, []);

  return {
    submit,
    isSubmitting,
    error,
    result,
    reset,
  };
}
