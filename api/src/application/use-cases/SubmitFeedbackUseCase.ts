import { Feedback, CreateFeedbackData, AIAnalysis } from '../../domain/entities/Feedback';
import { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';
import { AIService } from '../../ai/service';

export interface SubmitFeedbackInput {
  type: CreateFeedbackData['type'];
  comment: string;
  screenshot?: string | null;
  skipAI?: boolean;
  metadata?: CreateFeedbackData['metadata'];
  uiLanguage?: string;  // Ui language
  userAIConfig?: {
    provider: string;
    apiKey: string;
    model: string;
  };
}

export interface SubmitFeedbackResult {
  success: boolean;
  feedback: Feedback;
  aiAnalysis?: AIAnalysis;
  duplicateOf?: Feedback | null;
  error?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbackRepository: IFeedbackRepository,
    private aiService: AIService,
    private aiConfigRepository: any, // Simplified for now
  ) {}

  async execute(input: SubmitFeedbackInput): Promise<SubmitFeedbackResult> {
    try {
      // 1. Create domain entity (validates input)
      const feedback = Feedback.create({
        type: input.type,
        comment: input.comment,
        screenshot: input.screenshot,
        metadata: input.metadata,
      });

      // 2. Check for duplicates (if enabled)
      let duplicateOf: Feedback | null = null;
      if (!input.skipAI) {
        const similar = await this.feedbackRepository.findRecentSimilar(input.comment, 0.85);
        if (similar.length > 0) {
          duplicateOf = similar[0];
          feedback.markAsDuplicate(duplicateOf.id);
        }
      }

      // 3. AI Analysis (if enabled and not a duplicate)
      let aiAnalysis: AIAnalysis | undefined;
      if (!input.skipAI && !duplicateOf) {
        try {
          const aiResult = await this.aiService.analyzeFeedback(
            input.comment,
            input.type,
            input.screenshot,
            input.uiLanguage
          );

          if (aiResult) {
            aiAnalysis = {
              suggestedType: aiResult.suggestedType,
              confidence: aiResult.confidence,
              priority: aiResult.priority,
              sentiment: aiResult.sentiment,
              category: aiResult.category,
              summary: aiResult.summary,
              actionItems: aiResult.actionItems || [],
              language: aiResult.language,
              uiLanguage: aiResult.uiLanguage,
              translatedText: aiResult.translatedText,
              suggestedResponse: aiResult.suggestedResponse,
              translatedResponse: aiResult.translatedResponse,
              isRelevant: aiResult.isRelevant !== false,
            };

            feedback.analyze(aiAnalysis);

            // Auto-route based on category/priority
            if (aiAnalysis.category && aiAnalysis.priority) {
              const routing = await this.aiService.determineTeam(
                aiAnalysis.category,
                aiAnalysis.priority
              );
              feedback.assignTo(routing.team, routing.assignee);
            }
          }
        } catch (error) {
          // Log but don't fail the request
          console.error('AI analysis failed:', error);
        }
      }

      // 4. Persist
      const saved = await this.feedbackRepository.create(feedback);

      return {
        success: true,
        feedback: saved,
        aiAnalysis,
        duplicateOf,
      };

    } catch (error) {
      return {
        success: false,
        feedback: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
