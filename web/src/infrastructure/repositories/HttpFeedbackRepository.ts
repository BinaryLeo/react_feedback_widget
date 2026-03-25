import type { CreateFeedbackInput } from '../../domain/entities/Feedback';
import type { IFeedbackRepository, SubmitFeedbackResult } from '../../domain/repositories/IFeedbackRepository';
import { ApiClient } from '../api/ApiClient';

export class HttpFeedbackRepository implements IFeedbackRepository {
  constructor(private apiClient: ApiClient) {}

  async submit(input: CreateFeedbackInput): Promise<SubmitFeedbackResult> {
    const response = await this.apiClient.post<{
      success: boolean;
      data: any;
      ai?: any;
    }>('/feedbacks', {
      type: input.type,
      comment: input.comment,
      screenshot: input.screenshot,
      uiLanguage: input.uiLanguage,
    });

    return {
      feedback: response.data,
      aiAnalysis: response.ai,
    };
  }

  async rate(
    feedbackId: string,
    rating: 'POSITIVE' | 'NEGATIVE',
    note?: string
  ): Promise<void> {
    await this.apiClient.patch(`/feedbacks/${feedbackId}/rate`, {
      rating,
      ratingNote: note,
    });
  }
}
