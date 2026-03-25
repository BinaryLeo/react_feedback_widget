import { AIAnalysisResult, DuplicateCheckResult, AIConfig, FeedbackType} from '../types';

export abstract class AIProviderBase {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract analyzeFeedback(
    message: string,
    userSelectedType: FeedbackType,
    screenshot?: string | null,
    uiLanguage?: string
  ): Promise<AIAnalysisResult>;

  abstract checkDuplicates(
    message: string,
    existingFeedbacks: Array<{ id: string; comment: string; type: string }>
  ): Promise<DuplicateCheckResult>;

  protected createAnalysisPrompt(
    message: string,
    userSelectedType: FeedbackType,
    contentLanguage: string,
    uiLanguage?: string
  ): string {
    const ctx = this.config.businessContext?.trim();
    const contextBlock = ctx
      ? `
Application Context: ${ctx}

IMPORTANT — Relevance Check: If the feedback is clearly unrelated to this application (e.g., asking about stock prices in a school app, or requesting personal services unrelated to the platform), set "isRelevant": false in your response and explain politely in "suggestedResponse". Otherwise set "isRelevant": true.
`
      : `

IMPORTANT — Relevance Check: If the feedback is clearly unrelated to a software application or platform (e.g., asking about local restaurants, trying to sell personal items like PS5, asking about gym bookings in an educational app, or other off-topic content), set "isRelevant": false in your response and explain politely in "suggestedResponse" that this feedback appears to be unrelated to the application. Otherwise set "isRelevant": true.
`;

    const translationBlock = uiLanguage && uiLanguage !== contentLanguage
      ? `
IMPORTANT: The user's interface is in ${uiLanguage}, but they wrote in ${contentLanguage}. 
Provide "suggestedResponse" in ${contentLanguage} (language of the feedback).
Also provide "translatedResponse" in ${uiLanguage} (language of the UI).
`
      : `
Respond in ${contentLanguage} (the language of the feedback).
`;

    return `You are an AI assistant analyzing user feedback for a software application.
${contextBlock}
User Feedback: """${message}"""
User Selected Type: ${userSelectedType}
Detected Content Language: ${contentLanguage}
UI Language: ${uiLanguage || contentLanguage}
${translationBlock}
Analyze this feedback and return a JSON object with the following structure:
{
  "isRelevant": true/false,
  "suggestedType": "BUG" | "IDEA" | "OTHER" | "HELP" | "PRAISE" | "QUESTION",
  "confidence": 0.0-1.0,
  "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "sentiment": "FRUSTRATED" | "HAPPY" | "NEUTRAL" | "ANGRY" | "CONFUSED",
  "category": "UI_ISSUE" | "PERFORMANCE" | "SECURITY" | "FEATURE_REQUEST" | "BUG_REPORT" | "DOCUMENTATION" | "BILLING" | "INTEGRATION" | "OTHER",
  "summary": "Concise 1-2 sentence summary in English",
  "actionItems": ["Actionable task 1", "Actionable task 2"],
  "language": "${contentLanguage}",
  "translatedText": "English translation if feedback not in English, otherwise null",
  "suggestedResponse": "Helpful response to the user in ${contentLanguage}",
  "translatedResponse": ${uiLanguage && uiLanguage !== contentLanguage ? `"Translation of suggestedResponse to ${uiLanguage}"` : "null"},
  "typeValidation": {
    "isCorrect": true/false,
    "suggestedType": "BUG/IDEA/OTHER/HELP/PRAISE/QUESTION if different from user selection",
    "reason": "Explanation if type should be changed"
  }
}

CRITICAL: Return ONLY the plain enum values (e.g., "BUG", "MEDIUM", "FEATURE_REQUEST", "product") WITHOUT any prefixes like "type.", "priority.", "category.", or "team.".

Feedback Type Definitions:
- BUG: A clear software defect — something is broken, crashes, or behaves incorrectly.
- IDEA: A feature request or improvement suggestion for something that does not yet exist.
- HELP: The user is confused, does not know how to do something, or is struggling with UX. NOT a defect — the software works but the user needs guidance.
- PRAISE: Positive feedback, compliment, or expression of satisfaction.
- QUESTION: A general question about how something works, not a defect or help request.
- OTHER: Anything that does not fit the above categories.

Type Reclassification Rules (apply these strictly):
- If user selected BUG but the content expresses confusion, asks "how do I...", or describes not finding/understanding a feature → suggest HELP
- If user selected BUG but the content is actually a question about behaviour → suggest QUESTION
- If user selected BUG but it describes a missing feature they want → suggest IDEA
- If user selected BUG but it is just frustration/complaint with no specific defect → suggest OTHER or PRAISE depending on tone
`;
  }

  protected createDuplicateCheckPrompt(
    message: string,
    existingFeedbacks: Array<{ id: string; comment: string; type: string }>
  ): string {
    const feedbacksText = existingFeedbacks
      .map((f) => `- [${f.type}] ${f.comment.slice(0, 200)}`)
      .join('\n');

    return `Compare this new feedback with existing ones to find duplicates.

NEW FEEDBACK:
"""${message}"""

EXISTING FEEDBACKS:
${feedbacksText}

Return JSON with this structure:
{
  "isDuplicate": true/false,
  "originalId": "id of the original feedback if duplicate",
  "similarityScore": 0.0-1.0,
  "similarFeedbacks": [
    {"id": "feedback id", "similarity": 0.0-1.0, "type": "BUG/IDEA/etc", "summary": "brief summary"}
  ]
}

A duplicate means the same issue reported again. Score > 0.8 is likely a duplicate.`;
  }

  // Helper methods for subclasses
  protected sanitizeInput(input: string): string {
    // Remove potentially dangerous characters but preserve international text
    return input
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // Remove control chars
      .trim();
  }

  protected validateScreenshot(screenshot: string): void {
    // Check if base64 string is too large (max 5MB)
    const base64Length = screenshot.length;
    const sizeInBytes = (base64Length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 5) {
      throw new Error('Screenshot too large. Maximum size is 5MB.');
    }
  }

  protected createScreenshotAnalysisPrompt(): string {
    return 'Analyze this screenshot and describe what you see. Focus on any UI issues, errors, or visual problems that the user might be reporting.';
  }

  protected parseJSONResponse(response: string): any {
    try {
      // Try to find JSON in the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', response.substring(0, 500));
      throw new Error('Invalid JSON response from AI');
    }
  }

  protected createSafeError(provider: string, error: string): Error {
    // Don't expose API keys or sensitive info in errors
    const sanitizedError = error
      .replace(/api[_-]?key['"]?\s*[:=]\s*['"]?[^'"\s]+['"]?/gi, 'apiKey: ***')
      .replace(/bearer\s+[^\s]+/gi, 'Bearer ***');
    return new Error(`${provider} API error: ${sanitizedError}`);
  }
}
