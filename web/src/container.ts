/**
 * Dependency Injection Container (Frontend)
 * Manual DI, zero dependencies
 */

import { apiClient } from './infrastructure/api/ApiClient';
import { HttpFeedbackRepository } from './infrastructure/repositories/HttpFeedbackRepository';
import { SubmitFeedbackUseCase } from './application/use-cases/SubmitFeedbackUseCase';

class Container {
  private static instance: Container;

  // Infrastructure
  readonly apiClient = apiClient;

  // Repositories
  readonly feedbackRepository: HttpFeedbackRepository;

  // Use Cases
  readonly submitFeedbackUseCase: SubmitFeedbackUseCase;

  private constructor() {
    // Repositories
    this.feedbackRepository = new HttpFeedbackRepository(this.apiClient);

    // Use Cases
    this.submitFeedbackUseCase = new SubmitFeedbackUseCase(this.feedbackRepository);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

export const container = Container.getInstance();
