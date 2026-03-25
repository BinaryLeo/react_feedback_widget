import { Feedback } from '../entities/Feedback';

export interface ListOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt_desc' | 'createdAt_asc' | 'priority_desc';
  filters?: {
    type?: string;
    status?: string;
    team?: string;
    priority?: string;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface IFeedbackRepository {
  create(feedback: Feedback): Promise<Feedback>;
  findById(id: string): Promise<Feedback | null>;
  list(options?: ListOptions): Promise<PaginatedResult<Feedback>>;
  update(id: string, data: Partial<Feedback>): Promise<Feedback>;
  delete(id: string): Promise<void>;
  
  // Analytics
  getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
  }>;
  
  // Duplicate detection
  findRecentSimilar(comment: string, threshold?: number): Promise<Feedback[]>;
  
  // Rating
  rate(id: string, rating: 'POSITIVE' | 'NEGATIVE', note?: string): Promise<Feedback>;
}
