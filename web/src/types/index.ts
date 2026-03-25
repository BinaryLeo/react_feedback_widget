// Import Language type from i18n/lang.ts
import type { Language } from '../lib/i18n/lang';
export type { Language } from '../lib/i18n/lang';

// Widget position type
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type FeedbackType = 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Sentiment = 'FRUSTRATED' | 'HAPPY' | 'NEUTRAL' | 'ANGRY' | 'CONFUSED';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
export type Category = 
  | 'UI_ISSUE' 
  | 'PERFORMANCE' 
  | 'SECURITY' 
  | 'FEATURE_REQUEST' 
  | 'BUG_REPORT'
  | 'DOCUMENTATION'
  | 'BILLING'
  | 'INTEGRATION'
  | 'OTHER';
export type Team = 'dev' | 'design' | 'support' | 'product' | 'security' | 'finance';

export interface AITypeValidation {
  isCorrect: boolean;
  suggestedType: FeedbackType;
  reason: string;
}

export interface AIInsight {
  analyzed: boolean;
  isRelevant?: boolean;
  suggestedType: FeedbackType;
  confidence: number;
  priority: Priority;
  sentiment: Sentiment;
  category: Category;
  summary: string;
  actionItems: string[];
  language: Language;
  uiLanguage?: Language;
  suggestedResponse?: string;
  translatedResponse?: string;  // Response translated to UI language
  typeValidation?: {
    isCorrect: boolean;
    suggestedType: FeedbackType;
    reason: string;
    confidence: number;
  };
  isDuplicate?: boolean;
  duplicateOf?: string;
  similarFeedbacks?: Array<{
    id: string;
    similarity: number;
    type: string;
    summary: string;
  }>;
  team?: Team;
}

export interface FeedbackData {
  id: string;
  type: FeedbackType;
  comment: string;
  screenshot?: string | null;
  createdAt: string;
  updatedAt: string;
  status: Status;
  
  // AI Fields
  aiAnalyzed?: boolean;
  aiSuggestedType?: FeedbackType;
  aiConfidence?: number;
  aiPriority?: Priority;
  aiSentiment?: Sentiment;
  aiSummary?: string;
  aiCategory?: Category;
  aiActionItems?: string[];
  aiLanguage?: Language;
  aiTranslated?: string;
  aiResponse?: string;
  aiScreenshotDesc?: string;
  team?: Team;
  assignedTo?: string;
  rating?: 'POSITIVE' | 'NEGATIVE' | null;
  ratingNote?: string | null;
}

export interface AIConfig {
  provider: 'MOONSHOT' | 'ANTHROPIC' | 'OPENAI' | 'NONE';
  apiKey?: string;
  baseUrl?: string;
  model: string;
  enabled: boolean;
  hasApiKey: boolean;
  features: {
    autoCategorize: boolean;
    validateType: boolean;
    priorityScoring: boolean;
    sentimentAnalysis: boolean;
    autoResponse: boolean;
    screenshotAnalysis: boolean;
    duplicateDetection: boolean;
    smartRouting: boolean;
    languageDetection: boolean;
  };
  thresholds: {
    minConfidence: number;
    duplicateThreshold: number;
  };
}

export interface DashboardStats {
  total: number;
  newToday: number;
  avgResponseTime: string;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  byTeam: Record<string, number>;
  bySentiment: Record<string, number>;
}
