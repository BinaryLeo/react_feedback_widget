// Application Use Case - Update Feedback Status
import type { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';
import type { IStatsRepository } from '../../domain/repositories/IStatsRepository';
import type { Feedback } from '../../domain/entities/Feedback';
import type { DashboardStats } from '../../domain/entities/DashboardStats';
import type { Status } from '../../types';

export interface UpdateStatusResult {
  success: boolean;
  feedback?: Feedback;
  stats?: DashboardStats;
  error?: string;
}

export class UpdateFeedbackStatusUseCase {
  constructor(
    private feedbackRepository: IFeedbackRepository,
    private statsRepository: IStatsRepository
  ) {}

  async execute(feedbackId: string, newStatus: Status): Promise<UpdateStatusResult> {
    // Update the feedback status
    const updateResult = await this.feedbackRepository.updateStatus(feedbackId, newStatus);

    if (!updateResult.success) {
      return {
        success: false,
        error: updateResult.error || 'Failed to update status',
      };
    }

    // Refresh stats after status change
    const statsResult = await this.statsRepository.getDashboardStats();

    return {
      success: true,
      feedback: updateResult.feedback,
      stats: statsResult.stats,
    };
  }
}
