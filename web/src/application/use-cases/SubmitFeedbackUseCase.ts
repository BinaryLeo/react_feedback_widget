import { Feedback, type CreateFeedbackInput } from '../../domain/entities/Feedback';
import type { IFeedbackRepository, SubmitFeedbackResult } from '../../domain/repositories/IFeedbackRepository';

export class SubmitFeedbackUseCase {
  constructor(private feedbackRepository: IFeedbackRepository) {}

  async execute(input: CreateFeedbackInput): Promise<SubmitFeedbackResult> {
    // Domain validation happens in Feedback.create()
    const feedback = Feedback.create(input);

    // Call repository
    const result = await this.feedbackRepository.submit(input);

    return result;
  }
}
