// Infrastructure Repository Implementation
// Implements domain repository interface using API services
import type {
  IStatsRepository,
  GetDashboardStatsResult,
} from '../../domain/repositories/IStatsRepository';
import { DashboardStats } from '../../domain/entities/DashboardStats';
import { feedbackService } from '../../services/api';

export class StatsRepository implements IStatsRepository {
  async getDashboardStats(): Promise<GetDashboardStatsResult> {
    const data = await feedbackService.getFeedbackStats();

    // Map DTO to Domain Entity
    const stats = DashboardStats.fromDTO({
      total: data.total,
      pending: data.pending,
      resolved: data.resolved,
      rejected: data.rejected,
      byType: data.byType,
      byPriority: data.byPriority,
      byStatus: data.byStatus,
      bySentiment: data.bySentiment,
      byTeam: data.byTeam,
      topCategories: data.topCategories,
      topCustomers: data.topCustomers,
      satisfaction: data.satisfaction,
    });

    return { stats };
  }
}
