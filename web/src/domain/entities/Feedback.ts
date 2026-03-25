/**
 * Domain Entity: Feedback
 * Pure business logic, no external dependencies
 */

export type FeedbackType = 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION';
export type FeedbackStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Sentiment = 'FRUSTRATED' | 'HAPPY' | 'NEUTRAL' | 'ANGRY' | 'CONFUSED';

export interface AIAnalysis {
  suggestedType: FeedbackType;
  confidence: number;
  priority: Priority;
  sentiment: Sentiment;
  category: string;
  summary?: string;
  actionItems: string[];
  language?: string;           // Detected content language
  uiLanguage?: string;         // UI language when submitted
  suggestedResponse?: string;  // Response in content language
  translatedResponse?: string; // Response translated to UI language
  typeValidation?: {
    isCorrect: boolean;
    suggestedType: FeedbackType;
    reason: string;
  };
}

export interface CreateFeedbackInput {
  type: FeedbackType;
  comment: string;
  screenshot?: string | null;
  uiLanguage?: string;  // Current UI language for translation
}

export class Feedback {
  constructor(
    public readonly id: string,
    public readonly type: FeedbackType,
    public readonly comment: string,
    public readonly screenshot: string | null,
    public readonly status: FeedbackStatus,
    public readonly aiAnalysis: AIAnalysis | null,
    public readonly createdAt: Date,
    public readonly team?: string,
    public readonly assignedTo?: string,
    public readonly rating?: 'POSITIVE' | 'NEGATIVE',
    public readonly ratingNote?: string
  ) {}

  static create(input: CreateFeedbackInput, id?: string): Feedback {
    // Validation
    if (!input.comment || input.comment.trim().length < 3) {
      throw new Error('Comment must be at least 3 characters');
    }

    if (input.comment.length > 5000) {
      throw new Error('Comment must be at most 5000 characters');
    }

    if (input.screenshot) {
      const sizeInBytes = (input.screenshot.length * 3) / 4;
      if (sizeInBytes > 5 * 1024 * 1024) {
        throw new Error('Screenshot too large (max 5MB)');
      }
    }

    return new Feedback(
      id || crypto.randomUUID(),
      input.type,
      input.comment.trim(),
      input.screenshot || null,
      'PENDING',
      null,
      new Date()
    );
  }

  isHighPriority(): boolean {
    return this.aiAnalysis?.priority === 'CRITICAL' || 
           this.aiAnalysis?.priority === 'HIGH';
  }

  isAIAnalyzed(): boolean {
    return this.aiAnalysis !== null;
  }

  getTypeValidation() {
    return this.aiAnalysis?.typeValidation;
  }

  hasTypeMismatch(): boolean {
    const validation = this.getTypeValidation();
    return validation ? !validation.isCorrect : false;
  }
}
