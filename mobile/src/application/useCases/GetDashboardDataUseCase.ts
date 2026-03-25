// Application Use Case - Orchestrates domain and infrastructure
// Fetches both stats and feedbacks for the dashboard
import type { IStatsRepository } from '../../domain/repositories/IStatsRepository';
import type { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';
import type { DashboardStats } from '../../domain/entities/DashboardStats';
import type { Feedback } from '../../domain/entities/Feedback';

export interface DashboardData {
  stats: DashboardStats;
  feedbacks: Feedback[];
}

export class GetDashboardDataUseCase {
  constructor(
    private statsRepository: IStatsRepository,
    private feedbackRepository: IFeedbackRepository
  ) {}

  async execute(): Promise<DashboardData> {
    // Fetch both stats and feedbacks in parallel
    const [statsResult, feedbacksResult] = await Promise.all([
      this.statsRepository.getDashboardStats(),
      this.feedbackRepository.listFeedbacks(),
    ]);

    return {
      stats: statsResult.stats,
      feedbacks: feedbacksResult.feedbacks,
    };
  }
}
