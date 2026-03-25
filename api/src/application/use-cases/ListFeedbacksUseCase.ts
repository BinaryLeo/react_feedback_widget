import { IFeedbackRepository, ListOptions, PaginatedResult } from '../../domain/repositories/IFeedbackRepository';
import { Feedback } from '../../domain/entities/Feedback';

export class ListFeedbacksUseCase {
  constructor(private feedbackRepository: IFeedbackRepository) {}

  async execute(options?: ListOptions): Promise<PaginatedResult<Feedback>> {
    return this.feedbackRepository.list(options);
  }
}
