// Feedback Types
export type FeedbackType = 'BUG' | 'IDEA' | 'OTHER' | 'HELP' | 'PRAISE' | 'QUESTION';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
export type Sentiment = 'FRUSTRATED' | 'HAPPY' | 'NEUTRAL' | 'ANGRY' | 'CONFUSED';
export type Category = 'UI_ISSUE' | 'PERFORMANCE' | 'SECURITY' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'DOCUMENTATION' | 'BILLING' | 'INTEGRATION' | 'OTHER';
export type Team = 'dev' | 'design' | 'support' | 'product' | 'security' | 'finance';
export type AIProvider = 'NONE' | 'MOONSHOT' | 'ANTHROPIC';
export type Language = 'en' | 'es' | 'pt-BR' | 'zh';

// AI Features configuration
export interface AIFeatures {
  autoCategorize: boolean;
  validateType: boolean;
  priorityScoring: boolean;
  sentimentAnalysis: boolean;
  autoResponse: boolean;
  screenshotAnalysis: boolean;
  duplicateDetection: boolean;
  smartRouting: boolean;
  languageDetection: boolean;
}

// AI Thresholds
export interface AIThresholds {
  minConfidence: number;
  duplicateThreshold: number;
}

// AI Configuration
export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  enabled: boolean;
  features: AIFeatures;
  thresholds: AIThresholds;
  businessContext?: string;
}

// AI Analysis Result
export interface AIAnalysis {
  analyzed: boolean;
  suggestedType?: FeedbackType;
  confidence: number;
  priority?: Priority;
  sentiment?: Sentiment;
  category?: Category;
  summary?: string;
  actionItems: string[];
  language?: string;
  uiLanguage?: string;
  translatedText?: string;
  suggestedResponse?: string;
  translatedResponse?: string;
  typeValidation?: {
    isCorrect: boolean;
    suggestedType: FeedbackType;
    reason: string;
  };
  isRelevant?: boolean;
  isDuplicate?: boolean;
  duplicateOf?: string;
  similarFeedbacks?: SimilarFeedback[];
  screenshotAnalysis?: string;
  team?: Team;
}

// Similar feedback for duplicate detection
export interface SimilarFeedback {
  id: string;
  similarity: number;
  type: FeedbackType;
  summary: string;
}

// Feedback Data
export interface FeedbackData {
  type: FeedbackType;
  comment: string;
  screenshot?: string | null;
  language?: string;
  uiLanguage?: string;
}

// Feedback with AI analysis
export interface FeedbackWithAI extends FeedbackData {
  id: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  aiAnalyzed: boolean;
  aiSuggestedType?: FeedbackType;
  aiConfidence?: number;
  aiPriority?: Priority;
  aiSentiment?: Sentiment;
  aiCategory?: Category;
  aiSummary?: string;
  aiActionItems?: string[];
  aiLanguage?: string;
  aiUILanguage?: string;
  aiTranslated?: string;
  aiResponse?: string;
  aiTranslatedResponse?: string;
  aiScreenshotDesc?: string;
  duplicateOfId?: string | null;
  similarityScore?: number;
  team?: Team;
  assignedTo?: string;
  rating?: 'POSITIVE' | 'NEGATIVE';
  ratingNote?: string;
}

// API Response
export interface FeedbackResponse {
  success: boolean;
  data?: FeedbackWithAI;
  ai?: AIAnalysis;
  error?: string;
}

// AI Config Response
export interface AIConfigResponse {
  success: boolean;
  config?: AIConfig & { hasApiKey?: boolean };
  error?: string;
}

// Test Connection Response
export interface TestConnectionResponse {
  success: boolean;
  data?: {
    connected: boolean;
    response?: string;
  };
  error?: string;
}

// Customer info for stats
export interface CustomerInfo {
  email: string;
  name?: string;
  count: number;
  avgRating?: number;
}

// Category info for stats
export interface CategoryInfo {
  name: Category;
  count: number;
}

// Stats
export interface FeedbackStats {
  total: number;
  pending: number;
  resolved: number;
  rejected: number;
  byType: Record<FeedbackType, number>;
  byPriority: Record<Priority, number>;
  byStatus: Record<Status, number>;
  bySentiment: Record<Sentiment, number>;
  byTeam: Record<Team, number>;
  topCategories?: CategoryInfo[];
  topCustomers?: CustomerInfo[];
  satisfaction?: number;
}

// Guardrail Configuration
export interface GuardrailConfig {
  enabled: boolean;
  businessContext: string;
  keywords: string[];
  autoReject: boolean;
}

// Guardrail Example
export interface GuardrailExample {
  id: string;
  label: string;
  value: string;
}

// AI Status Response
export interface AIStatusResponse {
  success: boolean;
  data?: {
    enabled: boolean;
    provider?: AIProvider;
  };
  guardrail?: GuardrailConfig;
  error?: string;
}

// Icon Type
export type { IconComponent } from './icons';
