export type AIProvider = "MOONSHOT" | "ANTHROPIC" | "OPENAI" | "NONE";

export type FeedbackType =
  | "BUG"
  | "IDEA"
  | "OTHER"
  | "HELP"
  | "PRAISE"
  | "QUESTION";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type Sentiment =
  | "FRUSTRATED"
  | "HAPPY"
  | "NEUTRAL"
  | "ANGRY"
  | "CONFUSED";
export type Status =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";
export type Category =
  | "UI_ISSUE"
  | "PERFORMANCE"
  | "SECURITY"
  | "FEATURE_REQUEST"
  | "BUG_REPORT"
  | "DOCUMENTATION"
  | "BILLING"
  | "INTEGRATION"
  | "OTHER";

export type Team =
  | "dev"
  | "design"
  | "support"
  | "product"
  | "security"
  | "finance";
export type Language = "en" | "es" | "pt-BR" | "zh";

export interface AIAnalysisResult {
  isRelevant?: boolean;
  suggestedType: FeedbackType;
  confidence: number;
  priority: Priority;
  sentiment: Sentiment;
  category: Category;
  summary: string;
  actionItems: string[];
  language: Language; // Detected language
  uiLanguage?: Language; // UI language
  translatedText?: string; // Translated feedback text
  suggestedResponse?: string; // Response in detected language
  translatedResponse?: string; // Translated response for UI language
  typeValidation?: {
    isCorrect: boolean;
    suggestedType: FeedbackType;
    reason: string;
  };
  screenshotAnalysis?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  originalId?: string;
  similarityScore: number;
  similarFeedbacks: Array<{
    id: string;
    similarity: number;
    type: string;
    summary: string;
  }>;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  enabled: boolean;
  businessContext?: string;
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
