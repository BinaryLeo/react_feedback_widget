// Domain Layer Exports
// Pure business logic, no external dependencies

// Entities
export { Feedback } from './entities/Feedback';
export type { FeedbackProps } from './entities/Feedback';

export { DashboardStats } from './entities/DashboardStats';
export type { DashboardStatsProps, CategoryInfo, CustomerInfo } from './entities/DashboardStats';

// Repository Interfaces
export type {
  IFeedbackRepository,
  ListFeedbacksResult,
  UpdateFeedbackStatusResult,
  UpdateFeedbackTypeResult,
} from './repositories/IFeedbackRepository';

export type {
  IStatsRepository,
  GetDashboardStatsResult,
} from './repositories/IStatsRepository';
