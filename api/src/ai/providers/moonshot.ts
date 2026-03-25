import { AIProviderBase } from './base';
import { AIAnalysisResult, DuplicateCheckResult, FeedbackType, Priority, Sentiment, Category } from '../types';

interface MoonshotMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface MoonshotResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class MoonshotProvider extends AIProviderBase {
  private baseUrl = 'https://api.moonshot.ai/v1';

  async analyzeFeedback(
    message: string,
    userSelectedType: FeedbackType,
    screenshot?: string | null,
    uiLanguage?: string
  ): Promise<AIAnalysisResult> {
    // Skip separate language detection — the main analysis prompt already detects language,
    // saving one full round-trip to the API (especially important for slow thinking models).
    const language = 'en';

    // Sanitize user message
    const sanitizedMessage = this.sanitizeInput(message);

    // Prepare messages
    const messages: MoonshotMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant that analyzes user feedback. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: this.createAnalysisPrompt(sanitizedMessage, userSelectedType, language, uiLanguage),
      },
    ];

    // If screenshot provided, add image analysis
    if (screenshot && this.config.features.screenshotAnalysis) {
      // Validate screenshot size
      this.validateScreenshot(screenshot);
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: this.createScreenshotAnalysisPrompt() },
          { type: 'image_url', image_url: { url: screenshot } },
        ],
      });
    }

    const response = await this.callAPI(messages);
    const analysis = this.parseJSONResponse(response);

    // If screenshot was analyzed, get that result too
    let screenshotAnalysis: string | undefined;
    if (screenshot && this.config.features.screenshotAnalysis) {
      const screenshotMessages: MoonshotMessage[] = [
        {
          role: 'system',
          content: 'You are analyzing a screenshot. Describe what you see concisely.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: this.createScreenshotAnalysisPrompt() },
            { type: 'image_url', image_url: { url: screenshot } },
          ],
        },
      ];
      screenshotAnalysis = await this.callAPI(screenshotMessages);
    }

    return {
      suggestedType: analysis.suggestedType as FeedbackType,
      confidence: analysis.confidence,
      priority: analysis.priority as Priority,
      sentiment: analysis.sentiment as Sentiment,
      category: analysis.category as Category,
      summary: analysis.summary,
      actionItems: analysis.actionItems,
      language: analysis.language,
      uiLanguage: uiLanguage as any,
      translatedText: analysis.translatedText,
      suggestedResponse: analysis.suggestedResponse,
      translatedResponse: analysis.translatedResponse,
      typeValidation: analysis.typeValidation,
      isRelevant: analysis.isRelevant !== false, // Default to true if not explicitly false
      screenshotAnalysis,
    };
  }

  async checkDuplicates(
    message: string,
    existingFeedbacks: Array<{ id: string; comment: string; type: string }>
  ): Promise<DuplicateCheckResult> {
    if (!this.config.features.duplicateDetection || existingFeedbacks.length === 0) {
      return { isDuplicate: false, similarityScore: 0, similarFeedbacks: [] };
    }

    const messages: MoonshotMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant that detects duplicate feedback. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: this.createDuplicateCheckPrompt(message, existingFeedbacks),
      },
    ];

    const response = await this.callAPI(messages);
    const result = this.parseJSONResponse(response);

    return {
      isDuplicate: result.isDuplicate,
      originalId: result.originalId,
      similarityScore: result.similarityScore,
      similarFeedbacks: result.similarFeedbacks || [],
    };
  }

  private async callAPI(messages: MoonshotMessage[]): Promise<string> {
    const url = this.config.baseUrl || this.baseUrl;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s hard timeout

    try {
      const response = await fetch(`${url}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'kimi-k2.5',
          messages,
          // kimi-k2.5 thinking mode takes 300s+ — disable it for fast responses
          ...(!this.config.model || this.config.model === 'kimi-k2.5'
            ? { thinking: { type: 'disabled' } }
            : { temperature: 0.3 }),
          max_completion_tokens: 2000,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw this.createSafeError('Moonshot', error);
      }

      const data = await response.json() as MoonshotResponse;
      return data.choices[0]?.message?.content || '';
    } finally {
      clearTimeout(timeout);
    }
  }
}
