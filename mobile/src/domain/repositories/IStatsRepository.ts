// Repository Interface - Domain Layer
// Defines the contract for statistics data access
import type { DashboardStats } from '../entities/DashboardStats';

export interface GetDashboardStatsResult {
  stats: DashboardStats;
}

export interface IStatsRepository {
  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Promise<GetDashboardStatsResult>;
}
