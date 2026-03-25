/**
 * Simple DI Container - Manual, zero dependencies
 * Pattern: Registry/Service Locator simplified
 */

import { PrismaClient } from '@prisma/client';
import { prisma } from './utils/prisma';
import { PrismaFeedbackRepository } from './infrastructure/repositories/PrismaFeedbackRepository';
import { PrismaAIConfigRepository } from './infrastructure/repositories/PrismaAIConfigRepository';
import { AIService } from './ai/service';
import { SubmitFeedbackUseCase } from './application/use-cases/SubmitFeedbackUseCase';
import { RateFeedbackUseCase } from './application/use-cases/RateFeedbackUseCase';
import { ListFeedbacksUseCase } from './application/use-cases/ListFeedbacksUseCase';
import { EncryptionService } from './infrastructure/security/EncryptionService';

class Container {
  private static instance: Container;
  
  // Infrastructure
  readonly prisma: PrismaClient = prisma;
  readonly encryption: EncryptionService;
  
  // Repositories
  readonly feedbackRepository: PrismaFeedbackRepository;
  readonly aiConfigRepository: PrismaAIConfigRepository;
  
  // Services
  readonly aiService: AIService;
  
  // Use Cases
  readonly submitFeedbackUseCase: SubmitFeedbackUseCase;
  readonly rateFeedbackUseCase: RateFeedbackUseCase;
  readonly listFeedbacksUseCase: ListFeedbacksUseCase;

  private constructor() {
    // Initialize in dependency order
    this.encryption = new EncryptionService(process.env.ENCRYPTION_KEY || 'dev-key-change-in-prod');
    
    this.feedbackRepository = new PrismaFeedbackRepository(this.prisma);
    this.aiConfigRepository = new PrismaAIConfigRepository(this.prisma);
    
    this.aiService = new AIService();
    
    this.submitFeedbackUseCase = new SubmitFeedbackUseCase(
      this.feedbackRepository,
      this.aiService,
      this.aiConfigRepository
    );
    
    this.rateFeedbackUseCase = new RateFeedbackUseCase(
      this.feedbackRepository
    );
    
    this.listFeedbacksUseCase = new ListFeedbacksUseCase(
      this.feedbackRepository
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Reset instance (useful for testing)
  static reset(): void {
    Container.instance = null as any;
  }
}

// Export singleton
export const container = Container.getInstance();
