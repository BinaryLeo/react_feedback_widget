import { AIProviderBase } from './base';
import { AIAnalysisResult, DuplicateCheckResult, FeedbackType, Priority, Sentiment, Category } from '../types';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }>;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
}

export class AnthropicProvider extends AIProviderBase {
  private baseUrl = 'https://api.anthropic.com/v1';

  async analyzeFeedback(
    message: string,
    userSelectedType: FeedbackType,
    screenshot?: string | null,
    uiLanguage?: string
  ): Promise<AIAnalysisResult> {
    // First, detect language (on sanitized message)
    const sanitizedMessage = this.sanitizeInput(message);
    const language = await this.detectLanguage(sanitizedMessage);

    // Build content blocks
    const contentBlocks: AnthropicMessage['content'] = [
      { type: 'text', text: this.createAnalysisPrompt(sanitizedMessage, userSelectedType, language, uiLanguage) },
    ];

    // If screenshot provided and feature enabled
    if (screenshot && this.config.features.screenshotAnalysis) {
      // Validate screenshot size
      this.validateScreenshot(screenshot);
      // Extract base64 data
      const base64Data = screenshot.replace(/^data:image\/[^;]+;base64,/, '');
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: base64Data,
        },
      });
      contentBlocks.push({
        type: 'text',
        text: this.createScreenshotAnalysisPrompt(),
      });
    }

    const response = await this.callAPI([
      {
        role: 'user',
        content: contentBlocks,
      },
    ]);

    const analysis = this.parseJSONResponse(response);

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
      screenshotAnalysis: analysis.screenshotAnalysis,
    };
  }

  async checkDuplicates(
    message: string,
    existingFeedbacks: Array<{ id: string; comment: string; type: string }>
  ): Promise<DuplicateCheckResult> {
    if (!this.config.features.duplicateDetection || existingFeedbacks.length === 0) {
      return { isDuplicate: false, similarityScore: 0, similarFeedbacks: [] };
    }

    const response = await this.callAPI([
      {
        role: 'user',
        content: this.createDuplicateCheckPrompt(message, existingFeedbacks),
      },
    ]);

    const result = this.parseJSONResponse(response);

    return {
      isDuplicate: result.isDuplicate,
      originalId: result.originalId,
      similarityScore: result.similarityScore,
      similarFeedbacks: result.similarFeedbacks || [],
    };
  }

  private async detectLanguage(text: string): Promise<string> {
    try {
      const response = await this.callAPI([
        {
          role: 'user',
          content: `Detect the language of this text and return only the 2-letter ISO code (en, es, pt, etc.):\n\n"""${text}"""`,
        },
      ]);
      return response.trim().toLowerCase().slice(0, 2);
    } catch {
      return 'en';
    }
  }

  private async callAPI(messages: AnthropicMessage[]): Promise<string> {
    const url = this.config.baseUrl || this.baseUrl;
    
    const response = await fetch(`${url}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw this.createSafeError('Anthropic', error);
    }

    const data = await response.json() as AnthropicResponse;
    return data.content[0]?.text || '';
  }
}
