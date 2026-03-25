import { IFeedbackRepository } from '../../domain/repositories/IFeedbackRepository';

export interface RateFeedbackInput {
  feedbackId: string;
  rating: 'POSITIVE' | 'NEGATIVE';
  ratingNote?: string;
}

export class RateFeedbackUseCase {
  constructor(private feedbackRepository: IFeedbackRepository) {}

  async execute(input: RateFeedbackInput): Promise<void> {
    await this.feedbackRepository.rate(
      input.feedbackId,
      input.rating,
      input.ratingNote
    );
  }
}
