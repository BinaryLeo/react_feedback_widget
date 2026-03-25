// Infrastructure Repository Implementation
// Implements domain repository interface using API services
import type {
  IFeedbackRepository,
  ListFeedbacksResult,
  UpdateFeedbackStatusResult,
  UpdateFeedbackTypeResult,
} from '../../domain/repositories/IFeedbackRepository';
import { Feedback } from '../../domain/entities/Feedback';
import { feedbackService } from '../../services/api';
import type { Status, FeedbackType } from '../../types';

export class FeedbackRepository implements IFeedbackRepository {
  async listFeedbacks(): Promise<ListFeedbacksResult> {
    const result = await feedbackService.listFeedbacks();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch feedbacks');
    }

    // Map DTOs to Domain Entities
    const feedbacks = result.data.map(dto =>
      Feedback.fromDTO({
        id: dto.id,
        type: dto.type,
        comment: dto.comment,
        status: dto.status,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        aiAnalyzed: dto.aiAnalyzed,
        aiSuggestedType: dto.aiSuggestedType,
        aiConfidence: dto.aiConfidence,
        aiPriority: dto.aiPriority,
        aiSentiment: dto.aiSentiment,
        aiCategory: dto.aiCategory,
        aiSummary: dto.aiSummary,
        aiActionItems: dto.aiActionItems,
        aiLanguage: dto.aiLanguage,
        aiUILanguage: dto.aiUILanguage,
        aiTranslated: dto.aiTranslated,
        aiResponse: dto.aiResponse,
        aiTranslatedResponse: dto.aiTranslatedResponse,
        aiScreenshotDesc: dto.aiScreenshotDesc,
        duplicateOfId: dto.duplicateOfId,
        similarityScore: dto.similarityScore,
        team: dto.team,
        assignedTo: dto.assignedTo,
        rating: dto.rating,
        ratingNote: dto.ratingNote,
        screenshot: dto.screenshot,
      })
    );

    return { feedbacks };
  }

  async updateStatus(feedbackId: string, newStatus: Status): Promise<UpdateFeedbackStatusResult> {
    const result = await feedbackService.updateStatus(feedbackId, newStatus);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update status',
      };
    }

    // Fetch the updated feedback
    const listResult = await feedbackService.listFeedbacks();
    if (listResult.success && listResult.data) {
      const updatedDto = listResult.data.find(f => f.id === feedbackId);
      if (updatedDto) {
        const feedback = Feedback.fromDTO({
          id: updatedDto.id,
          type: updatedDto.type,
          comment: updatedDto.comment,
          status: updatedDto.status,
          createdAt: updatedDto.createdAt,
          updatedAt: updatedDto.updatedAt,
          aiAnalyzed: updatedDto.aiAnalyzed,
          aiSuggestedType: updatedDto.aiSuggestedType,
          aiConfidence: updatedDto.aiConfidence,
          aiPriority: updatedDto.aiPriority,
          aiSentiment: updatedDto.aiSentiment,
          aiCategory: updatedDto.aiCategory,
          aiSummary: updatedDto.aiSummary,
          aiActionItems: updatedDto.aiActionItems,
          aiLanguage: updatedDto.aiLanguage,
          aiUILanguage: updatedDto.aiUILanguage,
          aiTranslated: updatedDto.aiTranslated,
          aiResponse: updatedDto.aiResponse,
          aiTranslatedResponse: updatedDto.aiTranslatedResponse,
          aiScreenshotDesc: updatedDto.aiScreenshotDesc,
          duplicateOfId: updatedDto.duplicateOfId,
          similarityScore: updatedDto.similarityScore,
          team: updatedDto.team,
          assignedTo: updatedDto.assignedTo,
          rating: updatedDto.rating,
          ratingNote: updatedDto.ratingNote,
          screenshot: updatedDto.screenshot,
        });
        return { success: true, feedback };
      }
    }

    return { success: true };
  }

  async updateType(feedbackId: string, newType: FeedbackType): Promise<UpdateFeedbackTypeResult> {
    const result = await feedbackService.updateType(feedbackId, newType);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to update type',
      };
    }

    // Fetch the updated feedback
    const listResult = await feedbackService.listFeedbacks();
    if (listResult.success && listResult.data) {
      const updatedDto = listResult.data.find(f => f.id === feedbackId);
      if (updatedDto) {
        const feedback = Feedback.fromDTO({
          id: updatedDto.id,
          type: updatedDto.type,
          comment: updatedDto.comment,
          status: updatedDto.status,
          createdAt: updatedDto.createdAt,
          updatedAt: updatedDto.updatedAt,
          aiAnalyzed: updatedDto.aiAnalyzed,
          aiSuggestedType: updatedDto.aiSuggestedType,
          aiConfidence: updatedDto.aiConfidence,
          aiPriority: updatedDto.aiPriority,
          aiSentiment: updatedDto.aiSentiment,
          aiCategory: updatedDto.aiCategory,
          aiSummary: updatedDto.aiSummary,
          aiActionItems: updatedDto.aiActionItems,
          aiLanguage: updatedDto.aiLanguage,
          aiUILanguage: updatedDto.aiUILanguage,
          aiTranslated: updatedDto.aiTranslated,
          aiResponse: updatedDto.aiResponse,
          aiTranslatedResponse: updatedDto.aiTranslatedResponse,
          aiScreenshotDesc: updatedDto.aiScreenshotDesc,
          duplicateOfId: updatedDto.duplicateOfId,
          similarityScore: updatedDto.similarityScore,
          team: updatedDto.team,
          assignedTo: updatedDto.assignedTo,
          rating: updatedDto.rating,
          ratingNote: updatedDto.ratingNote,
          screenshot: updatedDto.screenshot,
        });
        return { success: true, feedback };
      }
    }

    return { success: true };
  }
}
