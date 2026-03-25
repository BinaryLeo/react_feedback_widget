// Application Use Case - Filter Feedbacks by Status
// Pure business logic, no external dependencies
import type { Feedback } from '../../domain/entities/Feedback';
import type { Status } from '../../types';

export interface FilterFeedbacksResult {
  filteredFeedbacks: Feedback[];
  totalCount: number;
  filteredCount: number;
}

export class FilterFeedbacksUseCase {
  execute(
    feedbacks: Feedback[],
    statusFilter: Status | 'ALL'
  ): FilterFeedbacksResult {
    let filtered: Feedback[];

    if (statusFilter === 'ALL') {
      filtered = feedbacks;
    } else {
      filtered = feedbacks.filter(feedback => feedback.status === statusFilter);
    }

    return {
      filteredFeedbacks: filtered,
      totalCount: feedbacks.length,
      filteredCount: filtered.length,
    };
  }
}
