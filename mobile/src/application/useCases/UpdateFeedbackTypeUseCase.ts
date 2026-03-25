// Application Use Case - Update Feedback Type
import type { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';
import type { IStatsRepository } from '../../domain/repositories/IStatsRepository';
import type { Feedback } from '../../domain/entities/Feedback';
import type { DashboardStats } from '../../domain/entities/DashboardStats';
import type { FeedbackType } from '../../types';

export interface UpdateTypeResult {
  success: boolean;
  feedback?: Feedback;
  stats?: DashboardStats;
  error?: string;
}

export class UpdateFeedbackTypeUseCase {
  constructor(
    private feedbackRepository: IFeedbackRepository,
    private statsRepository: IStatsRepository
  ) {}

  async execute(feedbackId: string, newType: FeedbackType): Promise<UpdateTypeResult> {
    // Update the feedback type
    const updateResult = await this.feedbackRepository.updateType(feedbackId, newType);

    if (!updateResult.success) {
      return {
        success: false,
        error: updateResult.error || 'Failed to update type',
      };
    }

    // Refresh stats after type change
    const statsResult = await this.statsRepository.getDashboardStats();

    return {
      success: true,
      feedback: updateResult.feedback,
      stats: statsResult.stats,
    };
  }
}
