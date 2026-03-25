// Domain Entity for Dashboard Statistics
import type { FeedbackType, Priority, Status, Sentiment, Team, Category } from '../../types';

export interface CategoryInfo {
  name: Category;
  count: number;
}

export interface CustomerInfo {
  email: string;
  name?: string;
  count: number;
  avgRating?: number;
}

export interface DashboardStatsProps {
  total: number;
  pending: number;
  resolved: number;
  rejected: number;
  byType: Record<FeedbackType, number>;
  byPriority: Record<Priority, number>;
  byStatus: Record<Status, number>;
  bySentiment: Record<Sentiment, number>;
  byTeam: Record<Team, number>;
  topCategories?: CategoryInfo[];
  topCustomers?: CustomerInfo[];
  satisfaction?: number;
}

export class DashboardStats {
  constructor(private props: DashboardStatsProps) {}

  // Getters
  get total(): number { return this.props.total; }
  get pending(): number { return this.props.pending; }
  get resolved(): number { return this.props.resolved; }
  get rejected(): number { return this.props.rejected; }
  get byType(): Record<FeedbackType, number> { return this.props.byType; }
  get byPriority(): Record<Priority, number> { return this.props.byPriority; }
  get byStatus(): Record<Status, number> { return this.props.byStatus; }
  get bySentiment(): Record<Sentiment, number> { return this.props.bySentiment; }
  get byTeam(): Record<Team, number> { return this.props.byTeam; }
  get topCategories(): CategoryInfo[] | undefined { return this.props.topCategories; }
  get topCustomers(): CustomerInfo[] | undefined { return this.props.topCustomers; }
  get satisfaction(): number | undefined { return this.props.satisfaction; }

  // Business logic
  getResolutionRate(): number {
    if (this.props.total === 0) return 0;
    return Math.round((this.props.resolved / this.props.total) * 100);
  }

  getRejectionRate(): number {
    if (this.props.total === 0) return 0;
    return Math.round((this.props.rejected / this.props.total) * 100);
  }

  getPendingRate(): number {
    if (this.props.total === 0) return 0;
    return Math.round((this.props.pending / this.props.total) * 100);
  }

  getStatusCount(status: Status | 'ALL'): number {
    if (status === 'ALL') return this.props.total;
    if (status === 'PENDING') return this.props.pending;
    if (status === 'RESOLVED') return this.props.resolved;
    if (status === 'REJECTED') return this.props.rejected;
    return this.props.byStatus[status] || 0;
  }

  getMostCommonType(): FeedbackType | null {
    let maxCount = 0;
    let mostCommon: FeedbackType | null = null;
    
    for (const [type, count] of Object.entries(this.props.byType)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = type as FeedbackType;
      }
    }
    return mostCommon;
  }

  // Factory method
  static fromDTO(dto: DashboardStatsProps): DashboardStats {
    return new DashboardStats(dto);
  }

  static empty(): DashboardStats {
    return new DashboardStats({
      total: 0,
      pending: 0,
      resolved: 0,
      rejected: 0,
      byType: { BUG: 0, IDEA: 0, OTHER: 0, HELP: 0, PRAISE: 0, QUESTION: 0 },
      byPriority: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
      byStatus: { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0, REJECTED: 0 },
      bySentiment: { FRUSTRATED: 0, HAPPY: 0, NEUTRAL: 0, ANGRY: 0, CONFUSED: 0 },
      byTeam: { dev: 0, design: 0, support: 0, product: 0, security: 0, finance: 0 },
    });
  }

  toDTO(): DashboardStatsProps {
    return { ...this.props };
  }
}
