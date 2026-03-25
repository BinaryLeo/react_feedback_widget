import { PrismaClient } from '@prisma/client';
import { IFeedbackRepository, ListOptions, PaginatedResult } from '../../domain/repositories/IFeedbackRepository';
import { Feedback } from '../../domain/entities/Feedback';

export class PrismaFeedbackRepository implements IFeedbackRepository {
  constructor(private prisma: PrismaClient) {}

  async create(feedback: Feedback): Promise<Feedback> {
    const data = feedback.toJSON();
    
    // Validate duplicateOfId exists before setting it
    let duplicateOfId = data.duplicateOfId;
    if (duplicateOfId) {
      const existing = await this.prisma.feedback.findUnique({
        where: { id: duplicateOfId },
      });
      if (!existing) {
        console.warn(`DuplicateOfId ${duplicateOfId} not found, setting to null`);
        duplicateOfId = null;
      }
    }
    
    const created = await this.prisma.feedback.create({
      data: {
        id: data.id,
        type: data.type,
        comment: data.comment,
        screenshot: data.screenshot,
        status: data.status,
        aiAnalyzed: data.aiAnalysis !== null,
        aiSuggestedType: data.aiAnalysis?.suggestedType,
        aiConfidence: data.aiAnalysis?.confidence,
        aiPriority: data.aiAnalysis?.priority,
        aiSentiment: data.aiAnalysis?.sentiment,
        aiCategory: data.aiAnalysis?.category,
        aiSummary: data.aiAnalysis?.summary,
        aiActionItems: data.aiAnalysis?.actionItems || [],
        aiLanguage: data.aiAnalysis?.language,
        aiResponse: data.aiAnalysis?.suggestedResponse,
        team: data.team,
        assignedTo: data.assignedTo,
        rating: data.rating,
        ratingNote: data.ratingNote,
        duplicateOfId,
      },
    });

    return Feedback.fromDatabase(created);
  }

  async findById(id: string): Promise<Feedback | null> {
    const found = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!found) return null;
    return Feedback.fromDatabase(found);
  }

  async list(options: ListOptions = {}): Promise<PaginatedResult<Feedback>> {
    const { limit = 50, offset = 0, orderBy = 'createdAt_desc', filters } = options;

    // Build where clause
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    if (filters?.team) where.team = filters.team;
    if (filters?.priority) where.aiPriority = filters.priority;

    // Parse orderBy
    const [field, direction] = orderBy.split('_');
    const prismaOrderBy: any = {};
    if (field === 'createdAt') {
      prismaOrderBy.createdAt = direction;
    } else if (field === 'priority') {
      // Custom ordering for priority
      prismaOrderBy.aiPriority = direction;
    }

    const [items, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        orderBy: prismaOrderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      data: items.map(item => Feedback.fromDatabase(item)),
      total,
      hasMore: offset + items.length < total,
    };
  }

  async update(id: string, data: Partial<Feedback>): Promise<Feedback> {
    const json = data.toJSON ? data.toJSON() : data;
    
    const updated = await this.prisma.feedback.update({
      where: { id },
      data: {
        status: json.status,
        team: json.team,
        assignedTo: json.assignedTo,
        rating: json.rating,
        ratingNote: json.ratingNote,
        duplicateOfId: json.duplicateOfId,
        // AI fields
        aiAnalyzed: json.aiAnalysis !== null,
        aiSuggestedType: json.aiAnalysis?.suggestedType,
        aiConfidence: json.aiAnalysis?.confidence,
        aiPriority: json.aiAnalysis?.priority,
        aiSentiment: json.aiAnalysis?.sentiment,
        aiCategory: json.aiAnalysis?.category,
        aiSummary: json.aiAnalysis?.summary,
        aiActionItems: json.aiAnalysis?.actionItems,
        aiResponse: json.aiAnalysis?.suggestedResponse,
      },
    });

    return Feedback.fromDatabase(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.feedback.delete({
      where: { id },
    });
  }

  async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const [
      total,
      typeGroups,
      priorityGroups,
      statusGroups,
    ] = await Promise.all([
      this.prisma.feedback.count(),
      this.prisma.feedback.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.feedback.groupBy({
        by: ['aiPriority'],
        _count: { aiPriority: true },
      }),
      this.prisma.feedback.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    return {
      total,
      byType: Object.fromEntries(typeGroups.map(g => [g.type, g._count.type])),
      byPriority: Object.fromEntries(priorityGroups.map(g => [g.aiPriority || 'NONE', g._count.aiPriority])),
      byStatus: Object.fromEntries(statusGroups.map(g => [g.status, g._count.status])),
    };
  }

  async findRecentSimilar(comment: string, threshold: number = 0.85): Promise<Feedback[]> {
    // Simple implementation: find by keywords
    // For production, use pg_trgm or vector similarity
    const keywords = comment.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 5);

    if (keywords.length === 0) return [];

    const recent = await this.prisma.feedback.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        OR: keywords.map(k => ({
          comment: { contains: k, mode: 'insensitive' },
        })),
      },
      take: 10,
    });

    return recent.map(item => Feedback.fromDatabase(item));
  }

  async rate(id: string, rating: 'POSITIVE' | 'NEGATIVE', note?: string): Promise<Feedback> {
    const updated = await this.prisma.feedback.update({
      where: { id },
      data: {
        rating,
        ratingNote: note || null,
      },
    });
    return Feedback.fromDatabase(updated);
  }
}
