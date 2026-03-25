import { prisma } from '../utils/prisma';
import { AIProviderFactory } from './factory';
import { AIAnalysisResult, DuplicateCheckResult, AIConfig, FeedbackType } from './types';

export class AIService {
  private config: AIConfig | null = null;

  async loadConfig(projectId: string = 'default'): Promise<AIConfig | null> {
    const dbConfig = await prisma.aIConfig.findUnique({
      where: { projectId },
    });

    if (!dbConfig || !dbConfig.enabled) {
      this.config = null;
      return null;
    }

    this.config = {
      provider: dbConfig.provider as any,
      apiKey: dbConfig.apiKey || undefined,
      baseUrl: dbConfig.baseUrl || undefined,
      model: dbConfig.model,
      enabled: dbConfig.enabled,
      businessContext: (dbConfig as any).businessContext || undefined,
      features: {
        autoCategorize: dbConfig.autoCategorize,
        validateType: dbConfig.validateType,
        priorityScoring: dbConfig.priorityScoring,
        sentimentAnalysis: dbConfig.sentimentAnalysis,
        autoResponse: dbConfig.autoResponse,
        screenshotAnalysis: dbConfig.screenshotAnalysis,
        duplicateDetection: dbConfig.duplicateDetection,
        smartRouting: dbConfig.smartRouting,
        languageDetection: dbConfig.languageDetection,
      },
      thresholds: {
        minConfidence: dbConfig.minConfidence,
        duplicateThreshold: dbConfig.duplicateThreshold,
      },
    };

    return this.config;
  }

  async analyzeFeedback(
    message: string,
    userSelectedType: FeedbackType,
    screenshot?: string | null,
    uiLanguage?: string,
    projectId: string = 'default',
    overrideConfig?: AIConfig | null
  ): Promise<AIAnalysisResult | null> {
    // Use override config if provided (from request), otherwise load from database
    const config = overrideConfig || await this.loadConfig(projectId);
    if (!config) return null;

    const provider = AIProviderFactory.createProvider(config);
    if (!provider) return null;

    return provider.analyzeFeedback(message, userSelectedType, screenshot, uiLanguage);
  }

  async checkDuplicates(
    message: string,
    projectId: string = 'default'
  ): Promise<DuplicateCheckResult | null> {
    const config = await this.loadConfig(projectId);
    if (!config || !config.features.duplicateDetection) return null;

    // Get recent feedbacks for comparison (last 100)
    const existingFeedbacks = await prisma.feedback.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: {
        id: true,
        comment: true,
        type: true,
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingFeedbacks.length === 0) {
      return { isDuplicate: false, similarityScore: 0, similarFeedbacks: [] };
    }

    const provider = AIProviderFactory.createProvider(config);
    if (!provider) return null;

    return provider.checkDuplicates(
      message,
      existingFeedbacks.map((f: { id: string; comment: string; type: string }) => ({ id: f.id, comment: f.comment, type: f.type }))
    );
  }

  async determineTeam(category: string, priority: string): Promise<{ team: string; assignee?: string }> {
    // Find matching routing rule
    const rules = await prisma.routingRule.findMany({
      where: {
        enabled: true,
        OR: [
          { categories: { has: category } },
          { priorities: { has: priority } },
        ],
      },
      orderBy: {
        priority: 'desc',
      },
    });

    if (rules.length > 0) {
      return {
        team: rules[0].team,
        assignee: rules[0].assignee || undefined,
      };
    }

    // Default routing
    const defaultTeams: Record<string, string> = {
      'UI_ISSUE': 'design',
      'PERFORMANCE': 'dev',
      'SECURITY': 'security',
      'FEATURE_REQUEST': 'product',
      'BUG_REPORT': 'dev',
      'DOCUMENTATION': 'support',
      'BILLING': 'finance',
      'INTEGRATION': 'dev',
      'OTHER': 'support',
    };

    return { team: defaultTeams[category] || 'support' };
  }

  async isEnabled(projectId: string = 'default'): Promise<boolean> {
    return this.loadConfig(projectId).then(c => !!c);
  }
}

export const aiService = new AIService();
