import type { Feedback, CreateFeedbackInput } from '../entities/Feedback';

export interface SubmitFeedbackResult {
  feedback: Feedback;
  aiAnalysis?: {
    analyzed: boolean;
    suggestedType: string;
    confidence: number;
    priority: string;
    sentiment: string;
    category: string;
    summary?: string;
    actionItems: string[];
    language?: string;
    suggestedResponse?: string;
    typeValidation?: {
      isCorrect: boolean;
      suggestedType: string;
      reason: string;
    };
  };
}

export interface IFeedbackRepository {
  submit(input: CreateFeedbackInput): Promise<SubmitFeedbackResult>;
  rate(feedbackId: string, rating: 'POSITIVE' | 'NEGATIVE', note?: string): Promise<void>;
}
