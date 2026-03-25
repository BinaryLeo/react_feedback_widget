// Repository Interface - Domain Layer
// Defines the contract for feedback data access
import type { Feedback } from '../entities/Feedback';
import type { Status, FeedbackType } from '../../types';

export interface ListFeedbacksResult {
  feedbacks: Feedback[];
}

export interface UpdateFeedbackStatusResult {
  success: boolean;
  feedback?: Feedback;
  error?: string;
}

export interface UpdateFeedbackTypeResult {
  success: boolean;
  feedback?: Feedback;
  error?: string;
}

export interface IFeedbackRepository {
  /**
   * Get all feedbacks
   */
  listFeedbacks(): Promise<ListFeedbacksResult>;

  /**
   * Update feedback status
   */
  updateStatus(feedbackId: string, newStatus: Status): Promise<UpdateFeedbackStatusResult>;

  /**
   * Update feedback type
   */
  updateType(feedbackId: string, newType: FeedbackType): Promise<UpdateFeedbackTypeResult>;
}
