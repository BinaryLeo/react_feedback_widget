// Dependency Injection Container
// Wires together all layers
import { FeedbackRepository, StatsRepository } from './infrastructure';
import {
  GetDashboardDataUseCase,
  UpdateFeedbackStatusUseCase,
  UpdateFeedbackTypeUseCase,
  FilterFeedbacksUseCase,
} from './application';

// Repositories (Singleton instances)
const feedbackRepository = new FeedbackRepository();
const statsRepository = new StatsRepository();

// Use Cases (Inject repositories)
export const getDashboardDataUseCase = new GetDashboardDataUseCase(
  statsRepository,
  feedbackRepository
);

export const updateFeedbackStatusUseCase = new UpdateFeedbackStatusUseCase(
  feedbackRepository,
  statsRepository
);

export const updateFeedbackTypeUseCase = new UpdateFeedbackTypeUseCase(
  feedbackRepository,
  statsRepository
);

// Stateless use cases can be instantiated directly or exported as class
export const filterFeedbacksUseCase = new FilterFeedbacksUseCase();
